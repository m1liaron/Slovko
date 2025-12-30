import { View } from 'react-native';

import ThemeText from '@/common/components/ThemeText/ThemeText';
import { useAppTheme } from '@/contexts/ThemeProvider';
import { i18n } from '@/localization/i18n';

interface GroupProgressProps {
  learnedCards: number;
  shownCardsLength: number;
  progressPercentage: number;
  isDesktop: boolean;
}

export const GroupProgress: React.FC<GroupProgressProps> = ({
  learnedCards,
  shownCardsLength,
  progressPercentage,
  isDesktop,
}) => {
  const {
    theme: { colors },
  } = useAppTheme();

  return (
    <View
      style={{
        backgroundColor: colors.background,
        padding: isDesktop ? 32 : 20,
        marginHorizontal: isDesktop ? 32 : 20,
        marginTop: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <ThemeText style={{ fontSize: 18, fontWeight: '600' }}>
          Progress
        </ThemeText>
        <ThemeText style={{ fontSize: 16 }}>
          {learnedCards > 0
            ? `${learnedCards}/${shownCardsLength}`
            : i18n.t('group.noCardsLearned')}{' '}
          {i18n.t('group.learned')}
        </ThemeText>
      </View>
      <View
        style={{
          height: 12,
          backgroundColor: colors.lightBackground,
          borderRadius: 6,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            height: '100%',
            width: `${progressPercentage}%`,
            backgroundColor: colors.primary,
            borderRadius: 6,
          }}
        />
      </View>
    </View>
  );
};
