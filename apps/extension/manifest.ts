import packageJson from "./package.json" with { type: "json" }

const isDevMode = process.env.VITE_APP_DEV_MODE === "true"
const rpcMatches = ["https://*/*", ...(isDevMode ? ["http://*/*"] : [])]

export const manifest: chrome.runtime.ManifestV3 = {
  manifest_version: 3,
  name: "Pallad",
  description:
    "Discover the Future of Web3 with Pallad. Unlock the power of the world's lightest blockchain 🪶",
  icons: {
    16: "icons/16.png",
    32: "icons/32.png",
    48: "icons/48.png",
    128: "icons/128.png",
  },
  version: packageJson.version,
  action: { default_title: "Click to open panel" },
  side_panel: { default_path: "index.html" },
  permissions: ["storage", "activeTab", "background", "sidePanel"],
  background: {
    service_worker: "src/background/index.ts",
    type: "module",
  },
  content_scripts: [
    {
      matches: rpcMatches,
      js: ["src/inject/index.ts"],
      run_at: "document_start",
      all_frames: true,
    },
  ],
  web_accessible_resources: [
    {
      resources: ["rpc.js"],
      matches: rpcMatches,
    },
  ],
  host_permissions: ["https://*/*"],
  commands: {
    _execute_action: {
      suggested_key: {
        windows: "Alt+Shift+P",
        mac: "Alt+Shift+P",
        chromeos: "Alt+Shift+P",
        linux: "Alt+Shift+P",
      },
      description: "Open the Pallad extension",
    },
  },
}
