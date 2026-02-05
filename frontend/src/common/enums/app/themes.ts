type Theme = {
  dark: boolean;
  colors: {
    primary: string;
    background: string;
    lightBackground: string;
    iconColor: string;
    text: string;
    highlightColor: string;
    highlightDarkColor: string;
    lightText: string;
    danger: string;
    success: string;
  };
};

const lightTheme: Theme = {
  dark: false,
  colors: {
    primary: '#12171D',
    background: '#fff',
    lightBackground: '#f5f5f5',
    lightText: '#626471ff',
    iconColor: '#12171D',
    text: '#12171D',
    highlightColor: '#9E2CE2',
    highlightDarkColor: '#7533EE',
    danger: '#AF0606',
    success: '#62c485',
  },
};

const darkTheme: Theme = {
  dark: true,
  colors: {
    primary: '#fff',
    background: '#12171D',
    lightBackground: '#2f3336',
    lightText: '#718696ff',
    iconColor: '#fff',
    text: '#fff',
    highlightColor: '#9E2CE2',
    highlightDarkColor: '#7533EE',
    danger: '#AF0606',
    success: '#62c485',
  },
};

export { lightTheme, darkTheme };
