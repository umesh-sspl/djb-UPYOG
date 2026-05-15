import { PersonIcon, EmployeeModuleCard } from "@djb25/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const RwhCard = () => {
  const { t } = useTranslation();

  const propsForModuleCard = {
    Icon: <PersonIcon />,
    moduleName: t("ACTION_TEST_RWH"),
    kpis: [
      
    ],
    links: [
      
      // {
      //     label: t("EKYC_CREATE_KYC"),
      //     link: `/digit-ui/employee/ekyc/create-kyc`
      // },
      // {
      //     label: t("EKYC_UPDATE_KYC"),
      //     link: `/digit-ui/employee/ekyc/update-kyc`
      // },
      
    ],
  };

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default RwhCard;
