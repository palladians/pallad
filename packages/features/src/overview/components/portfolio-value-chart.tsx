import { Area, AreaChart, ResponsiveContainer } from "recharts"

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
]

export const PortfolioValueChart = () => {
  return (
    <ResponsiveContainer width="100%" aspect={6}>
      <AreaChart
        width={300}
        height={100}
        data={data}
        margin={{ left: 0, top: 0, right: 0, bottom: 0 }}
      >
        <Area
          type="linear"
          dataKey="pv"
          stroke="#25233A"
          fill="#25233A"
          dot={false}
          fillOpacity={1}
          isAnimationActive={true}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
