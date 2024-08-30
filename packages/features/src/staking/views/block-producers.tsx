import { AppLayout } from "@/components/app-layout"
import { useTranslation } from "react-i18next"

import { MenuBar } from "@/components/menu-bar"
import arrayShuffle from "array-shuffle"
import { take } from "rambda"
import { BlockProducerTile } from "../components/block-producer-tile"
import type { BlockProducer } from "../types"

type BlockProducersViewProps = {
  onGoBack: () => void
  blockProducers: BlockProducer[]
}

export const BlockProducersView = ({
  onGoBack,
  blockProducers,
}: BlockProducersViewProps) => {
  const randomTwentyProducers = arrayShuffle(take(20, blockProducers))
  const { t } = useTranslation()
  return (
    <AppLayout>
      <MenuBar variant="back" onBackClicked={onGoBack} />
      <div className="flex flex-col gap-3 px-8 pb-8">
        <h1 className="text-3xl w-full">{t("select-validator")}</h1>
        {randomTwentyProducers.map((producer) => (
          <BlockProducerTile key={producer.pk} producer={producer} />
        ))}
      </div>
    </AppLayout>
  )
}
