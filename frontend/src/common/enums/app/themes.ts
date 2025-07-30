type Theme = {
  dark: boolean;
  colors: {
    primary: string;
    background: string;
    lightBackground: string;
    iconColor: string;
    text: string;
    highlightColor: string;
    lightText: string;
  };
};

const lightTheme: Theme = {
  dark: false,
  colors: {
    primary: '#12171D',
    background: '#fff',
    lightBackground: '#d5d5d5',
    lightText: '#626471ff',
    iconColor: '#12171D',
    text: '#12171D',
    highlightColor: '#5B62F8',
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
    highlightColor: '#5B62F8',
  },
};

export { lightTheme, darkTheme };
