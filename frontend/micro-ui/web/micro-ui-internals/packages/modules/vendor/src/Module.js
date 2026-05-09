import React, { useEffect } from "react";
import { useRouteMatch } from "react-router-dom";
import EmployeeApp from "./pages/employee";
import VENDORCard from "./components/VENDORCard";
import VendorDetails from "./pageComponents/VendorDetails";
import VendorDocuments from "./pageComponents/VendorDocuments";
import ServiceDoc from "./pageComponents/ServiceDoc";
import VendorSelectAddress from "./pageComponents/VendorSelectAddress";
import SearchApp from "./pages/employee/SearchApp";
import SearchVendor from "./components/SearchVendor/Index";
import SelectServiceType from "./pageComponents/SelectServiceType";
import SelectVehicleType from "./pageComponents/SelectVehicleType";
import BankDetailsComponent from "./components/BankDetailsComponent";
import SupervisorAreaAssignment from "./pageComponents/SupervisorAreaAssignment";
import CitizenVendorApp from "./pages/citizen";
import EditVendorDetails from "./components/RegisterVendor/EditVendorDetails";
import AddVendor from "./components/RegisterVendor/AddVendor";
import AddSupervisor from "./components/RegisterSupervisor/AddSupervisor";
import AddSurveyor from "./components/RegisterSurveyor/AddSurveyor";
import SurveyorDetails from "./components/RegisterSurveyor/SurveyorDetails";
import SupervisorDetails from "./components/RegisterSupervisor/SupervisorDetails";
import CheckPage from "./components/Create/CheckPage";
import NewResponse from "./components/Create/NewResponse";
import VENDORCreate from "./components/Create/index";
import AddDriver from "./components/RegisterDriver/AddDriver";
import DriverDetails from "./components/RegisterDriver/DriverDetails";
import AddVehicle from "./components/RegisterVehicle/AddVehicle";
import VehicleDetails from "./components/RegisterVehicle/VehicleDetails";

const componentsToRegister = {
  VendorDetails,
  //VENDOREMPCreate,
  // VendorAddress,
  // VendorPincode,
  VendorDocuments,
  ServiceDoc,
  AddVendor,
  VendorSelectAddress,
  SearchApp,
  SearchVendor,
  SelectServiceType,
  SelectVehicleType,
  BankDetailsComponent,
  AddDriver,
  EditVendorDetails,
  AddVehicle,
  VENDORCreate,
  VENDORCheckPage: CheckPage,
  NewResponse,
  DriverDetails,
  VehicleDetails,
  AddSupervisor,
  SupervisorDetails,
  SupervisorAreaAssignment,
  AddSurveyor,
  SurveyorDetails,
};

const addComponentsToRegistry = () => {
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};

export const VENDORModule = ({ stateCode, userType, tenants }) => {
  const { path, url } = useRouteMatch();

  addComponentsToRegistry();

  Digit.SessionStorage.set("VENDOR_TENANTS", tenants);

  useEffect(
    () =>
      userType === "employee" &&
      Digit.LocalizationService.getLocale({
        modules: [`rainmaker-${Digit.ULBService.getCurrentTenantId()}`],
        locale: Digit.StoreData.getCurrentLanguage(),
        tenantId: Digit.ULBService.getCurrentTenantId(),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (userType === "employee") return <EmployeeApp path={path} url={url} userType={userType} />;
  return <CitizenVendorApp path={path} url={url} userType={userType} />;
};

export const VENDORLinks = ({ matchPath, userType }) => {
  const [, , clearParams] = Digit.Hooks.useSessionStorage("VENDOR", {});

  useEffect(() => {
    clearParams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export const VENDORComponents = {
  VENDORCard,
  VENDORModule,
  VENDORLinks,
  // AST_INBOX_FILTER: (props) => <InboxFilter {...props} />,
  // ASTInboxTableConfig: TableConfig,
};
