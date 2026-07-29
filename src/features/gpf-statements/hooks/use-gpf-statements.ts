import { useAuthStore } from '@stores/auth.store';
import { useQuery } from '@tanstack/react-query';
import { GPFStatement } from '../types';
import { QUERY_KEYS, STALE_TIMES } from '@utils/constants';
import axios from 'axios';

type Props = {
  financialYear: string;
};

export function useGpfStatements({ financialYear }: Props) {
  const { isSignedIn, user } = useAuthStore();

  const isDataPresent: boolean = !!user?.pf_no && !!user?.pf_series && !!user?.pf_type;

  const isEnabled = !!financialYear && isSignedIn && user?.emp_type === 'DB' && isDataPresent;

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
      axios.post<{ data: GPFStatement }>('http://10.179.35.51:82/api/fetch/gpf/statement', {
        // financial_year: financialYear,
        // rtype: user?.pf_type,
        // gpfSeries: user?.pf_series,
        // gpfAccNo: user?.pf_no,

        financial_year: financialYear,
        rtype: 'S',
        gpfSeries: 'POL',
        gpfAccNo: '12279',
      }),
    select: (data) => data.data.data,
    staleTime: STALE_TIMES.GPF,
  });
}
