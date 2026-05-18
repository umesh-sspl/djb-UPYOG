package org.upyog.rs.wt.scheduler.service;

import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.upyog.rs.constant.WaterTankerConstants;
import org.upyog.rs.enums.AddressType;
import org.upyog.rs.web.models.Address;
import org.upyog.rs.web.models.ApplicantDetail;
import org.upyog.rs.web.models.Workflow;
import org.upyog.rs.web.models.waterTanker.WaterTankerBookingDetail;
import org.upyog.rs.web.models.waterTanker.WaterTankerBookingRequest;
import org.upyog.rs.wt.scheduler.model.FixedPointScheduleData;

import java.time.LocalDate;
import java.time.LocalTime;

@Slf4j
@Component
public class WaterTankerBookingRequestMapper {

    @Value("${wt.booking.default-water-quantity:3000}")
    private Integer defaultWaterQuantity;

    @Value("${wt.booking.extra-charge:N}")
    private String extraCharge;

    public WaterTankerBookingRequest toBookingCreateRequest(
            FixedPointScheduleData data,
            LocalDate deliveryDate,
            RequestInfo requestInfo
    ) {

        WaterTankerBookingDetail detail = WaterTankerBookingDetail.builder()
                .applicantId(data.getApplicantId())
                .tenantId(data.getTenantId())

                .tankerType(WaterTankerConstants.TANKER_TYPE)
                .waterType(WaterTankerConstants.WATER_TYPE)
                .tankerQuantity(WaterTankerConstants.TANKER_QUANTITY)
                .waterQuantity(resolveWaterQuantity(data.getWaterQuantity()))

                .description("Auto-created fixed point tanker booking by scheduler")
                .deliveryDate(deliveryDate)
                .deliveryTime(resolveDeliveryTime(data.getDeliveryTime()))

                .extraCharge(extraCharge)

                .addressDetailId(data.getAddressId())
                .vendorId(data.getVendorId())
                .vehicleId(data.getVehicleId())
                .driverId(data.getDriverId())
                .fillingPointId(data.getFillingPointId())

                .vehicleType(data.getVehicleType())
                .vehicleCapacity(data.getVehicleCapacity())

                .bookingStatus(WaterTankerConstants.BOOKING_STATUS_CREATED)
                .bookingCreatedBy(WaterTankerConstants.BOOKING_CREATED_BY_SYSTEM)
                .applicationType(WaterTankerConstants.APPLICATION_TYPE_FIXED_POINT)

                .applicantDetail(buildApplicantDetail(data))
                .address(buildAddress(data))
                .workflow(buildWorkflow())

                .build();

        return WaterTankerBookingRequest.builder()
                .requestInfo(requestInfo)
                .waterTankerBookingDetail(detail)
                .build();
    }

    private int resolveWaterQuantity(String waterQuantity) {

        if (StringUtils.hasText(waterQuantity)) {
            return Integer.parseInt(waterQuantity);
        }

        return defaultWaterQuantity;
    }

    private LocalTime resolveDeliveryTime(String deliveryTime) {

        if (StringUtils.hasText(deliveryTime)) {
            return LocalTime.parse(deliveryTime);
        }

        return LocalTime.of(8, 0);
    }

    private ApplicantDetail buildApplicantDetail(FixedPointScheduleData data) {

        ApplicantDetail applicant = new ApplicantDetail();

        applicant.setApplicantId(data.getApplicantId());
        applicant.setBookingId("");
        applicant.setName(data.getFixedPointName());
        applicant.setMobileNumber(data.getMobileNumber());
        applicant.setAlternateNumber(data.getAlternateNumber());
        applicant.setEmailId(data.getEmailId());
        applicant.setType(WaterTankerConstants.APPLICANT_TYPE_FIXED_POINT);
        applicant.setFixedPointId(data.getFixedPointCode());

        return applicant;
    }

    private Address buildAddress(FixedPointScheduleData data) {

        Address address = new Address();

        address.setApplicantId(data.getApplicantId());
        address.setAddressId(data.getAddressId());
        address.setAddressType(AddressType.valueOf(WaterTankerConstants.ADDRESS_TYPE_PERMANENT));

        address.setPincode(data.getPincode());
        address.setCity(data.getCity());
        address.setCityCode(data.getCityCode());

        address.setAddressLine1(data.getAddressLine1());
        address.setAddressLine2(data.getAddressLine2());

        address.setLocality(data.getLocality());
        address.setLocalityCode(data.getLocalityCode());

        address.setStreetName(data.getStreetName());
        address.setHouseNo(data.getHouseNo());
        address.setLandmark(data.getLandmark());

        address.setLatitude(data.getLatitude());
        address.setLongitude(data.getLongitude());

        address.setWard(data.getWard());
        address.setZone(data.getZone());
        address.setConstituency(data.getConstituency());

        return address;
    }

    private Workflow buildWorkflow() {

        Workflow workflow = new Workflow();

        workflow.setAction(WaterTankerConstants.WORKFLOW_ACTION_CREATE);
        workflow.setComments("Auto-created by fixed point scheduler");
        workflow.setBusinessService(WaterTankerConstants.WORKFLOW_BUSINESS_SERVICE_FIXED_POINT);
        workflow.setModuleName(WaterTankerConstants.WORKFLOW_MODULE_NAME);

        return workflow;
    }
}