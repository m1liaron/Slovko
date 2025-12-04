import { useEffect } from 'react';
import { Platform } from 'react-native';

import { i18n } from '@/localization/i18n';

export const useBeforeUnload = () => {
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      return i18n.t('learnScreen.leaveStudyMessage');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
};
