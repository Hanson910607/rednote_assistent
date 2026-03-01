import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: {
                    'modern-compiler': true,
                },
            },
        },
    },
    base: process.env.NODE_ENV === 'production' ? '/' : '/',
    build: {
        target: 'esnext',
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false,
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
                pure_funcs: ['console.log'],
            },
        },
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    if (id.includes('node_modules')) {
                        if (id.includes('vue') || id.includes('vue-router') || id.includes('pinia')) {
                            return 'vendor';
                        }
                        if (id.includes('element-plus')) {
                            return 'element-plus';
                        }
                        if (id.includes('axios') || id.includes('crypto-js')) {
                            return 'utils';
                        }
                        return 'vendor';
                    }
                },
                chunkFileNames: 'assets/js/[name]-[hash].js',
                entryFileNames: 'assets/js/[name]-[hash].js',
                assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
            },
        },
        chunkSizeWarningLimit: 500,
        reportCompressedSize: true,
        cssCodeSplit: true,
    },
    server: {
        port: 5173,
        open: true,
        host: true,
    },
    optimizeDeps: {
        include: ['vue', 'vue-router', 'pinia', 'element-plus', 'axios', 'crypto-js'],
        exclude: [],
        force: false,
    },
    clearScreen: false,
});
