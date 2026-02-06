import { View, Text } from 'react-native';

import AddInput from '@/common/components/AddInput/AddInput';
import PressableButton from '@/common/components/PressableButton/PressableButton';
import ThemeText from '@/common/components/ThemeText/ThemeText';
import { useAppTheme } from '@/contexts/ThemeProvider';
import { useResponsive } from '@/hooks';
import { i18n } from '@/localization/i18n';
import { getCardWidth } from '@/utils/learn/learnCards.utill';

interface AnswerInputProps {
  valueAnswer: string;
  backCardAnswerLength: number;
  onAnswerChange: (text: string) => void;
  onCheckAnswer: () => void;
  isCardAnswered: boolean;
  answerSide: 'word' | 'translateWord';
}

export const AnswerInput: React.FC<AnswerInputProps> = ({
  valueAnswer,
  backCardAnswerLength,
  onAnswerChange,
  onCheckAnswer,
  isCardAnswered,
  answerSide,
}) => {
  const {
    theme: { colors },
  } = useAppTheme();
  const { isMobile, isDesktop } = useResponsive();
  const isOverLimit = valueAnswer.length > backCardAnswerLength;

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        width: getCardWidth(isMobile, isDesktop),
        zIndex: 20,
        padding: 20,
        gap: 10,
        backgroundColor: colors.lightBackground,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ThemeText
        style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}
      >
        {valueAnswer.length}/
        <Text style={{ color: isOverLimit ? 'red' : colors.text }}>
          {backCardAnswerLength}
        </Text>
      </ThemeText>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <AddInput
          value={valueAnswer}
          onChangeText={onAnswerChange}
          height={50}
          placeholder={
            answerSide === 'translateWord'
              ? i18n.t('learnScreen.learnCards.typeTranslate')
              : i18n.t('learnScreen.learnCards.typeWord')
          }
        />
        <PressableButton
          text={
            isCardAnswered
              ? i18n.t('welcomeScreen.next')
              : i18n.t('learnScreen.learnCards.checkAnswer')
          }
          onPress={onCheckAnswer}
        />
      </View>
    </View>
  );
};
