import type { StoryDefault } from "@ladle/react/typings-for-build/app/exports"

import { BlockProducersView } from "./block-producers"

export const View = () => (
  <BlockProducersView
    blockProducers={[
      { name: "Test", delegatorsCount: 5, publicKey: "B62Test", stake: 442 },
    ]}
    onGoBack={() => console.log("go back")}
  />
)

export default {
  title: "Dashboard / Staking / Producers",
} satisfies StoryDefault
