import { FormComposer, Header, Loader, Toast, VerticalTimeline } from "@djb25/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useRouteMatch, useLocation } from "react-router-dom";
import { newConfig } from "../config/rwhCreateConfig";
import { RwhCreateFormPayload } from "../Utils/Index";
import _ from "lodash";

const RwhCreateformComponent = ({ onSelect, value, userType, redirectUrl }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const [showToast, setShowToast] = useState(null);
  const [canSubmit, setCanSubmit] = useState(false);
  const [formValue, setFormValue] = useState(value || {});
  const [currentStep, setCurrentStep] = useState(1);

  const onFormValueChange = (setValue, data, formState) => {
    if (!_.isEqual(data, formValue)) {
      setFormValue(data);
    }
    setCanSubmit(Object.keys(formState.errors).length === 0);
  };

  const onSubmit = (data) => {
    const payload = RwhCreateFormPayload(data);
    console.log("RwhCreateFormPayload:", payload);
    // For now, just show a success toast as the API implementation might be pending
    setShowToast({ key: "success", message: "RWH_APPLICATION_SUBMITTED_SUCCESSFULLY" });
    if (onSelect) {
      onSelect("rwhDetails", data);
    }
  };

  const closeToast = () => {
    setShowToast(null);
  };

  const timelineConfig = [
    {
      label: t("RWH_CONSUMER_DETAILS"),
    },
    {
      label: t("RWH_ADDRESS_DETAILS"),
    },
    {
      label: t("RWH_PROPERTY_INFO"),
    },
    {
      label: t("RWH_SIZE_OF_PIT"),
    },
    {
      label: t("RWH_DOCUMENT_UPLOAD"),
    },
    {
      label: t("RWH_DECLARATION"),
    },
    {
      label: t("RWH_SUMMARY"),
    },
  ].map((step, index) => ({
    route: `step-${index + 1}`,
    timeLine: [{ actions: step.label, currentStep: index + 1 }],
  }));

  return (
    <React.Fragment>
      <div className="employee-form-section-wrapper">
        <VerticalTimeline config={timelineConfig} currentActiveIndex={currentStep - 1} showFinalStep={false} />
        <FormComposer
          config={newConfig}
          userType={userType || "employee"}
          onFormValueChange={onFormValueChange}
          label={t("CS_COMMON_SUBMIT")}
          onSubmit={onSubmit}
          defaultValues={formValue}
          noCard={true}
          noBreakLine={true}
          cardFormWrapperClassName="new-application-card"
        />
        {showToast && <Toast error={showToast?.key === "error"} label={t(showToast?.message)} onClose={closeToast} />}
      </div>
    </React.Fragment>
  );
};

export default RwhCreateformComponent;
