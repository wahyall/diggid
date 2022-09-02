import { defineConfig, loadEnv } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default ({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

    return defineConfig({
        server: {
            host: process.env.VITE_HOST,
        },
        plugins: [
            laravel({
                input: "resources/js/app.jsx",
                refresh: true,
            }),
            react(),
        ],
    });
};
