import { AppContainer, PrivateRoute, ModuleHeader, ArrowLeft, HomeIcon, LayoutWrapper } from "@djb25/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Switch, useLocation } from "react-router-dom";
import RwhCreateformComponent from "../../pageComponents/RwhCreateform";

const EmployeeApp = ({ path }) => {
  const { t } = useTranslation();
  const location = useLocation();

  sessionStorage.removeItem("revalidateddone");

  const getBreadcrumbLabel = () => {
    const pathname = location.pathname;
    if (pathname.includes("/dashboard")) return "ES_COMMON_INBOX";
    if (pathname.includes("/create")) return "RWH_CREATE";
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
              <PrivateRoute
                path={`${path}/create`}
                component={() => (
                  <LayoutWrapper layoutClass="action">
                    <RwhCreateformComponent />
                  </LayoutWrapper>
                )}
              />
            </Switch>
          </div>
        </div>
      </div>
    </AppContainer>
  );
};

export default EmployeeApp;
