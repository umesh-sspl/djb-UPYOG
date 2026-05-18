import React, { useState, useEffect, Fragment } from "react";
import { CardLabel, TextInput, Dropdown, UploadFile, Toast, FormStep, Loader } from "@djb25/digit-ui-react-components";
import { useTranslation } from "react-i18next";

const AddressDetails = ({ config, onSelect }) => {
  const { t } = useTranslation();

  const tenantId = Digit.ULBService.getCurrentTenantId();

  // 🔹 STATES
  const [houseNo, setHouseNo] = useState("");
  const [street, setStreet] = useState("");
  const [locality, setLocality] = useState("");
  const [landmark, setLandmark] = useState("");
  const [subLocality, setSubLocality] = useState(null);

  const [pinCode, setPinCode] = useState("");
  const [assembly, setAssembly] = useState(null);
  const [ward, setWard] = useState(null);
  const [zone, setZone] = useState(null);

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [addressType, setAddressType] = useState(null);

  const [doorPhoto, setDoorPhoto] = useState(null);
  const [doorPhotoFileStoreId, setDoorPhotoFileStoreId] = useState(null);

  const [toast, setToast] = useState(null);

  // 🔹 MDMS DATA
  const { data: mdmsData, isLoading } = Digit.Hooks.useCommonMDMS(tenantId, "egov-location", ["TenantBoundary"]);

  const assemblies = mdmsData?.MdmsRes?.["egov-location"]?.TenantBoundary?.[0]?.boundary?.children || [];

  // 🔹 AUTO GPS
  useEffect(() => {
    let isMounted = true;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (!isMounted) return;
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
        },
        () => {
          if (!isMounted) return;
          setToast({ type: "error", message: "GPS access denied" });
        }
      );
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // 🔹 PIN CODE HANDLER
  const handlePincodeChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) {
      setPinCode(value);

      if (value.length === 6) {
        fetchLocationByPincode(value);
      }
    }
  };

  // 🔹 MOCK PIN API (Replace with real API)
  const fetchLocationByPincode = (pin) => {
    // 🔥 Replace this with backend API
    console.log("Fetching location for PIN:", pin);
  };

  // 🔹 FILE UPLOAD
  const selectphoto = async (e) => {
    let isMounted = true;

    const file = e.target.files[0];
    if (!file) return;

    if (file.size >= 2000000) {
      setToast({ type: "error", message: "Max size 2MB exceeded" });
      return;
    }

    try {
      const res = await Digit.UploadServices.Filestorage("EKYC", file, tenantId);

      if (!isMounted) return;

      const fileStoreId = res?.data?.files?.[0]?.fileStoreId;

      if (fileStoreId) {
        setDoorPhotoFileStoreId(fileStoreId);

        const reader = new FileReader();
        reader.onloadend = () => {
          if (!isMounted) return;
          setDoorPhoto(reader.result);
        };
        reader.readAsDataURL(file);

        setToast({ type: "success", message: "Upload successful" });
      }
    } catch {
      if (!isMounted) return;
      setToast({ type: "error", message: "Upload failed" });
    }

    return () => {
      isMounted = false;
    };
  };

  const removePhoto = () => {
    setDoorPhoto(null);
    setDoorPhotoFileStoreId(null);
  };

  // 🔹 VALIDATION
  const isValid = () => {
    return houseNo && street && pinCode.length === 6 && assembly && ward && zone && latitude && longitude && doorPhotoFileStoreId;
  };

  // 🔹 SUBMIT
  const onStepSelect = () => {
    if (!isValid()) {
      setToast({ type: "error", message: "Please fill all mandatory fields" });
      return;
    }

    const data = {
      houseNo,
      street,
      locality,
      landmark,
      subLocality,
      pinCode,
      assembly: assembly?.name,
      ward: ward?.name,
      zone: zone?.name,
      latitude,
      longitude,
      addressType: addressType?.name,
      doorPhotoFilestoreId: doorPhotoFileStoreId,
    };

    onSelect(config.key, data);
  };

  if (isLoading) return <Loader />;

  return (
    <Fragment>
      <FormStep t={t} onSelect={onStepSelect} config={config} label={t("ES_COMMON_CONTINUE")}>
        <CardLabel>House No / Flat No *</CardLabel>
        <TextInput value={houseNo} onChange={(e) => setHouseNo(e.target.value)} />

        <CardLabel>Street / Address Line *</CardLabel>
        <TextInput value={street} onChange={(e) => setStreet(e.target.value)} />

        <CardLabel>Locality</CardLabel>
        <TextInput value={locality} onChange={(e) => setLocality(e.target.value)} />

        <CardLabel>Landmark</CardLabel>
        <TextInput value={landmark} onChange={(e) => setLandmark(e.target.value)} />

        <CardLabel>Sub Locality</CardLabel>
        <Dropdown option={[]} selected={subLocality} select={setSubLocality} />

        <CardLabel>PIN Code *</CardLabel>
        <TextInput value={pinCode} onChange={handlePincodeChange} maxLength={6} />

        <CardLabel>Assembly *</CardLabel>
        <Dropdown option={assemblies} selected={assembly} select={setAssembly} />

        <CardLabel>Ward *</CardLabel>
        <Dropdown option={assembly?.children || []} selected={ward} select={setWard} />

        <CardLabel>Zone *</CardLabel>
        <Dropdown option={ward?.children || []} selected={zone} select={setZone} />

        <CardLabel>Latitude</CardLabel>
        <TextInput value={latitude} disabled />

        <CardLabel>Longitude</CardLabel>
        <TextInput value={longitude} disabled />

        <CardLabel>Address Type</CardLabel>
        <Dropdown option={[{ name: "Permanent" }, { name: "Correspondence" }, { name: "Other" }]} selected={addressType} select={setAddressType} />

        <CardLabel>Door Image *</CardLabel>
        <UploadFile onUpload={selectphoto} onDelete={removePhoto} message={doorPhotoFileStoreId ? "Uploaded" : "No file selected"} />

        {doorPhoto && <img src={doorPhoto} alt="preview" style={{ width: "100%", marginTop: "10px" }} />}

        {toast && <Toast label={toast.message} error={toast.type === "error"} onClose={() => setToast(null)} />}
      </FormStep>
    </Fragment>
  );
};

export default AddressDetails;
