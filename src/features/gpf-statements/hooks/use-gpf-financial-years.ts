import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS, STALE_TIMES } from '@utils/constants';
import { GpfFinancialYear } from '../types';
import { axiosInstanceWithoutEncryption } from '@utils/api/axios';
import { useAuthStore } from '@stores/auth.store';

export function useGPFFinancialYear() {
  const { isSignedIn, user } = useAuthStore();

  const empType = user?.emp_type;

  const isEnabled = !!isSignedIn && empType === 'DB';

  const body = {
    // gpfSeries: user?.pf_series,
    // gpfAccNo: user?.pf_no,
    gpfSeries: 'MEG/POL',
    gpfAccNo: '12279',
  };

  return useQuery({
    queryKey: QUERY_KEYS.GPF.FINANCIAL_YEARS(body),
    enabled: isEnabled,
    queryFn: () =>
      axiosInstanceWithoutEncryption.post<{ data: GpfFinancialYear[] }>(
        'http://10.179.35.51:82/api/fetch/gpf/financialyear',
        body
      ),
    select: (data) => data.data?.data,
    staleTime: STALE_TIMES.GPF,
  });
}
