// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
    // Canonical origin (used by the sitemap).
    site: process.env.SITE ?? "https://utrechteagles.nl",
    i18n: {
        locales: ["nl", "en"],
        defaultLocale: "nl",
        routing: { prefixDefaultLocale: false },
    },
    // Self-hosted, preloaded fonts (no render-blocking request to Google Fonts).
    fonts: [
        {
            provider: fontProviders.google(),
            name: "Barlow Condensed",
            cssVariable: "--font-barlow-condensed",
            weights: [600, 700, 800, 900],
            styles: ["normal", "italic"],
            subsets: ["latin"],
            fallbacks: ["Impact", "sans-serif"],
        },
        {
            provider: fontProviders.google(),
            name: "DM Sans",
            cssVariable: "--font-dm-sans",
            weights: [400, 500, 600, 700],
            styles: ["normal"],
            subsets: ["latin"],
            fallbacks: ["system-ui", "sans-serif"],
        },
    ],
    vite: {
        plugins: [tailwindcss()],
    }
});
