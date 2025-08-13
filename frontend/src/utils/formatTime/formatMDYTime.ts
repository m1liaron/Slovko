import { i18n } from '@/localization/i18n';

const formatMDYTime = (date: Date) =>
  new Date(date).toLocaleDateString(i18n.locale || 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

export { formatMDYTime };
