import { HomeQuickAction } from '@features/home/types';
import { PAGE_ROUTES } from '@utils/constants/routes';

/** Preset list of quick-action shortcuts for the home dashboard. */
export const HOME_QUICK_ACTIONS: HomeQuickAction[] = [
  { label: 'Apply Leave', icon: 'add-circle-outline', route: PAGE_ROUTES.LEAVE.CREATE },
  { label: 'Holiday List', icon: 'calendar-number-outline', route: '/holidays' },
  { label: 'Pay Slips', icon: 'document-text-outline', route: PAGE_ROUTES.STATEMENT },
  { label: 'Support', icon: 'help-circle-outline', route: '/support' },
];
