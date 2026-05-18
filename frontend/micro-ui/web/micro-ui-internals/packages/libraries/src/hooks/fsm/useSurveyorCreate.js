import { useMutation } from "react-query";
import { FSMService } from "../../services/elements/FSM";

const useSurveyorCreate = (tenantId) => {
  return useMutation((data) => SurveyorCreateActions(data, tenantId));
};

const SurveyorCreateActions = async (data, tenantId) => {
  try {
    const response = await FSMService.createSurveyor(data, tenantId);
    return response;
  } catch (error) {
    const message = error?.response?.data?.Errors?.[0]?.message || error?.message || "Something went wrong";
    throw new Error(message);
  }
};

export default useSurveyorCreate;
