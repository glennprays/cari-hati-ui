import type { Config } from "tailwindcss";
const { nextui } = require("@nextui-org/react");

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "primary-gradient": "var(--primary-gradient)",
            },
            colors: {
                primary: "#111418",
                pink: {
                    1: "#FD5564",
                    2: "#D44F61",
                },
                blue: {
                    1: "#5479B9",
                },
            },
        },
    },
    darkMode: "class",
    plugins: [
        nextui({
            addCommonColors: true,
        }),
    ],
};
export default config;
