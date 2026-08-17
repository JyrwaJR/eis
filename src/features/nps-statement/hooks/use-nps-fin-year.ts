import { useQuery } from '@tanstack/react-query';
import { METHODS, QUERY_KEYS, STALE_TIMES } from '@utils/constants';
import { rpc } from '@utils/api';
import { useAuthStore } from '@stores/auth.store';

export function useNpsFinYear() {
  const { isSignedIn, user } = useAuthStore();

  const isEnabled = !!isSignedIn;

  const body = {
    gpf_series: user?.pf_series,
    gpf_acc_no: user?.pf_no,
  };

  return useQuery({
    queryKey: QUERY_KEYS.GPF.FINANCIAL_YEARS(body),
    enabled: isEnabled,
    queryFn: () => rpc<{ label: string; value: string }[]>(METHODS.GET_GPF_FINANCIAL_YEAR, body),
    select: (data) => data.data,
    staleTime: STALE_TIMES.GPF,
  });
}
