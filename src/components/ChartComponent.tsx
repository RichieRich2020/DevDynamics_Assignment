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
import Paper from "@mui/material/Paper"
import CombinedActivities from "../Types/CombinedActivities"
import { useActivityMeta } from "../Context/ActivityMetaContext"

interface ActivityMeta {
  label: string
  fillColor: string
}

interface ChartComponentProps {
  combinedActivities: CombinedActivities[]
}

const ChartComponent: React.FC<ChartComponentProps> = ({
  combinedActivities,
}) => {
  // Get activityMeta from context
  const activityMeta = useActivityMeta()

  // Check if activityMeta is undefined
  if (!activityMeta) {
    // Render fallback UI or return null
    return null // You can render a loading state or a message here
  }

  // Prepare data for recharts LineChart
  const lineChartData = combinedActivities.map((activity) => ({
    date: activity.date,
    ...activity.combinedData,
  }))

  console.log(activityMeta, "activityMeta")
  console.log(lineChartData, "lineChartData")

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
      {/* Recharts Line Chart */}
      <div style={{ width: "100%" }}>
        {/* <h4>Recharts Line Chart</h4> */}
        <ResponsiveContainer width="100%" height={300}>
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
