import { View, Text } from 'react-native';

import PressableButton from '@/common/components/PressableButton/PressableButton';
import { ICard } from '@/common/enums/types/card.type';
import { useAppTheme } from '@/contexts/ThemeProvider';
import { i18n } from '@/localization/i18n';

interface LearnResultsProps {
  elapsedTime: string;
  correctAnswersAmount: number;
  accuracy: number;
  onContinue: () => void;
}

const LearnResults: React.FC<LearnResultsProps> = ({
  elapsedTime,
  correctAnswersAmount,
  accuracy,
  onContinue,
}) => {
  const { theme } = useAppTheme();

  const resultItems = [
    { value: elapsedTime },
    { value: `${correctAnswersAmount * 10} ${i18n.t('learnScreen.score')}` },
    { value: `${accuracy}% ${i18n.t('learnScreen.accuracy')}` },
  ];

  return (
    <View style={{ padding: 20 }}>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <Text
          style={{
            color: theme.colors.primary,
            textAlign: 'center',
            fontSize: 30,
            fontWeight: 'bold',
          }}
        >
          {i18n.t('learnScreen.lessonCompleteTitle')}
        </Text>

        <View style={{ marginBottom: 30, gap: 10, width: '100%' }}>
          {resultItems.map((item, index) => (
            <View
              key={index}
              style={{
                borderWidth: 2,
                borderColor: theme.colors.primary,
                borderRadius: 12,
                padding: 16,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: theme.colors.primary,
                  fontSize: 30,
                  fontWeight: '600',
                }}
              >
                {item.value}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <PressableButton
        text={i18n.t('learnScreen.continueButton')}
        onPress={onContinue}
      />
    </View>
  );
};

export { LearnResults };
