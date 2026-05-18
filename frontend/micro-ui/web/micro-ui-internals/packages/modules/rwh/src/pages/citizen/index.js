import { AppContainer, PrivateRoute, ModuleHeader, ArrowLeft, HomeIcon } from "@djb25/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Switch, useLocation, useRouteMatch } from "react-router-dom";
import Home from "./Home";
import RwhCreateformComponent from "../../pageComponents/RwhCreateform";

const CitizenApp = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { path } = useRouteMatch();

  sessionStorage.removeItem("revalidateddone");

  const getBreadcrumbLabel = () => {
    const pathname = location.pathname;
    if (pathname.includes("/create-rwh")) return "RWH_CREATE";
    return "RWH_HOME";
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
          <PrivateRoute path={`${path}/create-rwh`} component={() => <RwhCreateformComponent />} />
        </Switch>
      </div>
    </AppContainer>
  );
};

export default CitizenApp;
