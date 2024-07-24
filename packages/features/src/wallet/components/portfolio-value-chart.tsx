import DotIcon from "@/common/assets/dot.svg?react"
import { useEffect } from "react"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  type TooltipProps,
} from "recharts"

type CustomTooltipProps = TooltipProps<any, any> & {
  lastMonthPrices: [number, number][]
  currentPriceIndex: number | undefined
  setCurrentPriceIndex: (currentPriceIndex: number | undefined) => void
}

const CustomTooltip = ({
  payload,
  lastMonthPrices,
  setCurrentPriceIndex,
  currentPriceIndex,
}: CustomTooltipProps) => {
  const timestamp = payload?.[0]?.payload?.[0]
  const index = lastMonthPrices.findIndex((price) => price[0] === timestamp)
  // biome-ignore lint/correctness/useExhaustiveDependencies: just these props should rerender
  useEffect(() => {
    if ((payload ?? []).length === 0) {
      if (typeof currentPriceIndex === "undefined") return
      setCurrentPriceIndex(undefined)
      return
    }
    if (currentPriceIndex === index) return
    if (index === -1) {
      setCurrentPriceIndex(undefined)
      return
    }
    setCurrentPriceIndex(index)
  }, [currentPriceIndex, index])
  return null
}

type PortfolioValueChart = {
  lastMonthPrices: [number, number][]
  setCurrentPriceIndex: (currentPriceIndex: number | undefined) => void
  currentPriceIndex: number | undefined
}

export const PortfolioValueChart = ({
  lastMonthPrices,
  setCurrentPriceIndex,
  currentPriceIndex,
}: PortfolioValueChart) => {
  return (
    <ResponsiveContainer width="100%" aspect={6} maxHeight={53}>
      <AreaChart
        width={300}
        height={100}
        data={lastMonthPrices}
        margin={{ left: 0, top: 0, right: 0, bottom: 0 }}
      >
        <Area
          type="linear"
          dataKey={1}
          stroke="#25233A"
          fill="#25233A"
          fillOpacity={1}
          isAnimationActive={true}
          activeDot={({ cx, cy }) => <DotIcon x={cx - 12} y={cy - 12} />}
        />
        <Tooltip
          cursor={false}
          content={(props) => (
            <CustomTooltip
              lastMonthPrices={lastMonthPrices}
              setCurrentPriceIndex={setCurrentPriceIndex}
              currentPriceIndex={currentPriceIndex}
              {...props}
            />
          )}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
