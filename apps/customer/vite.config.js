import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: 'Maa Ki Rasoi',
                short_name: 'Maa Ki Rasoi',
                description: 'Your daily dose of home-cooked care.',
                theme_color: '#C8550A',
                background_color: '#F9F4EE',
                display: 'standalone',
                orientation: 'portrait',
                icons: [
                    {
                        src: 'pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            },
            workbox: {
                // Ignore API calls for caching so we don't accidentally cache dynamic JSON
                navigateFallback: '/index.html',
                navigateFallbackDenylist: [/^\/api/, /^\/auth/],
                runtimeCaching: [
                    {
                        // Cache JS/CSS/HTML bundles proactively
                        urlPattern: /^https:\/\/.*\.(js|css|html|png|svg|jpg)$/,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'static-assets-cache',
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
                            },
                        },
                    },
                ],
            },
        })
    ],
    build: {
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true, // remove all console.logs in production
                drop_debugger: true
            }
        },
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', 'react-router-dom', 'axios'],
                    ui: ['lucide-react']
                }
            }
        }
    }
})
