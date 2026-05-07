import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/witness-attestation/',
  build: {
    assetsDir: 'assets',
    outDir: 'docs',
    emptyOutDir: false,
    chunkSizeWarningLimit: 700,
    sourcemap: false,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Witness Attestation',
        short_name: 'Witness',
        description:
          'Sign GPS/time observations into verifiable, portable presence attestations.',
        theme_color: '#14342f',
        background_color: '#f6f3eb',
        display: 'standalone',
        start_url: '/witness-attestation/',
        scope: '/witness-attestation/',
        icons: [
          {
            src: '/witness-attestation/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        navigateFallback: '/witness-attestation/index.html',
        globPatterns: ['**/*.{js,css,html,svg,webmanifest}'],
        globIgnores: ['**/libsodium-wrappers-*.js'],
      },
    }),
  ],
  test: {
    environment: 'node',
    exclude: ['tests/e2e/**', 'node_modules/**', 'docs/**'],
    globals: true,
  },
});
