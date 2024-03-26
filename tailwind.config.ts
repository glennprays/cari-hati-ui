import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
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
                    2: "#E90B1E",
                },
                blue: {
                    1: "#5479B9",
                },
            },
        },
    },
    plugins: [],
};
export default config;
