import {
  Home09Icon,
  HugeiconsIcon,
  Payment01Icon,
  UserSquareIcon,
  NotificationSquareIcon,
  DocumentAttachmentIcon,
  GoogleDocIcon,
  Settings01Icon,
  CalendarAdd01Icon,
  CheckmarkCircle02Icon,
  PaymentSuccess01Icon,
  Clock01Icon,
  Time04Icon,
  Alert02Icon,
  CancelCircleIcon,
  HelpCircleIcon,
} from '@hugeicons/core-free-icons';

export const getTabIcons = (path: string): typeof HugeiconsIcon => {
  switch (path) {
    case 'index':
      return Home09Icon;
    case 'statement/index':
      return Payment01Icon;
    case 'leaves/index':
      return CalendarAdd01Icon;
    case 'profile/index':
      return UserSquareIcon;
    default:
      return Home09Icon;
  }
};

export const getDrawerIcons = (path: string): typeof HugeiconsIcon => {
  switch (path) {
    case 'index':
      return Home09Icon;
    case '/settings':
      return Settings01Icon;
    case '/announcements':
      return NotificationSquareIcon;
    case '/gpf-statements':
      return DocumentAttachmentIcon;
    case '/nps-statements':
      return GoogleDocIcon;
    default:
      return Home09Icon;
  }
};

export const getStatusIcon = (status: string): typeof HugeiconsIcon => {
  switch (status) {
    // Leave: Verified
    case 'Verified':
      return CheckmarkCircle02Icon;

    // Salary: Paid / Processed
    case 'PAID':
    case 'PROCESSED':
    case 'APPROVED':
      return PaymentSuccess01Icon;

    // Leave: Pending / Entry (draft)
    case 'Pending':
    case 'Entry':
      return Clock01Icon;

    // Salary: Pending / Held
    case 'PENDING':
    case 'HELD':
      return Time04Icon;

    // Tax: Not Filed
    case 'NOT_FILED':
      return Alert02Icon;

    // Tax: Filed
    case 'FILED':
      return GoogleDocIcon;

    // Leave: Rejected
    case 'Rejected':
    case 'REJECTED':
    case 'FAILED':
      return CancelCircleIcon;

    default:
      return HelpCircleIcon;
  }
};
