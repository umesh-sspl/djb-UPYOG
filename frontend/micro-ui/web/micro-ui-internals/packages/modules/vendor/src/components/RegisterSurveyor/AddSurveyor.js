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

  // Fetching Agencies (Vendors)
  const { data: vendorsData } = Digit.Hooks.fsm.useVendorSearch(tenantId, { status: "ACTIVE" });

  const agencies =
    vendorsData?.vendor?.map((v) => ({
      code: v.id,
      name: v.name,
      ...v,
    })) || [];

  // Mocking Reporting Managers (Agency Admins or Supervisors)
  const reportingManagers = [
    { code: "MGR1", name: "John Doe (Agency Admin)" },
    { code: "SUP1", name: "Jane Smith (Supervisor)" },
  ];

  const Config = SurveyorConfig(t, agencies, reportingManagers);

  const { supervisorId } = Digit.Hooks.useQueryParams();

  const defaultValues = {
    role: { code: "SURVEYOR", name: "Surveyor" },
    reportingManager: reportingManagers.find((m) => m.code === supervisorId) || null,
  };

  const onFormValueChange = (setValue, formData) => {
    // Basic validation logic
    const isBasicDetailsFilled = formData?.fullName && formData?.mobileNumber && formData?.emailId && formData?.employeeId;
    const isRoleAccessFilled = formData?.agencyName;
    const isAreaAssignmentFilled = formData?.areaAssignment?.zone && formData?.areaAssignment?.ward && formData?.areaAssignment?.areas?.length > 0;

    if (isBasicDetailsFilled && isRoleAccessFilled && isAreaAssignmentFilled) {
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
        name: data?.fullName,
        employeeId: data?.employeeId,
        status: "ACTIVE",
        owner: {
          tenantId: tenantId,
          name: data?.fullName,
          gender: data?.gender?.code || "OTHERS",
          emailId: data?.emailId,
          mobileNumber: data?.mobileNumber,
        },
        vendorSurveyorStatus: "ACTIVE",
        additionalDetails: {
          agencyId: data?.agencyName?.code,
          reportingManager: data?.reportingManager?.code,
          areaAssignment: data?.areaAssignment,
        },
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
