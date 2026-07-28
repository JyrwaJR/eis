import { useAuthStore } from '@stores/auth.store';
import { useQuery } from '@tanstack/react-query';
import { GPFStatement } from '../types';
import { QUERY_KEYS, STALE_TIMES } from '@utils/constants';
import { axiosInstanceWithoutEncryption } from '@utils/api/axios';

type Props = {
  financialYear: string;
};

export function useGpfStatements({ financialYear }: Props) {
  const { isSignedIn, user } = useAuthStore();

  const isEnabled = !!financialYear && isSignedIn;

  const queryKey = QUERY_KEYS.GPF.STATEMENTS(
    financialYear,
    user?.pf_type,
    user?.pf_series,
    user?.pf_no
  );

  return useQuery({
    enabled: isEnabled,
    queryKey: queryKey,
    queryFn: () =>
      axiosInstanceWithoutEncryption.post<GPFStatement>(
        'http://10.179.35.51:82/api/fetch/gpf/statement',
        {
          financial_year: financialYear,
          rtype: user?.pf_type,
          gpfSeries: user?.pf_series,
          gpfAccNo: user?.pf_no,
        }
      ),
    select: (data) => data.data,
    staleTime: STALE_TIMES.GPF,
  });
}
