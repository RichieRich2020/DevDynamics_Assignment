import React from "react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts"
import CombinedActivities from "../Types/CombinedActivitiesType"
import { useActivityMeta } from "../Context/ActivityMetaContext"

interface ChartComponentProps {
  combinedActivities: CombinedActivities[]
}

const ChartComponent: React.FC<ChartComponentProps> = ({
  combinedActivities,
}) => {
  const activityMeta = useActivityMeta()

  if (!activityMeta) {
    return null
  }

  const lineChartData = combinedActivities.map((activity) => ({
    date: activity.date,
    ...activity.combinedData,
  }))

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
      }}
    >
      {/* <Paper
        elevation={3}
        sx={{
          width: "90%",
          padding: "20px", // Example padding
          marginBottom: "20px", // Example margin bottom
          // Add any other styles as needed
        }}
      > */}
      <div style={{ width: "100%" }}>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={lineChartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {activityMeta.map((meta) => (
              <Line
                key={meta.label}
                type="monotone"
                dataKey={meta.label}
                stroke={meta.fillColor}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* </Paper> */}
    </div>
  )
}

export default ChartComponent
