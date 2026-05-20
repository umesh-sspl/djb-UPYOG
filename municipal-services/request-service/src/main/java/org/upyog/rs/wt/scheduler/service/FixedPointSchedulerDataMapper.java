package org.upyog.rs.wt.scheduler.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.upyog.rs.fixedpoint.web.model.FixedPointTimeTableDetail;
import org.upyog.rs.web.models.Address;
import org.upyog.rs.web.models.ApplicantDetail;
import org.upyog.rs.web.models.waterTanker.WaterTankerFixedPointDetail;
import org.upyog.rs.wt.scheduler.model.FixedPointScheduleData;
import org.upyog.rs.wt.scheduler.repository.FixedPointSearchClient;

import java.util.ArrayList;
import java.util.List;

/**
 * Converts existing FixedPointTimeTableDetail model into scheduler DTO.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class FixedPointSchedulerDataMapper {

    private final FixedPointSearchClient fixedPointSearchClient;

    public List<FixedPointScheduleData> toSchedulerDataList(List<FixedPointTimeTableDetail> details,RequestInfo requestInfo) {
        if (details == null) return List.of();

//        return details.stream()
//                .map(this::toSchedulerData)
//                .collect(Collectors.toList());
        List<FixedPointScheduleData> result = new ArrayList<>();

        for (FixedPointTimeTableDetail detail : details) {
            try {
                result.add(toSchedulerData(detail,requestInfo));
            } catch (Exception e) {
                log.error("Skipping timetable row. fixedPointCode={}, scheduleId={}: {}",
                        detail.getFixedPointCode(),
                        detail.getSystemAssignedScheduleId(),
                        e.getMessage());
            }
        }

        log.info("Timetable mapping done. total={}, mapped={}, skipped={}",
                details.size(), result.size(), details.size() - result.size());

        return result;
    }

    private FixedPointScheduleData toSchedulerData(FixedPointTimeTableDetail detail, RequestInfo requestInfo) {

        FixedPointScheduleData data = new FixedPointScheduleData();

        // 1. Map Core Identifiers
        data.setScheduleId(detail.getSystemAssignedScheduleId());
        data.setTenantId(detail.getTenantId());
        data.setFillingPointId(detail.getFillingPointId());
        data.setFixedPointId(detail.getFixedPointId());
        data.setFixedPointCode(detail.getFixedPointCode());
        data.setFixedPointName(detail.getFixedPointName());

        // 2. Map the actual Time and Quantity fields from your class
        data.setDeliveryTime(detail.getArrivalTimeDeliveryPoint());
        data.setWaterQuantity(detail.getVolumeWaterTobeDelivery() != null ? detail.getVolumeWaterTobeDelivery() : "3000");

        // 3. Map pre-assigned vehicle if available in the timetable
        data.setVehicleId(detail.getVehicleId());

        /* * NOTE: Applicant details (applicantId, mobileNumber) and Address details
         * (pincode, city, street) are NOT present in FixedPointTimeTableDetail.
         * * They will remain null here. Your FixedPointBookingSchedulerService
         * will dynamically populate them from the logged-in system user during runtime.
         */
        enrichFromApi(data,requestInfo);

        return data;
    }
    /**
     * Calls the fixed point search API using fixedPointCode.
     *
     * On success, maps from WaterTankerFixedPointDetail:
     *   applicantDetail → applicantId, mobileNumber, alternateNumber, emailId, name
     *   address         → addressId, houseNo, city, cityCode, pincode,
     *                     locality, localityCode, streetName, addressLine1, addressLine2,
     *                     landmark, latitude, longitude, ward, zone, constituency
     *
     * On failure, logs a warning and leaves fields null.
     * FixedPointBookingSchedulerService will then skip that booking cleanly.
     */
    private void enrichFromApi(FixedPointScheduleData data,RequestInfo requestInfo) {

        String tenantId = data.getTenantId();
        String fixedPointCode = data.getFixedPointCode();

        if (!StringUtils.hasText(fixedPointCode)) {
            log.warn("Cannot call API — fixedPointCode is blank. scheduleId={}",
                    data.getScheduleId());
            return;
        }
        /*
         * RestTemplate call via FixedPointSearchClient.
         *
         * URL: {wt.fixedpoint.search.host}{wt.fixedpoint.search.path}
         *          ?tenantId={tenantId}&fixedPointId={fixedPointCode}
         *
         * e.g.: http://localhost:8091/request-service/water-tanker/fixed-point/v1/_search
         *           ?tenantId=dl.djb&fixedPointId=FXP-05946
         *
         * Response key mapped: "waterTankerBookingDetail" → WaterTankerFixedPointDetail
         */
        WaterTankerFixedPointDetail detail =
                fixedPointSearchClient.searchByFixedPointCode(tenantId, fixedPointCode,requestInfo);

        if (detail == null) {
            log.warn("Fixed point API returned null. scheduleId={}, fixedPointCode={}. " +
                            "Booking will be skipped.",
                    data.getScheduleId(), fixedPointCode);
            return;
        }

        // ── Map ApplicantDetail ───────────────────────────────────────────
        ApplicantDetail applicant = detail.getApplicantDetail();
        if (applicant != null) {
            data.setApplicantId(applicant.getApplicantId());
            data.setMobileNumber(applicant.getMobileNumber());
            data.setAlternateNumber(applicant.getAlternateNumber());
            data.setEmailId(applicant.getEmailId());

            // Keep name from timetable as fallback if API returns null
            if (StringUtils.hasText(applicant.getName())) {
                data.setFixedPointName(applicant.getName());
            }
        } else {
            log.warn("API response has null applicantDetail. scheduleId={}, fixedPointCode={}",
                    data.getScheduleId(), fixedPointCode);
        }

        // ── Map Address ───────────────────────────────────────────────────
        Address address = detail.getAddress();
        if (address != null) {
            data.setAddressId(address.getAddressId());
            data.setHouseNo(address.getHouseNo());
            data.setAddressLine1(address.getAddressLine1());
            data.setAddressLine2(address.getAddressLine2());
            data.setStreetName(address.getStreetName());
            data.setLandmark(address.getLandmark());
            data.setCity(address.getCity());
            data.setCityCode(address.getCityCode());
            data.setLocality(address.getLocality());
            data.setLocalityCode(address.getLocalityCode());
            data.setPincode(address.getPincode());
            data.setLatitude(address.getLatitude());
            data.setLongitude(address.getLongitude());
            data.setWard(address.getWard());
            data.setZone(address.getZone());
            data.setConstituency(address.getConstituency());
        } else {
            log.warn("API response has null address. scheduleId={}, fixedPointCode={}",
                    data.getScheduleId(), fixedPointCode);
        }

        // Also use top-level mobileNumber as fallback if applicantDetail.mobileNumber was null
        if (!StringUtils.hasText(data.getMobileNumber())
                && StringUtils.hasText(detail.getMobileNumber())) {
            data.setMobileNumber(detail.getMobileNumber());
        }

        log.info("API enrich complete. scheduleId={}, fixedPointCode={}, " +
                        "applicantId={}, mobileNumber=***{}, addressId={}",
                data.getScheduleId(),
                fixedPointCode,
                data.getApplicantId(),
                data.getMobileNumber() != null
                        ? data.getMobileNumber().substring(
                        Math.max(0, data.getMobileNumber().length() - 4))
                        : "null",
                data.getAddressId());

    }

}