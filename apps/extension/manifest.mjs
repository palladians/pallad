import { writeJsonFile } from "write-json-file"
import packageJson from "./package.json" with { type: "json" }

const manifest = {
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
      matches: ["https://*/*"],
      js: ["src/inject/index.ts"],
      run_at: "document_start",
      all_frames: true,
    },
  ],
  web_accessible_resources: [
    {
      resources: ["pallad_rpc.js"],
      matches: ["https://*/*"],
    },
  ],
  host_permissions: ["https://*/*"],
}

const run = async () => {
  await writeJsonFile("manifest.json", manifest)
}

run()
