import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FormComposer, Toast, VerticalTimeline } from "@djb25/digit-ui-react-components";
import { useQueryClient } from "react-query";
import SurveyorConfig from "../../config/SurveyorConfig";

const AddSurveyor = ({ parentUrl, heading }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();

  const [showToast, setShowToast] = useState(null);
  const queryClient = useQueryClient();
  const [canSubmit, setCanSubmit] = useState(false);

  const { mutate } = Digit.Hooks.fsm.useSurveyorCreate(tenantId);

  const Config = SurveyorConfig(t);

  const defaultValues = {
    role: { code: "SURVEYOR", name: "Surveyor" },
  };

  const onFormValueChange = (setValue, formData) => {
    // Basic validation logic
    const isBasicDetailsFilled =
      formData?.fullName &&
      formData?.mobileNumber &&
      formData?.emailId &&
      formData?.employeeId &&
      formData?.fatherOrHusbandName &&
      formData?.relationship &&
      formData?.dob &&
      formData?.correspondenceAddress;

    if (isBasicDetailsFilled) {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  };

  const closeToast = () => {
    setShowToast(null);
  };

  const onSubmit = (data) => {
    const formData = {
      surveyor: {
        tenantId: tenantId,
        vendorId: data?.agencyName?.code || data?.agencyName?.id || "DL-DJB-000082", // Fallback for testing as per CURL
        supervisorId: data?.reportingManager?.code || data?.reportingManager?.id || "7fb7ce1d-1054-46c8-9518-ef0049bffcd4", // Fallback for testing as per CURL
        description: data?.description || "",
        additionalDetails: {
          serviceType: "ekyc",
        },
        owner: {
          tenantId: tenantId,
          name: data?.fullName,
          fatherOrHusbandName: data?.fatherOrHusbandName,
          relationship: data?.relationship?.code,
          gender: data?.gender?.code || "OTHERS",
          dob: data?.dob ? new Date(data.dob).getTime() : null,
          emailId: data?.emailId,
          mobileNumber: data?.mobileNumber,
          correspondenceAddress: data?.correspondenceAddress,
        },
      },
      RequestInfo: {
        apiId: "Rainmaker",
        msgId: "ekyc-surveyor-create",
      },
    };

    mutate(formData, {
      onError: (error) => {
        setShowToast({ key: "error", action: error });
        setTimeout(closeToast, 5000);
      },
      onSuccess: () => {
        setShowToast({ key: "success", action: "ADD_SURVEYOR" });
        queryClient.invalidateQueries("SURVEYOR_SEARCH");
        setTimeout(closeToast, 5000);
      },
    });
  };

  return (
    <React.Fragment>
      <VerticalTimeline
        config={[
          {
            route: "surveyor-details",
            timeLine: [{ actions: t("ES_VENDOR_SURVEYOR_DETAILS"), currentStep: 1 }],
          },
        ]}
        currentActiveIndex={0}
        showFinalStep={false}
      />
      <div style={{ flex: "1", overflowY: "auto" }}>
        <FormComposer
          isDisabled={!canSubmit}
          label={t("ES_COMMON_APPLICATION_SUBMIT")}
          config={Config.map((config) => ({
            ...config,
            isCollapsible: true,
            isDefaultOpen: true,
          }))}
          fieldStyle={{ marginRight: 0 }}
          onSubmit={onSubmit}
          defaultValues={defaultValues}
          onFormValueChange={onFormValueChange}
          noBreakLine={true}
          mode="onChange"
          noCard={true}
        />
        {showToast && (
          <Toast
            error={showToast.key === "error"}
            label={t(showToast.key === "success" ? `ES_VENDOR_${showToast.action}_SUCCESS` : showToast.action)}
            onClose={closeToast}
          />
        )}
      </div>
    </React.Fragment>
  );
};

export default AddSurveyor;
