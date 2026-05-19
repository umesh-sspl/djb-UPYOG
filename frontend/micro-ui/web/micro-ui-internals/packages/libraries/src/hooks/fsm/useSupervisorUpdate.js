import { useMutation } from "react-query";
import { FSMService } from "../../services/elements/FSM";

const useSupervisorUpdate = (tenantId) => {
  return useMutation((supervisorData) => SupervisorUpdateActions(supervisorData, tenantId));
};

const SupervisorUpdateActions = async (supervisorData, tenantId) => {
  try {
    const response = await FSMService.updateSupervisor(supervisorData, tenantId);
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.Errors[0].message);
  }
};

export default useSupervisorUpdate;
