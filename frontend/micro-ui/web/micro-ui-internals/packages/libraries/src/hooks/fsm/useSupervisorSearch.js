import { useQuery } from "react-query";
import { FSMService } from "../../services/elements/FSM";

const useSupervisorSearch = (tenantId, filters, config = {}) => {
  return useQuery(["FSM_SUPERVISOR_SEARCH", filters], () => FSMService.supervisorSearch(tenantId, filters), config);
};

export default useSupervisorSearch;
