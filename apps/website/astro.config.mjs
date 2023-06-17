import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify/functions';
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  vite: {
    build: {
      target: 'es2020'
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'es2020'
      }
    }
  },
  integrations: [tailwind()],
  adapter: netlify()
});
