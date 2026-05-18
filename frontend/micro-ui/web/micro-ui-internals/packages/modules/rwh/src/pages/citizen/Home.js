import React from "react";
import { useTranslation } from "react-i18next";
import { ModuleLinksView } from "@djb25/digit-ui-react-components";
const Home = () => {
  const { t } = useTranslation();
  const propsForModuleCard = {
    moduleName: t("ACTION_TEST_RWH"),
    kpis: [
      
    ],
    links: [
      
      // {
      //     label: t("EKYC_CREATE_KYC"),
      //     link: `/digit-ui/citizen/ekyc/create-kyc`
      // },
      // {
      //     label: t("EKYC_UPDATE_KYC"),
      //     link: `/digit-ui/citizen/ekyc/update-kyc`
      // },
      
    ],
  };
  return <ModuleLinksView links={propsForModuleCard.links} />;
};

export default Home;
