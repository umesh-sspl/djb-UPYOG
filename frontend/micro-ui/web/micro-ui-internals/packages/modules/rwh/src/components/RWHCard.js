import { PersonIcon, EmployeeModuleCard } from "@djb25/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const RwhCard = () => {
  const { t } = useTranslation();

  const propsForModuleCard = {
    Icon: <PersonIcon />,
    moduleName: t("ACTION_TEST_RWH"),
    kpis: [
      {
        label: t("RWH_TOTAL_APPLICATIONS"),
        value: 0,
      }
    ],
    links: [
      
      {
          label: t("RWH_CREATE"),
          link: `/digit-ui/employee/rwh/create`
      },
      
    ],
  };

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default RwhCard;
