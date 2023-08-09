import { Pie, PieChart, ResponsiveContainer } from 'recharts'
import colors from 'tailwindcss/colors' // eslint-disable-line

interface EpochProgressChartProps {
  progress: number
}

export const EpochProgressChart = ({ progress }: EpochProgressChartProps) => {
  const START_ANGLE = 90
  const MAX_ANGLE = 360
  const data = [
    {
      progress: 1,
      fill: colors.sky['500']
    }
  ]
  return (
    <ResponsiveContainer height={32} width={32}>
      <PieChart>
        <Pie
          data={data}
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={16}
          innerRadius={12}
          startAngle={START_ANGLE}
          endAngle={progress * MAX_ANGLE + START_ANGLE}
          fill="#8884d8"
          dataKey="progress"
          stroke="none"
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
