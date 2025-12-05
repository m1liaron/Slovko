import { View } from 'react-native';

import type { ICard, Section } from '@/common/enums/types/types';
import LearnCards from '@/components/Learn/LearnCards/LearnCards';
import LearnCheck from '@/components/Learn/LearnCheck/LearnCheck';
import LearnGuessWord from '@/components/Learn/LearnGuessWord/LearnGuessWord';
import LearnQuiz from '@/components/Learn/LearnQuiz/LearnQuiz';
import ExitModal from '@/components/Modals/ExitModal/ExitModal';
import { i18n } from '@/localization/i18n';

interface LearnContentProps {
  currentSection: Section;
  onComplete: () => void;
  onSetData: (card: ICard, isCorrect: boolean) => void;
  showExitModal: boolean;
  onCloseExitModal: () => void;
}

export const LearnContent: React.FC<LearnContentProps> = ({
  currentSection,
  onComplete,
  onSetData,
  showExitModal,
  onCloseExitModal,
}) => {
  return (
    <View>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        {currentSection === 'quiz' && (
          <LearnQuiz onComplete={onComplete} handleSetData={onSetData} />
        )}

        {currentSection === 'word' && (
          <LearnGuessWord onComplete={onComplete} handleSetData={onSetData} />
        )}

        {currentSection === 'check' && (
          <LearnCheck onComplete={onComplete} handleSetData={onSetData} />
        )}
      </View>

      {currentSection === 'cards' && (
        <LearnCards onComplete={onComplete} setFlashCards={onSetData} />
      )}

      <ExitModal
        modalVisible={showExitModal}
        handleClose={onCloseExitModal}
        text={i18n.t('learnScreen.leaveStudyMessage')}
      />
    </View>
  );
};
