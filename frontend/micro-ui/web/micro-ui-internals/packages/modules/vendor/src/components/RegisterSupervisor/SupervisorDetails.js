import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  SubmitBar,
  Loader,
  CardSectionHeader,
  ActionBar,
  Menu,
  Toast,
  EditIcon,
  DeleteIcon,
  Modal,
  CardText,
  Dropdown,
  AddIcon,
} from "@djb25/digit-ui-react-components";
import { useQueryClient } from "react-query";
import { useHistory, useParams } from "react-router-dom";
import ConfirmationBox from "../Confirmation";

const Heading = (props) => {
  return <h1 className="heading-m">{props.label}</h1>;
};

const Close = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF">
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
  </svg>
);

const CloseBtn = (props) => {
  return (
    <div className="icon-bg-secondary" onClick={props.onClick}>
      <Close />
    </div>
  );
};

const SupervisorDetails = (props) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const history = useHistory();
  const queryClient = useQueryClient();
  const { id: supervisorId } = useParams();

  const [displayMenu, setDisplayMenu] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [selectedOption, setSelectedOption] = useState({});
  const { data: vendorData } = Digit.Hooks.fsm.useDsoSearch(tenantId, { sortBy: "name", sortOrder: "ASC", status: "ACTIVE" }, {});
  const { data: supervisorSearchResponse, isLoading, refetch } = Digit.Hooks.fsm.useSupervisorSearch(tenantId, { ids: supervisorId }, { staleTime: Infinity });

  const supervisorData = React.useMemo(() => {
    if (!supervisorSearchResponse?.supervisors?.length) return [];
    
    return supervisorSearchResponse.supervisors.map((data) => {
      // Find the mapped vendor if we have vendorData loaded
      const mappedVendor = vendorData?.find(v => v.dsoDetails?.id === data.vendorId || v.dsoDetails?.vendorId === data.vendorId);
      const vendorName = mappedVendor?.dsoDetails?.name || data.vendorId || "ES_FSM_REGISTRY_DETAILS_ADD_VENDOR";

      return {
        supervisorData: data,
        vendorDetails: { vendor: mappedVendor ? [mappedVendor.dsoDetails] : [] },
        employeeResponse: [
          {
            title: "ES_VENDOR_SUPERVISOR_BASIC_DETAILS",
            values: [
              { title: "ES_VENDOR_SUPERVISOR_FULL_NAME", value: data?.name },
              { title: "ES_VENDOR_SUPERVISOR_MOBILE_NUMBER", value: data?.owner?.mobileNumber || data?.mobileNo },
              { title: "ES_VENDOR_SUPERVISOR_EMAIL_ID", value: data?.owner?.emailId },
              { title: "ES_VENDOR_SUPERVISOR_STAFF_CODE", value: data?.employeeId || "N/A" },
              { title: "ES_VENDOR_SUPERVISOR_GENDER", value: data?.owner?.gender },
              {
                title: "ES_VENDOR_SUPERVISOR_AGENCY_NAME",
                value: vendorName,
                type: "custom",
              },
            ],
          },
          {
            title: "ES_VENDOR_SUPERVISOR_MAPPED_SURVEYORS",
            type: "ES_FSM_REGISTRY_DETAILS_TYPE_SURVEYOR",
            child: [], // You can add surveyor data mapping here if needed in the future
          }
        ]
      };
    });
  }, [supervisorSearchResponse, vendorData]);



  const { mutate: mutateSupervisor } = Digit.Hooks.fsm.useSupervisorUpdate(tenantId);
  const { mutate: mutateVendor } = Digit.Hooks.fsm.useVendorUpdate(tenantId);

  useEffect(() => {
    if (vendorData) {
      let vendors = vendorData.map((data) => data.dsoDetails);
      setVendors(vendors);
    }
  }, [vendorData]);

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    switch (selectedAction) {
      case "DELETE":
      case "ADD_VENDOR":
      case "EDIT_VENDOR":
      case "DELETE_VENDOR":
        return setShowModal(true);
      case "EDIT":
        return history.push("/digit-ui/employee/vendor/modify-supervisor/" + supervisorId);
      case "HOME":
        return history.push("/digit-ui/employee/vendor/search-vendor?selectedTabs=SUPERVISOR");
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAction]);

  const closeToast = () => {
    setShowToast(null);
  };

  const handleModalAction = () => {
    switch (selectedAction) {
      case "DELETE":
        return handleDeleteSupervisor();
      case "DELETE_VENDOR":
        return handleDeleteVendor();
      case "ADD_VENDOR":
        return handleAddVendor();
      case "EDIT_VENDOR":
        return handleEditVendor();
      default:
        break;
    }
  };

  const handleDeleteSupervisor = () => {
    let details = supervisorData?.[0]?.supervisorData;
    const formData = {
      supervisor: {
        ...details,
        status: "INACTIVE",
      },
    };

    mutateSupervisor(formData, {
      onError: (error) => {
        setShowToast({ key: "error", action: error });
        setTimeout(closeToast, 5000);
      },
      onSuccess: () => {
        setShowToast({ key: "success", action: "DELETE_SUPERVISOR" });
        queryClient.invalidateQueries("SUPERVISOR_SEARCH");
        setTimeout(() => {
          closeToast();
          history.push(`/digit-ui/employee/vendor/search-vendor`);
        }, 5000);
      },
    });
    setShowModal(false);
  };

  const handleDeleteVendor = () => {
    let dsoDetails = supervisorData?.[0]?.vendorDetails?.vendor?.[0];
    let getSupervisorVendorDetails = dsoDetails?.supervisors || [];

    getSupervisorVendorDetails = getSupervisorVendorDetails.map((data) => {
      if (data.id === supervisorId) {
        data.vendorSupervisorStatus = "INACTIVE";
      }
      return data;
    });

    const formData = {
      vendor: {
        ...dsoDetails,
        supervisors: getSupervisorVendorDetails,
      },
    };

    mutateVendor(formData, {
      onError: (error) => {
        setShowToast({ key: "error", action: error });
        setTimeout(closeToast, 5000);
      },
      onSuccess: () => {
        setShowToast({ key: "success", action: "DELETE_VENDOR" });
        queryClient.invalidateQueries("FSM_VENDOR_SEARCH");
        refetch();
        setTimeout(closeToast, 5000);
      },
    });
    setShowModal(false);
  };

  const handleAddVendor = () => {
    let dsoDetails = selectedOption;
    let details = supervisorData?.[0]?.supervisorData;
    details.vendorSupervisorStatus = "ACTIVE";
    const formData = {
      vendor: {
        ...dsoDetails,
        supervisors: dsoDetails.supervisors ? [...dsoDetails.supervisors, details] : [details],
      },
    };
    mutateVendor(formData, {
      onError: (error) => {
        setShowToast({ key: "error", action: error });
        refetch();
        setTimeout(closeToast, 5000);
      },
      onSuccess: () => {
        setShowToast({ key: "success", action: "ADD_VENDOR" });
        queryClient.invalidateQueries("SUPERVISOR_SEARCH");
        refetch();
        setTimeout(closeToast, 5000);
      },
    });
    setShowModal(false);
    setSelectedAction(null);
  };

  const handleEditVendor = () => {
    let dsoDetails = selectedOption;
    let details = supervisorData?.[0]?.supervisorData;
    details.vendorSupervisorStatus = "ACTIVE";

    const formData = {
      vendor: {
        ...dsoDetails,
        supervisors: dsoDetails.supervisors ? [...dsoDetails.supervisors, details] : [details],
      },
    };

    mutateVendor(formData, {
      onError: (error) => {
        setShowToast({ key: "error", action: error });
        setTimeout(closeToast, 5000);
      },
      onSuccess: () => {
        setShowToast({ key: "success", action: "EDIT_VENDOR" });
        refetch();
        queryClient.invalidateQueries("SUPERVISOR_SEARCH");
        setTimeout(closeToast, 5000);
      },
    });
    setShowModal(false);
    setSelectedAction(null);
  };

  const closeModal = () => {
    setSelectedAction(null);
    setSelectedOption({});
    setShowModal(false);
  };

  const modalHeading = () => {
    switch (selectedAction) {
      case "DELETE":
      case "DELETE_VENDOR":
        return "ES_VENDOR_SUPERVISOR_DELETE_POPUP_HEADER";
      case "ADD_VENDOR":
      case "EDIT_VENDOR":
        return "ES_VENDOR_SUPERVISOR_ADD_VENDOR_POPUP_HEADER";
      default:
        break;
    }
  };

  const renderModalContent = () => {
    if (selectedAction === "DELETE" || selectedAction === "DELETE_VENDOR") {
      return <ConfirmationBox t={t} title={"ES_VENDOR_SUPERVISOR_DELETE_TEXT"} />;
    }
    if (selectedAction === "ADD_VENDOR" || selectedAction === "EDIT_VENDOR") {
      return (
        <React.Fragment>
          <CardText>{t(`ES_FSM_REGISTRY_SELECT_VENODOR`)}</CardText>
          <Dropdown t={t} option={vendors} value={selectedOption} selected={selectedOption} select={setSelectedOption} optionKey={"name"} />
        </React.Fragment>
      );
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      <div className="employee-form-content">
        <Card style={{ position: "relative", backgroundColor: "#fff" }}>
          {supervisorData?.[0]?.employeeResponse?.map((detail, index) => (
            <React.Fragment key={index}>
              {index > 0 && <CardSectionHeader style={{ marginBottom: "16px", marginTop: "32px" }}>{t(detail.title)}</CardSectionHeader>}
              <Card className="card-with-background" style={{ margin: "10px 16px", padding: "20px" }}>
                <div className="additional-grid">
                  {detail?.values?.map((value, index) => {
                    return value?.type === "custom" ? (
                      <React.Fragment key={index}>
                        <div className="additional-label">{t(value.title)}</div>
                        <div className="additional-value" style={{ color: "#a82227", display: "flex", gap: "20px", alignItems: "center" }}>
                          {t(value.value) || "N/A"}
                          {value.value === "ES_FSM_REGISTRY_DETAILS_ADD_VENDOR" && (
                            <span
                              className="add-details-link hover-button"
                              onClick={() => setSelectedAction("ADD_VENDOR")}
                              style={{ cursor: "pointer" }}
                            >
                              <AddIcon fill="#a82227" />
                            </span>
                          )}
                          {value.value !== "ES_FSM_REGISTRY_DETAILS_ADD_VENDOR" && (
                            <React.Fragment>
                              <div
                                className="add-details-link hover-button"
                                onClick={() => setSelectedAction("EDIT_VENDOR")}
                                style={{ cursor: "pointer" }}
                              >
                                <EditIcon />
                              </div>
                              <div
                                className="add-details-link hover-button"
                                onClick={() => setSelectedAction("DELETE_VENDOR")}
                                style={{ cursor: "pointer" }}
                              >
                                <DeleteIcon fill="#a82227" />
                              </div>
                            </React.Fragment>
                          )}
                        </div>
                      </React.Fragment>
                    ) : (
                      <React.Fragment key={index}>
                        <div className="additional-label">{t(value.title)}</div>
                        <div className="additional-value">{t(value.value) || "N/A"}</div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </Card>
              {detail?.child?.map((data, index) => (
                <Card className="card-with-background" key={data.id || index} style={{ margin: "10px 16px", padding: "20px" }}>
                  <div className="card-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>
                      {t(detail.type)} {index + 1}
                    </h2>
                    <div style={{ display: "flex", gap: "15px" }}>
                      <span onClick={() => history.push(`/digit-ui/employee/vendor/registry/modify-surveyor/${data.id}`)}>
                        <EditIcon fill="#a82227" style={{ cursor: "pointer" }} />
                      </span>
                    </div>
                  </div>
                  <div className="additional-grid">
                    {data?.values?.map((value, idx) => (
                      <React.Fragment key={idx}>
                        <div className="additional-label">{t(value.title)}</div>
                        <div className="additional-value">{t(value.value) || "N/A"}</div>
                      </React.Fragment>
                    ))}
                  </div>
                </Card>
              ))}
              {detail.type && (
                <div
                  className="add-details-link hover-button"
                  style={{
                    margin: "10px 16px",
                    color: "#a82227",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    fontWeight: "bold",
                  }}
                  onClick={() => history.push(`/digit-ui/employee/vendor/registry/new-surveyor?supervisorId=${supervisorId}`)}
                >
                  <AddIcon fill="#a82227" />
                  {t(`${detail.type}_ADD`)}
                </div>
              )}
            </React.Fragment>
          ))}
        </Card>
      </div>
      {showModal && (
        <Modal
          headerBarMain={<Heading label={t(modalHeading())} />}
          headerBarEnd={<CloseBtn onClick={closeModal} />}
          actionCancelLabel={t("CS_COMMON_CANCEL")}
          actionCancelOnSubmit={closeModal}
          actionSaveLabel={t(selectedAction === "DELETE" || selectedAction === "DELETE_VENDOR" ? "ES_EVENT_DELETE" : "CS_COMMON_SUBMIT")}
          actionSaveOnSubmit={handleModalAction}
        >
          <Card style={{ boxShadow: "none" }}>{renderModalContent()}</Card>
        </Modal>
      )}
      {showToast && (
        <Toast
          error={showToast.key === "error"}
          label={t(showToast.key === "success" ? `ES_VENDOR_${showToast.action}_SUCCESS` : showToast.action)}
          onClose={closeToast}
        />
      )}
      <ActionBar style={{ zIndex: "19" }}>
        {displayMenu ? (
          <Menu
            localeKeyPrefix={"ES_VENDOR_SUPERVISOR_ACTION"}
            options={["EDIT", "DELETE"]}
            t={t}
            onSelect={(a) => {
              setDisplayMenu(false);
              setSelectedAction(a);
            }}
          />
        ) : null}
        <SubmitBar label={t("ES_COMMON_TAKE_ACTION")} onSubmit={() => setDisplayMenu(!displayMenu)} />
      </ActionBar>
    </React.Fragment>
  );
};

export default SupervisorDetails;
