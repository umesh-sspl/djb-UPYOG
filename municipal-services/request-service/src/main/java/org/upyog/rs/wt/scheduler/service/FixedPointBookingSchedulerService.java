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
    private final WaterTankerBookingRequestMapper bookingRequestMapper; // Switched to active mapper
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

        List<FixedPointScheduleData> scheduleDataList =
                schedulerDataMapper.toSchedulerDataList(timetableRows);

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
                        // Dynamically resolve baseline fallback context from RequestInfo if missing
                        if (!StringUtils.hasText(schedule.getApplicantId()) && requestInfo.getUserInfo() != null) {
                            schedule.setApplicantId(requestInfo.getUserInfo().getUuid());
                        }

                        if (!StringUtils.hasText(schedule.getMobileNumber()) && requestInfo.getUserInfo() != null) {
                            schedule.setMobileNumber(requestInfo.getUserInfo().getMobileNumber());
                        }

                        if (!StringUtils.hasText(schedule.getAddressId())) {
                            schedule.setAddressId("ADDR-" + schedule.getFixedPointId());
                        }

                        if (!StringUtils.hasText(schedule.getDeliveryTime())) {
                            schedule.setDeliveryTime("08:00 PM");
                        }

                        String fillingPointCode = schedule.getFillingPointId(); // e.g. FLP-000012
                        String fillingPointUuid = fillingPointRepository.getFillingPointUuidByCode(fillingPointCode);

                        if (fillingPointUuid == null) {
                            log.warn("No filling point UUID found for code: {}. Skipping booking.", fillingPointCode);
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