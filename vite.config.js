import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
// import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "",
  // plugins: [react(), tailwindcss()],
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.ts",

    // include: [
    //   "src/**/*.{test,spec}.{js,ts,jsx,tsx}",
    //   "tests/**/*.{test,spec}.{js,ts,jsx,tsx}",
    // ],
  },
});
