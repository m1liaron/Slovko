import { View } from 'react-native';

import AddButton from '@/common/components/AddButton/AddButton';
import PressableButton from '@/common/components/PressableButton/PressableButton';
import { useResponsive } from '@/hooks';
import { i18n } from '@/localization/i18n';

interface GroupActionsProps {
  hasCards: boolean;
  isLoading: boolean;
  onLearn: () => void;
  onAddCard: () => void;
}

const GroupActions: React.FC<GroupActionsProps> = ({
  hasCards,
  isLoading,
  onLearn,
  onAddCard,
}) => {
  const { isDesktop } = useResponsive();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 20,
      }}
    >
      {hasCards && !isLoading && (
        <PressableButton
          onPress={onLearn}
          text={i18n.t('group.cardList.learnButton')}
          buttonStyle={{ flex: 1, width: isDesktop ? 500 : 'auto' }}
        />
      )}
      <AddButton
        viewStyles={{ position: 'static', right: 0, bottom: 0 }}
        onPress={onAddCard}
      />
    </View>
  );
};

export { GroupActions };
