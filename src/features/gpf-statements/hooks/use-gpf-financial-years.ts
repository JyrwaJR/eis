import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS, STALE_TIMES } from '@utils/constants';
import { GpfFinancialYear } from '../types';
import { useAuthStore } from '@stores/auth.store';
import { axiosInstanceWithoutEncryption } from '@utils/api/axios';

export const mockFinancialYears: GpfFinancialYear[] = [
  {
    value: '2024-2025',
    label: '2024–2025',
  },
  {
    value: '2023-2024',
    label: '2023–2024',
  },
  {
    value: '2022-2023',
    label: '2022–2023',
  },
  {
    value: '2021-2022',
    label: '2021–2022',
  },
  {
    value: '2020-2021',
    label: '2020–2021',
  },
];

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
