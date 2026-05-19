package org.upyog.rs.wt.scheduler.service;


import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.upyog.rs.repository.FillingPointRepository;
import org.upyog.rs.wt.scheduler.model.FixedPointScheduleData;
import org.upyog.rs.wt.scheduler.model.VehicleDriverAssignmentData;

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

        int roundRobinIndex = 0;

        for (FixedPointScheduleData schedule : schedules) {

            VehicleDriverAssignmentData selectedVehicle = null;

            String fixedPointId = schedule.getFixedPointId();

            VehicleDriverAssignmentData existingVehicle = fixedPointVehicleMap.get(fixedPointId);

            /*
             * Reuse same vehicle for same fixed point until preferred trip limit.
             */
            if (existingVehicle != null && existingVehicle.getAssignedCount() < preferredTripLimit) {
                selectedVehicle = existingVehicle;
            }

            /*
             * If no existing vehicle or preferred limit reached,
             * pick next available vehicle below preferred limit.
             */
            if (selectedVehicle == null) {
                selectedVehicle = findNextVehicleUnderLimit(vehicles, roundRobinIndex, preferredTripLimit);
            }

            /*
             * If all vehicles crossed preferred limit,
             * allow assignment up to maximum limit.
             */
            if (selectedVehicle == null) {
                selectedVehicle = findNextVehicleUnderLimit(vehicles, roundRobinIndex, maxTripLimit);
            }

            if (selectedVehicle == null) {
                throw new IllegalStateException("No vehicle capacity available for fillingPointId=" + fillingPointId);
            }

            schedule.setVendorId(selectedVehicle.getVendorId());
            schedule.setVehicleId(selectedVehicle.getVehicleId());
            schedule.setDriverId(selectedVehicle.getDriverId());
            schedule.setVehicleType(selectedVehicle.getVehicleType());
            schedule.setVehicleCapacity(selectedVehicle.getVehicleCapacity());

            selectedVehicle.setAssignedCount(selectedVehicle.getAssignedCount() + 1);

            fixedPointVehicleMap.put(fixedPointId, selectedVehicle);

            roundRobinIndex = vehicles.indexOf(selectedVehicle) + 1;
            if (roundRobinIndex >= vehicles.size()) {
                roundRobinIndex = 0;
            }

            log.info("Assigned vehicle. fillingPointId={}, fixedPointId={}, deliveryTime={}, vehicleId={}, driverId={}, assignedCount={}",
                    fillingPointId,
                    fixedPointId,
                    schedule.getDeliveryTime(),
                    selectedVehicle.getVehicleId(),
                    selectedVehicle.getDriverId(),
                    selectedVehicle.getAssignedCount());
        }

        return schedules;
    }

    private VehicleDriverAssignmentData findNextVehicleUnderLimit(
            List<VehicleDriverAssignmentData> vehicles,
            int startIndex,
            int limit
    ) {
        for (int i = 0; i < vehicles.size(); i++) {
            int index = (startIndex + i) % vehicles.size();
            VehicleDriverAssignmentData vehicle = vehicles.get(index);

            if (vehicle.getAssignedCount() < limit) {
                return vehicle;
            }
        }

        return null;
    }
}