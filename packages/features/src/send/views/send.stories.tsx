import type { StoryDefault } from "@ladle/react"

import { SendView } from "./send"

export const View = () => <SendView onGoBack={() => console.log("go back")} />

export default {
  title: "Send / Start",
} satisfies StoryDefault
