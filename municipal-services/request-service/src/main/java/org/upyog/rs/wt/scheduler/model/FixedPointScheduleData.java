package org.upyog.rs.wt.scheduler.model;

import lombok.Data;

/**
 * Flat DTO used only by scheduler.
 *
 * It contains all data needed to prepare WaterTankerBookingRequest.
 */
@Data
public class FixedPointScheduleData {

    private String scheduleId;
    private String tenantId;

    private String fillingPointId;
    private String fixedPointId;
    private String deliveryTime;
    private String waterQuantity;

    private String applicantId;
    private String fixedPointName;
    private String mobileNumber;
    private String alternateNumber;
    private String emailId;
    private String applicantType;
    private String fixedPointCode;

    private String addressId;
    private String pincode;
    private String city;
    private String cityCode;
    private String addressLine1;
    private String addressLine2;
    private String locality;
    private String localityCode;
    private String streetName;
    private String houseNo;
    private String landmark;
    private String latitude;
    private String longitude;
    private String ward;
    private String zone;
    private String constituency;

    private String vendorId;
    private String vehicleId;
    private String driverId;
    private String vehicleType;
    private String vehicleCapacity;
}