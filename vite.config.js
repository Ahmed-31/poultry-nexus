import {defineConfig} from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from "path";

export default defineConfig({
    server: {
        host: true,
        port: 5173,
        strictPort: true,
        hmr: {
            host: 'poultry-nexus.loc',
            protocol: 'ws',
        },
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    },
    plugins: [
        laravel({
            input: ['resources/js/src/main.jsx', 'resources/js/src/styles/app.css'],
            buildDirectory: 'build',
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "resources/js"),
        },
    },
});
