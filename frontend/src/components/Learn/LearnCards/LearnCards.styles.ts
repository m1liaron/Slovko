import { Dimensions, Platform, StyleSheet } from 'react-native';

const { width: W, height: H } = Dimensions.get('window');

const isWeb = Platform.OS === 'web';

const SPACING = 16;

// Responsive card sizes
const CARD_MAX_WIDTH = isWeb ? 480 : W * 0.9;

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING * 2,
  },

  card: {
    width: CARD_MAX_WIDTH,
    minHeight: H * 0.55,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: SPACING * 2,
    justifyContent: 'center',
    alignItems: 'center',

    // Shadows reworked for web + mobile
    ...(isWeb
      ? { boxShadow: '0 6px 16px rgba(0,0,0,0.15)' }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.18,
          shadowRadius: 12,
          elevation: 5,
        }),
  },

  cardText: {
    fontSize: isWeb ? 38 : 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: SPACING,
    flexWrap: 'wrap',
    width: '100%',
  },

  cardDescription: {
    fontSize: 16,
    color: '#666',
    marginTop: SPACING / 2,
    textAlign: 'center',
    maxWidth: CARD_MAX_WIDTH - SPACING * 4,
    lineHeight: 22,
  },

  iconButton: {
    marginTop: SPACING,
    padding: SPACING,
    backgroundColor: '#f3f3f3',
    borderRadius: 50,

    ...(isWeb ? { cursor: 'pointer' } : {}),
  },

  swipeFeedbackView: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: [{ translateX: -W * 0.2 }, { translateY: -20 }],
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },

  swipeText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
  },

  overlayLabelLeftWrapper: {
    position: 'absolute',
    top: '10%',
    left: '5%',
  },

  overlayLabelLeftTitle: {
    color: '#fff',
    backgroundColor: '#ff6b6b',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    fontSize: 18,
    fontWeight: '700',
  },

  overlayLabelRightWrapper: {
    position: 'absolute',
    top: '10%',
    right: '5%',
  },

  overlayLabelRightTitle: {
    color: '#fff',
    backgroundColor: '#1dd1a1',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    fontSize: 18,
    fontWeight: '700',
  },
});

export default styles;
