/**
 * Shared by `bun fmt` (reads this file natively, Tailwind sorting built in)
 * and Prettier (fallback while `bun fmt` is canary-only).
 * @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions}
 */
const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  // Tailwind v4: sort against our theme (custom colours/fonts), not just the defaults.
  tailwindStylesheet: "./src/styles/globals.css",
};

export default config;
