package org.upyog.rs.wt.scheduler.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.upyog.rs.fixedpoint.repository.FixedPointDetailsRepository;
import org.upyog.rs.fixedpoint.web.model.FixedPointTimeTableDetail;
import org.upyog.rs.repository.FillingPointVehicleRepository;
import org.upyog.rs.service.WaterTankerInternalBookingService;
import org.upyog.rs.web.models.waterTanker.WaterTankerBookingRequest;
import org.upyog.rs.wt.scheduler.model.FillingPointSchedulerSummary;
import org.upyog.rs.wt.scheduler.model.FixedPointScheduleData;
import org.upyog.rs.wt.scheduler.model.FixedPointSchedulerRunResponse;
import org.upyog.rs.wt.scheduler.model.VehicleDriverAssignmentData;
import org.upyog.rs.wt.scheduler.service.FixedPointBookingRequestMapper;
import org.upyog.rs.wt.scheduler.service.FixedPointSchedulerDataMapper;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Common service used by:
 * 1. Auto scheduler
 * 2. Manual scheduler API
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class FixedPointBookingSchedulerService {

    private final FixedPointDetailsRepository fixedPointDetailsRepository;
    private final FillingPointVehicleRepository vehicleRepository;
    private final VehicleAssignmentService vehicleAssignmentService;
    private final FixedPointSchedulerDataMapper schedulerDataMapper;
    private final FixedPointBookingRequestMapper bookingRequestMapper;
    private final WaterTankerInternalBookingService internalBookingService;

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

        List<FixedPointScheduleData> scheduleDataList =
                schedulerDataMapper.toSchedulerDataList(timetableRows);

        Map<String, List<FixedPointScheduleData>> groupedByFillingPoint =
                scheduleDataList.stream()
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
                        validateBeforeBooking(schedule);

                        WaterTankerBookingRequest bookingRequest =
                                bookingRequestMapper.toBookingRequest(
                                        schedule,
                                        deliveryDate,
                                        requestInfo
                                );

                        internalBookingService.createBooking(bookingRequest);

                        fillingPointSuccess++;
                        totalSuccess++;

                    } catch (DuplicateKeyException duplicateKeyException) {
                        fillingPointFailed++;
                        totalFailed++;

                        log.warn("Duplicate booking prevented by DB. fixedPointId={}, deliveryDate={}, deliveryTime={}",
                                schedule.getFixedPointId(),
                                deliveryDate,
                                schedule.getDeliveryTime());

                    } catch (Exception e) {
                        fillingPointFailed++;
                        totalFailed++;

                        log.error("Booking failed. fixedPointId={}, deliveryTime={}, vehicleId={}, driverId={}",
                                schedule.getFixedPointId(),
                                schedule.getDeliveryTime(),
                                schedule.getVehicleId(),
                                schedule.getDriverId(),
                                e);
                    }
                }

            } catch (Exception e) {
                fillingPointFailed += schedulesForFillingPoint.size();
                totalFailed += schedulesForFillingPoint.size();

                log.error("Filling point processing failed. fillingPointId={}",
                        currentFillingPointId, e);
            }

            summaries.add(FillingPointSchedulerSummary.builder()
                    .fillingPointId(currentFillingPointId)
                    .scheduledRows(schedulesForFillingPoint.size())
                    .activeVehiclesWithDriver(activeVehicleCount)
                    .successCount(fillingPointSuccess)
                    .failedCount(fillingPointFailed)
                    .build());
        }

        log.info("Fixed-point scheduler completed. tenantId={}, deliveryDate={}, total={}, success={}, failed={}",
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

    private void validateBeforeBooking(FixedPointScheduleData data) {

        if (!StringUtils.hasText(data.getTenantId())) {
            throw new IllegalStateException("tenantId is missing");
        }

        if (!StringUtils.hasText(data.getFillingPointId())) {
            throw new IllegalStateException("fillingPointId is missing");
        }

        if (!StringUtils.hasText(data.getFixedPointId())) {
            throw new IllegalStateException("fixedPointId is missing");
        }

        if (!StringUtils.hasText(data.getApplicantId())) {
            throw new IllegalStateException("applicantId is missing");
        }

        if (!StringUtils.hasText(data.getAddressId())) {
            throw new IllegalStateException("addressId is missing");
        }

        if (!StringUtils.hasText(data.getVendorId())) {
            throw new IllegalStateException("vendorId is missing");
        }

        if (!StringUtils.hasText(data.getVehicleId())) {
            throw new IllegalStateException("vehicleId is missing");
        }

        if (!StringUtils.hasText(data.getDriverId())) {
            throw new IllegalStateException("driverId is missing");
        }

        if (data.getDeliveryTime() == null) {
            throw new IllegalStateException("deliveryTime is missing");
        }
    }
}