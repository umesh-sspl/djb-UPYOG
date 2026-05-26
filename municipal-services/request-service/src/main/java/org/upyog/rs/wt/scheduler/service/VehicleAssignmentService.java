package org.upyog.rs.wt.scheduler.service;


import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.upyog.rs.repository.FillingPointRepository;
import org.upyog.rs.wt.scheduler.model.FixedPointScheduleData;
import org.upyog.rs.wt.scheduler.model.VehicleDriverAssignmentData;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * Assigns vehicles dynamically.
 *
 * Rules:
 * 1. Same fixed point should get same vehicle first.
 * 2. Continue same vehicle until preferred limit, normally 6.
 * 3. No vehicle should exceed max limit, normally 8.
 * 4. If 6 fixed points and 6 vehicles, distribute one each, not all to one.
 */
@Slf4j
@Service
public class VehicleAssignmentService {

    @Value("${wt.vehicle.preferred-trip-limit:6}")
    private int preferredTripLimit;

    @Value("${wt.vehicle.max-trip-limit:8}")
    private int maxTripLimit;

    @Value("${wt.vehicle.trip-duration-minutes:60}")
    private int tripDurationMinutes;

    @Autowired
    private FillingPointRepository fillingPointDetailsRepository;

    public List<FixedPointScheduleData> assignVehicles(
            String fillingPointId,
            List<FixedPointScheduleData> schedules,
            List<VehicleDriverAssignmentData> vehicles
    ) {

        String systemFillingPointId = fillingPointDetailsRepository.getFillingPointUuidByCode(fillingPointId);

        if (systemFillingPointId == null) {
            throw new IllegalStateException("Invalid Filling Point Code: " + fillingPointId);
        }

        if (schedules == null || schedules.isEmpty()) {
            return schedules;
        }

        List<VehicleDriverAssignmentData> eligibleVehicles = new ArrayList<>();
        for (VehicleDriverAssignmentData vehicle : vehicles) {
            if (systemFillingPointId.equals(vehicle.getFillingPointId())) {
                eligibleVehicles.add(vehicle);
            }
        }

        if (eligibleVehicles.isEmpty()) {
            throw new IllegalStateException("No active vehicle with mapped driver found for fillingPointId=" + fillingPointId);
        }

        Map<String, VehicleDriverAssignmentData> fixedPointVehicleMap = new HashMap<>();

        // NEW: Track busy time slots to prevent overlapping assignments for the same vehicle
        Map<String, Set<String>> vehicleBusyTimeSlots = new HashMap<>();

        int roundRobinIndex = 0;

        List<FixedPointScheduleData> assignedSchedules = new ArrayList<>();

        for (FixedPointScheduleData schedule : schedules) {

            VehicleDriverAssignmentData selectedVehicle = null;

            String fixedPointId = schedule.getFixedPointId();

            // Standardize requested time
            String requestedTime = schedule.getDeliveryTime();
            if (!StringUtils.hasText(requestedTime)) {
                requestedTime = "20:00"; // Defaulting safely
                schedule.setDeliveryTime(requestedTime);
            }

            VehicleDriverAssignmentData existingVehicle =
                    fixedPointVehicleMap.get(fixedPointId);

            /*
             * 1. Reuse same vehicle for same fixed point until preferred limit,
             * ONLY IF it is not already busy at this exact time.
             */
            if (existingVehicle != null && existingVehicle.getAssignedCount() < preferredTripLimit) {
                Set<String> busySlots = vehicleBusyTimeSlots.getOrDefault(existingVehicle.getVehicleId(), new HashSet<>());
                if (!busySlots.contains(requestedTime)) {
                    selectedVehicle = existingVehicle;
                }
            }
            /*
             * 2. Find ANY vehicle under preferred limit available at this time.
             */
            if (selectedVehicle == null) {
                selectedVehicle = findNextVehicleUnderLimit(
                        eligibleVehicles, roundRobinIndex, preferredTripLimit, requestedTime, vehicleBusyTimeSlots
                );
            }

            /*
             * 3. Allow max limit fallback.
             */
            if (selectedVehicle == null) {
                selectedVehicle = findNextVehicleUnderLimit(
                        eligibleVehicles, roundRobinIndex, maxTripLimit, requestedTime, vehicleBusyTimeSlots
                );
            }

            /*
             * 4. STAGGER TIME: If NO vehicle is available at this exact requested time,
             * we stagger the time (add 60 mins) to find the next available slot.
             */
            if (selectedVehicle == null) {
                log.warn("No vehicle free at exactly {}. Attempting to stagger time.", requestedTime);

                String staggeredTime = requestedTime;
                for (int attempt = 1; attempt <= maxTripLimit; attempt++) {
                    staggeredTime = addMinutesToTime(staggeredTime, tripDurationMinutes);

                    selectedVehicle = findNextVehicleUnderLimit(
                            eligibleVehicles, roundRobinIndex, maxTripLimit, staggeredTime, vehicleBusyTimeSlots
                    );

                    if (selectedVehicle != null) {
                        schedule.setDeliveryTime(staggeredTime); // Force the schedule to the new staggered time
                        requestedTime = staggeredTime;
                        log.info("Staggered schedule time to {} for vehicle {}", staggeredTime, selectedVehicle.getVehicleId());
                        break;
                    }
                }
            }

            /*
             * Find vehicle under preferred limit.
             */
//            if (selectedVehicle == null) {
//
//                selectedVehicle =
//                        findNextVehicleUnderLimit(
//                                eligibleVehicles,
//                                roundRobinIndex,
//                                preferredTripLimit
//                        );
//            }

            /*
             * Allow max limit fallback.
             */
//            if (selectedVehicle == null) {
//
//                selectedVehicle =
//                        findNextVehicleUnderLimit(
//                                eligibleVehicles,
//                                roundRobinIndex,
//                                maxTripLimit
//                        );
//            }

            /*
             * IMPORTANT:
             * Skip only this schedule instead of failing whole batch.
             */
            if (selectedVehicle == null) {

                log.warn(
                        "No vehicle capacity available. fillingPointId={}, fixedPointId={}, scheduleId={}",
                        fillingPointId,
                        fixedPointId,
                        schedule.getScheduleId()
                );

                continue;
            }

            /*
             * Assign vehicle details.
             */
            schedule.setVendorId(selectedVehicle.getVendorId());
            schedule.setVehicleId(selectedVehicle.getVehicleId());
            schedule.setDriverId(selectedVehicle.getDriverId());
            schedule.setVehicleType(selectedVehicle.getVehicleType());
            schedule.setVehicleCapacity(selectedVehicle.getVehicleCapacity());

            /*
             * Increase trip count.
             */
            selectedVehicle.setAssignedCount(
                    selectedVehicle.getAssignedCount() + 1
            );

            // Record this specific time slot as BUSY for this vehicle.
            vehicleBusyTimeSlots.computeIfAbsent(selectedVehicle.getVehicleId(), k -> new HashSet<>()).add(requestedTime);
            fixedPointVehicleMap.put(fixedPointId, selectedVehicle);
            assignedSchedules.add(schedule);

            /*
             * Remember assignment for same fixed point.
             */
//            fixedPointVehicleMap.put(fixedPointId, selectedVehicle);
//
//            assignedSchedules.add(schedule);

            /*
             * Round robin next index.
             */
            roundRobinIndex =
                    eligibleVehicles.indexOf(selectedVehicle) + 1;

            if (roundRobinIndex >= eligibleVehicles.size()) {
                roundRobinIndex = 0;
            }

            log.info(
                    "Assigned vehicle. fillingPointId={}, fixedPointId={}, deliveryTime={}, vehicleId={}, driverId={}, assignedCount={}",
                    fillingPointId,
                    fixedPointId,
                    schedule.getDeliveryTime(),
                    selectedVehicle.getVehicleId(),
                    selectedVehicle.getDriverId(),
                    selectedVehicle.getAssignedCount()
            );
        }

        return assignedSchedules;
    }

