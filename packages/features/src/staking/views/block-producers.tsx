import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { ViewHeading } from "@/components/view-heading"

import { BlockProducerTile } from "../components/block-producer-tile"

type BlockProducer = {
  name: string
  publicKey: string
  stake: number
  delegatorsCount: number
}

type BlockProducersViewProps = {
  onGoBack: () => void
  blockProducers: BlockProducer[]
}

export const BlockProducersView = ({
  onGoBack,
  blockProducers,
}: BlockProducersViewProps) => {
  return (
    <AppLayout>
      <div className="flex flex-col flex-1 gap-4">
        <ViewHeading
          title="Find Producers"
          backButton={{ onClick: onGoBack }}
        />
        <div className="flex flex-col gap-3">
          {blockProducers.map((producer, i) => (
            // biome-ignore lint: hardcoded for now
            <BlockProducerTile key={i} producer={producer} />
          ))}
          <Button variant="link">Add Your Pool</Button>
        </div>
      </div>
    </AppLayout>
  )
}
