import React, { useCallback, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextInput,
  SubmitBar,
  DatePicker,
  CardLabelError,
  Dropdown,
  Table,
  Card,
  MobileNumber,
  Loader,
  Header,
  Modal,
  ViewsIcon,
} from "@djb25/digit-ui-react-components";
import { Link } from "react-router-dom";
import { APPLICATION_PATH } from "../utils";
import CollapsibleCardPage from "./CollapseCard";

const WTSearchApplication = ({ tenantId, isLoading, t, onSubmit, data, count, setShowToast, moduleCode, isFixedPoint }) => {
  const isMobile = window.Digit.Utils.browser.isMobile();
  const user = Digit.UserService.getUser().info;
  const [showWorkOrderModal, setShowWorkOrderModal] = useState(false);
  const [selectedVendorForWorkOrder, setSelectedVendorForWorkOrder] = useState(null);

  const handleViewDocument = useCallback(async (fileStoreId) => {
    if (!fileStoreId) return;
    try {
      const response = await Digit.UploadServices.FileFetchbyid(fileStoreId, tenantId);
      if (response && response.data) {
        const file = new Blob([response.data], { type: response.headers["content-type"] });
        const fileUrl = URL.createObjectURL(file);
        window.open(fileUrl, "_blank");
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const DriverReportColumns = useMemo(
    () => [
      {
        Header: t("S.No"),
        accessor: (row, index) => index + 1,
      },
      {
        Header: t("WT_BOOKING_NO"),
        accessor: "bookingNo",
      },
      {
        Header: t("WT_VEHICLE_NO"),
        accessor: "vehicleRegistrationNo",
      },
      {
        Header: t("WT_DRIVER_NAME"),
        accessor: "driverName",
      },
      {
        Header: t("WT_TANK_CAPACITY"),
        accessor: "tankCapicity",
      },
      {
        Header: t("WT_STATUS"),
        accessor: "currentStatus",
      },
      {
        Header: t("WT_START_PHOTO"),
        Cell: ({ row }) =>
          row.original.startFileStoreId ? (
            <div
              style={{ color: "#f47738", cursor: "pointer", display: "inline-block" }}
              onClick={() => handleViewDocument(row.original.startFileStoreId)}
            >
              <ViewsIcon />
            </div>
          ) : (
            t("CS_NA")
          ),
      },
      {
        Header: t("WT_END_PHOTO"),
        Cell: ({ row }) =>
          row.original.endFileStoreId ? (
            <div
              style={{ color: "#f47738", cursor: "pointer", display: "inline-block" }}
              onClick={() => handleViewDocument(row.original.endFileStoreId)}
            >
              <ViewsIcon />
            </div>
          ) : (
            t("CS_NA")
          ),
      },
    ],
    [t, handleViewDocument]
  );


  const openWorkOrderModal = (vendorDetails) => {
    setSelectedVendorForWorkOrder(vendorDetails);
    setShowWorkOrderModal(true);
  };

  const closeWorkOrderModal = () => {
    setSelectedVendorForWorkOrder(null);
    setShowWorkOrderModal(false);
  };
  const defaultValues = {
    offset: 0,
    limit: 10,
    sortBy: "commencementDate",
    sortOrder: "DESC",
    bookingNo: "",
    mobileNumber: "",
    applicantName: "",
    status: "",
    fromDate: "",
    toDate: "",
  };

  const { register, control, handleSubmit, setValue, getValues, reset, formState, watch } = useForm({
    defaultValues,
  });

  const fromDateValue = watch("fromDate");
  const { data: fillingPointsData } = Digit.Hooks.wt.useFillPointSearch(
    { tenantId: Digit.ULBService.getCurrentTenantId(), filters: { limit: 1000 } },
    { enabled: !!isFixedPoint }
  );
  const fillingPoints = fillingPointsData?.fillingPoints || [];

  const { data: tripReportsData, isLoading: isTripReportsLoading } = Digit.Hooks.wt.useDriverTripReportSearch(
    { tenantId, filters: { bookingNo: selectedVendorForWorkOrder?.bookingNo } },
    { enabled: !!selectedVendorForWorkOrder?.bookingNo }
  );

  const GetCell = (value) => <span className="cell-text">{value}</span>;

  const columns = useMemo(
    () => [
      {
        Header: t("WT_BOOKING_NO"),
        accessor: "bookingNo",
        disableSortBy: true,
        Cell: ({ row }) => {
          const bookingNo = row.original["bookingNo"];
          const userTypePath = user.type === "EMPLOYEE" ? "employee" : "citizen";
          return (
            <div>
              <span className="link">
                <Link to={`${APPLICATION_PATH}/${userTypePath}/wt/bookingsearch/booking-details/${bookingNo}`}>{bookingNo}</Link>
              </span>
            </div>
          );
        },
      },
      {
        Header: t("WT_APPLICANT_NAME"),
        disableSortBy: true,
        Cell: ({ row }) => GetCell(row.original?.applicantDetail?.["name"]),
      },
      {
        Header: t("WT_MOBILE_NUMBER"),
        disableSortBy: true,
        Cell: ({ row }) => GetCell(row.original?.applicantDetail?.["mobileNumber"]),
      },
      {
        Header: t("PT_COMMON_TABLE_COL_STATUS_LABEL"),
        disableSortBy: true,
        Cell: ({ row }) => GetCell(t(row.original["bookingStatus"])),
      },
      {
        Header: t("VIEW_REPORTS"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return (
            <button
              className="submit-bar"
              style={{
                backgroundColor: "#417505",
                color: "white",
              }}
              onClick={() => openWorkOrderModal(row.original)}
            >
              {t("VIEW_REPORTS")}
            </button>
          );
        },
      },
    ],
    [t, user.type]
  );

  const statusOptions =
    moduleCode === "TP"
      ? [
        { i18nKey: "TP_BOOKING_CREATED", code: "BOOKING_CREATED", value: t("TP_BOOKING_CREATED") },
        { i18nKey: "TP_PENDING_FOR_APPROVAL", code: "PENDING_FOR_APPROVAL", value: t("TP_PENDING_FOR_APPROVAL") },
        { i18nKey: "TP_PAYMENT_PENDING", code: "PAYMENT_PENDING", value: t("TP_PAYMENT_PENDING") },
        {
          i18nKey: "TP_TEAM_ASSIGNMENT_FOR_VERIFICATION",
          code: "TEAM_ASSIGNMENT_FOR_VERIFICATION",
          value: t("TP_TEAM_ASSIGNMENT_FOR_VERIFICATION"),
        },
        { i18nKey: "TP_TEAM_ASSIGNMENT_FOR_EXECUTION", code: "TEAM_ASSIGNMENT_FOR_EXECUTION", value: t("TP_TEAM_ASSIGNMENT_FOR_EXECUTION") },
        { i18nKey: "TP_TREE_PRUNING_SERVICE_COMPLETED", code: "TREE_PRUNING_SERVICE_COMPLETED", value: t("TP_TREE_PRUNING_SERVICE_COMPLETED") },
      ]
      : [
        { i18nKey: "WT_BOOKING_CREATED", code: "BOOKING_CREATED", value: t("WT_BOOKING_CREATED") },
        { i18nKey: "WT_VENDOR_ASSIGNED", code: "VENDOR_ASSIGNED", value: t("WT_VENDOR_ASSIGNED") },
        { i18nKey: "WT_DELIVERY_PENDING", code: "DELIVERY_PENDING", value: t("WT_DELIVERY_PENDING") },
        { i18nKey: "WT_DELIVERED", code: "DELIVERED", value: t("WT_DELIVERED") },
        { i18nKey: "WT_REQUEST_REJECTED", code: "REQUEST_REJECTED", value: t("WT_REQUEST_REJECTED") },
      ];

  const onSort = useCallback(
    (args) => {
      if (args.length === 0) return;
      setValue("sortBy", args.id);
      setValue("sortOrder", args.desc ? "DESC" : "ASC");
    },
    [setValue]
  );

  const onPageSizeChange = (e) => {
    setValue("limit", Number(e.target.value));
    handleSubmit(onSubmit)();
  };

  const nextPage = () => {
    setValue("offset", getValues("offset") + getValues("limit"));
    handleSubmit(onSubmit)();
  };

  const previousPage = () => {
    const currentOffset = getValues("offset");
    const limit = getValues("limit");
    if (currentOffset - limit >= 0) {
      setValue("offset", currentOffset - limit);
      handleSubmit(onSubmit)();
    }
  };

  const handleClearSearch = () => {
    reset(defaultValues);
    setShowToast(null);
    handleSubmit(onSubmit)();
  };

  return (
    <React.Fragment>
      <div className={user?.type === "CITIZEN" ? "citizen-wrapper" : "employee-wrapper"}>
        <CollapsibleCardPage
          title={t("WT_SEARCH_FILTERS_LABEL") || "Search Filters"}
          defaultOpen={true}
          tabs={[t("WT_SMART_SEARCH"), t("WT_ADVANCED_SEARCH")]} // Define tab names
          defaultTab={t("WT_SMART_SEARCH")}
        >
          {/* The component passes the 'activeTab' string back to us 
             via the render prop function below.
          */}
          {(activeTab) => (
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* --- SMART SEARCH --- */}
              {activeTab === t("WT_SMART_SEARCH") && (
                <div className="wt-search-grid" style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "24px" }}>
                  <div className="search-field-wrapper">
                    <label>{t("WT_MOBILE_NUMBER")}</label>
                    <MobileNumber
                      name="mobileNumber"
                      inputRef={register({
                        minLength: { value: 10, message: t("CORE_COMMON_MOBILE_ERROR") },
                        maxLength: { value: 10, message: t("CORE_COMMON_MOBILE_ERROR") },
                        pattern: { value: /[6789][0-9]{9}/, message: t("CORE_COMMON_MOBILE_ERROR") },
                      })}
                      type="number"
                      maxlength={10}
                    />
                    <CardLabelError>{formState?.errors?.["mobileNumber"]?.message}</CardLabelError>
                  </div>

                  {/* <div className="search-field-wrapper">
                    <label>{t("WT_APPLICANT_NAME")}</label>
                    <TextInput name="applicantName" inputRef={register({})} />
                  </div> */}
                </div>
              )}

              {/* --- ADVANCED SEARCH --- */}
              {activeTab === t("WT_ADVANCED_SEARCH") && (
                <div className="formcomposer-section-grid">
                  <div className="search-field-wrapper">
                    <label>{t("WT_BOOKING_NO")}</label>
                    <TextInput name="bookingNo" inputRef={register({})} />
                  </div>

                  <div className="search-field-wrapper">
                    <label>{t("WT_APPLICANT_NAME")}</label>
                    <TextInput name="applicantName" inputRef={register({})} />
                  </div>

                  <div className="search-field-wrapper">
                    <label>{t("WT_MOBILE_NUMBER")}</label>
                    <MobileNumber
                      name="mobileNumber"
                      inputRef={register({
                        minLength: { value: 10, message: t("CORE_COMMON_MOBILE_ERROR") },
                        maxLength: { value: 10, message: t("CORE_COMMON_MOBILE_ERROR") },
                        pattern: { value: /[6789][0-9]{9}/, message: t("CORE_COMMON_MOBILE_ERROR") },
                      })}
                      type="number"
                      maxlength={10}
                    />
                    <CardLabelError>{formState?.errors?.["mobileNumber"]?.message}</CardLabelError>
                  </div>

                  <div className="search-field-wrapper">
                    <label>{t("PT_COMMON_TABLE_COL_STATUS_LABEL")}</label>
                    <Controller
                      control={control}
                      name="status"
                      render={(props) => (
                        <Dropdown
                          selected={props.value}
                          select={props.onChange}
                          onBlur={props.onBlur}
                          option={statusOptions}
                          optionKey="i18nKey"
                          t={t}
                        />
                      )}
                    />
                  </div>

                  <div className="search-field-wrapper">
                    <label>{t("FROM_DATE")}</label>
                    <Controller
                      render={(props) => <DatePicker date={props.value} onChange={props.onChange} max={new Date().toISOString().split("T")[0]} />}
                      name="fromDate"
                      control={control}
                    />
                  </div>

                  <div className="search-field-wrapper">
                    <label>{t("TO_DATE")}</label>
                    <Controller
                      render={(props) => <DatePicker date={props.value} onChange={props.onChange} min={fromDateValue} />}
                      name="toDate"
                      control={control}
                    />
                  </div>

                  {isFixedPoint && (
                    <div className="search-field-wrapper">
                      <label>{t("WT_FILLING_POINT")}</label>
                      <Controller
                        control={control}
                        name="fillingPointId"
                        render={(props) => (
                          <Dropdown
                            selected={fillingPoints.find((fp) => (fp.id || fp.fillingPointId || fp.bookingId) === props.value)}
                            select={(val) => props.onChange(val?.id || val?.fillingPointId || val?.bookingId)}
                            onBlur={props.onBlur}
                            option={fillingPoints}
                            optionKey="fillingPointName"
                            t={t}
                          />
                        )}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* ACTIONS */}
              <div
                className="wt-search-actions"
                style={{
                  display: "flex",
                  justifyContent: isMobile ? "center" : "flex-end",
                  flexDirection: isMobile ? "column-reverse" : "row",
                  gap: "24px",
                  marginTop: "16px",
                }}
              >
                <span className="generic-button clear-search" onClick={handleClearSearch} style={{ cursor: "pointer", alignSelf: "center" }}>
                  {t("ES_COMMON_CLEAR_ALL")}
                </span>
                <div style={{ minWidth: isMobile ? "100%" : "160px" }}>
                  <SubmitBar label={t("ES_COMMON_SEARCH")} submit />
                </div>
              </div>
            </form>
          )}
        </CollapsibleCardPage>

        {/* RESULTS TABLE */}
        {!isLoading && data?.display ? (
          <Card style={{ marginTop: 20 }}>
            {t(data.display)
              .split("\\n")
              .map((text, index) => (
                <p key={index} style={{ textAlign: "center" }}>
                  {text}
                </p>
              ))}
          </Card>
        ) : !isLoading && data !== "" ? (
          <Table
            t={t}
            data={data}
            totalRecords={count}
            columns={columns}
            getCellProps={(cellInfo) => ({
              style: {
                minWidth: cellInfo.column.Header === t("WT_INBOX_APPLICATION_NO") ? "240px" : "",
                padding: "20px 18px",
                fontSize: "16px",
              },
            })}
            onPageSizeChange={onPageSizeChange}
            currentPage={getValues("offset") / getValues("limit")}
            onNextPage={nextPage}
            onPrevPage={previousPage}
            pageSizeLimit={getValues("limit")}
            onSort={onSort}
            disableSort={false}
            sortParams={[{ id: getValues("sortBy"), desc: getValues("sortOrder") === "DESC" }]}
          />
        ) : (
          (data !== "" || isLoading) && <Loader />
        )}
      </div>
      {showWorkOrderModal && (
        <Modal
          headerBarMain={
            <h1 className="heading-m" style={{ margin: 0 }}>
              {t("VIEW_DRIVER_TRIP_REPORTS")}
            </h1>
          }
          headerBarEnd={
            <div className="icon-bg-secondary" onClick={closeWorkOrderModal} style={{ cursor: "pointer" }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF" width="24" height="24">
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
              </svg>
            </div>
          }
          actionCancelLabel={t("CS_COMMON_CLOSE")}
          actionCancelOnSubmit={closeWorkOrderModal}
          hideSubmit={true}
          formId="modal-action"
        >
          <div style={{ padding: "16px" }}>
            {isTripReportsLoading ? (
              <Loader />
            ) : tripReportsData?.driverTripReports?.length > 0 ? (
              <Table
                t={t}
                data={tripReportsData.driverTripReports}
                columns={DriverReportColumns}
                getCellProps={(cellInfo) => {
                  return {
                    style: {
                      minWidth: "150px",
                      padding: "8px 12px",
                      fontSize: "13.5px",
                    },
                  };
                }}
              />
            ) : (
              <p style={{ textAlign: "center", marginTop: "20px" }}>{t("ES_VENDOR_NO_WORKORDERS")}</p>
            )}
          </div>
        </Modal>
      )}
    </React.Fragment>
  );
};

export default WTSearchApplication;
