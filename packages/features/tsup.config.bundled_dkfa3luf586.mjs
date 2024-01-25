// tsup.config.ts
import { baseTsupConfig } from '@palladxyz/common'
import svgJsx from '@svgr/plugin-jsx'
import { polyfillNode } from 'esbuild-plugin-polyfill-node'
import svgr from 'esbuild-plugin-svgr'
import { defineConfig } from 'tsup'

// package.json
var package_default = {
  name: '@palladxyz/features',
  version: '0.1.0',
  description: '',
  type: 'module',
  module: 'dist/index.js',
  types: 'dist/index.d.ts',
  exports: {
    '.': {
      types: './dist/index.d.ts',
      default: './dist/index.js'
    },
    './dist/index.css': {
      import: './dist/index.css',
      require: './dist/index.css'
    },
    './tailwind.config.mjs': {
      import: './tailwind.config.mjs',
      require: './tailwind.config.mjs'
    },
    './postcss.config.mjs': {
      import: './postcss.config.mjs',
      require: './postcss.config.mjs'
    }
  },
  scripts: {
    build: 'tsup',
    dev: 'tsup --watch',
    'test:unit': "echo 'not yet'",
    'story:dev': 'VITE_APP_LADLE=true ladle serve',
    'story:build': 'VITE_APP_LADLE=true ladle build -o ./build',
    'story:preview': 'VITE_APP_LADLE=true ladle preview',
    cleanup: 'rimraf node_modules dist .turbo build'
  },
  dependencies: {
    '@hookform/resolvers': '^3.3.2',
    '@jitsu/jitsu-react': '^1.7.2',
    '@palladxyz/key-management': '^0.0.1',
    '@palladxyz/mina-core': '^0.0.1',
    '@palladxyz/mina-graphql': '^0.0.1',
    '@palladxyz/multi-chain-core': '^0.0.1',
    '@palladxyz/offchain-data': '^1.0.0',
    '@palladxyz/persistence': '^1.0.0',
    '@palladxyz/vault': '^0.0.1',
    '@radix-ui/react-accordion': '^1.1.2',
    '@radix-ui/react-alert-dialog': '^1.0.5',
    '@radix-ui/react-aspect-ratio': '^1.0.3',
    '@radix-ui/react-avatar': '^1.0.4',
    '@radix-ui/react-checkbox': '^1.0.4',
    '@radix-ui/react-collapsible': '^1.0.3',
    '@radix-ui/react-context-menu': '^2.1.5',
    '@radix-ui/react-dialog': '^1.0.5',
    '@radix-ui/react-dropdown-menu': '^2.0.6',
    '@radix-ui/react-hover-card': '^1.0.7',
    '@radix-ui/react-label': '^2.0.2',
    '@radix-ui/react-menubar': '^1.0.4',
    '@radix-ui/react-navigation-menu': '^1.1.4',
    '@radix-ui/react-popover': '^1.0.7',
    '@radix-ui/react-progress': '^1.0.3',
    '@radix-ui/react-radio-group': '^1.1.3',
    '@radix-ui/react-scroll-area': '^1.0.5',
    '@radix-ui/react-select': '^2.0.0',
    '@radix-ui/react-separator': '^1.0.3',
    '@radix-ui/react-slider': '^1.1.2',
    '@radix-ui/react-slot': '^1.0.2',
    '@radix-ui/react-switch': '^1.0.3',
    '@radix-ui/react-tabs': '^1.0.4',
    '@radix-ui/react-toast': '^1.1.5',
    '@radix-ui/react-toggle': '^1.0.3',
    '@radix-ui/react-toggle-group': '^1.0.4',
    '@radix-ui/react-tooltip': '^1.0.7',
    '@total-typescript/ts-reset': '^0.5.1',
    'class-variance-authority': '^0.7.0',
    clsx: '^2.0.0',
    cmdk: '^0.2.0',
    'date-fns': '^3.0.1',
    dayjs: '^1.11.10',
    'easy-mesh-gradient': '^0.0.5',
    immer: '^10.0.3',
    'lucide-react': '^0.299.0',
    'match-sorter': '^6.3.1',
    'merge-refs': '^1.2.2',
    'next-themes': '^0.2.1',
    rambda: '^8.6.0',
    react: '^18.2.0',
    'react-day-picker': '^8.9.1',
    'react-dom': '^18.2.0',
    'react-hook-form': '^7.49.2',
    'react-qr-code': '^2.0.12',
    'react-router': '^6.21.0',
    'react-router-dom': '^6.21.0',
    'react-twc': '^1.0.1',
    recharts: '^2.10.3',
    superjson: '^2.2.1',
    'tailwind-merge': '^2.1.0',
    'tailwindcss-animate': '^1.0.7',
    'webextension-polyfill': '^0.10.0',
    zod: '^3.22.4',
    zustand: '^4.4.7'
  },
  devDependencies: {
    '@chialab/esbuild-plugin-commonjs': '^0.17.2',
    '@hyrious/esbuild-plugin-commonjs': '^0.2.2',
    '@ladle/react': '^4.0.2',
    '@palladxyz/common': '^1.0.0',
    '@svgr/plugin-jsx': '^8.0.1',
    '@svgr/rollup': '^8.0.1',
    '@testing-library/react': '^14.1.2',
    '@trpc/server': '^10.44.1',
    '@tsconfig/recommended': '^1.0.3',
    '@tsconfig/vite-react': '^3.0.0',
    '@types/mocha': '^10.0.6',
    '@types/react': '^18.2.45',
    '@types/react-dom': '^18.2.18',
    '@types/webextension-polyfill': '^0.10.7',
    'esbuild-plugin-polyfill-node': '^0.3.0',
    'esbuild-plugin-svgr': '2.0.0',
    'graphql-request': '^6.1.0',
    'mina-signer': '^2.1.1',
    swr: '^2.2.4',
    vite: '^4.5.1',
    'vite-plugin-node-polyfills': '^0.17.0',
    'vite-plugin-svgr': '^3.2.0',
    'vite-plugin-top-level-await': '^1.4.1'
  },
  peerDependencies: {
    '@types/mocha': '^10.0.1',
    react: '^18.2.0',
    'react-dom': '^18.2.0'
  }
}

