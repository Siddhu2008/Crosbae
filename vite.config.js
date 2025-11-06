import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy /api requests to the real API in development to avoid CORS issues.
    proxy: {
      '/api': {
        target: 'https://api.crosbae.com',
        changeOrigin: true,
        secure: true,
        // keep path the same: /api/* -> /api/* on target
        rewrite: (path) => path,
        configure: (proxy) => {
          // Intercept proxy responses and rewrite Set-Cookie headers so cookies can be set for localhost during dev.
          proxy.on('proxyRes', (proxyRes, req, res) => {
            const setCookie = proxyRes.headers && proxyRes.headers['set-cookie'];
            if (!setCookie || !res || !res.setHeader) return;

            try {
              const newCookies = setCookie.map((cookie) => {
                // Remove Domain attribute so the cookie becomes host-only (localhost)
                let out = cookie.replace(/; ?Domain=[^;]+/i, '');
                // Remove Secure flag because dev server is HTTP (non-HTTPS) at localhost
                out = out.replace(/; ?Secure/i, '');
                // Optional: remove SameSite if it's incompatible
                out = out.replace(/; ?SameSite=[^;]+/i, '');
                return out;
              });

              // Set modified cookies on the proxied response
              res.setHeader('set-cookie', newCookies);
              } catch {
              // ignore
            }
          });
        },
      },
    },
  },
})
