import { useQuery } from '@tanstack/react-query';
import { axiosInstanceWithoutEncryption } from '@utils/api/axios';
import { EPayslip } from '../types';
import { useAuthStore } from '@stores/auth.store';
import { QUERY_KEYS } from '@utils/constants';

export function useEPayslip({ geNumber }: { geNumber: string }) {
  const { user, isSignedIn } = useAuthStore();
  const isGeNumberExist = !!user?.ge_no;
  const enabled = !!isGeNumberExist || !!geNumber;

  const payload: { ge_number: string } = { ge_number: user?.ge_no || geNumber };

  return useQuery({
    queryKey: QUERY_KEYS.E_PAY_SLIP.LIST(payload),
    queryFn: () =>
      axiosInstanceWithoutEncryption.post<{ data: EPayslip }>(
        'http://10.179.35.51:82/api/get/epayslip',
        payload
      ),
    select: (data) => data.data.data,
    enabled: enabled && isSignedIn,
  });
}
