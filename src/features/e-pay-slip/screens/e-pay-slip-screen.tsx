import React, { useState } from 'react';
import { Container } from '@components/layout';
import { EmptyScreen } from '@components/screens';
import { useSnackbar } from '@hooks';
import { AlertCircleIcon } from '@hugeicons/core-free-icons';
import { useAuthStore } from '@stores/auth.store';
import { GeNumberForm } from '../components/ge-number-form';
import { PayslipConfirmDialog } from '../components/payslip-confirm-dialog';
import { PayslipDetails } from '../components/payslip-details';
import { EPaySlipSkeleton } from '../components/skeleton';
import { useEPayslip } from '../hooks/use-e-payslip';
import { useUpdateGeNumber } from '../hooks/use-update-ge-number';

const ENTRY_ERROR = 'No e-pay slip found for this GE number. Please check and try again.';

/**
 * E-Pay Slip screen.
 *
 * Flow:
 * 1. User has a stored GE number -> auto-fetch and show the payslip with
 *    the Download PDF action (no confirmation).
 * 2. User has no GE number -> the entry form is shown first.
 * 3. After fetching with a newly entered GE number, a confirmation dialog
 *    verifies the payslip belongs to the current user.
 * 4. On confirm, the GE number is persisted to the backend; the auth store
 *    is refreshed (`refresh()`) so `user.ge_number` is repopulated from
 *    employee details.
 * 5. Only then is the PDF download enabled.
 */
export const EPaySlipScreen = () => {
  const { user, refresh } = useAuthStore();
  const existingGeNumber = user?.ge_number?.trim() ?? '';

  const [enteredGeNumber, setEnteredGeNumber] = useState('');
  const [pendingGeNumber, setPendingGeNumber] = useState<string | null>(null);
  const [confirmedGeNumber, setConfirmedGeNumber] = useState<string | null>(null);

  const activeGeNumber = existingGeNumber || confirmedGeNumber || pendingGeNumber || '';

  const { data: payslip, isLoading, isError, refetch } = useEPayslip({ geNumber: activeGeNumber });
  const updateGeNumber = useUpdateGeNumber();
  const { showSnackbar } = useSnackbar();

  const needsGeNumber = !activeGeNumber;
  const isNewEntryFetch = !!pendingGeNumber && !confirmedGeNumber;

  const handleGeNumberSubmit = (geNumber: string) => {
    setEnteredGeNumber(geNumber);
    if (pendingGeNumber === geNumber) {
      // Re-submitting the same number after a fetch error: retry the query.
      void refetch();
    } else {
      setPendingGeNumber(geNumber);
    }
  };

  const handleConfirmPayslip = async () => {
    if (!enteredGeNumber) return;
    try {
      const res = await updateGeNumber.mutateAsync({ geNumber: enteredGeNumber });
      if (!res.success) {
        showSnackbar(
          res.message || 'Could not save your GE number. Please try again.',
          AlertCircleIcon
        );
        return;
      } else {
        if (res.message) {
          showSnackbar(res.message, AlertCircleIcon);
        }
      }
      // GE number is persisted on the backend; refresh employee details so
      // `user.ge_number` is repopulated from the API response.
      refresh();
      setConfirmedGeNumber(enteredGeNumber);
      setPendingGeNumber(null);
    } catch {
      showSnackbar('Could not save your GE number. Please try again.', AlertCircleIcon);
    }
  };

  const handleCancelPayslip = () => setPendingGeNumber(null);

  const userName = [user?.emp_fname, user?.emp_mname, user?.emp_lname].filter(Boolean).join(' ');

  // Loading: initial fetch, or the first fetch of a newly entered GE number.
  if (isLoading) {
    return <EPaySlipSkeleton />;
  }

  // A newly entered GE number failed to fetch: return to the form with an
  // inline error so the user can correct the number.
  if (isError && isNewEntryFetch) {
    return <GeNumberForm onSubmit={handleGeNumberSubmit} error={ENTRY_ERROR} />;
  }

  // Case 2 - no GE number yet (or the user cancelled): prompt for entry.
  if (needsGeNumber) {
    return <GeNumberForm onSubmit={handleGeNumberSubmit} />;
  }

  // Existing GE number failed to fetch: full-screen error with retry.
  if (isError || !payslip) {
    return (
      <Container className="flex-1">
        <EmptyScreen
          title="Unable to load e-pay slip"
          message="No e-pay slip could be fetched for the given GE number. Please try again."
          refresh={refetch}
        />
      </Container>
    );
  }

  const showConfirmation = isNewEntryFetch;

  return (
    <>
      <PayslipDetails payslip={payslip} downloadEnabled={!showConfirmation} />
      <PayslipConfirmDialog
        open={showConfirmation}
        payslip={payslip}
        userName={userName}
        isConfirming={updateGeNumber.isPending}
        onConfirm={handleConfirmPayslip}
        onCancel={handleCancelPayslip}
      />
    </>
  );
};
