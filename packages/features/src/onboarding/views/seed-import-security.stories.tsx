import { action } from "@ladle/react"
import type { StoryDefault } from "@ladle/react"

import { SeedImportSecurityView } from "./seed-import-security"

export const View = () => {
  return <SeedImportSecurityView onConfirm={action("Security confirmed")} />
}

export default {
  title: "Onboarding / Seed Import Security",
} satisfies StoryDefault
