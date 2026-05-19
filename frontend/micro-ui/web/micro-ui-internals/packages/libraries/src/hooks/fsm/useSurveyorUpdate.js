import { useMutation } from "react-query";
import { FSMService } from "../../services/elements/FSM";

const useSurveyorUpdate = (tenantId) => {
  return useMutation((surveyorData) => SurveyorUpdateActions(surveyorData, tenantId));
};

const SurveyorUpdateActions = async (surveyorData, tenantId) => {
  try {
    const response = await FSMService.updateSurveyor(surveyorData, tenantId);
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.Errors[0].message);
  }
};

export default useSurveyorUpdate;
