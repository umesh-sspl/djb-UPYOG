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
    throw new Error(error?.response?.data?.Errors[0].message);
  }
};

export default useSurveyorCreate;
