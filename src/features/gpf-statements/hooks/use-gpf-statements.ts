import { useAuthStore } from '@stores/auth.store';
import { useQuery } from '@tanstack/react-query';
import { GPFStatement } from '../types';
import { QUERY_KEYS, STALE_TIMES } from '@utils/constants';
import { axiosInstanceWithoutEncryption } from '@utils/api/axios';

type Props = {
  financialYear: string;
};

export const mockGPFStatement: GPFStatement = {
  emp: {
    treasury: 'TREASURY-001',
    ddo: 'DDO-123',
    dob: '15/08/1985',
    interest_rate: '8.5%',
  },

  summary: [
    {
      summary: 'Opening Balance',
      balanceI: '₹ 5,00,000',
      balanceII: '',
      total: '₹ 5,00,000',
      missingCredits: '₹ 0',
    },
    {
      summary: 'Closing Balance',
      balanceI: '₹ 5,88,000',
      balanceII: '',
      total: '₹ 5,88,000',
      missingCredits: '₹ 0',
    },
    {
      summary: 'Year Summary',
      balanceI: '₹ 5,00,000',
      balanceII: '₹ 5,88,000',
      total: '₹ 90,000',
      missingCredits: '₹ 2,000',
    },
  ],

  monthly_data: [
    {
      month: 'Apr',
      subscription: '₹ 15,000',
      refund: '₹ 0',
      other: '₹ 0',
      category: 'Regular',
      total: '₹ 15,000',
      debit: '₹ 0',
      type: 'Crd',
    },
    {
      month: 'May',
      subscription: '₹ 15,000',
      refund: '₹ 0',
      other: '₹ 0',
      category: 'Regular',
      total: '₹ 15,000',
      debit: '₹ 0',
      type: 'Crd',
    },
    {
      month: 'Jun',
      subscription: '₹ 15,000',
      refund: '₹ 2,000',
      other: '₹ 0',
      category: 'Arrear',
      total: '₹ 17,000',
      debit: '₹ 0',
      type: 'Crd',
    },
    {
      month: 'Jul',
      subscription: '₹ 15,000',
      refund: '₹ 0',
      other: '₹ 0',
      category: 'Regular',
      total: '₹ 15,000',
      debit: '₹ 50,000',
      type: 'Dbt',
    },
    {
      month: 'Aug',
      subscription: '₹ 15,000',
      refund: '₹ 0',
      other: '₹ 0',
      category: 'Regular',
      total: '₹ 15,000',
      debit: '₹ 0',
      type: 'Crd',
    },
    {
      month: 'Sep',
      subscription: '₹ 15,000',
      refund: '₹ 0',
      other: '₹ 0',
      category: 'Regular',
      total: '₹ 15,000',
      debit: '₹ 0',
      type: 'Crd',
    },
    {
      month: 'Oct',
      subscription: '₹ 15,000',
      refund: '₹ 0',
      other: '₹ 1,500',
      category: 'Regular',
      total: '₹ 16,500',
      debit: '₹ 0',
      type: 'Crd',
    },
    {
      month: 'Nov',
      subscription: '₹ 15,000',
      refund: '₹ 0',
      other: '₹ 0',
      category: 'Regular',
      total: '₹ 15,000',
      debit: '₹ 0',
      type: 'Crd',
    },
    {
      month: 'Dec',
      subscription: '₹ 15,000',
      refund: '₹ 0',
      other: '₹ 0',
      category: 'Regular',
      total: '₹ 15,000',
      debit: '₹ 0',
      type: 'Crd',
    },
    {
      month: 'Jan',
      subscription: '₹ 15,000',
      refund: '₹ 0',
      other: '₹ 0',
      category: 'Regular',
      total: '₹ 15,000',
      debit: '₹ 0',
      type: 'Crd',
    },
    {
      month: 'Feb',
      subscription: '₹ 15,000',
      refund: '₹ 0',
      other: '₹ 0',
      category: 'Regular',
      total: '₹ 15,000',
      debit: '₹ 0',
      type: 'Crd',
    },
    {
      month: 'Mar',
      subscription: '₹ 15,000',
      refund: '₹ 0',
      other: '₹ 0',
      category: 'Regular',
      total: '₹ 15,000',
      debit: '₹ 0',
      type: 'Crd',
    },
  ],
};

export function useGpfStatements({ financialYear }: Props) {
  const { isSignedIn, user } = useAuthStore();

  const isDataPresent: boolean = !!user?.pf_no && !!user?.pf_series && !!user?.pf_type;

  const isEnabled = !!financialYear && isSignedIn && user?.emp_type === 'DB' && isDataPresent;

  const queryKey = QUERY_KEYS.GPF.STATEMENTS(financialYear, 'S', user?.pf_series, user?.pf_no);

  return useQuery({
    enabled: isEnabled,
    queryKey: queryKey,
    queryFn: () =>
      axiosInstanceWithoutEncryption.post<{ data: GPFStatement }>(
        'http://10.179.35.51:82/api/fetch/gpf/statement',
        {
          financial_year: financialYear,
          // TODO: On Live api rtype will be remove
          rtype: 'S',
          gpfSeries: user?.pf_series,
          gpfAccNo: user?.pf_no,
        }
      ),
    select: (data) => data.data.data,
    staleTime: STALE_TIMES.GPF,
  });
}
