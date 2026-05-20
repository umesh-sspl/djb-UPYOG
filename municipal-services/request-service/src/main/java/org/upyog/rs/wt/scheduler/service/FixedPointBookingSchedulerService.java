package org.upyog.rs.wt.scheduler.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.upyog.rs.fixedpoint.repository.FixedPointDetailsRepository;
import org.upyog.rs.fixedpoint.web.model.FixedPointTimeTableDetail;
import org.upyog.rs.repository.FillingPointRepository;
import org.upyog.rs.repository.FillingPointVehicleRepository;
import org.upyog.rs.service.WaterTankerInternalBookingService;
import org.upyog.rs.web.models.waterTanker.WaterTankerBookingRequest;
import org.upyog.rs.wt.scheduler.model.FillingPointSchedulerSummary;
import org.upyog.rs.wt.scheduler.model.FixedPointScheduleData;
import org.upyog.rs.wt.scheduler.model.FixedPointSchedulerRunResponse;
import org.upyog.rs.wt.scheduler.model.VehicleDriverAssignmentData;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FixedPointBookingSchedulerService {

    private final FixedPointDetailsRepository fixedPointDetailsRepository;
    private final FillingPointVehicleRepository vehicleRepository;
    private final VehicleAssignmentService vehicleAssignmentService;
    private final FixedPointSchedulerDataMapper schedulerDataMapper;
    private final WaterTankerBookingRequestMapper bookingRequestMapper;
    private final WaterTankerInternalBookingService internalBookingService;
    private final FillingPointRepository fillingPointRepository;

    public FixedPointSchedulerRunResponse runScheduler(
            String tenantId,
            LocalDate deliveryDate,
            String fillingPointId,
            RequestInfo requestInfo
    ) {
        if (!StringUtils.hasText(tenantId)) {
            throw new IllegalArgumentException("tenantId is mandatory");
        }

        if (deliveryDate == null) {
            deliveryDate = LocalDate.now();
        }

        DayOfWeek dayOfWeek = deliveryDate.getDayOfWeek();

        log.info("Fixed-point scheduler started. tenantId={}, deliveryDate={}, dayOfWeek={}, fillingPointId={}",
                tenantId, deliveryDate, dayOfWeek.name(), fillingPointId);

        if (requestInfo == null) {
            requestInfo = internalBookingService.buildSystemRequestInfo(tenantId);
        }

        List<FixedPointTimeTableDetail> timetableRows =
                fixedPointDetailsRepository.getScheduledFixedPointsForScheduler(
                        tenantId,
                        dayOfWeek.name(),
                        fillingPointId
                );
        log.info("Timetable rows loaded. count={}", timetableRows.size());

        // ── Step 2: Map rows + enrich from fixed point search API ─────────
        //
        // Per row: GET http://localhost:8091/request-service/water-tanker/fixed-point/v1/_search
        //                  ?tenantId=dl.djb&fixedPointId=FXP-05946
        //
        // Fills: applicantId, mobileNumber, addressId, address fields, etc.
        // from response key "waterTankerBookingDetail" → WaterTankerFixedPointDetail


        List<FixedPointScheduleData> scheduleDataList =
                schedulerDataMapper.toSchedulerDataList(timetableRows,requestInfo);

        Map<String, List<FixedPointScheduleData>> groupedByFillingPoint =
                scheduleDataList.stream()
                        .filter(s -> s.getFillingPointId() != null)
                        .collect(Collectors.groupingBy(FixedPointScheduleData::getFillingPointId));

        int totalSuccess = 0;
        int totalFailed = 0;

        List<FillingPointSchedulerSummary> summaries = new ArrayList<>();

        for (Map.Entry<String, List<FixedPointScheduleData>> entry : groupedByFillingPoint.entrySet()) {
            String currentFillingPointId = entry.getKey();
            List<FixedPointScheduleData> schedulesForFillingPoint = entry.getValue();

            int fillingPointSuccess = 0;
            int fillingPointFailed = 0;
            int activeVehicleCount = 0;

            try {
                log.info("Processing fillingPointId={}, scheduleRows={}",
                        currentFillingPointId, schedulesForFillingPoint.size());

                List<VehicleDriverAssignmentData> activeVehicles =
                        vehicleRepository.findActiveVehiclesWithMappedDriver(
                                tenantId,
                                currentFillingPointId
                        );

                activeVehicleCount = activeVehicles.size();

                List<FixedPointScheduleData> assignedSchedules =
                        vehicleAssignmentService.assignVehicles(
                                currentFillingPointId,
                                schedulesForFillingPoint,
                                activeVehicles
                        );

                for (FixedPointScheduleData schedule : assignedSchedules) {
                    try {
                        // Validate mandatory fields came from API.
                        // IMPORTANT: we do NOT fall back to system user here.
                        //            If the API didn't return data, skip the booking.
                        // Dynamically resolve baseline fallback context from RequestInfo if missing
                        String skipReason = firstMissingMandatoryField(schedule);
                        if (skipReason != null) {
                            log.warn("Skipping — {}. fixedPointCode={}, scheduleId={}",
                                    skipReason, schedule.getFixedPointCode(), schedule.getScheduleId());
                            fillingPointFailed++;
                            totalFailed++;
                            continue;
                        }

                        if (!StringUtils.hasText(schedule.getDeliveryTime())) {
                            schedule.setDeliveryTime("08:00 PM");
                        }

                        String fillingPointCode = schedule.getFillingPointId();
                        String fillingPointUuid = fillingPointRepository.getFillingPointUuidByCode(fillingPointCode);

                        if (!StringUtils.hasText(fillingPointUuid)) {
                            log.warn("No UUID for fillingPointCode={}. Skipping. scheduleId={}",
                                    fillingPointCode, schedule.getScheduleId());
                            fillingPointFailed++;
                            totalFailed++;
                            continue;
                        }

                        schedule.setFillingPointId(fillingPointUuid);

                        validateBeforeBooking(schedule);

                        WaterTankerBookingRequest bookingRequest =
                                bookingRequestMapper.toBookingCreateRequest(
                                        schedule,
                                        deliveryDate,
                                        requestInfo
                                );

                        internalBookingService.createBooking(bookingRequest);
                        fillingPointSuccess++;
                        totalSuccess++;
                        log.info("Booking created. fixedPointCode={}, scheduleId={}, deliveryDate={}",
                                schedule.getFixedPointCode(), schedule.getScheduleId(), deliveryDate);

                    } catch (DuplicateKeyException duplicateKeyException) {
                        fillingPointFailed++;
                        totalFailed++;
                        log.warn("Duplicate booking prevented. fillingPointId={}, deliveryDate={}",
                                schedule.getFillingPointId(), deliveryDate);
                    } catch (Exception e) {
                        fillingPointFailed++;
                        totalFailed++;
                        log.error("Booking failed for fillingPointId={}: {}",
                                schedule.getFillingPointId(), e.getMessage());                    }
                }

            } catch (Exception e) {
                fillingPointFailed += schedulesForFillingPoint.size();
                totalFailed += schedulesForFillingPoint.size();
                log.error("Filling point processing failed for fillingPointId={}", currentFillingPointId, e);
            }

            summaries.add(FillingPointSchedulerSummary.builder()
                    .fillingPointId(currentFillingPointId)
                    .scheduledRows(schedulesForFillingPoint.size())
                    .activeVehiclesWithDriver(activeVehicleCount)
                    .successCount(fillingPointSuccess)
                    .failedCount(fillingPointFailed)
                    .build());
        }
        log.info("Scheduler complete. tenantId={}, deliveryDate={}, " +
                        "totalRows={}, success={}, failed={}",
                tenantId, deliveryDate, scheduleDataList.size(), totalSuccess, totalFailed);

        return FixedPointSchedulerRunResponse.builder()
                .tenantId(tenantId)
                .deliveryDate(deliveryDate.toString())
                .dayOfWeek(dayOfWeek.name())
                .totalScheduledRows(scheduleDataList.size())
                .successCount(totalSuccess)
                .failedCount(totalFailed)
                .fillingPointSummaries(summaries)
                .build();
    }

    /**
     * Returns the first missing mandatory field name, or null if all are present.
     *
     * applicantId and mobileNumber MUST come from the fixed point search API.
     * They are NEVER populated from requestInfo or system user.
     */
    private String firstMissingMandatoryField(FixedPointScheduleData data) {
        if (!StringUtils.hasText(data.getApplicantId()))
            return "applicantId missing — fixed point API returned no applicant data";
        if (!StringUtils.hasText(data.getMobileNumber()))
            return "mobileNumber missing — fixed point API returned no applicant data";
        if (!StringUtils.hasText(data.getAddressId()))
            return "addressId missing — fixed point has no address in API response";
        if (!StringUtils.hasText(data.getVendorId()))
            return "vendorId missing — no vehicle assigned for this filling point";
        if (!StringUtils.hasText(data.getVehicleId()))
            return "vehicleId missing — no vehicle assigned for this filling point";
        if (!StringUtils.hasText(data.getDriverId()))
            return "driverId missing — no driver mapped to vehicle";
        return null;
    }

    private void validateBeforeBooking(FixedPointScheduleData data) {
        if (!StringUtils.hasText(data.getTenantId())) throw new IllegalStateException("tenantId is missing");
        if (!StringUtils.hasText(data.getFillingPointId())) throw new IllegalStateException("fillingPointId is missing");
//        if (!StringUtils.hasText(data.getFixedPointId())) throw new IllegalStateException("fixedPointId is missing");
        if (!StringUtils.hasText(data.getApplicantId())) throw new IllegalStateException("applicantId is missing");
        if (!StringUtils.hasText(data.getAddressId())) throw new IllegalStateException("addressId is missing");
        if (!StringUtils.hasText(data.getVendorId())) throw new IllegalStateException("vendorId is missing");
        if (!StringUtils.hasText(data.getVehicleId())) throw new IllegalStateException("vehicleId is missing");
        if (!StringUtils.hasText(data.getDriverId())) throw new IllegalStateException("driverId is missing");
        if (data.getDeliveryTime() == null) throw new IllegalStateException("deliveryTime is missing");
        if (!StringUtils.hasText(data.getMobileNumber())) throw new IllegalStateException("mobileNumber is missing");
    }
}