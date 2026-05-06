import { useQuery } from "react-query";
import SurveyorDetails from "../../services/molecules/FSM/SurveyorDetails";

const useSurveyorDetails = (tenantId, filters, config = {}) => {
  return useQuery(["SURVEYOR_SEARCH", filters], () => SurveyorDetails(tenantId, filters), config);
};

export default useSurveyorDetails;
