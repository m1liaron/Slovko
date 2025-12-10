import { useWindowDimensions } from 'react-native';

const useResponsive = () => {
  const { width, height } = useWindowDimensions();
  const isMobile = width <= 768;
  const isDesktop = width >= 768;
  const isTablet = width >= 768 && width <= 1080;

  return {
    width,
    height,
    isMobile,
    isDesktop,
    isTablet,
  };
};

export { useResponsive };
