import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
    server: { port: 3000 },
    resolve: { alias: { "@": path.resolve(__dirname, "./src") } },

    build: {
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, "index.html"),
                styles: path.resolve(__dirname, "src/assets/scss/main.scss"),
                app: path.resolve(__dirname, "src/main.ts"),
            },
            output: {
                entryFileNames: "assets/[name]-[hash].js",
                chunkFileNames: "assets/[name]-[hash].js",
                assetFileNames: "assets/[name]-[hash].[ext]",
            },
        },
    },
});
