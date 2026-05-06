import React, { useState, useEffect } from "react";
import { CardLabel, Dropdown, LabelFieldPair, MultiSelectDropdown, Loader } from "@djb25/digit-ui-react-components";

const SupervisorAreaAssignment = ({ config, onSelect, t, userType, formData }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const [selectedZone, setSelectedZone] = useState(formData?.areaAssignment?.zone || null);
  const [selectedCluster, setSelectedCluster] = useState(formData?.areaAssignment?.cluster || null);
  const [selectedWard, setSelectedWard] = useState(formData?.areaAssignment?.ward || null);
  const [selectedAreas, setSelectedAreas] = useState(formData?.areaAssignment?.areas || []);

  const [zones, setZones] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [wards, setWards] = useState([]);
  const [areas, setAreas] = useState([]);

  // Fetching Hierarchy Data from MDMS
  const { data: boundaryData, isLoading } = Digit.Hooks.useCommonMDMS(tenantId, "egov-location", ["TenantBoundary"]);

  useEffect(() => {
    if (boundaryData) {
      const tenantBoundary = boundaryData?.MdmsRes?.["egov-location"]?.TenantBoundary?.[0]?.boundary;
      if (tenantBoundary && tenantBoundary.children) {
        setZones(tenantBoundary.children);
      }
    }
  }, [boundaryData]);

  useEffect(() => {
    if (selectedZone) {
      setClusters(selectedZone.children || []);
      // If no cluster selected or zone changed, reset children
      if (selectedZone.code !== formData?.areaAssignment?.zone?.code) {
          setSelectedCluster(null);
          setSelectedWard(null);
          setSelectedAreas([]);
      }
    } else {
      setClusters([]);
    }
  }, [selectedZone]);

  useEffect(() => {
    if (selectedCluster) {
      setWards(selectedCluster.children || []);
      if (selectedCluster.code !== formData?.areaAssignment?.cluster?.code) {
          setSelectedWard(null);
          setSelectedAreas([]);
      }
    } else {
      setWards([]);
    }
  }, [selectedCluster]);

  useEffect(() => {
    if (selectedWard) {
      setAreas(selectedWard.children || []);
      if (selectedWard.code !== formData?.areaAssignment?.ward?.code) {
          setSelectedAreas([]);
      }
    } else {
      setAreas([]);
    }
  }, [selectedWard]);

  const handleSelect = (key, value) => {
    const updatedData = {
      ...formData?.areaAssignment,
      [key]: value,
    };
    
    // Clear dependent fields if parent changes
    if (key === "zone") {
        updatedData.cluster = null;
        updatedData.ward = null;
        updatedData.areas = [];
    } else if (key === "cluster") {
        updatedData.ward = null;
        updatedData.areas = [];
    } else if (key === "ward") {
        updatedData.areas = [];
    }

    onSelect(config.key, updatedData);
  };

  if (isLoading) return <Loader />;

  return (
    <React.Fragment>
      <LabelFieldPair>
        <CardLabel>{t("ES_VENDOR_SUPERVISOR_ZONE") + " *"}</CardLabel>
        <Dropdown
          selected={selectedZone}
          option={zones}
          select={(val) => {
            setSelectedZone(val);
            handleSelect("zone", val);
          }}
          optionKey="name"
          t={t}
        />
      </LabelFieldPair>

      <LabelFieldPair>
        <CardLabel>{t("ES_VENDOR_SUPERVISOR_CLUSTER") + " *"}</CardLabel>
        <Dropdown
          selected={selectedCluster}
          option={clusters}
          select={(val) => {
            setSelectedCluster(val);
            handleSelect("cluster", val);
          }}
          optionKey="name"
          t={t}
          disable={!selectedZone}
        />
      </LabelFieldPair>

      <LabelFieldPair>
        <CardLabel>{t("ES_VENDOR_SUPERVISOR_WARD") + " *"}</CardLabel>
        <Dropdown
          selected={selectedWard}
          option={wards}
          select={(val) => {
            setSelectedWard(val);
            handleSelect("ward", val);
          }}
          optionKey="name"
          t={t}
          disable={!selectedCluster}
        />
      </LabelFieldPair>

      <LabelFieldPair>
        <CardLabel>{t("ES_VENDOR_SUPERVISOR_AREA") + " *"}</CardLabel>
        <MultiSelectDropdown
          options={areas}
          selected={selectedAreas}
          onSelect={(val) => {
            setSelectedAreas(val);
            handleSelect("areas", val);
          }}
          optionsKey="name"
          t={t}
          disable={!selectedWard}
        />
      </LabelFieldPair>
    </React.Fragment>
  );
};

export default SupervisorAreaAssignment;
