import { useMutation } from "react-query";
import { FSMService } from "../../services/elements/FSM";

const useSurveyorUpdate = (tenantId) => {
  return useMutation((data) => SurveyorUpdateActions(data, tenantId));
};

const SurveyorUpdateActions = async (data, tenantId) => {
  try {
    const response = await FSMService.updateSurveyor(data, tenantId);
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.Errors[0].message);
  }
};

export default useSurveyorUpdate;
