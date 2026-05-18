import React, { useState, Fragment } from "react";
import { CardLabel, TextInput, Dropdown, UploadFile, Toast, FormStep } from "@djb25/digit-ui-react-components";

const MeterDetails = ({ config, onSelect }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();

  // 🔹 STATES
  const [connectionCategory, setConnectionCategory] = useState("");
  const [saType, setSaType] = useState("");
  const [status, setStatus] = useState("");

  const [mrCode, setMrCode] = useState("");
  const [areaCode, setAreaCode] = useState("");
  const [mrKey, setMrKey] = useState("");

  const [meterNumber, setMeterNumber] = useState("");
  const [meterMaker, setMeterMaker] = useState("");

  const [meterStatus, setMeterStatus] = useState(null);
  const [meterCondition, setMeterCondition] = useState(null);
  const [meterLocation, setMeterLocation] = useState(null);

  const [lastBillReceived, setLastBillReceived] = useState(null);
  const [billMonthYear, setBillMonthYear] = useState(null);
  const [reason, setReason] = useState("");

  const [accessToMeter, setAccessToMeter] = useState(null);
  const [sewerConnection, setSewerConnection] = useState(null);
  const [septicTank, setSepticTank] = useState(null);

  const [meterPhoto, setMeterPhoto] = useState(null);
  const [meterPhotoId, setMeterPhotoId] = useState(null);

  const [toast, setToast] = useState(null);

  // 🔹 OPTIONS
  const yesNo = [{ name: "Yes" }, { name: "No" }];

  const meterStatusOptions = [{ name: "Metered" }, { name: "Unmetered" }, { name: "Can not be identified" }];

  const meterConditionOptions = [{ name: "Damaged" }, { name: "Not-Damaged" }];

  const meterLocationOptions = [{ name: "Inside" }, { name: "Outside" }];

  // 🔹 MONTH-YEAR OPTIONS (1998–2026)
  const monthYearOptions = [];
  for (let y = 1998; y <= 2026; y++) {
    for (let m = 1; m <= 12; m++) {
      monthYearOptions.push({ name: `${m}/${y}` });
    }
  }

  // 🔹 FREEZE LOGIC
  const isFrozen = meterStatus?.name === "Can not be identified";

  // 🔹 FILE UPLOAD
  const uploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const res = await Digit.UploadServices.Filestorage("EKYC", file, tenantId);
      const id = res?.data?.files?.[0]?.fileStoreId;

      if (id) {
        setMeterPhotoId(id);

        const reader = new FileReader();
        reader.onloadend = () => setMeterPhoto(reader.result);
        reader.readAsDataURL(file);
      }
    } catch {
      setToast({ type: "error", message: "Upload failed" });
    }
  };

  // 🔹 VALIDATION
  const isValid = () => {
    if (!connectionCategory) return false;
    if (!meterStatus) return false;
    if (!meterLocation) return false;
    if (!lastBillReceived) return false;
    if (!sewerConnection) return false;

    if (meterStatus?.name === "Metered" && !meterPhotoId) return false;

    if (lastBillReceived?.name === "No" && !reason) return false;

    if (sewerConnection?.name === "No" && !septicTank) return false;

    return true;
  };

  // 🔹 SUBMIT
  const onStepSelect = () => {
    if (!isValid()) {
      setToast({ type: "error", message: "Fill all mandatory fields" });
      return;
    }

    const data = {
      connectionCategory,
      saType,
      status,
      mrCode,
      areaCode,
      mrKey,
      meterNumber,
      meterMaker,
      meterStatus: meterStatus?.name,
      meterCondition: meterCondition?.name,
      meterLocation: meterLocation?.name,
      lastBillReceived: lastBillReceived?.name,
      billMonthYear: billMonthYear?.name,
      reason,
      accessToMeter: accessToMeter?.name,
      sewerConnection: sewerConnection?.name,
      septicTank: septicTank?.name,
      meterPhotoId,
    };

    onSelect(config.key, data);
  };

  return (
    <Fragment>
      <FormStep onSelect={onStepSelect} config={config}>
        <div>
          <CardLabel>Connection Category *</CardLabel>
          <TextInput value={connectionCategory} onChange={(e) => setConnectionCategory(e.target.value)} />
        </div>

        <div>
          <CardLabel>SA Type</CardLabel>
          <TextInput value={saType} onChange={(e) => setSaType(e.target.value)} />
        </div>

        <div>
          <CardLabel>Status</CardLabel>
          <TextInput value={status} onChange={(e) => setStatus(e.target.value)} />
        </div>

        <div>
          <CardLabel>MR Code</CardLabel>
          <TextInput value={mrCode} onChange={(e) => setMrCode(e.target.value)} />
        </div>

        <div>
          <CardLabel>Area Code</CardLabel>
          <TextInput value={areaCode} onChange={(e) => setAreaCode(e.target.value)} />
        </div>

        <div>
          <CardLabel>MR Key</CardLabel>
          <TextInput value={mrKey} onChange={(e) => setMrKey(e.target.value)} />
        </div>

        {!isFrozen && (
          <Fragment>
            <div>
              <CardLabel>Meter Number</CardLabel>
              <TextInput value={meterNumber} onChange={(e) => setMeterNumber(e.target.value)} />
            </div>

            <div>
              <CardLabel>Meter Maker</CardLabel>
              <TextInput value={meterMaker} onChange={(e) => setMeterMaker(e.target.value)} />
            </div>

            <div>
              <CardLabel>Meter Condition</CardLabel>
              <Dropdown option={meterConditionOptions} selected={meterCondition} select={setMeterCondition} />
            </div>

            {meterStatus?.name === "Metered" && (
              <Fragment>
                <div>
                  <CardLabel>Meter Photo *</CardLabel>
                  <UploadFile onUpload={uploadPhoto} message={meterPhotoId ? "Uploaded" : "No file"} />
                </div>
                {meterPhoto && (
                  <div style={{ gridColumn: "span 2" }}>
                    <img src={meterPhoto} style={{ width: "100%" }} alt="" />
                  </div>
                )}
              </Fragment>
            )}
          </Fragment>
        )}

        <div>
          <CardLabel>Meter Status *</CardLabel>
          <Dropdown option={meterStatusOptions} selected={meterStatus} select={setMeterStatus} />
        </div>

        <div>
          <CardLabel>Meter Location *</CardLabel>
          <Dropdown option={meterLocationOptions} selected={meterLocation} select={setMeterLocation} />
        </div>

        <div>
          <CardLabel>Last Bill Received *</CardLabel>
          <Dropdown option={yesNo} selected={lastBillReceived} select={setLastBillReceived} />
        </div>

        {lastBillReceived?.name === "Yes" && (
          <div>
            <CardLabel>When was the last bill received *</CardLabel>
            <Dropdown option={monthYearOptions} selected={billMonthYear} select={setBillMonthYear} />
          </div>
        )}

        {lastBillReceived?.name === "No" && (
          <div>
            <CardLabel>Reason *</CardLabel>
            <TextInput value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
        )}

        <div>
          <CardLabel>Access to Meter</CardLabel>
          <Dropdown option={yesNo} selected={accessToMeter} select={setAccessToMeter} />
        </div>

        <div>
          <CardLabel>Sewer Connection *</CardLabel>
          <Dropdown option={yesNo} selected={sewerConnection} select={setSewerConnection} />
        </div>

        {sewerConnection?.name === "No" && (
          <div>
            <CardLabel>Septic Tank *</CardLabel>
            <Dropdown option={yesNo} selected={septicTank} select={setSepticTank} />
          </div>
        )}

        {toast && <Toast label={toast.message} error={toast.type === "error"} onClose={() => setToast(null)} />}
      </FormStep>
    </Fragment>
  );
};

export default MeterDetails;
