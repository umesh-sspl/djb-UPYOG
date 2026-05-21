import { WTService } from "../../elements/WT";
import { FSMService } from "../../elements/FSM";
import React from "react";

/**
 * Provides methods for interacting with water tanker (WT) bookings. 
 * Includes functionality for searching all bookings, retrieving a specific application, 
 * formatting booking details, and returning application-specific data. 
 * Uses `WTService.search` to fetch data, then formats it for display in the UI. 
 */
export const WTSearch = {

  all: async (tenantId, filters = {}) => {

    const response = await WTService.search({ tenantId, filters });

    return response;
  },

  application: async (tenantId, filters = {}) => {
    const response = await WTService.search({ tenantId, filters });
    return response.waterTankerBookingDetail[0];
  },
  BookingDetails: ({ waterTankerBookingDetail: response, vendorDetails, vehicleDetails, driverDetails, t }) => {

    let immediateRequired = (response?.extraCharge) ? "YES" : "NO"
    return [
      {
        title: "WT_BOOKING_NO",
        asSectionHeader: true,
        values: [
          { title: "WT_BOOKING_NO", value: response?.bookingNo || t("CS_NA") },
          { title: "WT_BOOKING_STATUS", value: response?.bookingStatus || t("CS_NA") },
          { title: "WT_APPLICATION_DATE", value: (response?.applicationDate || response?.auditDetails?.createdTime) ? Digit.DateUtils.ConvertEpochToDate(response?.applicationDate || response?.auditDetails?.createdTime) : t("CS_NA") },
          { title: "WT_PAYMENT_DATE", value: response?.paymentDate ? Digit.DateUtils.ConvertEpochToDate(response?.paymentDate) : t("CS_NA") }
        ]
      },
      {
        title: window.location.href.includes("fixed-point") ? "WT_FIXED_POINT_DETAILS" : "WT_APPLICANT_DETAILS",

        asSectionHeader: true,
        values: [
          { title: window.location.href.includes("fixed-point") ? "WT_FIXED_POINT_NAME" : "WT_APPLICANT_NAME", value: response?.applicantDetail?.name || t("CS_NA") },
          { title: "WT_MOBILE_NUMBER", value: response?.applicantDetail?.mobileNumber || t("CS_NA") },
          { title: "WT_ALT_MOBILE_NUMBER", value: response?.applicantDetail?.alternateNumber || t("CS_NA") },
          { title: "WT_EMAIL_ID", value: response?.applicantDetail?.emailId || t("CS_NA") }
        ],
      },
      {
        title: "WT_ADDRESS_DETAILS",
        asSectionHeader: true,
        values: [
          { title: "WT_PINCODE", value: response?.address?.pincode || t("CS_NA") },
          { title: "WT_CITY", value: response?.address?.city || t("CS_NA") },
          { title: "WT_LOCALITY", value: response?.address?.locality || t("CS_NA") },
          { title: "WT_STREET_NAME", value: response?.address?.streetName || t("CS_NA") },
          { title: "WT_HOUSE_NO", value: response?.address?.houseNo || t("CS_NA") },
          { title: "WT_LANDMARK", value: response?.address?.landmark || t("CS_NA") },
          { title: "WT_ADDRESS_LINE1", value: response?.address?.addressLine1 || t("CS_NA") },
          { title: "WT_ADDRESS_LINE2", value: response?.address?.addressLine2 || t("CS_NA") },
          { title: "WT_LATITUDE", value: response?.address?.latitude || response?.latitude || t("CS_NA") },
          { title: "WT_LONGITUDE", value: response?.address?.longitude || response?.longitude || t("CS_NA") }
        ],
      },
      {
        title: "WT_REQUEST_DETAILS",
        asSectionHeader: true,
        values: [
          { title: "WT_TANKER_TYPE", value: response?.tankerType || t("CS_NA") },
          { title: "WT_WATER_TYPE", value: response?.waterType || t("CS_NA") },
          { title: "WT_TANKER_QUANTITY", value: response?.tankerQuantity || t("CS_NA") },
          { title: "WT_WATER_QUANTITY", value: response?.waterQuantity || t("CS_NA") },
          { title: "WT_DELIVERY_DATE", value: response?.deliveryDate || t("CS_NA") },
          { title: "WT_DELIVERY_TIME", value: response?.deliveryTime?.replace(":", "h ") + "m" || t("CS_NA") },
          { title: "WT_DESCRIPTION", value: response?.description || t("CS_NA") },
          { title: "WT_IMMEDIATE", value: immediateRequired || t("CS_NA") },
        ],
      },
      {
        title: "WT_VENDOR_DETAILS",
        asSectionHeader: true,
        values: [
          { title: "WT_VENDOR_NAME", value: vendorDetails?.name || t("CS_NA") },
          { title: "WT_MOBILE_NUMBER", value: vendorDetails?.owner?.mobileNumber || t("CS_NA") },
          { title: "WT_ALT_MOBILE_NUMBER", value: vendorDetails?.owner?.alternateNumber || t("CS_NA") },
          { title: "WT_EMAIL_ID", value: vendorDetails?.owner?.emailId || t("CS_NA") }
        ],
      },
      {
        title: "WT_DRIVER_DETAILS",
        asSectionHeader: true,
        values: [
          { title: "WT_DRIVER_NAME", value: driverDetails?.name || t("CS_NA") },
          { title: "WT_MOBILE_NUMBER", value: driverDetails?.owner?.mobileNumber || t("CS_NA") },
          { title: "WT_ALT_MOBILE_NUMBER", value: driverDetails?.owner?.alternateNumber || t("CS_NA") },
          { title: "WT_EMAIL_ID", value: driverDetails?.owner?.emailId || t("CS_NA") }
        ],
      },
      {
        title: "WT_VEHICLE_DETAILS",
        asSectionHeader: true,
        values: [
          { title: "WT_VEHICLE_NUMBER", value: vehicleDetails?.registrationNumber || t("CS_NA") },
          { title: "WT_VEHICLE_TYPE", value: vehicleDetails?.type ? t(`COMMON_MASTER_VEHICLE_${vehicleDetails?.type}`) : t("CS_NA") },
          { title: "WT_VEHICLE_CAPACITY", value: vehicleDetails?.tankCapacity || t("CS_NA") },
          { title: "WT_FILLING_POINTS", value: response?.fillingPointMetadata?.name || t("CS_NA") }
        ],
      },
    ];
  },
  applicationDetails: async (t, tenantId, BookingNo, userType, args) => {
    const filter = { BookingNo, ...args };
    const response = await WTSearch.application(tenantId, filter);

    let vendorDetails = null;
    let vehicleDetails = null;
    let driverDetails = null;

    try {
      if (response?.vendorId) {
        const vendorRes = await FSMService.vendorSearch(tenantId, { ids: response.vendorId });
        vendorDetails = vendorRes?.vendor?.[0] || null;
      }
      if (response?.vehicleId) {
        const vehicleRes = await FSMService.vehiclesSearch(tenantId, { ids: response.vehicleId });
        vehicleDetails = vehicleRes?.vehicle?.[0] || null;
      }
      if (response?.driverId) {
        const driverRes = await FSMService.driverSearch(tenantId, { ownerIds: response.driverId });
        driverDetails = driverRes?.driver?.[0] || null;
      }
    } catch (e) {
      console.error("Error fetching WT vendor/vehicle/driver details", e);
    }

    return {
      tenantId: response.tenantId,
      applicationDetails: WTSearch.BookingDetails({ waterTankerBookingDetail: response, vendorDetails, vehicleDetails, driverDetails, t }),
      applicationData: response,
      transformToAppDetailsForEmployee: (params) => WTSearch.BookingDetails({ ...params, vendorDetails, vehicleDetails, driverDetails })
    };
  },
};
