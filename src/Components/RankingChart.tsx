import React from "react"
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts"

import { useActivityMeta } from "../Context/ActivityMetaContext"

import SimulateData from "../Types/SimulateDataType"

interface RankingChartProps {
  data: SimulateData[]
}

const RankingChart: React.FC<RankingChartProps> = ({ data }) => {
  const activityMeta = useActivityMeta()

  const chartData = data.map((developer: SimulateData, index: number) => {
    let username =
      developer.name.split("@")[0].charAt(0).toUpperCase() +
      developer.name.split("@")[0].slice(1)
    username = username.replace(".", " ")
    // [RANK=${index + 1}]
    const rankLabel = data.length === 1 ? "" : `[RANK=${index + 1}]`
    const chartObj: {
      name: string
      ranking: number
      [key: string]: number | string
    } = {
      name: `${username.trim()} ${rankLabel}`,
      ranking: index + 1,
    }
    if (data.length > 1) {
      chartObj.score = Math.floor(developer.score / 100)
    }

    developer.totalActivity.forEach((activity) => {
      chartObj[activity.name] = parseInt(activity.value, 10)
    })

    return chartObj
  })

  return (
    <ComposedChart
      width={Math.min(800, window.innerWidth - 50)}
      height={400}
      data={chartData}
      margin={{ right: 40, bottom: 20 }}
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

export default RankingChart
