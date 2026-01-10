import { defineConfig } from "vitest/config";
import preact from "@preact/preset-vite";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const baseConfig = {
    plugins: [preact()],
    test: {
      globals: true,
    },
  };

  if (command === "serve") {
    return baseConfig;
  }

  return {
    ...baseConfig,
    base: "/triangle-game/",
  };
});
