import React from "react";
import { useTranslation } from "react-i18next";
import { ModuleLinksView } from "@djb25/digit-ui-react-components";
const Home = () => {
  const { t } = useTranslation();
  const propsForModuleCard = {
    moduleName: t("ACTION_TEST_EKYC"),
    kpis: [
      {
        count: "-",
        label: t("TOTAL_EKYC"),
        link: `/digit-ui/citizen/ekyc/dashboard`,
      },
    ],
    links: [
      {
        label: t("EKYC_DASHBOARD"),
        link: `/digit-ui/citizen/ekyc/dashboard`,
      },
      {
        label: t("EKYC_INBOX"),
        link: `/digit-ui/citizen/ekyc/inbox`,
      },
      // {
      //     label: t("EKYC_CREATE_KYC"),
      //     link: `/digit-ui/citizen/ekyc/create-kyc`
      // },
      // {
      //     label: t("EKYC_UPDATE_KYC"),
      //     link: `/digit-ui/citizen/ekyc/update-kyc`
      // },
      {
        label: t("EKYC_MAPPING"),
        link: `/digit-ui/citizen/ekyc/mapping`,
      },
    ],
  };
  return <ModuleLinksView links={propsForModuleCard.links} />;
};

export default Home;
