import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router-dom";
import { CitizenHomeCard, DocumentIcon } from "@djb25/digit-ui-react-components";
import RWHCard from "./components/RWHCard";
import EmployeeApp from "./pages/employee";
import CitizenApp from "./pages/citizen";
export const RWHModule = ({ userType, tenants }) => {
  const { path, url } = useRouteMatch();
  const moduleCode = "RWH";
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading, data: store } = Digit.Services.useStore({ moduleCode, language });

  Digit.SessionStorage.set("RWH_TENANTS", tenants);

  useEffect(
    () =>
      userType === "employee" &&
      Digit.LocalizationService.getLocale({
        modules: [`rainmaker-${Digit.ULBService.getCurrentTenantId()}`],
        locale: Digit.StoreData.getCurrentLanguage(),
        tenantId: Digit.ULBService.getCurrentTenantId(),
      }),
    []
  );

  if (userType === "employee") {
    return <EmployeeApp path={path} url={url} userType={userType} tenants={tenants} />;
  } else return <CitizenApp />;
};

export const RWHLinks = ({ matchPath, userType }) => {
  const { t } = useTranslation();
  const links = [
    {
      link: `${matchPath}/create-rwh`,
      i18nKey: t("RWH_CREATE_KYC"),
    },
    {
      link: `${matchPath}/update-rwh`,
      i18nKey: t("RWH_UPDATE_KYC"),
    },
  ];

  return <CitizenHomeCard header={t("RWH_MODULE_NAME")} links={links} Icon={() => <DocumentIcon className="fill-path-primary-main" />} />;
};

const componentsToRegister = {
  RWHModule,
  RWHCard,
  RWHLinks,
};

export const initRwhComponents = () => {
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};

export default RWHModule;
