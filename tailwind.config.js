module.exports = {
	content: [
		"./src/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
		"./pages/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Poppins", "system-ui", "sans-serif"],
			},
			keyframes: {
				slideInLeft: {
					"0%": { transform: "translateX(-1rem)", opacity: "0" },
					"100%": { transform: "translateX(0)", opacity: "1" },
				},
				fadeIn: {
					"0%": { opacity: "0", transform: "translateY(0.5rem)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
			},
			animation: {
				slideInLeft: "slideInLeft 0.3s ease-out forwards",
				fadeIn: "fadeIn 0.4s ease-out forwards",
			},
		},
	},
	plugins: [],
};
