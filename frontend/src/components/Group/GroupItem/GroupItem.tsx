import { SimpleLineIcons } from '@expo/vector-icons';
import { Link } from '@react-navigation/native';
import { useWindowDimensions, View, Pressable } from 'react-native';
import { useAppTheme } from '../../../contexts/ThemeProvider';
import ThemeText from '@/common/components/ThemeText/ThemeText';
import { IGroup } from '@/common/enums/types/group.type';
import PressableButton from '@/common/components/PressableButton/PressableButton';

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
  const isDesktop = width >= 768;

  // Calculate total cards for accurate progress
  const totalCards = (toLearnCount || 0) + (repeatedCount || 0) + (learnedCount || 0) + (knowCount || 0);
  const learnedTotal = (learnedCount || 0) + (knowCount || 0);
  const progress = totalCards > 0 ? (learnedTotal / totalCards) * 100 : 0;

  return (
    <Link
      key={id}
      style={{
        backgroundColor: colors.background,
        borderRadius: 16,
        padding: isDesktop ? 24 : 20,
        borderWidth: 1,
        borderColor: colors.lightBackground,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        minHeight: 160,
        width: '100%'
      }}
      to={{ screen: 'group', params: { groupId: id } }}
    >
      <View style={{ flex: 1, gap: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: "center" }}>
        <View>
          <View style={{ marginBottom: 16 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 12,
              }}
            >
              <ThemeText
                numberOfLines={2}
                ellipsizeMode="tail"
                style={{
                  fontSize: isDesktop ? 20 : 18,
                  fontWeight: '600',
                  flex: 1,
                  marginRight: 12,
                }}
              >
                {title}
              </ThemeText>
            </View>

            {/* Stats */}
            <View style={{ gap: 6 }}>
              {toLearnCount! > 0 ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#32C74D',
                    }}
                  />
                  <ThemeText style={{ fontSize: 14, opacity: 0.8 }}>
                    To learn: {toLearnCount}
                  </ThemeText>
                </View>
              ) : (
                <ThemeText style={{ fontSize: 14, opacity: 0.6 }}>
                  No words to learn
                </ThemeText>
              )}
              {repeatedCount! > 0 && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#62CBE9',
                    }}
                  />
                  <ThemeText style={{ fontSize: 14, opacity: 0.8 }}>
                    Repeated: {repeatedCount}
                  </ThemeText>
                </View>
              )}
              {learnedCount! > 0 && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: colors.primary,
                    }}
                  />
                  <ThemeText style={{ fontSize: 14, opacity: 0.8 }}>
                    Learned: {learnedCount}
                  </ThemeText>
                </View>
              )}
            </View>
          </View>

          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}
            >
              <ThemeText style={{ fontSize: 12, opacity: 0.6 }}>
                Progress
              </ThemeText>
              <ThemeText style={{ fontSize: 12, fontWeight: '600' }}>
                {Math.round(progress)}%
              </ThemeText>
            </View>
            <View
              style={{
                width: '100%',
                height: 8,
                backgroundColor: colors.lightBackground,
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  backgroundColor: colors.primary,
                  borderRadius: 4,
                }}
              />
            </View>
          </View>
        </View>

        <SimpleLineIcons name='arrow-right-circle' color={colors.primary} size={50}/>
      </View>
    </Link>
  );
};