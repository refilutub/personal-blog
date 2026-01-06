import type { Config } from "tailwindcss";

export default {
    darkMode: "class",
    theme: {
        extend: {
            fontFamily: {
                'minecraft': ['Minecraft', 'sans-serif'],
                'google-sans': ['Google Sans', 'sans-serif'],
            },
        },
    },
} satisfies Config;