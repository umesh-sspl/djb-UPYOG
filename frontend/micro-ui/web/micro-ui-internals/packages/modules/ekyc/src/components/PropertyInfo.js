import React, { useState, Fragment, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  CardLabel,
  TextInput,
  Dropdown,
  UploadFile,
  Toast,
  FormStep,
  Loader
} from "@djb25/digit-ui-react-components";
import { useTranslation } from "react-i18next";

const PropertyInfo = ({ config, onSelect, formData }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const flowState = location.state || {};
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const searchKno = flowState?.kNumber || flowState?.kno || formData?.kNumber || formData?.kno || sessionStorage.getItem("EKYC_K_NUMBER");

  const { isLoading, data: searchData } = Digit.Hooks.ekyc.useSearchConnection(
    { tenantId, details: { kno: searchKno } },
    { enabled: !!searchKno, cacheTime: 0 }
  );

  const updateMutation = Digit.Hooks.ekyc.useEkycUpdate(tenantId);

  const savedData = formData?.propertyDetails || {};

  // 🔹 STATES
  const [pidNumber, setPidNumber] = useState(savedData.pidNumber || "");
  const [propertyType, setPropertyType] = useState(savedData.propertyType ? { name: savedData.propertyType } : null);
  const [subPropertyCategory, setSubPropertyCategory] = useState(savedData.subPropertyCategory ? { name: savedData.subPropertyCategory } : null);

  const [noOfFloors, setNoOfFloors] = useState(savedData.noOfFloors || "");
  const [floorNo, setFloorNo] = useState(savedData.floorNo || "");

  const [noOfRooms, setNoOfRooms] = useState(savedData.noOfRooms || "");
  const [noOfBeds, setNoOfBeds] = useState(savedData.noOfBeds || "");
  const [dwellingUnits, setDwellingUnits] = useState(savedData.dwellingUnits || "");

  const [buildingImage, setBuildingImage] = useState(null);
  const [buildingImageId, setBuildingImageId] = useState(savedData.buildingImageId || null);

  const [toast, setToast] = useState(null);

  // 🔹 PROPERTY TYPE OPTIONS
  const propertyTypeOptions = [
    { name: "Residential" },
    { name: "Commercial" },
    { name: "Hotel" },
    { name: "Hospital" },
    { name: "Nursing Home" },
  ];

  useEffect(() => {
    const rawData = searchData || formData?.connectionDetails;
    const propertyInfo = rawData?.propertyInfo || rawData?.propertyDetails || {};

    if (propertyInfo && Object.keys(propertyInfo).length > 0 && !savedData.pidNumber) {
      if (propertyInfo.pidNumber) setPidNumber(propertyInfo.pidNumber);
      if (propertyInfo.numberOfFloors || propertyInfo.noOfFloor) setNoOfFloors(String(propertyInfo.numberOfFloors || propertyInfo.noOfFloor));
      if (propertyInfo.buildingImageFileStoreId) setBuildingImageId(propertyInfo.buildingImageFileStoreId);

      if (propertyInfo.subPropertyCategory) {
        const matchingType = propertyTypeOptions.find(type => type.name.toLowerCase() === propertyInfo.subPropertyCategory.toLowerCase());
        if (matchingType) setPropertyType(matchingType);
        else setPropertyType({ name: propertyInfo.subPropertyCategory });
        setSubPropertyCategory({ name: propertyInfo.subPropertyCategory });
      }

      if (propertyInfo.propertyType) {
        setSubPropertyCategory({ name: propertyInfo.propertyType }); // Just in case, depending on how UI renders it
        if (!propertyInfo.subPropertyCategory) setPropertyType({ name: propertyInfo.propertyType });
      }

      if (propertyInfo.floorNo) setFloorNo(propertyInfo.floorNo);
      if (propertyInfo.numberOfRooms !== null && propertyInfo.numberOfRooms !== undefined) setNoOfRooms(String(propertyInfo.numberOfRooms));
      if (propertyInfo.numberOfBeds !== null && propertyInfo.numberOfBeds !== undefined) setNoOfBeds(String(propertyInfo.numberOfBeds));
      if (propertyInfo.numberOfDwellingUnits !== null && propertyInfo.numberOfDwellingUnits !== undefined) setDwellingUnits(String(propertyInfo.numberOfDwellingUnits));
    }
  }, [searchData, formData?.connectionDetails]);

  // 🔹 FILE UPLOAD
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2000000) {
      setToast({ type: "error", message: "Max size 2MB exceeded" });
      return;
    }

    try {
      const res = await Digit.UploadServices.Filestorage(
        "EKYC",
        file,
        tenantId
      );

      const fileStoreId = res?.data?.files?.[0]?.fileStoreId;

      if (fileStoreId) {
        setBuildingImageId(fileStoreId);

        const reader = new FileReader();
        reader.onloadend = () => setBuildingImage(reader.result);
        reader.readAsDataURL(file);

        setToast({ type: "success", message: "Upload successful" });
      }
    } catch {
      setToast({ type: "error", message: "Upload failed" });
    }
  };

  // 🔹 VALIDATION
  const isValid = () => {
    if (!propertyType) return false;
    if (!subPropertyCategory) return false;
    if (!noOfFloors || Number(noOfFloors) < 1) return false;
    if (!buildingImageId) return false;

    if (propertyType?.name === "Hotel" && !noOfRooms) return false;
    if (
      (propertyType?.name === "Hospital" ||
        propertyType?.name === "Nursing Home") &&
      !noOfBeds
    )
      return false;

    return true;
  };

  // 🔹 SUBMIT
  const onStepSelect = async () => {
    /* Optional validation enforce
    if (!isValid()) {
      setToast({ type: "error", message: "Fill all required fields" });
      return;
    }
    */

    const data = {
      pidNumber,
      propertyType: propertyType?.name,
      subPropertyCategory: subPropertyCategory?.name,
      noOfFloors,
      floorNo,
      noOfRooms,
      noOfBeds,
      dwellingUnits,
      buildingImageId,
    };

    try {
      await updateMutation.mutateAsync({
        RequestInfo: {},
        updateType: "PROPERTY",
        kno: searchKno,
        ...data,
      });
      setToast({ type: "success", message: "Property details updated successfully!" });
      onSelect(config.key, data);
    } catch (error) {
      setToast({ type: "error", message: "Failed to update property details" });
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Fragment>
      <FormStep
        t={t}
        onSelect={onStepSelect}
        config={config}
        label={t("ES_COMMON_CONTINUE")}
        isDisabled={!isValid()}
      >
        <div>
          <CardLabel>PID Number</CardLabel>
          <TextInput value={pidNumber} onChange={(e) => setPidNumber(e.target.value)} />
        </div>

        <div>
          <CardLabel>Property Type</CardLabel>
          <Dropdown
            option={propertyTypeOptions}
            selected={propertyType}
            select={setPropertyType}
          />
        </div>

        <div>
          <CardLabel>Sub Property Category</CardLabel>
          <Dropdown option={[]} selected={subPropertyCategory} select={setSubPropertyCategory} />
        </div>

        <div>
          <CardLabel>No. of Floors *</CardLabel>
          <TextInput
            type="number"
            value={noOfFloors}
            onChange={(e) => setNoOfFloors(e.target.value)}
          />
        </div>

        <div>
          <CardLabel>Floor No. of this KNO</CardLabel>
          <TextInput value={floorNo} onChange={(e) => setFloorNo(e.target.value)} />
        </div>

        <div>
          <CardLabel>No of Beds</CardLabel>
          <TextInput
            type="number"
            value={noOfBeds}
            onChange={(e) => setNoOfBeds(e.target.value)}
          />
        </div>

        <div>
          <CardLabel>No. of Rooms</CardLabel>
          <TextInput
            type="number"
            value={noOfRooms}
            onChange={(e) => setNoOfRooms(e.target.value)}
          />
        </div>

        {/* HOTEL CONDITION */}
        {propertyType?.name === "Hotel" && (
          <div>
            <CardLabel>No. of Rooms *</CardLabel>
            <TextInput
              type="number"
              value={noOfRooms}
              onChange={(e) => setNoOfRooms(e.target.value)}
            />
          </div>
        )}

        {/* HOSPITAL CONDITION */}
        {(propertyType?.name === "Hospital" ||
          propertyType?.name === "Nursing Home") && (
            <div>
              <CardLabel>No. of Beds *</CardLabel>
              <TextInput
                type="number"
                value={noOfBeds}
                onChange={(e) => setNoOfBeds(e.target.value)}
              />
            </div>
          )}

        <div>
          <CardLabel>Number of Dwelling Units</CardLabel>
          <TextInput
            type="number"
            value={dwellingUnits}
            onChange={(e) => setDwellingUnits(e.target.value)}
          />
        </div>

        <div>
          <CardLabel>Building Image *</CardLabel>
          <UploadFile
            onUpload={handleUpload}
            onDelete={() => {
              setBuildingImage(null);
              setBuildingImageId(null);
            }}
            message={buildingImageId ? "Uploaded" : "No file selected"}
          />
        </div>

        {buildingImage && (
          <div style={{ gridColumn: "span 2" }}>
            <img
              src={buildingImage}
              alt="preview"
              style={{ width: "100%", marginTop: "10px" }}
            />
          </div>
        )}

        {toast && (
          <Toast
            label={toast.message}
            error={toast.type === "error"}
            onClose={() => setToast(null)}
          />
        )}
      </FormStep>
    </Fragment>
  );
};

export default PropertyInfo;