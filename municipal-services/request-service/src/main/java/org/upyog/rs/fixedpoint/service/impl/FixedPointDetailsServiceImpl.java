package org.upyog.rs.fixedpoint.service.impl;

import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.upyog.rs.fixedpoint.repository.FixedPointDetailsRepository;
import org.upyog.rs.fixedpoint.repository.querybuilder.FixedPointTimeTableQueryBuilder;
import org.upyog.rs.fixedpoint.service.FixedPointEnrichmentService;
import org.upyog.rs.fixedpoint.service.FixedPointDetailsService;
import org.upyog.rs.fixedpoint.web.model.*;
import org.upyog.rs.web.models.AuditDetails;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class FixedPointDetailsServiceImpl implements FixedPointDetailsService {

    @Autowired
    private FixedPointEnrichmentService fixedPointEnrichmentService;

    private static final List<String> DAYS_OF_WEEK = Arrays.asList(
            "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"
    );

    @Autowired
    private FixedPointDetailsRepository fixedPointDetailsRepository;

    @Autowired
    private FixedPointTimeTableQueryBuilder fixedPointTimeTableQueryBuilder;

    @Override
    public FixedPointDetailsResponse saveFixedPointDetails(FixedPointDetailsRequest fixedPointDetailsRequest) {

        log.info("FixedPointDetailsServiceImpl :: saveFixedPointDetails :: Started");

        RequestInfo requestInfo = fixedPointDetailsRequest.getRequestInfo();
        FixedPointDetails inputDetail = fixedPointDetailsRequest.getFixedPointDetails();

        // Validate day list
        if (inputDetail.getDay() == null || inputDetail.getDay().isEmpty()) {
            throw new CustomException("INVALID_REQUEST", "At least one day is required");
        }

        List<String> requestedDays = inputDetail.getDay().stream()
                .map(String::toUpperCase)
                .collect(Collectors.toList());

        // Validate each day value
        for (String day : requestedDays) {
            if (!DAYS_OF_WEEK.contains(day)) {
                throw new CustomException("INVALID_DAY",
                        "Invalid day: " + day + ". Must be one of: " + DAYS_OF_WEEK);
            }
        }

        AuditDetails auditDetails = buildAuditDetails(requestInfo);
        List<FixedPointDetails> fixedPointDetailsList = new ArrayList<>();

        boolean fixedPointExists = fixedPointTimeTableQueryBuilder
                .existsByFixedPointCode(inputDetail.getFixedPointCode());

        if (!fixedPointExists) {
            // ── NEW FIXED POINT: save all 7 days ──────────────────────────
            log.info("FixedPointDetailsServiceImpl :: New fixedPointCode detected, creating 7 day records");

            for (String day : DAYS_OF_WEEK) {
                FixedPointDetails detail = buildDetail(
                        inputDetail,
                        day,
                        requestedDays.contains(day),  // isEnable = true only for requested days
                        auditDetails
                );
                fixedPointDetailsList.add(detail);
            }

        } else {
            // ── EXISTING FIXED POINT: save only requested days ─────────────
            log.info("FixedPointDetailsServiceImpl :: Existing fixedPointCode detected, creating {} day record(s)",
                    requestedDays.size());

            for (String day : requestedDays) {

                // Block: same fixedPointCode + same day + same arrivalTimeToFpl
                if (fixedPointTimeTableQueryBuilder.existsByFixedPointCodeAndDayAndArrivalTime(
                        inputDetail.getFixedPointCode(),
                        day,
                        inputDetail.getArrivalTimeToFpl())) {

                    throw new CustomException("DUPLICATE_FIXED_POINT_SCHEDULE",
                            "A schedule for fixed_point_code '" + inputDetail.getFixedPointCode()
                                    + "' on day '" + day
                                    + "' with arrival time '" + inputDetail.getArrivalTimeToFpl()
                                    + "' already exists.");
                }

                // Allow: same fixedPointCode + same day + different arrivalTimeToFpl (new trip)
                FixedPointDetails detail = buildDetail(inputDetail, day, true, auditDetails);
                fixedPointDetailsList.add(detail);
            }
        }

        fixedPointDetailsRepository.saveFixedPointDetails(fixedPointDetailsList, requestInfo);

        log.info("FixedPointDetailsServiceImpl :: saveFixedPointDetails :: Completed, saved {} records",
                fixedPointDetailsList.size());

        return FixedPointDetailsResponse.builder()
                .fixedPointDetailsList(fixedPointDetailsList)
                .build();
    }

    private FixedPointDetails buildDetail(FixedPointDetails input, String day,
                                          boolean isEnable, AuditDetails auditDetails) {
        return FixedPointDetails.builder()
                .systemAssignedScheduleId(UUID.randomUUID().toString())
                .fixedPointCode(input.getFixedPointCode())
                .day(Collections.singletonList(day))
                .dayValue(day)
                .tripNo(input.getTripNo())
                .arrivalTimeToFpl(input.getArrivalTimeToFpl())
                .departureTimeFromFpl(input.getDepartureTimeFromFpl())
                .arrivalTimeDeliveryPoint(input.getArrivalTimeDeliveryPoint())
                .departureTimeDeliveryPoint(input.getDepartureTimeDeliveryPoint())
                .timeOfArrivingBackFplAfterDelivery(input.getTimeOfArrivingBackFplAfterDelivery())
                .volumeWaterTobeDelivery(input.getVolumeWaterTobeDelivery())
                .vehicleId(input.getVehicleId())
                .remarks(input.getRemarks())
                .fillingPointId(input.getFillingPointId())
                .active(true)
                .isEnable(isEnable)
                .tenantId("dl.djb")
                .auditDetails(auditDetails)
                .build();
    }

    private AuditDetails buildAuditDetails(RequestInfo requestInfo) {
        String userId = (requestInfo.getUserInfo() != null)
                ? requestInfo.getUserInfo().getUuid()
                : "SYSTEM";
        long currentTime = System.currentTimeMillis();

        return AuditDetails.builder()
                .createdBy(userId)
                .lastModifiedBy(userId)
                .createdTime(currentTime)
                .lastModifiedTime(currentTime)
                .build();
    }

    @Override
    public List<FixedPointTimeTableDetail> getFixedPointDetails(RequestInfo requestInfo, FixedPointSearchCriteria criteria) {
        List<FixedPointTimeTableDetail> details = fixedPointDetailsRepository.getDetails(criteria);
        if (CollectionUtils.isEmpty(details)) {
            return new ArrayList<>();
        }
        return details;
    }

    @Override
    public Integer getApplicationsCount(FixedPointSearchCriteria criteria, RequestInfo requestInfo) {
        criteria.setCountCall(true);
        return fixedPointDetailsRepository.getCount(criteria);
    }


    @Override
    public FixedPointDetailsResponse updateFixedPointDetails(FixedPointDetailsRequest fixedPointDetailsRequest) {
        FixedPointDetails fixedPointDetails = fixedPointDetailsRequest.getFixedPointDetailsList().get(0);
        fixedPointEnrichmentService.enrichUpdateFixedPointDetails(fixedPointDetailsRequest);

        fixedPointDetailsRepository.updateFixedPointDetails(
                fixedPointDetails,
                fixedPointDetailsRequest.getRequestInfo()
        );

        return FixedPointDetailsResponse.builder()
                .fixedPointDetailsList(Collections.singletonList(fixedPointDetails))
                .build();
    }

}