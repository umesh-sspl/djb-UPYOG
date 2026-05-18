import { AppContainer, PrivateRoute, ModuleHeader, ArrowLeft, HomeIcon } from "@djb25/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Switch, useLocation, useRouteMatch } from "react-router-dom";
import Home from "./Home";

const CitizenApp = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { path } = useRouteMatch();

  sessionStorage.removeItem("revalidateddone");

  const getBreadcrumbLabel = () => {
    const pathname = location.pathname;
    if (pathname.includes("/create-kyc")) return "EKYC_CREATE_KYC";
    if (pathname.includes("/aadhaar-verification")) return "EKYC_AADHAAR_VERIFICATION";
    if (pathname.includes("/address-details")) return "EKYC_ADDRESS_DETAILS";
    if (pathname.includes("/property-info")) return "EKYC_PROPERTY_INFO";
    if (pathname.includes("/meter-details")) return "EKYC_METER_DETAILS";
    if (pathname.includes("/review")) return "EKYC_REVIEW";
    return "EKYC_HOME";
  };

  const breadcrumbs = [{ icon: HomeIcon, path: "/digit-ui/citizen" }, { label: t(getBreadcrumbLabel()) }];

  return (
    <AppContainer>
      <div className="ground-container employee-app-container form-container">
        <ModuleHeader
          leftContent={
            <React.Fragment>
              <ArrowLeft className="icon" />
              {t("CS_COMMON_BACK")}
            </React.Fragment>
          }
          onLeftClick={() => window.history.back()}
          breadcrumbs={breadcrumbs}
        />

        <Switch>
          <PrivateRoute exact path={`${path}`} component={() => <Home />} />
        </Switch>
      </div>
    </AppContainer>
  );
};

export default CitizenApp;
