import type { StackScreenProps } from '@react-navigation/stack';
import type React from 'react';
import { View } from 'react-native';

import ThemeBackground from '@/common/components/ThemeBackground/Themebackground';
import { AppPath } from '@/common/enums/app/app';
import type { RootStackParamList } from '@/navigation/ProtectedRoute/ProtectedRoute';
import Loading from '@/components/Loading';
import {
  useBeforeUnload,
  useLearnScreen,
  useLearnSession,
} from '@/hooks/LearnScreen';
import { LearnResults } from './components/LearnResults/LearnResults';
import { LearnHeader } from './components/LearnHeader/LearnHeader';
import { LearnContent } from './components/LearnContent/LearnContent';

type LearnScreenProps = StackScreenProps<
  RootStackParamList,
  typeof AppPath.Learn
>;

const LearnScreen: React.FC<LearnScreenProps> = ({ route }) => {
  const groupId = (route.params as { groupId?: string | undefined })?.groupId;

  const {
    status,
    isLessonOver,
    currentSection,
    showExitModal,
    sessionData,
    elapsedTime,
    setShowExitModal,
    handleNextSection,
    handleSetData,
    leaveStudy,
  } = useLearnScreen(groupId);

  const { resultsData, accuracy, correctAnswersAmount } =
    useLearnSession(sessionData);

  useBeforeUnload();

  if (!groupId) {
    return null;
  }

  return (
    <ThemeBackground>
      <View>
        {!isLessonOver ? (
          <View style={{ justifyContent: 'center', paddingHorizontal: 20 }}>
            <LearnHeader onExit={() => setShowExitModal(true)} />

            {status === 'pending' ? (
              <Loading />
            ) : (
              <LearnContent
                currentSection={currentSection}
                onComplete={handleNextSection}
                onSetData={handleSetData}
                showExitModal={showExitModal}
                onCloseExitModal={() => setShowExitModal(false)}
              />
            )}
          </View>
        ) : (
          <LearnResults
            elapsedTime={elapsedTime}
            correctAnswersAmount={correctAnswersAmount}
            accuracy={accuracy}
            onContinue={leaveStudy}
          />
        )}
      </View>
    </ThemeBackground>
  );
};

export default LearnScreen;
