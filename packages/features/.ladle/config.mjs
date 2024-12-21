/** @type {import('@ladle/react').UserConfig} */
export default {
  base: "/pallad/",
  viteConfig: `${process.cwd()}/.ladle/vite.config.ts`,
  addons: {
    width: {
      enabled: true,
      options: {
        xsmall: 480,
        small: 640,
        medium: 768,
        large: 1024,
      },
      defaultState: 480,
    },
  },
  appendToHead: `<style>
      .frame-content { display: flex; flex-direction: column; min-height: 100vh; }
    </style>`,
}