// tsup.config.ts
var tsup_config_default = defineConfig([
  {
    ...baseTsupConfig,
    name: package_default.name,
    esbuildPlugins: [
      polyfillNode({
        polyfills: { crypto: true },
        globals: { process: true }
      }),
      svgr({ plugins: [svgJsx] })
    ],
    external: ['swr'],
    treeshake: true
  }
])
export { tsup_config_default as default }
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidHN1cC5jb25maWcudHMiLCAicGFja2FnZS5qc29uIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX2luamVjdGVkX2ZpbGVuYW1lX18gPSBcIi9Vc2Vycy90aGVvZG9yZXBlbmRlci9Db2RpbmcvdHMtcHJvamVjdHMvcGFsbGFkL3BhY2thZ2VzL2ZlYXR1cmVzL3RzdXAuY29uZmlnLnRzXCI7Y29uc3QgX19pbmplY3RlZF9kaXJuYW1lX18gPSBcIi9Vc2Vycy90aGVvZG9yZXBlbmRlci9Db2RpbmcvdHMtcHJvamVjdHMvcGFsbGFkL3BhY2thZ2VzL2ZlYXR1cmVzXCI7Y29uc3QgX19pbmplY3RlZF9pbXBvcnRfbWV0YV91cmxfXyA9IFwiZmlsZTovLy9Vc2Vycy90aGVvZG9yZXBlbmRlci9Db2RpbmcvdHMtcHJvamVjdHMvcGFsbGFkL3BhY2thZ2VzL2ZlYXR1cmVzL3RzdXAuY29uZmlnLnRzXCI7aW1wb3J0IHsgYmFzZVRzdXBDb25maWcgfSBmcm9tICdAcGFsbGFkeHl6L2NvbW1vbidcbmltcG9ydCBzdmdKc3ggZnJvbSAnQHN2Z3IvcGx1Z2luLWpzeCdcbmltcG9ydCB7IHBvbHlmaWxsTm9kZSB9IGZyb20gJ2VzYnVpbGQtcGx1Z2luLXBvbHlmaWxsLW5vZGUnXG5pbXBvcnQgc3ZnciBmcm9tICdlc2J1aWxkLXBsdWdpbi1zdmdyJ1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndHN1cCcgLy8gZXNsaW50LWRpc2FibGUtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcblxuaW1wb3J0IHBhY2thZ2VKc29uIGZyb20gJy4vcGFja2FnZS5qc29uJ1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoW1xuICB7XG4gICAgLi4uYmFzZVRzdXBDb25maWcsXG4gICAgbmFtZTogcGFja2FnZUpzb24ubmFtZSxcbiAgICBlc2J1aWxkUGx1Z2luczogW1xuICAgICAgcG9seWZpbGxOb2RlKHtcbiAgICAgICAgcG9seWZpbGxzOiB7IGNyeXB0bzogdHJ1ZSB9LFxuICAgICAgICBnbG9iYWxzOiB7IHByb2Nlc3M6IHRydWUgfVxuICAgICAgfSksXG4gICAgICBzdmdyKHsgcGx1Z2luczogW3N2Z0pzeF0gfSlcbiAgICBdLFxuICAgIGV4dGVybmFsOiBbJ3N3ciddLFxuICAgIHRyZWVzaGFrZTogdHJ1ZVxuICB9XG5dKVxuIiwgIntcbiAgXCJuYW1lXCI6IFwiQHBhbGxhZHh5ei9mZWF0dXJlc1wiLFxuICBcInZlcnNpb25cIjogXCIwLjEuMFwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiXCIsXG4gIFwidHlwZVwiOiBcIm1vZHVsZVwiLFxuICBcIm1vZHVsZVwiOiBcImRpc3QvaW5kZXguanNcIixcbiAgXCJ0eXBlc1wiOiBcImRpc3QvaW5kZXguZC50c1wiLFxuICBcImV4cG9ydHNcIjoge1xuICAgIFwiLlwiOiB7XG4gICAgICBcInR5cGVzXCI6IFwiLi9kaXN0L2luZGV4LmQudHNcIixcbiAgICAgIFwiZGVmYXVsdFwiOiBcIi4vZGlzdC9pbmRleC5qc1wiXG4gICAgfSxcbiAgICBcIi4vZGlzdC9pbmRleC5jc3NcIjoge1xuICAgICAgXCJpbXBvcnRcIjogXCIuL2Rpc3QvaW5kZXguY3NzXCIsXG4gICAgICBcInJlcXVpcmVcIjogXCIuL2Rpc3QvaW5kZXguY3NzXCJcbiAgICB9LFxuICAgIFwiLi90YWlsd2luZC5jb25maWcubWpzXCI6IHtcbiAgICAgIFwiaW1wb3J0XCI6IFwiLi90YWlsd2luZC5jb25maWcubWpzXCIsXG4gICAgICBcInJlcXVpcmVcIjogXCIuL3RhaWx3aW5kLmNvbmZpZy5tanNcIlxuICAgIH0sXG4gICAgXCIuL3Bvc3Rjc3MuY29uZmlnLm1qc1wiOiB7XG4gICAgICBcImltcG9ydFwiOiBcIi4vcG9zdGNzcy5jb25maWcubWpzXCIsXG4gICAgICBcInJlcXVpcmVcIjogXCIuL3Bvc3Rjc3MuY29uZmlnLm1qc1wiXG4gICAgfVxuICB9LFxuICBcInNjcmlwdHNcIjoge1xuICAgIFwiYnVpbGRcIjogXCJ0c3VwXCIsXG4gICAgXCJkZXZcIjogXCJ0c3VwIC0td2F0Y2hcIixcbiAgICBcInRlc3Q6dW5pdFwiOiBcImVjaG8gJ25vdCB5ZXQnXCIsXG4gICAgXCJzdG9yeTpkZXZcIjogXCJWSVRFX0FQUF9MQURMRT10cnVlIGxhZGxlIHNlcnZlXCIsXG4gICAgXCJzdG9yeTpidWlsZFwiOiBcIlZJVEVfQVBQX0xBRExFPXRydWUgbGFkbGUgYnVpbGQgLW8gLi9idWlsZFwiLFxuICAgIFwic3Rvcnk6cHJldmlld1wiOiBcIlZJVEVfQVBQX0xBRExFPXRydWUgbGFkbGUgcHJldmlld1wiLFxuICAgIFwiY2xlYW51cFwiOiBcInJpbXJhZiBub2RlX21vZHVsZXMgZGlzdCAudHVyYm8gYnVpbGRcIlxuICB9LFxuICBcImRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJAaG9va2Zvcm0vcmVzb2x2ZXJzXCI6IFwiXjMuMy4yXCIsXG4gICAgXCJAaml0c3Uvaml0c3UtcmVhY3RcIjogXCJeMS43LjJcIixcbiAgICBcIkBwYWxsYWR4eXova2V5LW1hbmFnZW1lbnRcIjogXCJeMC4wLjFcIixcbiAgICBcIkBwYWxsYWR4eXovbWluYS1jb3JlXCI6IFwiXjAuMC4xXCIsXG4gICAgXCJAcGFsbGFkeHl6L21pbmEtZ3JhcGhxbFwiOiBcIl4wLjAuMVwiLFxuICAgIFwiQHBhbGxhZHh5ei9tdWx0aS1jaGFpbi1jb3JlXCI6IFwiXjAuMC4xXCIsXG4gICAgXCJAcGFsbGFkeHl6L29mZmNoYWluLWRhdGFcIjogXCJeMS4wLjBcIixcbiAgICBcIkBwYWxsYWR4eXovcGVyc2lzdGVuY2VcIjogXCJeMS4wLjBcIixcbiAgICBcIkBwYWxsYWR4eXovdmF1bHRcIjogXCJeMC4wLjFcIixcbiAgICBcIkByYWRpeC11aS9yZWFjdC1hY2NvcmRpb25cIjogXCJeMS4xLjJcIixcbiAgICBcIkByYWRpeC11aS9yZWFjdC1hbGVydC1kaWFsb2dcIjogXCJeMS4wLjVcIixcbiAgICBcIkByYWRpeC11aS9yZWFjdC1hc3BlY3QtcmF0aW9cIjogXCJeMS4wLjNcIixcbiAgICBcIkByYWRpeC11aS9yZWFjdC1hdmF0YXJcIjogXCJeMS4wLjRcIixcbiAgICBcIkByYWRpeC11aS9yZWFjdC1jaGVja2JveFwiOiBcIl4xLjAuNFwiLFxuICAgIFwiQHJhZGl4LXVpL3JlYWN0LWNvbGxhcHNpYmxlXCI6IFwiXjEuMC4zXCIsXG4gICAgXCJAcmFkaXgtdWkvcmVhY3QtY29udGV4dC1tZW51XCI6IFwiXjIuMS41XCIsXG4gICAgXCJAcmFkaXgtdWkvcmVhY3QtZGlhbG9nXCI6IFwiXjEuMC41XCIsXG4gICAgXCJAcmFkaXgtdWkvcmVhY3QtZHJvcGRvd24tbWVudVwiOiBcIl4yLjAuNlwiLFxuICAgIFwiQHJhZGl4LXVpL3JlYWN0LWhvdmVyLWNhcmRcIjogXCJeMS4wLjdcIixcbiAgICBcIkByYWRpeC11aS9yZWFjdC1sYWJlbFwiOiBcIl4yLjAuMlwiLFxuICAgIFwiQHJhZGl4LXVpL3JlYWN0LW1lbnViYXJcIjogXCJeMS4wLjRcIixcbiAgICBcIkByYWRpeC11aS9yZWFjdC1uYXZpZ2F0aW9uLW1lbnVcIjogXCJeMS4xLjRcIixcbiAgICBcIkByYWRpeC11aS9yZWFjdC1wb3BvdmVyXCI6IFwiXjEuMC43XCIsXG4gICAgXCJAcmFkaXgtdWkvcmVhY3QtcHJvZ3Jlc3NcIjogXCJeMS4wLjNcIixcbiAgICBcIkByYWRpeC11aS9yZWFjdC1yYWRpby1ncm91cFwiOiBcIl4xLjEuM1wiLFxuICAgIFwiQHJhZGl4LXVpL3JlYWN0LXNjcm9sbC1hcmVhXCI6IFwiXjEuMC41XCIsXG4gICAgXCJAcmFkaXgtdWkvcmVhY3Qtc2VsZWN0XCI6IFwiXjIuMC4wXCIsXG4gICAgXCJAcmFkaXgtdWkvcmVhY3Qtc2VwYXJhdG9yXCI6IFwiXjEuMC4zXCIsXG4gICAgXCJAcmFkaXgtdWkvcmVhY3Qtc2xpZGVyXCI6IFwiXjEuMS4yXCIsXG4gICAgXCJAcmFkaXgtdWkvcmVhY3Qtc2xvdFwiOiBcIl4xLjAuMlwiLFxuICAgIFwiQHJhZGl4LXVpL3JlYWN0LXN3aXRjaFwiOiBcIl4xLjAuM1wiLFxuICAgIFwiQHJhZGl4LXVpL3JlYWN0LXRhYnNcIjogXCJeMS4wLjRcIixcbiAgICBcIkByYWRpeC11aS9yZWFjdC10b2FzdFwiOiBcIl4xLjEuNVwiLFxuICAgIFwiQHJhZGl4LXVpL3JlYWN0LXRvZ2dsZVwiOiBcIl4xLjAuM1wiLFxuICAgIFwiQHJhZGl4LXVpL3JlYWN0LXRvZ2dsZS1ncm91cFwiOiBcIl4xLjAuNFwiLFxuICAgIFwiQHJhZGl4LXVpL3JlYWN0LXRvb2x0aXBcIjogXCJeMS4wLjdcIixcbiAgICBcIkB0b3RhbC10eXBlc2NyaXB0L3RzLXJlc2V0XCI6IFwiXjAuNS4xXCIsXG4gICAgXCJjbGFzcy12YXJpYW5jZS1hdXRob3JpdHlcIjogXCJeMC43LjBcIixcbiAgICBcImNsc3hcIjogXCJeMi4wLjBcIixcbiAgICBcImNtZGtcIjogXCJeMC4yLjBcIixcbiAgICBcImRhdGUtZm5zXCI6IFwiXjMuMC4xXCIsXG4gICAgXCJkYXlqc1wiOiBcIl4xLjExLjEwXCIsXG4gICAgXCJlYXN5LW1lc2gtZ3JhZGllbnRcIjogXCJeMC4wLjVcIixcbiAgICBcImltbWVyXCI6IFwiXjEwLjAuM1wiLFxuICAgIFwibHVjaWRlLXJlYWN0XCI6IFwiXjAuMjk5LjBcIixcbiAgICBcIm1hdGNoLXNvcnRlclwiOiBcIl42LjMuMVwiLFxuICAgIFwibWVyZ2UtcmVmc1wiOiBcIl4xLjIuMlwiLFxuICAgIFwibmV4dC10aGVtZXNcIjogXCJeMC4yLjFcIixcbiAgICBcInJhbWJkYVwiOiBcIl44LjYuMFwiLFxuICAgIFwicmVhY3RcIjogXCJeMTguMi4wXCIsXG4gICAgXCJyZWFjdC1kYXktcGlja2VyXCI6IFwiXjguOS4xXCIsXG4gICAgXCJyZWFjdC1kb21cIjogXCJeMTguMi4wXCIsXG4gICAgXCJyZWFjdC1ob29rLWZvcm1cIjogXCJeNy40OS4yXCIsXG4gICAgXCJyZWFjdC1xci1jb2RlXCI6IFwiXjIuMC4xMlwiLFxuICAgIFwicmVhY3Qtcm91dGVyXCI6IFwiXjYuMjEuMFwiLFxuICAgIFwicmVhY3Qtcm91dGVyLWRvbVwiOiBcIl42LjIxLjBcIixcbiAgICBcInJlYWN0LXR3Y1wiOiBcIl4xLjAuMVwiLFxuICAgIFwicmVjaGFydHNcIjogXCJeMi4xMC4zXCIsXG4gICAgXCJzdXBlcmpzb25cIjogXCJeMi4yLjFcIixcbiAgICBcInRhaWx3aW5kLW1lcmdlXCI6IFwiXjIuMS4wXCIsXG4gICAgXCJ0YWlsd2luZGNzcy1hbmltYXRlXCI6IFwiXjEuMC43XCIsXG4gICAgXCJ3ZWJleHRlbnNpb24tcG9seWZpbGxcIjogXCJeMC4xMC4wXCIsXG4gICAgXCJ6b2RcIjogXCJeMy4yMi40XCIsXG4gICAgXCJ6dXN0YW5kXCI6IFwiXjQuNC43XCJcbiAgfSxcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQGNoaWFsYWIvZXNidWlsZC1wbHVnaW4tY29tbW9uanNcIjogXCJeMC4xNy4yXCIsXG4gICAgXCJAaHlyaW91cy9lc2J1aWxkLXBsdWdpbi1jb21tb25qc1wiOiBcIl4wLjIuMlwiLFxuICAgIFwiQGxhZGxlL3JlYWN0XCI6IFwiXjQuMC4yXCIsXG4gICAgXCJAcGFsbGFkeHl6L2NvbW1vblwiOiBcIl4xLjAuMFwiLFxuICAgIFwiQHN2Z3IvcGx1Z2luLWpzeFwiOiBcIl44LjAuMVwiLFxuICAgIFwiQHN2Z3Ivcm9sbHVwXCI6IFwiXjguMC4xXCIsXG4gICAgXCJAdGVzdGluZy1saWJyYXJ5L3JlYWN0XCI6IFwiXjE0LjEuMlwiLFxuICAgIFwiQHRycGMvc2VydmVyXCI6IFwiXjEwLjQ0LjFcIixcbiAgICBcIkB0c2NvbmZpZy9yZWNvbW1lbmRlZFwiOiBcIl4xLjAuM1wiLFxuICAgIFwiQHRzY29uZmlnL3ZpdGUtcmVhY3RcIjogXCJeMy4wLjBcIixcbiAgICBcIkB0eXBlcy9tb2NoYVwiOiBcIl4xMC4wLjZcIixcbiAgICBcIkB0eXBlcy9yZWFjdFwiOiBcIl4xOC4yLjQ1XCIsXG4gICAgXCJAdHlwZXMvcmVhY3QtZG9tXCI6IFwiXjE4LjIuMThcIixcbiAgICBcIkB0eXBlcy93ZWJleHRlbnNpb24tcG9seWZpbGxcIjogXCJeMC4xMC43XCIsXG4gICAgXCJlc2J1aWxkLXBsdWdpbi1wb2x5ZmlsbC1ub2RlXCI6IFwiXjAuMy4wXCIsXG4gICAgXCJlc2J1aWxkLXBsdWdpbi1zdmdyXCI6IFwiMi4wLjBcIixcbiAgICBcImdyYXBocWwtcmVxdWVzdFwiOiBcIl42LjEuMFwiLFxuICAgIFwibWluYS1zaWduZXJcIjogXCJeMi4xLjFcIixcbiAgICBcInN3clwiOiBcIl4yLjIuNFwiLFxuICAgIFwidml0ZVwiOiBcIl40LjUuMVwiLFxuICAgIFwidml0ZS1wbHVnaW4tbm9kZS1wb2x5ZmlsbHNcIjogXCJeMC4xNy4wXCIsXG4gICAgXCJ2aXRlLXBsdWdpbi1zdmdyXCI6IFwiXjMuMi4wXCIsXG4gICAgXCJ2aXRlLXBsdWdpbi10b3AtbGV2ZWwtYXdhaXRcIjogXCJeMS40LjFcIlxuICB9LFxuICBcInBlZXJEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQHR5cGVzL21vY2hhXCI6IFwiXjEwLjAuMVwiLFxuICAgIFwicmVhY3RcIjogXCJeMTguMi4wXCIsXG4gICAgXCJyZWFjdC1kb21cIjogXCJeMTguMi4wXCJcbiAgfVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFpVixTQUFTLHNCQUFzQjtBQUNoWCxPQUFPLFlBQVk7QUFDbkIsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsb0JBQW9COzs7QUNKN0I7QUFBQSxFQUNFLE1BQVE7QUFBQSxFQUNSLFNBQVc7QUFBQSxFQUNYLGFBQWU7QUFBQSxFQUNmLE1BQVE7QUFBQSxFQUNSLFFBQVU7QUFBQSxFQUNWLE9BQVM7QUFBQSxFQUNULFNBQVc7QUFBQSxJQUNULEtBQUs7QUFBQSxNQUNILE9BQVM7QUFBQSxNQUNULFNBQVc7QUFBQSxJQUNiO0FBQUEsSUFDQSxvQkFBb0I7QUFBQSxNQUNsQixRQUFVO0FBQUEsTUFDVixTQUFXO0FBQUEsSUFDYjtBQUFBLElBQ0Es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
