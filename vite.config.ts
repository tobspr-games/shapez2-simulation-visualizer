import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { join } from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    base: "./",
    resolve: {
        alias: {
            "@": join(__dirname, "src"),
        },
    },

    build: {
        target: ["es2020"],
    },
    define: { "process.env": {} },
});
