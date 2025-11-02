import { SimpleLineIcons } from '@expo/vector-icons';
import { Link } from '@react-navigation/native';
import { Text, useWindowDimensions } from 'react-native';
import { useAppTheme } from '../../../contexts/ThemeProvider';
import styles from './Group.styles';
import ThemeText from '@/common/components/ThemeText/ThemeText';
import { View } from 'moti';
import { IGroup } from '@/common/enums/types/group.type';

interface GroupItemProps {
  item: IGroup;
}

export const GroupItem = ({
  item: { id, title, toLearnCount, repeatedCount, learnedCount, knowCount },
}: GroupItemProps) => {
  const {
    theme: { colors },
  } = useAppTheme();

  const { width } = useWindowDimensions();
  const groupWidth = width < 720 ? width / 1.2 : width / 5;

  const progress = knowCount! / 100;

  return (
    <Link
      key={id}
      style={[
        styles.item,
        {
          width: groupWidth,
          borderColor: colors.lightBackground,
          alignSelf: 'center',
        },
      ]}
      to={{ screen: 'group', params: { groupId: id } }}
    >
      <View>
        <ThemeText
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{ fontSize: 20 }}
        >
          {title}
        </ThemeText>
        <View>
          <View style={{ flexDirection: 'row', margin: 10 }}>
            {toLearnCount! > 0 ? (
              <ThemeText>To learn {toLearnCount} </ThemeText>
            ) : (
              <ThemeText>No words to Learn</ThemeText>
            )}
            {repeatedCount! > 0 && (
              <ThemeText>Repeated {repeatedCount} </ThemeText>
            )}
            {learnedCount! > 0 && (
              <ThemeText>Learned {learnedCount} </ThemeText>
            )}
          </View>
          <View
            style={{
              width: groupWidth / 1.5,
              height: 10,
              backgroundColor: colors.lightBackground,
              borderRadius: 40,
            }}
          >
            <View
              style={{
                width: `${progress}%`,
                height: '100%',
                borderRadius: 40,
                backgroundColor: colors.primary,
              }}
            ></View>
          </View>
        </View>
      </View>
      <SimpleLineIcons name="arrow-right" size={30} color={colors.primary} />
    </Link>
  );
};
