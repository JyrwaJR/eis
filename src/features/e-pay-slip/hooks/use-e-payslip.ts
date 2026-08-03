import { useQuery } from '@tanstack/react-query';
import { axiosInstanceWithoutEncryption } from '@utils/api/axios';
import { EPayslip } from '../types';
import { useAuthStore } from '@stores/auth.store';
import { QUERY_KEYS } from '@utils/constants';

export function useEPayslip({ geNumber }: { geNumber: string }) {
  const { user, isSignedIn } = useAuthStore();
  const isGeNumberExist = !!user?.ge_no;
  const enabled = !!isGeNumberExist || !!geNumber;

  return useQuery({
    queryKey: QUERY_KEYS.E_PAY_SLIP.LIST(isGeNumberExist ? user?.ge_no : geNumber),
    queryFn: () =>
      axiosInstanceWithoutEncryption.post<{ data: EPayslip }>(
        'http://10.179.35.51:82/api/get/epayslip',
        {
          ge_number: user?.ge_no || geNumber,
        }
      ),
    select: (data) => data.data.data,
    enabled: enabled && isSignedIn,
  });
}
