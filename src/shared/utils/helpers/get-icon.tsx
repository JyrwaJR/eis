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
