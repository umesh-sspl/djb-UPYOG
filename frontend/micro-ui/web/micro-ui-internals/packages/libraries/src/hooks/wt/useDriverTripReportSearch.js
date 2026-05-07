import { useQuery, useQueryClient } from "react-query";

const useDriverTripReportSearch = ({ tenantId, filters, auth }, config = {}) => {
  const client = useQueryClient();

  const args = tenantId ? { tenantId, filters, auth } : { filters, auth };

  const { isLoading, error, data, isSuccess, refetch } = useQuery(
    ["driverTripReportSearch", tenantId, filters, auth, config],
    () => Digit.WTService.driverTripReportSearch(args),
    {
      ...config,
    }
  );

  return {
    isLoading,
    error,
    data,
    isSuccess,
    refetch,
    revalidate: () => client.invalidateQueries(["driverTripReportSearch", tenantId, filters, auth]),
  };
};

export default useDriverTripReportSearch;
