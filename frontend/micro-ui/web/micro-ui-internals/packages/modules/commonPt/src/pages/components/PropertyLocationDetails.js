

import React, { useState, useEffect } from "react";
import { AddressDetails } from "@djb25/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";

const Heading = ({ t }) => <h1 className="heading-m">{t("FILL_ADDRESS_DETAILS")}</h1>;
/**
 * AddressDetailss component renders a  popup for capturing and submitting user address details.
 * It utilizes Digit's UI components and services to present a form and update the user's profile address.
 * Using the `AddressDetails` component to handle all address-related input fields such as pincode, city, locality, street name, house number, landmark, and address lines.
 * - Displaying success or error toasts based on the response.
 */
const PropertyLocationDetails = ({ address, actionCancelOnSubmit, isEdit, onSelect, config, formData: formDataProp, ...props }) => {
  const { t } = useTranslation();
  const { data: allCities } = Digit.Hooks.useTenants();
  const { handleSubmit } = useForm();
  const [showToast, setShowToast] = useState(null);
  const [formData, setFormData] = useState({
    addressType: address?.addressType || "",
    pincode: address?.pinCode || "",
    city: address?.city || "",
    locality: address?.locality || "",
    streetName: address?.streetName || "",
    houseNo: address?.houseNumber || "",
    houseName: address?.houseName || "",
    landmark: address?.landmark || "",
    addressLine1: address?.address || "",
    addressLine2: address?.address2 || "",
    latitude: address?.latitude || "",
    longitude: address?.longitude || "",
    assembly: address?.assembly || "",
    block: address?.block || "",
    zone: address?.zone || "",
    zro: address?.zro || "",
  });
  
  const isPropertyFound = !!formDataProp?.cpt?.details?.propertyId;

  useEffect(() => {
    if (formDataProp?.cpt?.details) {
      const details = formDataProp.cpt.details;
      const addressData = details.address || {};
      const additionalDetails = details.additionalDetails || {};
      
      const localityCode = addressData.locality?.code || addressData.locality || "";
      const lat = addressData.geoLocation?.latitude && addressData.geoLocation?.latitude !== 0 ? addressData.geoLocation.latitude : addressData.locality?.latitude || addressData.latitude || "";
      const lng = addressData.geoLocation?.longitude && addressData.geoLocation?.longitude !== 0 ? addressData.geoLocation.longitude : addressData.locality?.longitude || addressData.longitude || "";

      setFormData({
        pincode: addressData.pincode || "",
        city: addressData.city || "",
        locality: localityCode,
        streetName: addressData.street || "",
        houseNo: addressData.houseNo || "",
        landmark: addressData.landmark || "",
        latitude: lat,
        longitude: lng,
        assembly: additionalDetails.assembly || addressData.additionalDetails?.assembly || "",
        block: additionalDetails.block || addressData.additionalDetails?.block || "",
        zone: additionalDetails.zone || addressData.additionalDetails?.zone || "",
        zro: additionalDetails.zro || addressData.additionalDetails?.zro || "",
        address: {
          ...addressData,
          city: addressData.city || "",
          pincode: addressData.pincode || "",
          locality: localityCode,
          streetName: addressData.street || "",
          houseNo: addressData.houseNo || "",
          addressLine1: addressData.street || "",
          latitude: lat,
          longitude: lng,
          zro: additionalDetails.zro || addressData.additionalDetails?.zro || "",
          assembly: additionalDetails.assembly || addressData.additionalDetails?.assembly || "",
          block: additionalDetails.block || addressData.additionalDetails?.block || "",
          zone: additionalDetails.zone || addressData.additionalDetails?.zone || "",
        }
      });
    }
  }, [formDataProp?.cpt?.details]);
  /*
   * This component renders a modal for capturing and updating user address details.
   * - Manages form state for address fields like pincode, city, locality, etc., using `useState`.
   * - Uses `updateProfile` to send updated address details to the backend via `Digit.UserService.createAddressV2`.
   * - Displays success or error toasts based on the API response.
   * - Renders a form inside a modal using `AddressDetails` for input fields and React Hook Form for submission handling.
   */
  // timer for toast
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(null);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const { createAddress, updateAddress: updateAddressMutation } = Digit.Hooks.useAddress(null, Digit.ULBService.getCurrentTenantId());

  const updateProfile = async () => {
    try {
      const stateCode = Digit.ULBService.getStateId();
      const tenantId = Digit.ULBService.getCurrentTenantId();
      const user = Digit.UserService.getUser();
      const userInfo = user?.info;
      const userUuid = userInfo?.uuid || userInfo?.userUuid || "";

      if (!userInfo) {
        throw new Error("User session not found");
      }

      const requestData = {
        pinCode: formData.pincode,
        city: formData.city?.name || formData.city,
        address: formData.addressLine1,
        type: formData.addressType?.code || formData.addressType,
        tenantId: stateCode,
        userId: userInfo?.id,
        addressType:
          (formData.addressType?.code || formData.addressType) === "CORRESPONDENCE"
            ? "COPONDENCE"
            : formData.addressType?.code || formData.addressType,
        address2: formData.addressLine2,
        houseNumber: formData.houseNo,
        houseName: formData.houseName || formData.city?.name || formData.city,
        streetName: formData.streetName,
        landmark: formData.landmark,
        locality: formData.locality?.code || formData.locality,
        zro: formData.zro?.code || formData.zro,
      };

      createAddress.mutate(
        { address: requestData, userUuid },
        {
          onSuccess: (data) => {
            actionCancelOnSubmit();
          },
          onError: (error) => {
            let message = t("CORE_COMMON_PROFILE_UPDATE_ERROR");
            try {
              const errorObj = typeof error === "string" ? JSON.parse(error) : error;
              message = errorObj?.message || message;
            } catch (e) {}
            setShowToast({
              error: true,
              label: message,
            });
          },
        }
      );
    } catch (error) {
      let message = t("CORE_COMMON_PROFILE_UPDATE_ERROR");
      try {
        const errorObj = JSON.parse(error);
        message = errorObj?.message || message;
      } catch (e) {}
      setShowToast({
        error: true,
        label: message,
      });
    }
  };

  const updateAddress = async () => {
    try {
      const stateCode = Digit.ULBService.getStateId();
      const tenantId = Digit.ULBService.getCurrentTenantId();
      const user = Digit.UserService.getUser();
      const userInfo = user?.info;
      const userUuid = userInfo?.uuid || userInfo?.userUuid || "";

      if (!userInfo) {
        throw new Error("User session not found");
      }

      const requestUpdatedData = {
        pinCode: formData.pincode,
        city: formData.city?.name || formData.city,
        address: formData.addressLine1,
        type: formData.addressType?.code || formData.addressType,
        tenantId: stateCode,
        userId: address?.userId || userInfo?.id || userInfo?.userId || null,
        addressType:
          (formData.addressType?.code || formData.addressType) === "CORRESPONDENCE"
            ? "COPONDENCE"
            : formData.addressType?.code || formData.addressType,
        address2: formData.addressLine2,
        houseNumber: formData.houseNo,
        houseName: formData.houseName || formData.city?.name || formData.city,
        streetName: formData.streetName,
        landmark: formData.landmark,
        locality: formData.locality?.code || formData.locality,
        zro: formData.zro?.code || formData.zro,

        id: address?.id,
      };

      updateAddressMutation.mutate(
        { address: requestUpdatedData, userUuid },
        {
          onSuccess: (data) => {
            actionCancelOnSubmit();
          },
          onError: (error) => {
            let message = t("CORE_COMMON_PROFILE_UPDATE_ERROR");
            try {
              const errorObj = typeof error === "string" ? JSON.parse(error) : error;
              message = errorObj?.message || message;
            } catch (e) {}
            setShowToast({
              error: true,
              label: message,
            });
          },
        }
      );
    } catch (error) {
      let message = t("CORE_COMMON_PROFILE_UPDATE_ERROR");
      try {
        const errorObj = JSON.parse(error);
        message = errorObj?.message || message;
      } catch (e) {}
      setShowToast({
        error: true,
        label: message,
      });
    }
  };

  return (
    <div style={{ boxShadow: "none", ...props.style }}>
      <AddressDetails
        t={t}
        formData={formData}
        onSelect={(key, data) => {
          setFormData(data);
          onSelect(key, data);
        }}
        config={config}
        isEdit={isEdit}
        showZRO={true}
        disable={isPropertyFound}
        hideNextButton={true}
      />
    </div>
  );
};
export default PropertyLocationDetails;
