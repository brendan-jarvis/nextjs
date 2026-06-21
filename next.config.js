import { withContentlayer } from "next-contentlayer2";

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // CSP tuned for Clerk + Supabase + Next.js
          // - script-src: allow Clerk's browser bundle (clerk.browser.js)
          // - frame-src: Clerk uses iframes for sign-in flows, UserButton, etc.
          // - connect-src: includes wss for Clerk realtime
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: https://*.clerk.accounts.dev; font-src 'self'; connect-src 'self' https://*.clerk.accounts.dev wss://*.clerk.accounts.dev https://*.supabase.co; frame-src https://*.clerk.accounts.dev;",
          },
        ],
      },
    ];
  },
};

export default withContentlayer(config);
