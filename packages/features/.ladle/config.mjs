/** @type {import('@ladle/react').UserConfig} */
export default {
  base: "/pallad/",
  viteConfig: `${process.cwd()}/.ladle/vite.config.ts`,
  addons: {
    width: {
      enabled: true,
      options: {
        xsmall: 370,
        small: 640,
        medium: 768,
        large: 1024,
      },
      defaultState: 370,
    },
  },
  appendToHead: `<style>
      .ladle-iframe { max-height: 600px; }
      .frame-content { display: flex; flex-direction: column; min-height: 100vh; }
    </style>`,
}
