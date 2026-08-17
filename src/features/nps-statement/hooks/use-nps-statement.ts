import { useAuthStore } from '@stores/auth.store';
import { useQuery } from '@tanstack/react-query';
import { rpc } from '@utils/api';
import { METHODS, QUERY_KEYS, STALE_TIMES } from '@utils/constants';
import { NPSAnnux5 } from '../types/nps';

type Props = {
  financialYear: string;
};

export function useNpsStatements({ financialYear }: Props) {
  const { isSignedIn, user } = useAuthStore();

  const pran = user?.pf_pran_no;
  const ppan = user?.ppan;

  const isFieldsExist = !!pran || !!ppan;

  const isEnabled = isSignedIn && isFieldsExist;

  return useQuery({
    enabled: isEnabled,
    queryKey: QUERY_KEYS.NPS.LIST(pran, ppan, financialYear),
    queryFn: () =>
      rpc<NPSAnnux5>(METHODS.GET_NPS_ANNEX5, {
        pran: pran,
        ppan,
        fin_year: financialYear,
      }),
    select: (data) => data.data,
    staleTime: STALE_TIMES.NPS,
  });
}
