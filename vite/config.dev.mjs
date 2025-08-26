import { defineConfig } from 'vite';

export default defineConfig({
    base: './',
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    phaser: ['phaser']
                }
            }, 
            external: ["phaser-navmesh/src"]
        },
    },
    server: {
        port: 8080
    }
});
