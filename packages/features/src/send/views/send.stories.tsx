import { action } from "@ladle/react"
import type { Story, StoryDefault } from "@ladle/react"

import { SendView } from "./send"

export const View: Story<{ advanced: boolean }> = ({ advanced }) => (
  <SendView
    onGoBack={action("Go Back")}
    balance={300000000000}
    fiatPrice={1.5}
    advanced={advanced}
    setAdvanced={action("Set Advanced")}
  />
)

export default {
  title: "Send / Start",
  args: {
    advanced: true,
  },
} satisfies StoryDefault
