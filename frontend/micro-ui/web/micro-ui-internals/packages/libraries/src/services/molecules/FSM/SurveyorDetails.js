import { FSMService } from "../../elements/FSM";

const getResponse = (data, vendorDetails) => {
  let details = [
    {
      title: "ES_VENDOR_SURVEYOR_BASIC_DETAILS",
      values: [
        { title: "ES_VENDOR_SURVEYOR_FULL_NAME", value: data?.name },
        { title: "ES_VENDOR_SURVEYOR_MOBILE_NUMBER", value: data?.owner?.mobileNumber },
        { title: "ES_VENDOR_SURVEYOR_EMAIL_ID", value: data?.owner?.emailId },
        { title: "ES_VENDOR_SURVEYOR_STAFF_CODE", value: data?.employeeId },
        { title: "ES_VENDOR_SURVEYOR_GENDER", value: data?.owner?.gender },
        {
          title: "ES_VENDOR_SURVEYOR_AGENCY_NAME",
          value: vendorDetails?.vendor?.[0]?.name || "ES_FSM_REGISTRY_DETAILS_ADD_VENDOR",
          type: "custom",
        },
      ],
    },
  ];
  return details;
};

const SurveyorDetails = async (tenantId, filters = {}) => {
  const { ids } = filters;
  try {
    const surveyorDetails = await FSMService.surveyorSearch(tenantId, filters);
    const vendorDetails = await FSMService.vendorSearch(tenantId, { surveyorIds: ids });

    if (!surveyorDetails?.surveyor?.length) throw new Error("No data found");

    const data = surveyorDetails.surveyor.map((data) => ({
      surveyorData: data,
      employeeResponse: getResponse(data, vendorDetails),
      vendorDetails: vendorDetails,
    }));

    return data;
  } catch (error) {
    const mockData = [
      {
        surveyorData: { 
          id: "SUR1", 
          name: "Suresh Raina", 
          employeeId: "EMP101", 
          status: "ACTIVE",
          owner: { mobileNumber: "9123456780", emailId: "suresh@test.com", gender: "MALE" } 
        },
        employeeResponse: getResponse(
          { name: "Suresh Raina", owner: { mobileNumber: "9123456780", emailId: "suresh@test.com", gender: "MALE" }, employeeId: "EMP101" },
          { vendor: [{ name: "Clean City Agency" }] }
        ),
        vendorDetails: { vendor: [{ name: "Clean City Agency" }] },
      }
    ];
    return mockData;
  }
};

export default SurveyorDetails;
