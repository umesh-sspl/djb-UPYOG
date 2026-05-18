import React, { useState, useEffect } from "react";
import { Modal, Card, TextInput, CardLabel, Dropdown, MobileNumber, TextArea, Loader } from "@djb25/digit-ui-react-components";
import { updateEmergencyWaterTankerPayload } from "../utils";

const Close = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF">
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
  </svg>
);

const CloseBtn = (props) => {
  return (
    <div className="icon-bg-secondary" onClick={props.onClick}>
      <Close />
    </div>
  );
};

const WTEditApplicationModal = ({ t, applicationData, closeModal }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  const [formData, setFormData] = useState({
    owner: {},
    address: {},
    requestDetails: {},
    dispatchDetails: {}
  });

  // MDMS Data
  const { data: VehicleType } = Digit.Hooks.useCustomMDMS(stateId, "request-service", [{ name: "VehicleType" }], {
    select: (data) => data?.["request-service"]?.["VehicleType"] || [],
  });

  const { data: TankerType } = Digit.Hooks.useCustomMDMS(stateId, "request-service", [{ name: "TankerType" }], {
    select: (data) => data?.["request-service"]?.["TankerType"] || [],
  });

  const { data: TankerDetails } = Digit.Hooks.useCustomMDMS(stateId, "request-service", [{ name: "TankerQuantity" }], {
    select: (data) => data?.["request-service"]?.["TankerQuantity"] || [],
  });

  const { data: WaterTypeData } = Digit.Hooks.useCustomMDMS(stateId, "Request-service", [{ name: "WaterType" }], {
    select: (data) => data?.["Request-service"]?.["WaterType"] || [],
  });

  // API Data
  const { data: fixedPointsData } = Digit.Hooks.wt.useFixedPointSearchAPI(
    { tenantId, filters: { limit: 1000 } },
    { enabled: true }
  );

  const { data: fillingPointsData } = Digit.Hooks.wt.useFillPointSearch(
    { tenantId, filters: { limit: 1000 } },
    { enabled: true }
  );

  // Mutation
  const mutation = Digit.Hooks.wt.useUpdateEmergencyBooking(tenantId);

  useEffect(() => {
    if (applicationData) {
      const tankerTypeObj = TankerType?.find(tt => tt.code === applicationData.tankerType) || { code: applicationData.tankerType, i18nKey: applicationData.tankerType };
      const tankerQtyObj = TankerDetails?.find(tq => tq.code === applicationData.tankerQuantity) || { code: applicationData.tankerQuantity, i18nKey: applicationData.tankerQuantity };
      const waterTypeObj = WaterTypeData?.find(wt => wt.code === applicationData.waterType) || { code: applicationData.waterType, i18nKey: applicationData.waterType };
      
      const fillingPointObj = fillingPointsData?.fillingPoints?.find(fp => fp.id === applicationData.fillingPointId || fp.fillingPointId === applicationData.fillingPointId) || {};
      
      setFormData({
        owner: {
          applicantName: applicationData?.applicantDetail?.name || "",
          mobileNumber: applicationData?.applicantDetail?.mobileNumber || "",
          alternateNumber: applicationData?.applicantDetail?.alternateNumber || "",
          emailId: applicationData?.applicantDetail?.emailId || "",
          fixedPoint: fixedPointsData?.waterTankerBookingDetail?.find(fp => fp.applicantDetail?.fixedPointId === applicationData?.applicantDetail?.fixedPointId) || "",
          applicantId: applicationData?.applicantDetail?.applicantId || "",
          gender: applicationData?.applicantDetail?.gender || null,
        },
        address: {
          houseNo: applicationData?.address?.houseNo || "",
          streetName: applicationData?.address?.streetName || "",
          addressLine1: applicationData?.address?.addressLine1 || "",
          addressLine2: applicationData?.address?.addressLine2 || "",
          landmark: applicationData?.address?.landmark || "",
          pincode: applicationData?.address?.pincode || "",
          addressId: applicationData?.address?.addressId || "",
          city: applicationData?.address?.city || "Delhi",
          cityCode: applicationData?.address?.cityCode || "DJB",
          locality: applicationData?.address?.locality || "",
          localityCode: applicationData?.address?.localityCode || "",
          ward: applicationData?.address?.ward || "",
          zone: applicationData?.address?.zone || "",
          constituency: applicationData?.address?.constituency || "",
        },
        requestDetails: {
          tankerType: tankerTypeObj,
          waterType: waterTypeObj,
          tankerQuantity: tankerQtyObj,
          waterQuantity: applicationData?.waterQuantity || "",
          description: applicationData?.description || "",
          deliveryDate: applicationData?.deliveryDate || "",
          deliveryTime: applicationData?.deliveryTime || "",
          fileStoreId: applicationData?.WTfileStoreId || null,
          extraCharge: applicationData?.extraCharge === "Y"
        },
        dispatchDetails: {
          fillingPoint: { ...fillingPointObj, name: fillingPointObj?.fillingPointName || "NA" },
          vendor: applicationData?.vendorDetail || "",
          vehicle: applicationData?.vehicleDetail || "",
          driver: applicationData?.driverDetail || ""
        }
      });
    }
  }, [applicationData, TankerType, TankerDetails, WaterTypeData, fixedPointsData, fillingPointsData]);

  // Fetch Vendors based on filling point
  const { data: vendorData } = Digit.Hooks.fsm.useVendorSearch({
    tenantId,
    filters: {
      ...(formData?.dispatchDetails?.fillingPoint?.id ? { fillingPointId: formData.dispatchDetails.fillingPoint.id } : {})
    },
    config: { enabled: !!formData?.dispatchDetails?.fillingPoint?.id }
  });

  const fixedPointOptions = fixedPointsData?.waterTankerBookingDetail?.map(fp => ({
    ...fp,
    name: fp?.applicantDetail?.name || fp?.applicantDetail?.fixedPointId || "NA",
  })) || [];

  const fillingPointOptions = fillingPointsData?.fillingPoints?.map(fp => ({
    ...fp,
    name: fp?.fillingPointName || "NA",
  })) || [];

  const vendorOptions = vendorData?.vendor?.map(v => ({
    ...v,
    name: v?.name || v?.vendor_id || "NA",
  })) || [];

  let vehicleOptions = [];
  let driverOptions = [];

  if (formData?.dispatchDetails?.vendor && typeof formData?.dispatchDetails?.vendor === "object") {
    vehicleOptions = formData?.dispatchDetails?.vendor.vehicles?.map(veh => ({
      ...veh,
      name: veh?.registrationNumber || veh?.type || "NA",
    })) || [];

    driverOptions = formData?.dispatchDetails?.vendor.drivers?.map(drv => ({
      ...drv,
      name: drv?.name || drv?.licenseNumber || "NA",
    })) || [];
  }

  const waterTypeOptions = WaterTypeData?.map(data => ({ i18nKey: `${data.code}`, code: `${data.code}`, value: `${data.code}` })) || [];
  const tankerTypeOptions = TankerType?.map(data => ({ i18nKey: `${data.i18nKey}`, code: `${data.code}`, value: `${data.value}` })) || [];
  const tankerQtyOptions = TankerDetails?.map(data => ({ i18nKey: `${data.code}`, code: `${data.code}`, value: `${data.code}` })) || [];

  const vehicleCapacityOptions = VehicleType?.filter((data) => {
    const vType = data.vehicleType ? data.vehicleType.toLowerCase() : "";
    const tType = formData?.requestDetails?.tankerType?.code ? formData.requestDetails.tankerType.code.toLowerCase() : "";
    return vType === tType || vType.includes("tanker");
  }).map((data) => ({
    i18nKey: `${data.capacityName}`,
    code: `${data.capacity}`,
    value: `${data.capacity}`,
    capacity: `${data.capacity}`,
  })) || [];

  const handleFixedPointSelect = (selected) => {
    if (selected && typeof selected === "object") {
      const applicant = selected.applicantDetail;
      const addr = selected.address;
      setFormData({
        ...formData,
        owner: {
          ...formData.owner,
          fixedPoint: selected,
          applicantName: applicant?.name || formData.owner.applicantName,
          mobileNumber: applicant?.mobileNumber || formData.owner.mobileNumber,
          alternateNumber: applicant?.alternateNumber || formData.owner.alternateNumber,
          emailId: applicant?.emailId || formData.owner.emailId,
        },
        address: {
          ...formData.address,
          houseNo: addr?.houseNo || "",
          streetName: addr?.streetName || "",
          addressLine1: addr?.addressLine1 || "",
          addressLine2: addr?.addressLine2 || "",
          landmark: addr?.landmark || "",
          pincode: addr?.pincode ? addr.pincode.toString().split(".")[0] : "",
          city: addr?.city || "Delhi",
          cityCode: addr?.cityCode || "DJB",
          locality: addr?.locality || "",
          localityCode: addr?.localityCode || "",
          ward: addr?.ward || "",
          zone: addr?.zone || "",
          constituency: addr?.constituency || "",
        }
      });
    }
  };

  const handleFillingPointSelect = (selected) => {
    setFormData({
      ...formData,
      dispatchDetails: {
        ...formData.dispatchDetails,
        fillingPoint: selected,
        vendor: "",
        vehicle: "",
        driver: ""
      }
    });
  };

  const handleVendorSelect = (selected) => {
    setFormData({
      ...formData,
      dispatchDetails: {
        ...formData.dispatchDetails,
        vendor: selected,
        vehicle: "",
        driver: ""
      }
    });
  };

  const handleUpdate = () => {
    const payload = updateEmergencyWaterTankerPayload({ ...applicationData, ...formData, tenantId });
    mutation.mutate(payload, {
      onSuccess: () => {
        closeModal();
        window.location.reload(); // Reload to see changes
      },
      onError: (error) => {
        console.error("Update Error:", error);
      }
    });
  };

  if (mutation.isLoading) return <Loader />;

  return (
    <Modal
      headerBarMain={<h1 className="heading-m">{t("WT_EDIT_APPLICATION_DETAILS")}</h1>}
      headerBarEnd={<CloseBtn onClick={closeModal} />}
      actionCancelLabel={t("CS_COMMON_CANCEL")}
      actionCancelOnSubmit={closeModal}
      actionSaveLabel={t("CS_COMMON_UPDATE")}
      actionSaveOnSubmit={handleUpdate}
    >
      <Card style={{ maxHeight: "70vh", overflowY: "auto", padding: "20px" }}>
        {/* Applicant Details */}
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px", color: "#0B0C10", borderBottom: "1px solid #e0e0e0", paddingBottom: "8px" }}>
            {t("WT_APPLICANT_DETAILS")}
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ flex: "1 1 100%" }}>
              <CardLabel style={{ fontWeight: "600", marginBottom: "4px", fontSize: "14px" }}>{t("WT_FIXED_POINT")}</CardLabel>
              <Dropdown
                selected={formData.owner.fixedPoint}
                option={fixedPointOptions}
                select={handleFixedPointSelect}
                optionKey="name"
                t={t}
                placeholder={t("WT_SELECT_FIXED_POINT")}
              />
            </div>
            <div style={{ flex: "1 1 200px" }}>
              <CardLabel style={{ fontWeight: "600", marginBottom: "4px", fontSize: "14px" }}>{t("WT_APPLICANT_NAME")}</CardLabel>
              <TextInput value={formData.owner.applicantName} onChange={(e) => setFormData({ ...formData, owner: { ...formData.owner, applicantName: e.target.value } })} />
            </div>
            <div style={{ flex: "1 1 200px" }}>
              <CardLabel style={{ fontWeight: "600", marginBottom: "4px", fontSize: "14px" }}>{t("WT_MOBILE_NUMBER")}</CardLabel>
              <MobileNumber value={formData.owner.mobileNumber} onChange={(val) => setFormData({ ...formData, owner: { ...formData.owner, mobileNumber: val } })} />
            </div>
            <div style={{ flex: "1 1 200px" }}>
              <CardLabel style={{ fontWeight: "600", marginBottom: "4px", fontSize: "14px" }}>{t("WT_ALT_MOBILE_NUMBER")}</CardLabel>
              <MobileNumber value={formData.owner.alternateNumber} onChange={(val) => setFormData({ ...formData, owner: { ...formData.owner, alternateNumber: val } })} />
            </div>
            <div style={{ flex: "1 1 200px" }}>
              <CardLabel style={{ fontWeight: "600", marginBottom: "4px", fontSize: "14px" }}>{t("WT_EMAIL_ID")}</CardLabel>
              <TextInput value={formData.owner.emailId} onChange={(e) => setFormData({ ...formData, owner: { ...formData.owner, emailId: e.target.value } })} />
            </div>
          </div>
        </div>

        {/* Address Details */}
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px", color: "#0B0C10", borderBottom: "1px solid #e0e0e0", paddingBottom: "8px" }}>
            {t("WT_ADDRESS_DETAILS")}
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            {["houseNo", "streetName", "addressLine1", "addressLine2", "landmark", "pincode"].map(key => (
              <div key={key} style={{ flex: "1 1 200px" }}>
                <CardLabel style={{ fontWeight: "600", marginBottom: "4px", fontSize: "14px" }}>{t(`WT_${key.toUpperCase()}`)}</CardLabel>
                <TextInput value={formData.address[key]} onChange={(e) => setFormData({ ...formData, address: { ...formData.address, [key]: e.target.value } })} />
              </div>
            ))}
          </div>
        </div>

        {/* Request Details */}
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px", color: "#0B0C10", borderBottom: "1px solid #e0e0e0", paddingBottom: "8px" }}>
            {t("WT_REQUEST_DETAILS")}
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ flex: "1 1 200px" }}>
              <CardLabel style={{ fontWeight: "600", marginBottom: "4px", fontSize: "14px" }}>{t("WT_TANKER_TYPE")}</CardLabel>
              <Dropdown selected={formData.requestDetails.tankerType} option={tankerTypeOptions} select={(val) => setFormData({ ...formData, requestDetails: { ...formData.requestDetails, tankerType: val } })} optionKey="i18nKey" t={t} />
            </div>
            <div style={{ flex: "1 1 200px" }}>
              <CardLabel style={{ fontWeight: "600", marginBottom: "4px", fontSize: "14px" }}>{t("WT_WATER_TYPE")}</CardLabel>
              <Dropdown selected={formData.requestDetails.waterType} option={waterTypeOptions} select={(val) => setFormData({ ...formData, requestDetails: { ...formData.requestDetails, waterType: val } })} optionKey="i18nKey" t={t} />
            </div>
            <div style={{ flex: "1 1 200px" }}>
              <CardLabel style={{ fontWeight: "600", marginBottom: "4px", fontSize: "14px" }}>{t("WT_TANKER_QUANTITY")}</CardLabel>
              <Dropdown selected={formData.requestDetails.tankerQuantity} option={tankerQtyOptions} select={(val) => setFormData({ ...formData, requestDetails: { ...formData.requestDetails, tankerQuantity: val } })} optionKey="i18nKey" t={t} />
            </div>
            <div style={{ flex: "1 1 200px" }}>
              <CardLabel style={{ fontWeight: "600", marginBottom: "4px", fontSize: "14px" }}>{t("WT_WATER_QUANTITY")}</CardLabel>
              <Dropdown selected={formData.requestDetails.waterQuantity} option={vehicleCapacityOptions} select={(val) => setFormData({ ...formData, requestDetails: { ...formData.requestDetails, waterQuantity: val } })} optionKey="i18nKey" t={t} />
            </div>
            <div style={{ flex: "1 1 200px" }}>
              <CardLabel style={{ fontWeight: "600", marginBottom: "4px", fontSize: "14px" }}>{t("WT_DELIVERY_DATE")}</CardLabel>
              <TextInput type="date" value={formData.requestDetails.deliveryDate} onChange={(e) => setFormData({ ...formData, requestDetails: { ...formData.requestDetails, deliveryDate: e.target.value } })} />
            </div>
            <div style={{ flex: "1 1 200px" }}>
              <CardLabel style={{ fontWeight: "600", marginBottom: "4px", fontSize: "14px" }}>{t("WT_DELIVERY_TIME")}</CardLabel>
              <TextInput type="time" value={formData.requestDetails.deliveryTime} onChange={(e) => setFormData({ ...formData, requestDetails: { ...formData.requestDetails, deliveryTime: e.target.value } })} />
            </div>
            <div style={{ flex: "1 1 100%" }}>
              <CardLabel style={{ fontWeight: "600", marginBottom: "4px", fontSize: "14px" }}>{t("WT_DESCRIPTION")}</CardLabel>
              <TextArea value={formData.requestDetails.description} onChange={(e) => setFormData({ ...formData, requestDetails: { ...formData.requestDetails, description: e.target.value } })} />
            </div>
          </div>
        </div>

        {/* Dispatch Details */}
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px", color: "#0B0C10", borderBottom: "1px solid #e0e0e0", paddingBottom: "8px" }}>
            {t("WT_DISPATCH_DETAILS")}
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ flex: "1 1 200px" }}>
              <CardLabel style={{ fontWeight: "600", marginBottom: "4px", fontSize: "14px" }}>{t("WT_FILLING_POINT")}</CardLabel>
              <Dropdown selected={formData.dispatchDetails.fillingPoint} option={fillingPointOptions} select={handleFillingPointSelect} optionKey="name" t={t} />
            </div>
            <div style={{ flex: "1 1 200px" }}>
              <CardLabel style={{ fontWeight: "600", marginBottom: "4px", fontSize: "14px" }}>{t("WT_VENDOR")}</CardLabel>
              <Dropdown selected={formData.dispatchDetails.vendor} option={vendorOptions} select={handleVendorSelect} optionKey="name" t={t} />
            </div>
            <div style={{ flex: "1 1 200px" }}>
              <CardLabel style={{ fontWeight: "600", marginBottom: "4px", fontSize: "14px" }}>{t("WT_VEHICLE")}</CardLabel>
              <Dropdown selected={formData.dispatchDetails.vehicle} option={vehicleOptions} select={(val) => setFormData({ ...formData, dispatchDetails: { ...formData.dispatchDetails, vehicle: val } })} optionKey="name" t={t} />
            </div>
            <div style={{ flex: "1 1 200px" }}>
              <CardLabel style={{ fontWeight: "600", marginBottom: "4px", fontSize: "14px" }}>{t("WT_DRIVER")}</CardLabel>
              <Dropdown selected={formData.dispatchDetails.driver} option={driverOptions} select={(val) => setFormData({ ...formData, dispatchDetails: { ...formData.dispatchDetails, driver: val } })} optionKey="name" t={t} />
            </div>
          </div>
        </div>
      </Card>
    </Modal>
  );
};

export default WTEditApplicationModal;

