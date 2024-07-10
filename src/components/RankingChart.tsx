import React from "react"
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import SimulateData from "../Types/SimulateData"
import { useActivityMeta } from "../Context/ActivityMetaContext"

interface RankingChartProps {
  data: SimulateData[]
}

const RankingChart: React.FC<RankingChartProps> = ({ data }) => {
  const activityMeta = useActivityMeta() // Using activityMeta from context

  // Prepare data for the chart
  const chartData = data.map((developer: SimulateData, index: number) => {
    // Extracting the username before '@' symbol and capitalizing first letter
    let username =
      developer.name.split("@")[0].charAt(0).toUpperCase() +
      developer.name.split("@")[0].slice(1)
    username = username.replace(".", " ")
    // [RANK=${index + 1}]
    const rankLabel = data.length === 1 ? "" : `[RANK=${index + 1}]`
    const chartObj: {
      name: string
      ranking: number
      [key: string]: number | string // Index signature for dynamic keys
    } = {
      name: `${username.trim()} ${rankLabel}`, // Format name with ranking
      ranking: index + 1, // Ranking starting from 1 (1st, 2nd, 3rd, ...)
    }

    // Only include score if there are multiple developers
    if (data.length > 1) {
      chartObj.score = developer.score / 100
    }

    developer.totalActivity.forEach((activity) => {
      chartObj[activity.name] = parseInt(activity.value, 10)
    })

    return chartObj
  })
  console.log(chartData, "chartData")
  return (
    <ComposedChart
      width={Math.min(800, window.innerWidth - 50)} // Adjust dynamically based on available width
      height={400} // Set fixed height or adjust dynamically
      data={chartData}
      margin={{ right: 40, bottom: 20 }} // Adjust margins as needed
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="name"
        tick={{
          fontSize: 14,
          fontWeight: "bold",
          textAnchor: "middle",
        }}
        tickFormatter={(value) =>
          data.length === 1 ? value.split("[RANK=")[0] : value
        }
      />
      <YAxis />
      <Tooltip />
      <Legend />
      {data.length > 1 && <Bar dataKey="score" fill="#8884d8" />}
      {activityMeta &&
        activityMeta.map((meta) => (
          <Bar key={meta.label} dataKey={meta.label} fill={meta.fillColor} />
        ))}
    </ComposedChart>
  )
}

// Custom tooltip component to conditionally render 'score'
const CustomTooltip = ({ active, payload, label, includeScore }: any) => {
  if (active && payload && payload.length && includeScore) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${label}`}</p>
        <p className="intro">{`Score: ${payload[0].value}`}</p>
      </div>
    )
  }

  return null
}

export default RankingChart
