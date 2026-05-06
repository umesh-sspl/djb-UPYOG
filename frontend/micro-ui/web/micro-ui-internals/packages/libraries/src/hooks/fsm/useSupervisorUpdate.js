import { useMutation } from "react-query";
import { FSMService } from "../../services/elements/FSM";

const useSupervisorUpdate = (tenantId) => {
  return useMutation((data) => SupervisorUpdateActions(data, tenantId));
};

const SupervisorUpdateActions = async (data, tenantId) => {
  try {
    const response = await FSMService.updateSupervisor(data, tenantId);
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.Errors[0].message);
  }
};

export default useSupervisorUpdate;
