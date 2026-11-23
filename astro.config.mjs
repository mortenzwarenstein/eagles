// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
    // Canonical origin (used by the sitemap). The staging workflow overrides it with SITE.
    site: process.env.SITE ?? "https://utrechteagles.nl",
    i18n: {
        locales: ["nl", "en"],
        defaultLocale: "nl",
        routing: { prefixDefaultLocale: false },
    },
    vite: {
        plugins: [tailwindcss()],
    }
});
