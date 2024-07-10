import * as echarts from "echarts"
import { useEffect } from "react"
import { useActivityMeta } from "../Context/ActivityMetaContext"
import MaxValues from "../Types/MaxValues"
import ActivityMeta from "../Types/ActivityMeta"

interface DoughnutChartProps {
  totalValue: {
    Commits: number
    PR_Comments: number
    PR_Merged: number
    PR_Open: number
    PR_Reviewed: number
  }
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ totalValue }) => {
  const activityMeta = useActivityMeta() || [] // Ensure activityMeta is defined as an empty array if undefined

  // Example data for the Doughnut chart
  const generateChartData = (
    totalValue: MaxValues,
    activityMeta: ActivityMeta[]
  ) => {
    const data = activityMeta.map((meta) => ({
      value: totalValue[meta.label.replace(/ /g, "_") as keyof MaxValues] || 0,
      name: meta.label,
    }))

    return data
  }

  const chartData = generateChartData(totalValue, activityMeta)

  // Initialize ECharts instance
  useEffect(() => {
    const chartDom = document.getElementById("main")
    if (!chartDom) return

    const myChart = echarts.init(chartDom)

    // Chart options
    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: "item",
      },
      legend: {
        top: "5%",
        left: "center",
      },
      series: [
        {
          name: "Activity Summary",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10, // Rounded corners
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 50,

              fontWeight: "bold",
            },
          },
          labelLine: {
            show: true,
          },
          data: chartData.map((item) => ({
            value: item.value,
            name: item.name,
          })),
        },
      ],
    }

    // Set chart options
    option && myChart.setOption(option)

    // Clean up ECharts instance
    return () => {
      myChart.dispose()
    }
  }, [totalValue, activityMeta]) // Re-render chart when totalValue or activityMeta changes

  return <div id="main" style={{ width: "100%", height: "600px" }}></div>
}

export default DoughnutChart
