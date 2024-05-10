import { type Story, type StoryDefault, action } from "@ladle/react"

import { DelegateView } from "./delegate"

export const View: Story<{ advanced: boolean }> = ({ advanced }) => (
  <DelegateView
    onGoBack={() => console.log("go back")}
    advanced={advanced}
    setAdvanced={action("Toggle Advanced")}
  />
)

export default {
  title: "Staking / Delegate",
  args: {
    advanced: false,
  },
} satisfies StoryDefault
