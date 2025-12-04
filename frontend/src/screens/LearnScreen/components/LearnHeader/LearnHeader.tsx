import { Entypo } from '@expo/vector-icons';
import { Pressable } from 'react-native';

import { useAppTheme } from '@/contexts/ThemeProvider';

interface LearnHeaderProps {
  onExit: () => void;
}

export const LearnHeader: React.FC<LearnHeaderProps> = ({ onExit }) => {
  const { theme } = useAppTheme();

  return (
    <Pressable onPress={onExit}>
      <Entypo name="cross" size={35} color={theme.colors.iconColor} />
    </Pressable>
  );
};
