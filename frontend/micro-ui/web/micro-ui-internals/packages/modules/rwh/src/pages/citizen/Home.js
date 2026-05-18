import React from "react";
import { useTranslation } from "react-i18next";
import { ModuleLinksView } from "@djb25/digit-ui-react-components";
const Home = () => {
  const { t } = useTranslation();
  const propsForModuleCard = {
    moduleName: t("ACTION_TEST_RWH"),
    kpis: [],
    links: [
      {
        label: t("RWH_CREATE"),
        link: `/digit-ui/citizen/rwh/create-rwh`,
      },
    ],
  };
  return <ModuleLinksView links={propsForModuleCard.links} />;
};

export default Home;
