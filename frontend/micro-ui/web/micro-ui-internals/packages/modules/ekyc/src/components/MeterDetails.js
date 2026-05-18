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

const MeterDetails = ({ config, onSelect, formData }) => {
  const location = useLocation();
  const flowState = location.state || {};
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const searchKno = flowState?.kNumber || flowState?.kno || formData?.kNumber || formData?.kno || sessionStorage.getItem("EKYC_K_NUMBER");

  const { isLoading, data: searchData } = Digit.Hooks.ekyc.useSearchConnection(
    { tenantId, details: { kno: searchKno } },
    { enabled: !!searchKno, cacheTime: 0 }
  );

  const updateMutation = Digit.Hooks.ekyc.useEkycUpdate(tenantId);

  const savedData = formData?.meterDetails || {};

  // 🔹 STATES
  const [connectionCategory, setConnectionCategory] = useState(savedData.connectionCategory || "");
  const [saType, setSaType] = useState(savedData.saType || "");
  const [status, setStatus] = useState(savedData.status || "");

  const [mrCode, setMrCode] = useState(savedData.mrCode || "");
  const [areaCode, setAreaCode] = useState(savedData.areaCode || "");
  const [mrKey, setMrKey] = useState(savedData.mrKey || "");

  const [meterNumber, setMeterNumber] = useState(savedData.meterNumber || "");
  const [meterMaker, setMeterMaker] = useState(savedData.meterMaker || "");

  const [meterStatus, setMeterStatus] = useState(savedData.meterStatus ? { name: savedData.meterStatus } : null);
  const [meterCondition, setMeterCondition] = useState(savedData.meterCondition ? { name: savedData.meterCondition } : null);
  const [meterLocation, setMeterLocation] = useState(savedData.meterLocation ? { name: savedData.meterLocation } : null);

  const [lastBillReceived, setLastBillReceived] = useState(savedData.lastBillReceived ? { name: savedData.lastBillReceived } : null);
  const [billMonthYear, setBillMonthYear] = useState(savedData.billMonthYear ? { name: savedData.billMonthYear } : null);
  const [reason, setReason] = useState(savedData.reason || "");

  const [accessToMeter, setAccessToMeter] = useState(savedData.accessToMeter ? { name: savedData.accessToMeter } : null);
  const [sewerConnection, setSewerConnection] = useState(savedData.sewerConnection ? { name: savedData.sewerConnection } : null);
  const [septicTank, setSepticTank] = useState(savedData.septicTank ? { name: savedData.septicTank } : null);

  const [meterPhoto, setMeterPhoto] = useState(null);
  const [meterPhotoId, setMeterPhotoId] = useState(savedData.meterPhotoId || null);

  const [toast, setToast] = useState(null);

  // 🔹 OPTIONS
  const yesNo = [{ name: "Yes" }, { name: "No" }];

  const meterStatusOptions = [
    { name: "Metered" },
    { name: "Unmetered" },
    { name: "Can not be identified" },
  ];

  const meterConditionOptions = [
    { name: "Damaged" },
    { name: "Not-Damaged" },
  ];

  const meterLocationOptions = [
    { name: "Inside" },
    { name: "Outside" },
  ];

  // 🔹 MONTH-YEAR OPTIONS (1998–2026)
  const monthYearOptions = [];
  for (let y = 1998; y <= 2026; y++) {
    for (let m = 1; m <= 12; m++) {
      monthYearOptions.push({ name: `${m}/${y}` });
    }
  }

  useEffect(() => {
    const rawData = searchData || formData?.connectionDetails;
    const apiMeter = rawData?.meterDetails || rawData || {};

    if (apiMeter && Object.keys(apiMeter).length > 0 && !savedData.connectionCategory) {
      if (apiMeter.connectionCategory) setConnectionCategory(apiMeter.connectionCategory);
      if (apiMeter.saType) setSaType(apiMeter.saType);
      if (apiMeter.statusFlag) setStatus(apiMeter.statusFlag);

      if (apiMeter.mrcode) setMrCode(String(apiMeter.mrcode));
      if (apiMeter.areacode) setAreaCode(String(apiMeter.areacode));
      if (apiMeter.mrkey) setMrKey(String(apiMeter.mrkey));

      if (apiMeter.meterNumber) setMeterNumber(apiMeter.meterNumber);
      if (apiMeter.meterMake) setMeterMaker(apiMeter.meterMake);

      if (apiMeter.meterStatus) {
        const matchingStatus = meterStatusOptions.find(o => o.name.toLowerCase() === apiMeter.meterStatus.toLowerCase());
        if (matchingStatus) setMeterStatus(matchingStatus);
        else setMeterStatus({ name: apiMeter.meterStatus });
      } else if (apiMeter.metered !== undefined) {
        setMeterStatus({ name: apiMeter.metered ? "Metered" : "Unmetered" });
      }

      if (apiMeter.meterCondition) {
        const matchingCond = meterConditionOptions.find(o => o.name.toLowerCase() === apiMeter.meterCondition.toLowerCase());
        if (matchingCond) setMeterCondition(matchingCond);
        else setMeterCondition({ name: apiMeter.meterCondition });
      }

      if (apiMeter.meterLocation) {
        const matchingLoc = meterLocationOptions.find(o => o.name.toLowerCase() === apiMeter.meterLocation.toLowerCase() || apiMeter.meterLocation.toLowerCase().includes(o.name.toLowerCase()));
        if (matchingLoc) setMeterLocation(matchingLoc);
        else setMeterLocation({ name: apiMeter.meterLocation });
      }

      if (apiMeter.lastBillRaised !== undefined && apiMeter.lastBillRaised !== null) {
        const strVal = String(apiMeter.lastBillRaised).toLowerCase();
        if (strVal === "true" || strVal === "yes") setLastBillReceived({ name: "Yes" });
        else setLastBillReceived({ name: "No" });
      }

      if (apiMeter.lastBillReceivedDate) {
        const formatted = apiMeter.lastBillReceivedDate.replace("-", "/");
        const parsedParts = formatted.split("/");
        if (parsedParts.length === 2) {
          const mon = parseInt(parsedParts[0], 10);
          const yr = parseInt(parsedParts[1], 10);
          setBillMonthYear({ name: `${mon}/${yr}` });
        } else {
          setBillMonthYear({ name: apiMeter.lastBillReceivedDate });
        }
      }

      if (apiMeter.lastBillNotRaisedReason) setReason(apiMeter.lastBillNotRaisedReason);

      if (apiMeter.accessToMeter !== undefined && apiMeter.accessToMeter !== null) {
        const strVal = String(apiMeter.accessToMeter).toLowerCase();
        if (strVal === "true" || strVal === "yes") setAccessToMeter({ name: "Yes" });
        else setAccessToMeter({ name: "No" });
      }

      if (apiMeter.sewerConnection !== undefined && apiMeter.sewerConnection !== null) {
        const strVal = String(apiMeter.sewerConnection).toLowerCase();
        if (strVal === "true" || strVal === "yes") setSewerConnection({ name: "Yes" });
        else setSewerConnection({ name: "No" });
      }

      if (apiMeter.septicTank !== undefined && apiMeter.septicTank !== null) {
        const strVal = String(apiMeter.septicTank).toLowerCase();
        if (strVal === "true" || strVal === "yes") setSepticTank({ name: "Yes" });
        else setSepticTank({ name: "No" });
      }

      if (apiMeter.meterPhotoFileStoreId) setMeterPhotoId(apiMeter.meterPhotoFileStoreId);
    }
  }, [searchData, formData?.connectionDetails]);

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
    if (lastBillReceived?.name === "Yes" && !billMonthYear) return false;

    if (sewerConnection?.name === "No" && !septicTank) return false;

    return true;
  };

  // 🔹 SUBMIT
  const onStepSelect = async () => {
    /*
    if (!isValid()) {
      setToast({ type: "error", message: "Fill all mandatory fields" });
      return;
    }
    */

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

    try {
      await updateMutation.mutateAsync({
        RequestInfo: {},
        updateType: "METER",
        kno: searchKno,
        ...data,
      });
      setToast({ type: "success", message: "Meter details updated successfully!" });
      onSelect(config.key, data);
    } catch (error) {
      setToast({ type: "error", message: "Failed to update meter details" });
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Fragment>
      <FormStep onSelect={onStepSelect} config={config} isDisabled={!isValid()}>
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
                    <img src={meterPhoto} style={{ width: "100%" }} />
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