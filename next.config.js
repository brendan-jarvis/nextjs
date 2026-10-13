import { withContentlayer } from "next-contentlayer2";

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: false,
  // The dev server listens on 0.0.0.0. Browsers that open 127.0.0.1 are
  // treated as a different dev origin, and Next.js 16 then blocks the
  // client chunks (the asteroids page stays on "Loading...").
  allowedDevOrigins: ["127.0.0.1", "localhost"],
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
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
          // 'unsafe-inline' stays in script-src because Next.js inlines its
          // bootstrap and RSC payload scripts; nonces would make every page
          // dynamic. Webpack's dev runtime evaluates scripts, so 'unsafe-eval'
          // is added only while NODE_ENV is development. Production CSP does
          // not allow it. form-action allows the OAuth redirects that follow
          // the Auth.js sign-in form.
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              process.env.NODE_ENV === "development"
                ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
                : "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self'",
              "connect-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self' https://github.com https://accounts.google.com",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default withContentlayer(config);
