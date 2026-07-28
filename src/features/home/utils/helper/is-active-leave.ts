import { LeaveListItem } from '@sharedTypes/leave';

/**
 * Determines whether a leave request is still "active" — i.e. it should
 * appear in the **Active Applications** section rather than **Recent History**
 * on the home dashboard.
 *
 * A leave is considered active when:
 * 1. It has **not** been rejected (`Rejected` leaves always go to history).
 * 2. Its end date is **today or later** (still in progress or upcoming).
 *
 * ### Timezone handling
 *
 * `from_dt1` / `to_dt1` are `YYYY-MM-DD` strings.  The JS spec parses
 * bare `YYYY-MM-DD` as **UTC midnight**, while `new Date()` returns the
 * **local** time.  To compare fairly we normalise today to local midnight
 * and append `T00:00:00` to the date strings so they are also treated as
 * local midnight.
 *
 * @param leave - The leave record to check.
 * @returns `true` if the leave is still active, `false` if it belongs in
 *   history.
 *
 * @example
 * ```ts
 * isActiveLeave({ from_dt1: '2026-06-01', to_dt1: '2026-06-03', verify_flg_desc: 'Pending' });
 * // => true (still pending, end date hasn't passed)
 * ```
 */
export function isActiveLeave(leave: LeaveListItem): boolean {
  // Rejected leaves are never active — they belong in history.
  if (leave.verify_flg_desc === 'Rejected') return false;

  // Normalise today to start of day (local timezone).
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Force local-timezone parsing by appending T00:00:00.
  const endDate = new Date(leave.to_dt1 + 'T00:00:00');

  // Active = end date is today or later (in-progress or upcoming).
  return endDate >= todayStart;
}
