import { ChokidarWatcher, defineConfig } from "turbowatch"

export default defineConfig({
  project: __dirname,
  Watcher: ChokidarWatcher,
  triggers: [
    {
      expression: [
        "allof",
        ["not", ["dirname", "node_modules"]],
        ["match", "*.ts", "basename"],
      ],
      name: "build",
      onChange: async ({ spawn }) => {
        await spawn`bun run build:extension`
      },
    },
  ],
})
