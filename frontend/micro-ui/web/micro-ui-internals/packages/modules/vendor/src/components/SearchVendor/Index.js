import React, { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import VendorInbox from "../VendorInbox";

const SearchVendor = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { selectedTabs } = Digit.Hooks.useQueryParams();
  const [searchParams, setSearchParams] = useState({});
  const [sortParams, setSortParams] = useState([{ id: "createdTime", desc: true }]);
  const [pageOffset, setPageOffset] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [tab, setTab] = useState(selectedTabs || "VENDOR");
  const [vehicleIds, setVehicleIds] = useState("");
  const [driverIds, setDriverIds] = useState("");
  const [tableData, setTableData] = useState([]);

  // const userInfo = Digit.UserService.getUser();

  const { data: allVendors } = Digit.Hooks.fsm.useDsoSearch(tenantId, { status: "ACTIVE" }, { staleTime: Infinity });
  const { data: allFillingPoints } = Digit.Hooks.wt.useFillPointSearch({ tenantId, filters: { limit: 1000 } }, { staleTime: Infinity });

  let paginationParms = { limit: pageSize, offset: pageOffset, sortBy: sortParams?.[0]?.id, sortOrder: sortParams?.[0]?.desc ? "DESC" : "ASC" };

  const { data: dsoData, isLoading, refetch } =
    tab === "VEHICLE"
      ? Digit.Hooks.fsm.useVehiclesSearch({
          //
          tenantId,
          filters: {
            ...paginationParms,
            registrationNumber: searchParams?.registrationNumber,
            status: "ACTIVE,DISABLED",
            vendorId: searchParams?.vendor?.id,
            fillingPointId: searchParams?.fillingPoint?.id,
          },
          config: { enabled: false },
        })
      : tab === "DRIVER"
      ? Digit.Hooks.fsm.useDriverSearch({
          tenantId,
          filters: {
            ...paginationParms,
            name: searchParams?.name,
            status: "ACTIVE,DISABLED",
            vendorId: searchParams?.vendor?.id,
          },
          config: { enabled: false },
        })
      : tab === "SUPERVISOR"
      ? Digit.Hooks.fsm.useSupervisorDetails(tenantId, { ...paginationParms, status: "ACTIVE,DISABLED" }, { enabled: false })
      : tab === "SURVEYOR"
      ? Digit.Hooks.fsm.useSurveyorDetails(tenantId, { ...paginationParms, status: "ACTIVE,DISABLED" }, { enabled: false })
      : Digit.Hooks.fsm.useVendorSearch({
          tenantId,
          filters: {
            ...paginationParms,
            name: searchParams?.name,
            status: "ACTIVE,DISABLED",
          },
          config: { enabled: false },
        });

  Digit.Hooks.fsm.useVendorSearch({
    tenantId,
    filters: {
      ...paginationParms,
      name: searchParams?.name,
      status: "ACTIVE,DISABLED",
    },
    config: { enabled: false },
  });

  const { data: vendorData, isLoading: isVendorLoading, refetch: refetchVendor } = Digit.Hooks.fsm.useDsoSearch(
    tenantId,
    {
      vehicleIds: vehicleIds,
      driverIds: driverIds,
      status: "ACTIVE",
    },
    { enabled: false }
  );

  const inboxTotalCount = dsoData?.totalCount || 50;

  useEffect(() => {
    refetch();
    refetchVendor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, sortParams, pageOffset, pageSize]);

  useEffect(() => {
    if (dsoData?.vehicle && tab === "VEHICLE") {
      const vehicleIds = dsoData.vehicle
        .map((data) => data.id)
        .filter(Boolean)
        .join(",");
      setVehicleIds(vehicleIds);
      setTableData(dsoData.vehicle);
    }
    if (dsoData?.driver && tab === "DRIVER") {
      const driverIds = dsoData.driver
        .map((data) => data.id)
        .filter(Boolean)
        .join(",");
      setDriverIds(driverIds);
      setTableData(dsoData?.driver);
    }
    if (dsoData?.vendor && tab === "VENDOR") {
      const tableData = dsoData.vendor.map((dso) => ({
        mobileNumber: dso.owner?.mobileNumber,
        name: dso.name,
        id: dso.id,
        auditDetails: dso.auditDetails,
        drivers: dso.drivers,
        activeDrivers: dso.drivers?.filter((driver) => driver.status === "ACTIVE"),
        allVehicles: dso.vehicles,
        dsoDetails: dso,
        vendorAdditionalDetails: dso.vendorAdditionalDetails,
        fillingPoint: dso.fillingPoint,
        vehicles: dso.vehicles
          ?.filter((vehicle) => vehicle.status === "ACTIVE")
          ?.map((vehicle) => ({
            id: vehicle.id,
            registrationNumber: vehicle?.registrationNumber,
            type: vehicle.type,
            i18nKey: `FSM_VEHICLE_TYPE_${vehicle.type}`,
            capacity: vehicle.tankCapacity,
            suctionType: vehicle.suctionType,
            model: vehicle.model,
          })),
      }));
      setTableData(tableData);
    }
    if (tab === "SUPERVISOR") {
      const staticSupervisors = [
        {
          id: "SUP1",
          name: "Amit Kumar",
          employeeId: "EMP001",
          status: "ACTIVE",
          owner: { mobileNumber: "9876543210", userName: "9876543210" },
          auditDetails: { createdTime: new Date().getTime() },
          vendorData: { name: "Clean City Agency" },
        },
        {
          id: "SUP2",
          name: "Rajesh Singh",
          employeeId: "EMP002",
          status: "ACTIVE",
          owner: { mobileNumber: "9876543211", userName: "9876543211" },
          auditDetails: { createdTime: new Date().getTime() },
          vendorData: { name: "Green Environment" },
        },
      ];
      setTableData(dsoData?.supervisor || staticSupervisors);
    }
    if (tab === "SURVEYOR") {
      const staticSurveyors = [
        {
          id: "SUR1",
          name: "Suresh Raina",
          employeeId: "EMP101",
          status: "ACTIVE",
          owner: { mobileNumber: "9123456780", userName: "9123456780" },
          auditDetails: { createdTime: new Date().getTime() },
          vendorData: { name: "Clean City Agency" },
        },
        {
          id: "SUR2",
          name: "Mahesh Babu",
          employeeId: "EMP102",
          status: "ACTIVE",
          owner: { mobileNumber: "9123456781", userName: "9123456781" },
          auditDetails: { createdTime: new Date().getTime() },
          vendorData: { name: "Green Environment" },
        },
      ];
      setTableData(dsoData?.surveyor || staticSurveyors);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dsoData, tab]);

  useEffect(() => {
    if (vehicleIds !== "" || driverIds !== "") refetchVendor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicleIds, driverIds]);

  useEffect(() => {
    let mounted = true;
    if (vendorData && mounted) {
      if (tab === "VEHICLE") {
        const vehicles = dsoData?.vehicle.map((data) => {
          let vendor = vendorData.find((ele) => ele.dsoDetails?.vehicles?.find((vehicle) => vehicle.id === data.id));
          if (vendor) {
            let updatedData = { ...data, vendor: vendor.dsoDetails };
            const vehicleInVendor = vendor.dsoDetails?.vehicles?.find((vehicle) => vehicle.id === data.id);
            if (vehicleInVendor) {
              updatedData.driverData = vehicleInVendor.driverData || vehicleInVendor.driver || updatedData.driverData;
            }
            return updatedData;
          }
          return data;
        });
        setTableData(vehicles);
        setVehicleIds("");
      }
      if (tab === "DRIVER") {
        const drivers = dsoData?.driver.map((data) => {
          let vendor = vendorData.find((ele) => ele.dsoDetails?.drivers?.find((driver) => driver.id === data.id));
          if (vendor) {
            return { ...data, vendor: vendor.dsoDetails };
          }
          return data;
        });
        setTableData(drivers);
        setDriverIds("");
      }
    }
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorData, dsoData]);

  //functions to handle search, pagination, sorting and filter
  const onSearch = (params = {}) => {
    setSearchParams({ ...params });
  };

  const fetchNextPage = () => {
    setPageOffset((prevState) => prevState + pageSize);
  };

  const fetchPrevPage = () => {
    setPageOffset((prevState) => prevState - pageSize);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
  };

  const handleFilterChange = () => {};

  const searchFields =
    tab === "VEHICLE"
      ? [
          {
            label: t("ES_VENDOR_SEARCH_VENDOR_NAME"),
            name: "vendor",
            type: "dropdown",
            options: allVendors?.map((data) => ({
              ...data.dsoDetails,
              displayName: `${data.dsoDetails.name} (${data.dsoDetails.mobileNumber || data.dsoDetails.owner?.mobileNumber || "N/A"})`,
            })),
            optionsKey: "displayName",
          },
          {
            label: t("ES_FSM_REGISTRY_SEARCH_FILLING_POINT"),
            name: "fillingPoint",
            type: "dropdown",
            options: allFillingPoints?.fillingPoints?.map((fp) => ({ ...fp, name: fp?.name || fp?.fillingPointName || fp?.fillingStationId })),
            optionsKey: "name",
          },
          {
            label: t("ES_VEHICLE_SEARCH_VEHICLE_NUMBER"),
            name: "registrationNumber",
            pattern: "[A-Z]{2}[- ]?[0-9]{2}[- ]?[A-Z]{1,2}[- ]?[0-9]{4}",
            title: t("ES_FSM_VEHICLE_FORMAT_TIP"),
          },
        ]
      : tab === "DRIVER"
      ? [
          {
            label: t("ES_VENDOR_SEARCH_VENDOR_NAME"),
            name: "vendor",
            type: "dropdown",
            options: allVendors?.map((data) => ({
              ...data.dsoDetails,
              displayName: `${data.dsoDetails.name} (${data.dsoDetails.mobileNumber || data.dsoDetails.owner?.mobileNumber || "N/A"})`,
            })),
            optionsKey: "displayName",
          },
          {
            label: t("ES_DRIVER_SEARCH_DRIVER_NAME"),
            name: "name",
          },
        ]
      : tab === "SUPERVISOR" || tab === "SURVEYOR"
      ? [
          {
            label: t("ES_VENDOR_SEARCH_VENDOR_NAME"),
            name: "vendor",
            type: "dropdown",
            options: allVendors?.map((data) => ({
              ...data.dsoDetails,
              displayName: `${data.dsoDetails.name} (${data.dsoDetails.mobileNumber || data.dsoDetails.owner?.mobileNumber || "N/A"})`,
            })),
            optionsKey: "displayName",
          },
          {
            label: tab === "SUPERVISOR" ? t("ES_SUPERVISOR_SEARCH_NAME") : t("ES_SURVEYOR_SEARCH_NAME"),
            name: "name",
          },
        ]
      : [
          {
            label: t("ES_VENDOR_SEARCH_VENDOR_NAME"),
            name: "name",
          },
        ];

  // const searchFields = [
  //   {
  //     label: t("VENDOR_SEARCH_VENDOR_NAME"),
  //     name: "name",
  //   },
  // ];

  const handleSort = useCallback((args) => {
    if (args?.length === 0) return;
    setSortParams(args);
  }, []);

  const onTabChange = (tab) => {
    setTab(tab);
  };

  const refetchData = () => {
    refetch();
  };

  const refetchVendorData = () => {
    refetchVendor();
  };

  return (
    <React.Fragment>
      {/* <Header>{t("VENDOR_SEARCH")}</Header> */}
      <div className="employee-form-content">
        <VendorInbox
          data={{ table: tableData }}
          isLoading={isLoading || isVendorLoading}
          onSort={handleSort}
          disableSort={false}
          sortParams={sortParams}
          userRole={"FSM_ADMIN"}
          onFilterChange={handleFilterChange}
          searchFields={searchFields}
          onSearch={onSearch}
          onNextPage={fetchNextPage}
          onPrevPage={fetchPrevPage}
          currentPage={Math.floor(pageOffset / pageSize)}
          pageSizeLimit={pageSize}
          onPageSizeChange={handlePageSizeChange}
          totalRecords={inboxTotalCount || 0}
          onTabChange={onTabChange}
          selectedTab={tab}
          refetchData={refetchData}
          refetchVendor={refetchVendorData}
        />
      </div>
    </React.Fragment>
  );
};

export default SearchVendor;
