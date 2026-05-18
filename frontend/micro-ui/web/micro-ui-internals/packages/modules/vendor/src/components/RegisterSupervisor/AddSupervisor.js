import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FormComposer, Toast, VerticalTimeline } from "@djb25/digit-ui-react-components";
import { useQueryClient } from "react-query";
import SupervisorConfig from "../../config/SupervisorConfig";

const AddSupervisor = ({ parentUrl, heading }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();

  const [showToast, setShowToast] = useState(null);
  const queryClient = useQueryClient();
  const [canSubmit, setCanSubmit] = useState(false);

  const { mutate } = Digit.Hooks.fsm.useSupervisorCreate(tenantId);

  const Config = SupervisorConfig(t);

  const defaultValues = {
    role: { code: "SUPERVISOR", name: "Supervisor" },
  };

  const onFormValueChange = (setValue, formData) => {
    // Basic validation logic
    const isBasicDetailsFilled =
      formData?.fullName &&
      formData?.mobileNumber &&
      formData?.emailId &&
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
      supervisor: {
        tenantId: tenantId,
        owner: {
          tenantId: tenantId,
          name: data?.fullName,
          fatherOrHusbandName: data?.fatherOrHusbandName,
          relationship: data?.relationship?.code,
          dob: data?.dob ? new Date(data.dob).getTime() : null,
          gender: data?.gender?.code || "OTHERS",
          mobileNumber: data?.mobileNumber,
          emailId: data?.emailId,
          correspondenceAddress: data?.correspondenceAddress,
        },
      },
      RequestInfo: {
        msgId: "ekyc-supervisor-create",
      },
    };
    console.log("DEBUG: Supervisor create payload:", formData);

    mutate(formData, {
      onError: (error) => {
        setShowToast({ key: "error", action: error });
        setTimeout(closeToast, 5000);
      },
      onSuccess: () => {
        setShowToast({ key: "success", action: "ADD_SUPERVISOR" });
        queryClient.invalidateQueries("SUPERVISOR_SEARCH");
        setTimeout(closeToast, 5000);
      },
    });
  };

  return (
    <React.Fragment>
      <VerticalTimeline
        config={[
          {
            route: "supervisor-details",
            timeLine: [{ actions: t("ES_VENDOR_SUPERVISOR_DETAILS"), currentStep: 1 }],
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

export default AddSupervisor;
