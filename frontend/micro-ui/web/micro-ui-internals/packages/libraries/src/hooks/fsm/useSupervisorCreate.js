import { useMutation } from "react-query";
import { FSMService } from "../../services/elements/FSM";

const useSupervisorCreate = (tenantId) => {
  return useMutation((data) => SupervisorCreateActions(data, tenantId));
};

const SupervisorCreateActions = async (data, tenantId) => {
  try {
    const response = await FSMService.createSupervisor(data, tenantId);
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.Errors[0].message);
  }
};

export default useSupervisorCreate;
