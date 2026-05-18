import { useMutation } from "react-query";
import { WTService } from "../../services/elements/WT";

export const useUpdateEmergencyBooking = (tenantId) => {
  return useMutation((data) => WTService.updateEmergency(data, tenantId));
};

export default useUpdateEmergencyBooking;
