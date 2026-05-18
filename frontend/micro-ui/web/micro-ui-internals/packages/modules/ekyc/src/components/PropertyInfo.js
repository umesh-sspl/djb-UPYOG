import React, { useState, Fragment } from "react";
import { CardLabel, TextInput, Dropdown, UploadFile, Toast, FormStep } from "@djb25/digit-ui-react-components";
import { useTranslation } from "react-i18next";

const PropertyInfo = ({ config, onSelect }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  // 🔹 STATES
  const [pidNumber, setPidNumber] = useState("");
  const [propertyType, setPropertyType] = useState(null);
  const [subPropertyCategory, setSubPropertyCategory] = useState(null);

  const [noOfFloors, setNoOfFloors] = useState("");
  const [floorNo, setFloorNo] = useState("");

  const [noOfRooms, setNoOfRooms] = useState("");
  const [noOfBeds, setNoOfBeds] = useState("");
  const [dwellingUnits, setDwellingUnits] = useState("");

  const [buildingImage, setBuildingImage] = useState(null);
  const [buildingImageId, setBuildingImageId] = useState(null);

  const [toast, setToast] = useState(null);

  // 🔹 PROPERTY TYPE OPTIONS (you can replace with MDMS)
  const propertyTypeOptions = [{ name: "Residential" }, { name: "Commercial" }, { name: "Hotel" }, { name: "Hospital" }, { name: "Nursing Home" }];

  // 🔹 FILE UPLOAD
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2000000) {
      setToast({ type: "error", message: "Max size 2MB exceeded" });
      return;
    }

    try {
      const res = await Digit.UploadServices.Filestorage("EKYC", file, tenantId);

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
    if (!noOfFloors || Number(noOfFloors) < 1) return false;
    if (!buildingImageId) return false;

    if (propertyType?.name === "Hotel" && !noOfRooms) return false;
    if ((propertyType?.name === "Hospital" || propertyType?.name === "Nursing Home") && !noOfBeds) return false;

    return true;
  };

  // 🔹 SUBMIT
  const onStepSelect = () => {
    if (!isValid()) {
      setToast({ type: "error", message: "Fill all required fields" });
      return;
    }

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

    onSelect(config.key, data);
  };

  return (
    <Fragment>
      <FormStep t={t} onSelect={onStepSelect} config={config} label={t("ES_COMMON_CONTINUE")}>
        <div>
          <CardLabel>PID Number</CardLabel>
          <TextInput value={pidNumber} onChange={(e) => setPidNumber(e.target.value)} />
        </div>

        <div>
          <CardLabel>Property Type</CardLabel>
          <Dropdown option={propertyTypeOptions} selected={propertyType} select={setPropertyType} />
        </div>

        <div>
          <CardLabel>Sub Property Category</CardLabel>
          <Dropdown option={[]} selected={subPropertyCategory} select={setSubPropertyCategory} />
        </div>

        <div>
          <CardLabel>No. of Floors *</CardLabel>
          <TextInput type="number" value={noOfFloors} onChange={(e) => setNoOfFloors(e.target.value)} />
        </div>

        <div>
          <CardLabel>Floor No. of this KNO</CardLabel>
          <TextInput value={floorNo} onChange={(e) => setFloorNo(e.target.value)} />
        </div>

        <div>
          <CardLabel>No of Beds</CardLabel>
          <TextInput type="number" value={noOfBeds} onChange={(e) => setNoOfBeds(e.target.value)} />
        </div>

        <div>
          <CardLabel>No. of Rooms</CardLabel>
          <TextInput type="number" value={noOfRooms} onChange={(e) => setNoOfRooms(e.target.value)} />
        </div>

        {/* HOTEL CONDITION */}
        {propertyType?.name === "Hotel" && (
          <div>
            <CardLabel>No. of Rooms *</CardLabel>
            <TextInput type="number" value={noOfRooms} onChange={(e) => setNoOfRooms(e.target.value)} />
          </div>
        )}

        {/* HOSPITAL CONDITION */}
        {(propertyType?.name === "Hospital" || propertyType?.name === "Nursing Home") && (
          <div>
            <CardLabel>No. of Beds *</CardLabel>
            <TextInput type="number" value={noOfBeds} onChange={(e) => setNoOfBeds(e.target.value)} />
          </div>
        )}

        <div>
          <CardLabel>Number of Dwelling Units</CardLabel>
          <TextInput type="number" value={dwellingUnits} onChange={(e) => setDwellingUnits(e.target.value)} />
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
            <img src={buildingImage} alt="preview" style={{ width: "100%", marginTop: "10px" }} />
          </div>
        )}

        {toast && <Toast label={toast.message} error={toast.type === "error"} onClose={() => setToast(null)} />}
      </FormStep>
    </Fragment>
  );
};

export default PropertyInfo;
