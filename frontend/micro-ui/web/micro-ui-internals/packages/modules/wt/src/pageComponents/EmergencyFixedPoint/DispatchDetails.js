import React, { useState } from "react";
import { FormStep, CardLabel, Dropdown } from "@djb25/digit-ui-react-components";

const EmergencyFixedPointDispatchDetails = ({ t, config, onSelect, formData }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const [fillingPoint, setFillingPoint] = useState(formData?.dispatchDetails?.fillingPoint || "");
  const [vendor, setVendor] = useState(formData?.dispatchDetails?.vendor || "");
  const [vehicle, setVehicle] = useState(formData?.dispatchDetails?.vehicle || "");
  const [driver, setDriver] = useState(formData?.dispatchDetails?.driver || "");

  // Fetch all Filling Points
  const { data: fillingPointsData } = Digit.Hooks.wt.useFillPointSearch(
    {
      tenantId,
      filters: { limit: 1000 },
    },
    { enabled: true }
  );

  const fillingPointOptions = fillingPointsData?.fillingPoints?.map(fp => ({
    ...fp,
    name: fp?.fillingPointName || "NA",
  })) || [];

  // Fetch Vendors
  const { data: vendorData } = Digit.Hooks.fsm.useVendorSearch({
    tenantId,
    filters: {
      ...(fillingPoint?.fillingPointId ? { fillingPointId: fillingPoint.id } : {})
    },
    config: { enabled: true }
  });

  const vendorOptions = vendorData?.vendor?.map(v => ({
    ...v,
    name: v?.name || v?.vendor_id || "NA",
  })) || [];

  let vehicleOptions = [];
  let driverOptions = [];

  if (vendor && typeof vendor === "object") {
    vehicleOptions = vendor.vehicles?.map(veh => ({
      ...veh,
      name: veh?.registrationNumber || veh?.type || "NA",
    })) || [];

    driverOptions = vendor.drivers?.map(drv => ({
      ...drv,
      name: drv?.name || drv?.licenseNumber || "NA",
    })) || [];
  }

  const handleVendorSelect = (selected) => {
    setVendor(selected);
    setVehicle("");
    setDriver("");
  };

  const goNext = () => {
    onSelect(config.key, { fillingPoint, vendor, vehicle, driver }, false);
  };

  return (
    <React.Fragment>
      <FormStep
        config={config}
        onSelect={goNext}
        t={t}
        isDisabled={!fillingPoint || !vendor || !vehicle || !driver}
        className={"search-form-wrapper"}
      >
        <div className="form-field wns-search-field">
          <CardLabel>{`${t("WT_FILLING_POINT", "Filling Point")}`}</CardLabel>
          <Dropdown
            className="form-field"
            selected={fillingPoint}
            option={fillingPointOptions}
            select={setFillingPoint}
            optionKey="name"
            t={t}
            name="fillingPoint"
            placeholder={t("WT_SELECT_FILLING_POINT", "Select Filling Point")}
          />
        </div>

        <div className="form-field wns-search-field">
          <CardLabel>{`${t("WT_VENDOR", "Vendor")}`}</CardLabel>
          <Dropdown
            className="form-field"
            selected={vendor}
            option={vendorOptions}
            select={handleVendorSelect}
            optionKey="name"
            t={t}
            name="vendor"
            placeholder={t("WT_SELECT_VENDOR", "Select Vendor")}
          />
        </div>

        <div className="form-field wns-search-field">
          <CardLabel>{`${t("WT_VEHICLE", "Vehicle")}`}</CardLabel>
          <Dropdown
            className="form-field"
            selected={vehicle}
            option={vehicleOptions}
            select={setVehicle}
            optionKey="name"
            t={t}
            name="vehicle"
            placeholder={t("WT_SELECT_VEHICLE", "Select Vehicle")}
          />
        </div>

        <div className="form-field wns-search-field">
          <CardLabel>{`${t("WT_DRIVER", "Driver")}`}</CardLabel>
          <Dropdown
            className="form-field"
            selected={driver}
            option={driverOptions}
            select={setDriver}
            optionKey="name"
            t={t}
            name="driver"
            placeholder={t("WT_SELECT_DRIVER", "Select Driver")}
          />
        </div>
      </FormStep>
    </React.Fragment>
  );
};

export default EmergencyFixedPointDispatchDetails;
