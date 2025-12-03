import { useWindowDimensions } from 'react-native';

const useResponsive = () => {
  const { width, height } = useWindowDimensions();
  const isMobile = width <= 768;
  const isDesktop = width >= 768;

  return {
    width,
    height,
    isMobile,
    isDesktop,
  };
};

export { useResponsive };
