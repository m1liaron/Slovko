type Theme = {
	dark: boolean,
	colors: {
		primary: string,
		background: string,
		lightBackground: string,
		iconColor: string,
		text: string,
	},
}

const lightTheme: Theme = {
	dark: false,
	colors: {
		primary: "#12171D",
		background: "#fff",
		lightBackground: "#d5d5d5",
		iconColor: "#12171D",
		text: "#12171D",
	},
};

const darkTheme: Theme = {
	dark: true,
	colors: {
		primary: "#fff",
		background: "#12171D",
		lightBackground: "#2f3336",
		iconColor: "#fff",
		text: "#fff",
	},
};

export { lightTheme, darkTheme };
