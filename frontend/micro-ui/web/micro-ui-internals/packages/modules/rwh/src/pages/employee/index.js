import { AppContainer, PrivateRoute, ModuleHeader, ArrowLeft, HomeIcon } from "@djb25/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Switch, useLocation } from "react-router-dom";


const EmployeeApp = ({ path }) => {
  const { t } = useTranslation();
  const location = useLocation();

  sessionStorage.removeItem("revalidateddone");

  const getBreadcrumbLabel = () => {
    const pathname = location.pathname;
    if (pathname.includes("/dashboard")) return "ES_COMMON_INBOX";
    if (pathname.includes("/create-kyc")) return "EKYC_CREATE_KYC";
    if (pathname.includes("/k-details")) return "EKYC_K_DETAILS";
    if (pathname.includes("/consumer-details")) return "EKYC_CONSUMER_DETAILS";
    if (pathname.includes("/address-details")) return "EKYC_ADDRESS_DETAILS";
    if (pathname.includes("/property-info")) return "EKYC_PROPERTY_INFO";
    if (pathname.includes("/meter-details")) return "EKYC_METER_DETAILS";
    if (pathname.includes("/review")) return "EKYC_REVIEW";
    return "ES_COMMON_INBOX";
  };

  const breadcrumbs = [{ icon: HomeIcon, path: "/digit-ui/employee" }, { label: t(getBreadcrumbLabel()) }];

  const formStepRoutes = ["consumer-details", "address-details", "property-info", "meter-details"];

  return (
    <AppContainer>
      <div className="ground-container employee-app-container form-container">
        <ModuleHeader
          leftContent={
            <React.Fragment>
              <ArrowLeft className="icon" />
              Back
            </React.Fragment>
          }
          onLeftClick={() => window.history.back()}
          breadcrumbs={breadcrumbs}
        />

        <div className="employee-form">
          <div className="employee-form-content">
            <Switch>
             
            </Switch>
          </div>
        </div>
      </div>
    </AppContainer>
  );
};

export default EmployeeApp;
