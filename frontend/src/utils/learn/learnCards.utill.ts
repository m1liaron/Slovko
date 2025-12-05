import type { DimensionValue } from 'react-native';

const getCardWidth = (
  isMobile: boolean,
  isDesktop: boolean,
): DimensionValue => {
  return isMobile ? '90%' : isDesktop ? '70%' : '50%';
};

const getCardHeight = (isMobile: boolean): DimensionValue => {
  return isMobile ? '70%' : '75%';
};

export { getCardWidth, getCardHeight };
