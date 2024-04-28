import { action } from "@ladle/react"
import type { StoryDefault } from "@ladle/react"

import { SeedBackupSecurityView } from "./seed-backup-security"

export const View = () => {
  return <SeedBackupSecurityView onConfirm={action("Security confirmed")} />
}

export default {
  title: "Onboarding / Seed Backup Security",
} satisfies StoryDefault
