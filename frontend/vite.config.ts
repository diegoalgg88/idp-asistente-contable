import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'
import { VitePWA } from 'vite-plugin-pwa'
import { sentryVitePlugin } from "@sentry/vite-plugin"
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import { visualizer } from 'rollup-plugin-visualizer'
import Critters from 'critters'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      webp: { quality: 85, lossless: false },
      avif: { quality: 80 },
    }),
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
    {
      name: 'vite-plugin-critters',
      apply: 'build',
      async closeBundle() {
        // Leer el HTML para encontrar el archivo CSS generado
        const indexPath = path.resolve(__dirname, 'dist/index.html');
        const htmlContent = await fs.promises.readFile(indexPath, 'utf-8');
        
        // Extraer el nombre del archivo CSS del HTML
        const cssMatch = htmlContent.match(/href=["']\/assets\/([^"']+)\.css["']/);
        const cssFileName = cssMatch ? `${cssMatch[1]}.css` : 'index.css';
        const cssFilePath = path.resolve(__dirname, 'dist/assets', cssFileName);
        
        // Verificar que el archivo existe antes de procesar
        if (!fs.existsSync(cssFilePath)) {
          console.warn('[Critters] CSS file not found:', cssFilePath);
          return;
        }

        const critters = new Critters({
          path: path.resolve(__dirname, 'dist'),
          publicPath: '/',
          inlineFonts: true,
          preload: 'swap',
          pruneSource: true, // Eliminar CSS duplicado del bundle
          additionalStylesheets: [`assets/${cssFileName}`], // Usar nombre específico del archivo
          filterSelectors: false, // Evitar errores con selectores modernos como &:dir(ltr)
          keyframes: 'inline', // Inline keyframes para animaciones críticas
          threshold: 10240, // 10KB threshold para critical CSS
        });
        
        const inlined = await critters.process(htmlContent);
        await fs.promises.writeFile(indexPath, inlined);
      },
    },
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24, // 1 día
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 días
              },
            },
          },
        ],
      },
      manifest: {
        name: 'IDP Asistente Contable',
        short_name: 'IDP App',
        description: 'Asistente contable con IA para contadores públicos en México',
        theme_color: '#000000',
        background_color: '#09090b',
        display: 'standalone',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
    sentryVitePlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@store': path.resolve(__dirname, './src/store'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/v1'),
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: "hidden", // Source maps generados pero no referenciados en HTML
    minify: 'terser',
    target: 'esnext',
    cssCodeSplit: true,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      },
    },
    rollupOptions: {
      output: {
        // Code splitting optimizado para FCP
        manualChunks: {
          // React y ReactDOM en bundle separado - crítico para hydration
          'react-vendor': ['react', 'react-dom/client'],
          // Router en bundle separado - se carga después del render inicial
          'router-vendor': ['react-router-dom'],
          // React Query - se carga diferido
          'query-vendor': ['@tanstack/react-query'],
          // Sentry - monitoring, no crítico para FCP
          'sentry-vendor': ['@sentry/react'],
          // Radix UI primitives - solo los más usados inicialmente
          'ui-primitives': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          // Icons - bundle separado para lazy load
          'icons-vendor': ['lucide-react'],
        },
        // Naming pattern para mejor caching
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 500,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
