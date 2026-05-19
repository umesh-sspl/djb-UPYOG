import { useQuery } from "react-query";
import { FSMService } from "../../services/elements/FSM";

const useSurveyorSearch = (tenantId, filters, config = {}) => {
  return useQuery(["FSM_SURVEYOR_SEARCH", filters], () => FSMService.surveyorSearch(tenantId, filters), config);
};

export default useSurveyorSearch;
