import React, { useEffect, useState } from "react";
import { FormStep, TextInput, CardLabel, CheckBox, Dropdown, TextArea, UploadFile } from "@djb25/digit-ui-react-components";

/**
 * Major Page which is developed for Request/Booking detail page
 *
 */

const EmergencyFixedPointRequestDetails = ({ t, config, onSelect, userType, formData }) => {
  const user = Digit.UserService.getUser().info;
  let validation = {};

  // Defaulted tankerType to "tanker" object so it passes correctly to the payload
  const [tankerType, settankerType] = useState(formData?.requestDetails?.tankerType || { code: "TANKER", i18nKey: "TANKER", value: "TANKER" });
  const [tankerQuantity, settankerQuantity] = useState(formData?.requestDetails?.tankerQuantity || { i18nKey: "1", code: "1", value: "1" });
  const [waterQuantity, setwaterQuantity] = useState(formData?.requestDetails?.waterQuantity || "");
  const [waterType, setWaterType] = useState(formData?.requestDetails?.waterType || "");
  const [deliveryDate, setdeliveryDate] = useState(formData?.requestDetails?.deliveryDate || new Date().toISOString().split("T")[0]);
  const [description, setdescription] = useState(formData?.requestDetails?.description || "");
  const [deliveryTime, setdeliveryTime] = useState(formData?.requestDetails?.deliveryTime || new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }));
  const [extraCharge, setextraCharge] = useState(formData?.requestDetails?.extraCharge || false);
  const [uploadedFile, setUploadedFile] = useState(formData?.requestDetails?.fileStoreId || null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const tenantId = Digit.ULBService.getStateId();
  const inputStyles = { width: user.type === "EMPcommonConfigLOYEE" ? "100%" : "100%" };

  // Fetch VehicleType data from MDMS
  const { data: VehicleType } = Digit.Hooks.useCustomMDMS(tenantId, "request-service", [{ name: "VehicleType" }], {
    select: (data) => {
      const formattedData = data?.["request-service"]?.["VehicleType"];
      return formattedData;
    },
  });

  // Fetch TankerType data from MDMS
  const { data: TankerType } = Digit.Hooks.useCustomMDMS(tenantId, "request-service", [{ name: "TankerType" }], {
    select: (data) => {
      const formattedData = data?.["request-service"]?.["TankerType"];
      return formattedData;
    },
  });

  // Fetch TankerQuantity data from MDMS
  const { data: TankerDetails } = Digit.Hooks.useCustomMDMS(tenantId, "request-service", [{ name: "TankerQuantity" }], {
    select: (data) => {
      const formattedData = data?.["request-service"]?.["TankerQuantity"];
      return formattedData;
    },
  });

  // Fetch WaterType data from MDMS
  const { data: WaterTypeData } = Digit.Hooks.useCustomMDMS(tenantId, "Request-service", [{ name: "WaterType" }], {
    select: (data) => {
      const formattedData = data?.["Request-service"]?.["WaterType"];
      return formattedData;
    },
  });
  
  let Vehicle = [];
  let tankerDetails = [];
  let tankerTypeDetails = [];
  let WaterType = [];

  // Iterate over the WaterType array and push data to the WaterType array
  WaterTypeData &&
    WaterTypeData.map((data) => {
      WaterType.push({ i18nKey: `${data.code}`, code: `${data.code}`, value: `${data.code}` });
    });

  // Iterate over the TankerQuantity array and push data to the Vehicle array
  TankerDetails &&
    TankerDetails.map((data) => {
      tankerDetails.push({ i18nKey: `${data.code}`, code: `${data.code}`, value: `${data.code}` });
    });

  // Iterate over the VehicleType array and push data to the Vehicle array
  VehicleType &&
    VehicleType.map((data) => {
      Vehicle.push({
        i18nKey: `${data.capacity}`,
        code: `${data.capacity}`,
        value: `${data.capacity}`,
        vehicleType: data.vehicleType,
        capacityName: data.capacityName,
      });
    });

  // Iterate over the TankerType array and push data to the tankerTypeDetails array
  TankerType &&
    TankerType.map((data) => {
      tankerTypeDetails.push({ i18nKey: `${data.i18nKey}`, code: `${data.code}`, value: `${data.value}` });
    });

  // Filter Vehicle array based on selected tankerType (Case-insensitive to prevent empty dropdowns)
  let VehicleDetails = Vehicle
    .filter((data) => {
      const vType = data.vehicleType ? data.vehicleType.toLowerCase() : "";
      const tType = tankerType?.code ? tankerType.code.toLowerCase() : "";
      return vType === tType || vType.includes("tanker");
    })
    .map((data) => ({
      i18nKey: `${data.capacityName}`,
      code: `${data.code}`,
      value: `${data.value}`,
      capacity: `${data.capacity}`,
    }));

  // Fallback: If strict matching failed but vehicles exist, map all vehicles so dropdown isn't empty
  if (VehicleDetails.length === 0 && Vehicle.length > 0) {
    VehicleDetails = Vehicle.map((data) => ({
      i18nKey: `${data.capacityName}`,
      code: `${data.code}`,
      value: `${data.value}`,
      capacity: `${data.capacity}`,
    }));
  }

  // Custom time input component
  const TimeInput = () => {
    return (
      <div className="flex items-center">
        <TextInput type="time" value={deliveryTime} style={inputStyles} onChange={(e) => setdeliveryTime(e.target.value)} min="06:00" max="23:59" />
      </div>
    );
  };

  const setextrachargeHandler = () => {
    setextraCharge(!extraCharge);
  };

  function setDescription(e) {
    setdescription(e.target.value);
  }
  function setDeliveryDate(e) {
    setdeliveryDate(e.target.value);
  }

  function selectfile(e) {
    setUploadedFile(null);
    setFile(e.target.files[0]);
  }

  useEffect(() => {
    (async () => {
      setError(null);
      if (file) {
        if (file.size >= 2000000) {
          setError(t("WT_MAXIMUM_UPLOAD_SIZE_EXCEEDED"));
        } else {
          try {
            const response = await Digit.UploadServices.Filestorage("wt", file, Digit.ULBService.getStateId());
            if (response?.data?.files?.length > 0) {
              setUploadedFile(response?.data?.files[0]?.fileStoreId);
            } else {
              setError(t("WT_FILE_UPLOAD_ERROR"));
            }
          } catch (err) {
            setError(t("WT_FILE_UPLOAD_ERROR"));
          }
        }
      }
    })();
  }, [file]);

  const goNext = () => {
    let requestDetails = formData.requestDetails;
    let request = {
      ...requestDetails,
      tankerType,
      deliveryDate,
      tankerQuantity,
      waterType,
      waterQuantity,
      deliveryTime,
      description,
      extraCharge,
      fileStoreId: uploadedFile,
    };
    onSelect(config.key, request, false);
  };

  return (
    <React.Fragment>
      <FormStep
        config={config}
        onSelect={goNext}
        t={t}
        // Removed !description from isDisabled constraints
        isDisabled={!tankerType || !deliveryDate || !tankerQuantity || !waterQuantity || !deliveryTime || !waterType}
        className="card-form-container"
      >
        <div>
          <CardLabel>
            {`${t("WT_WATER_TYPE")}`} <span className="astericColor">*</span>
          </CardLabel>
          <Dropdown
            className="form-field"
            selected={waterType}
            placeholder={t("WT_SELECT_WATER_TYPE")}
            select={setWaterType}
            option={WaterType}
            style={inputStyles}
            optionKey="i18nKey"
            t={t}
          />
        </div>
        <div>
          <CardLabel>
            {`${t("WT_WATER_QUANTITY")}`} <span className="astericColor">*</span>
          </CardLabel>
          <Dropdown
            className="form-field"
            selected={waterQuantity}
            placeholder={"Select Water Quantity"}
            select={setwaterQuantity}
            option={VehicleDetails}
            style={inputStyles}
            optionKey="i18nKey"
            t={t}
          />
        </div>
        <div>
          <CardLabel>
            {`${t("WT_TANKER_QUANTITY")}`} <span className="astericColor">*</span>
          </CardLabel>
          <Dropdown
            className="form-field"
            selected={tankerQuantity}
            placeholder={"Select Tanker Quantity"}
            select={settankerQuantity}
            option={tankerDetails}
            style={inputStyles}
            optionKey="i18nKey"
            t={t}
          />
        </div>
        <div>
          <CardLabel>
            {`${t("WT_DELIVERY_DATE")}`} <span className="astericColor">*</span>
          </CardLabel>
          <TextInput
            t={t}
            type={"date"}
            isMandatory={false}
            optionKey="i18nKey"
            name="deliveryDate"
            style={inputStyles}
            value={deliveryDate}
            onChange={setDeliveryDate}
            min={new Date().toISOString().split("T")[0]}
            max={new Date().toISOString().split("T")[0]}
            rules={{
              required: t("CORE_COMMON_REQUIRED_ERRMSG"),
              validDate: (val) => (/^\d{4}-\d{2}-\d{2}$/.test(val) ? true : t("ERR_DEFAULT_INPUT_FIELD_MSG")),
            }}
          />
        </div>
        <div>
          <CardLabel>
            {`${t("WT_DELIVERY_TIME")}`} <span className="astericColor">*</span>
          </CardLabel>
          <TimeInput />
        </div>

        <div>
          <CardLabel>{`${t("WT_UPLOAD_DOCUMENT")}`}</CardLabel>
          <UploadFile
            id={"wt-doc"}
            extraStyleName={"propertyCreate"}
            accept=".jpg,.png,.pdf,.jpeg"
            onUpload={selectfile}
            onDelete={() => {
              setUploadedFile(null);
            }}
            message={uploadedFile ? `1 ${t(`WT_ACTION_FILEUPLOADED`)}` : t(`WT_ACTION_NO_FILEUPLOADED`)}
            error={error}
          />
        </div>
        <div>
          {/* Removed mandatory asterisk span */}
          <CardLabel>
            {`${t("WT_DESCRIPTION")}`}
          </CardLabel>
          <TextArea
            t={t}
            type={"text"}
            isMandatory={false}
            optionKey="i18nKey"
            name="description"
            value={description}
            onChange={setDescription}
            style={inputStyles}
            ValidationRequired={false} // Validation turned off
            {...(validation = {
              isRequired: false, // Made optional
              pattern: "^[a-zA-Z ]+$",
              type: "tel",
              title: t("PT_NAME_ERROR_MESSAGE"),
            })}
          />
        </div>
        {error ? <div style={{ height: "20px", width: "100%", fontSize: "20px", color: "red", marginTop: "5px" }}>{error}</div> : ""}
        <CheckBox label={t("WT_IMMEDIATE")} onChange={setextrachargeHandler} checked={extraCharge} />
      </FormStep>
    </React.Fragment>
  );
};

export default EmergencyFixedPointRequestDetails;