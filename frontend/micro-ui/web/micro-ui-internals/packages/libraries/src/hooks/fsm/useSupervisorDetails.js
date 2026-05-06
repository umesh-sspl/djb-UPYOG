import { useQuery } from "react-query";
import SupervisorDetails from "../../services/molecules/FSM/SupervisorDetails";

const useSupervisorDetails = (tenantId, filters, config = {}) => {
  return useQuery(["SUPERVISOR_SEARCH", filters], () => SupervisorDetails(tenantId, filters), config);
};

export default useSupervisorDetails;
