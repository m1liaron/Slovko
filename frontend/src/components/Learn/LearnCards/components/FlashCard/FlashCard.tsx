import type { ViewStyle } from 'react-native';
import { Pressable, View, Text, Image } from 'react-native';
import Animated from 'react-native-reanimated';
import type { AnimatedStyleProp } from 'react-native-reanimated';

import type { ICard } from '@/common/enums/types/card.type';
import { useAppTheme } from '@/contexts/ThemeProvider';
import { useResponsive } from '@/hooks';
import { i18n } from '@/localization/i18n';
import { getCardHeight, getCardWidth } from '@/utils/learn/learnCards.utill';

interface FlashCardProps {
  card: ICard;
  index: number;
  typeMode: boolean;
  frontAnimatedStyle: AnimatedStyleProp<ViewStyle>;
  backAnimatedStyle: AnimatedStyleProp<ViewStyle>;
  onFlipCard: (index: number) => void;
}

export const FlashCard: React.FC<FlashCardProps> = ({
  card,
  index,
  typeMode,
  frontAnimatedStyle,
  backAnimatedStyle,
  onFlipCard,
}) => {
  const { isTablet, isMobile, isDesktop } = useResponsive();
  const {
    theme: { colors },
  } = useAppTheme();

  const cardStyle = {
    backgroundColor: colors.lightBackground,
    position: 'absolute' as const,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: isMobile ? 20 : 32,
    borderWidth: 1,
    borderColor: colors.primary + '10',
  };

  const imageSize = isMobile ? 180 : isTablet ? 280 : 360;
  const fontSize = isMobile ? 28 : isTablet ? 36 : 42;

  const renderCardImage = () => {
    if (!card.image?.url) return null;

    return (
      <View
        style={{
          marginBottom: 24,
          borderRadius: 16,
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        }}
      >
        <Image
          source={{ uri: card.image.url.toString() }}
          style={{
            width: imageSize,
            height: imageSize,
            borderRadius: 16,
          }}
          resizeMode="cover"
        />
      </View>
    );
  };

  return (
    <Pressable
      key={card.id}
      onPress={() => !typeMode && onFlipCard(index)}
      disabled={typeMode}
      style={{
        flex: 1,
        width: getCardWidth(isMobile, isDesktop),
        height: '100%',
        margin: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          position: 'relative',
          width: '100%',
          height: getCardHeight(isMobile, isDesktop),
        }}
      >
        {/* Front of card */}
        <Animated.View style={[cardStyle, frontAnimatedStyle]}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
          >
            {renderCardImage()}
            <Text
              style={{
                fontSize,
                fontWeight: '700',
                color: colors.primary,
                textAlign: 'center',
                letterSpacing: 0.5,
              }}
              selectable={false}
            >
              {card.word}
            </Text>
            {!typeMode && (
              <Text
                style={{
                  fontSize: 14,
                  color: colors.lightText,
                  marginTop: 16,
                  opacity: 0.6,
                }}
              >
                {i18n.t('learnScreen.learnCards.tapToFlip')}
              </Text>
            )}
          </View>
        </Animated.View>

        {/* Back of card */}
        <Animated.View style={[cardStyle, backAnimatedStyle]}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
          >
            {renderCardImage()}
            <Text
              style={{
                fontSize,
                fontWeight: '700',
                color: colors.primary,
                textAlign: 'center',
                letterSpacing: 0.5,
              }}
              selectable={false}
            >
              {card.translateWord}
            </Text>
          </View>
        </Animated.View>
      </View>
    </Pressable>
  );
};