    /**
     * Checks if vehicle limit is valid AND vehicle is free at the requested time.
     */
    private VehicleDriverAssignmentData findNextVehicleUnderLimit(
            List<VehicleDriverAssignmentData> vehicles,
            int startIndex,
            int limit,
            String requestedTime,
            Map<String, Set<String>> vehicleBusyTimeSlots
    ) {
        for (int i = 0; i < vehicles.size(); i++) {
            int index = (startIndex + i) % vehicles.size();
            VehicleDriverAssignmentData vehicle = vehicles.get(index);
            Set<String> busySlots = vehicleBusyTimeSlots.getOrDefault(vehicle.getVehicleId(), new HashSet<>());

            if (vehicle.getAssignedCount() < limit && !busySlots.contains(requestedTime)) {
                return vehicle;
            }
        }
        return null;
    }

    /**
     * Helper to offset time when a resource conflict occurs.
     */
    private String addMinutesToTime(String timeStr, int minutesToAdd) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
            LocalTime time = LocalTime.parse(timeStr, formatter);
            return time.plusMinutes(minutesToAdd).format(formatter);
        } catch (Exception e) {
            try {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("hh:mm a", Locale.US);
                LocalTime time = LocalTime.parse(timeStr, formatter);
                return time.plusMinutes(minutesToAdd).format(formatter);
            } catch (Exception ex) {
                log.error("Could not parse time: " + timeStr);
                return timeStr;
            }
        }
    }
}