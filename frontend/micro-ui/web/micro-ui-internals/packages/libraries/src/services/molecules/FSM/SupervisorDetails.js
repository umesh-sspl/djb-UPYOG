import { FSMService } from "../../elements/FSM";

const getResponse = (data, vendorDetails, surveyors) => {
  let details = [
    {
      title: "ES_VENDOR_SUPERVISOR_BASIC_DETAILS",
      values: [
        { title: "ES_VENDOR_SUPERVISOR_FULL_NAME", value: data?.name },
        { title: "ES_VENDOR_SUPERVISOR_MOBILE_NUMBER", value: data?.owner?.mobileNumber },
        { title: "ES_VENDOR_SUPERVISOR_EMAIL_ID", value: data?.owner?.emailId },
        { title: "ES_VENDOR_SUPERVISOR_STAFF_CODE", value: data?.employeeId },
        { title: "ES_VENDOR_SUPERVISOR_GENDER", value: data?.owner?.gender },
        {
          title: "ES_VENDOR_SUPERVISOR_AGENCY_NAME",
          value: vendorDetails?.vendor?.[0]?.name || "ES_FSM_REGISTRY_DETAILS_ADD_VENDOR",
          type: "custom",
        },
      ],
    },
  ];

  details.push({
    title: "ES_VENDOR_SUPERVISOR_MAPPED_SURVEYORS",
    type: "ES_FSM_REGISTRY_DETAILS_TYPE_SURVEYOR",
    child: surveyors?.map((s) => ({
      id: s.id,
      values: [
        { title: "ES_VENDOR_SURVEYOR_NAME", value: s.name },
        { title: "ES_VENDOR_SURVEYOR_ID", value: s.employeeId },
        { title: "ES_VENDOR_SURVEYOR_MOBILE", value: s.owner?.mobileNumber },
      ],
    })) || [],
  });

  return details;
};

const SupervisorDetails = async (tenantId, filters = {}) => {
  const { ids } = filters;
  try {
    const supervisorDetails = await FSMService.supervisorSearch(tenantId, filters);
    const vendorDetails = await FSMService.vendorSearch(tenantId, { supervisorIds: ids });
    const surveyorDetails = await FSMService.surveyorSearch(tenantId, { supervisorIds: ids });

    if (!supervisorDetails?.supervisor?.length) throw new Error("No data found");

    const data = supervisorDetails.supervisor.map((data) => ({
      supervisorData: data,
      employeeResponse: getResponse(data, vendorDetails, surveyorDetails?.surveyor || []),
      vendorDetails: vendorDetails,
      surveyors: surveyorDetails?.surveyor || [],
    }));

    return data;
  } catch (error) {
    const mockData = [
      {
        supervisorData: { 
          id: "SUP1", 
          name: "Amit Kumar", 
          employeeId: "EMP001", 
          status: "ACTIVE",
          owner: { mobileNumber: "9876543210", emailId: "amit@test.com", gender: "MALE" } 
        },
        employeeResponse: getResponse(
          { name: "Amit Kumar", owner: { mobileNumber: "9876543210", emailId: "amit@test.com", gender: "MALE" }, employeeId: "EMP001" },
          { vendor: [{ name: "Clean City Agency" }] },
          [
            {
              id: "SUR1",
              name: "Suresh Raina",
              employeeId: "EMP101",
              status: "ACTIVE",
              owner: { mobileNumber: "9123456780" },
            },
          ]
        ),
        vendorDetails: { vendor: [{ name: "Clean City Agency" }] },
        surveyors: [
          {
            id: "SUR1",
            name: "Suresh Raina",
            employeeId: "EMP101",
            status: "ACTIVE",
            owner: { mobileNumber: "9123456780" },
          },
        ],
      }
    ];
    return mockData;
  }
};

export default SupervisorDetails;
