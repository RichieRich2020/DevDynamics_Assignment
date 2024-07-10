import React, { useState } from "react"
import {
  Select,
  Space,
  Badge,
  List,
  Card,
  Divider,
  Typography,
  Avatar,
} from "antd"
import {
  UnorderedListOutlined,
  UserOutlined,
  DownOutlined,
  BellOutlined,
} from "@ant-design/icons"
import { Box } from "@mui/material"
import RankingChart from "./RankingChart"
import DoughnutChart from "./DoughnutChart"
import ChartComponent from "./ChartComponent"
import CombinedActivities from "../Types/CombinedActivities"
import DeveloperWorklogRow from "../Types/DeveloperWorklogRow"
import ContributionInfo from "../Types/ContributionInfo"
import MaxValues from "../Types/MaxValues"
import getFormattedDeveloperNames from "../utils/getFormattedDeveloperNames"
import { useActivityMeta } from "../Context/ActivityMetaContext"
import DeveloperTable from "./DeveloperTable"
const { Option } = Select

const weights = {
  Commits: 25,
  PR_Open: 15,
  PR_Merged: 25,
  PR_Reviewed: 2,
  PR_Comments: 15,
}
const { Text, Link } = Typography
const normalize = (value: number, max: number) => {
  if (max === 0) {
    return 0
  }
  return (value / max) * 100
}

const calculateScore = (developer: DeveloperWorklogRow, maxValues: any) => {
  let score = 0

  score +=
    normalize(
      Number(findActivityCount(developer, "Commits")),
      maxValues.Commits
    ) * weights.Commits
  score +=
    normalize(
      Number(findActivityCount(developer, "PR Open")),
      maxValues.PR_Open
    ) * weights.PR_Open
  score +=
    normalize(
      Number(findActivityCount(developer, "PR Merged")),
      maxValues.PR_Merged
    ) * weights.PR_Merged
  score +=
    normalize(
      Number(findActivityCount(developer, "PR Reviewed")),
      maxValues.PR_Reviewed
    ) * weights.PR_Reviewed
  score +=
    normalize(
      Number(findActivityCount(developer, "PR Comments")),
      maxValues.PR_Comments
    ) * weights.PR_Comments

  return score
}

function findActivityCount(
  developer: DeveloperWorklogRow,
  activityLabel: string
) {
  const activity = developer.totalActivity.find(
    (activity) => activity.name === activityLabel
  )
  return activity ? Number(activity.value) : 0
}
const combineDayWiseActivities = (data: ContributionInfo[]) => {
  const combinedData: CombinedActivities[] = []

  data.forEach((contribution) => {
    contribution.data.AuthorWorklog.rows.forEach((row) => {
      row.dayWiseActivity.forEach((day) => {
        const existingEntry = combinedData.find(
          (entry) => entry.date === day.date
        )

        if (existingEntry) {
          day.data.children.forEach((child) => {
            if (existingEntry.combinedData[child.label]) {
              existingEntry.combinedData[child.label] += parseInt(
                child.count,
                10
              )
            } else {
              existingEntry.combinedData[child.label] = parseInt(
                child.count,
                10
              )
            }
          })
        } else {
          const newDataEntry: CombinedActivities = {
            date: day.date,
            combinedData: {},
          }

          day.data.children.forEach((child: any) => {
            newDataEntry.combinedData[child.label] = parseInt(child.count, 10)
          })

          combinedData.push(newDataEntry)
        }
      })
    })
  })

  return combinedData
}

const combineDayWiseActivitiesForDeveloper = (
  developer: DeveloperWorklogRow
) => {
  const combinedData: CombinedActivities[] = []
  console.log(developer, "deveeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
  developer.dayWiseActivity.forEach((day) => {
    const existingEntry = combinedData.find((entry) => entry.date === day.date)

    if (existingEntry) {
      day.data.children.forEach((child) => {
        if (existingEntry.combinedData[child.label]) {
          existingEntry.combinedData[child.label] += parseInt(child.count, 10)
        } else {
          existingEntry.combinedData[child.label] = parseInt(child.count, 10)
        }
      })
    } else {
      const newDataEntry: CombinedActivities = {
        date: day.date,
        combinedData: {},
      }

      day.data.children.forEach((child) => {
        newDataEntry.combinedData[child.label] = parseInt(child.count, 10)
      })

      combinedData.push(newDataEntry)
    }
  })
  console.log(combinedData)

  return combinedData
}
interface DashboardProps {
  data: ContributionInfo[]
}
const DeveloperActivityDashboard: React.FC<DashboardProps> = ({ data }) => {
  const combinedActivities = combineDayWiseActivities(data)
  const [developerFilter, setDeveloperFilter] = useState("")

  const names = getFormattedDeveloperNames(data[0].data.AuthorWorklog.rows)

  const handleFilterChange = (value: any) => {
    setDeveloperFilter(value)
  }

  const filteredDevelopers = developerFilter
    ? data[0].data.AuthorWorklog.rows.filter((developer: DeveloperWorklogRow) =>
        developer.name.toLowerCase().includes(developerFilter.toLowerCase())
      )
    : data[0].data.AuthorWorklog.rows

  const maxValues: MaxValues = filteredDevelopers.reduce(
    (max: MaxValues, developer: DeveloperWorklogRow) => ({
      Commits: Math.max(max.Commits, findActivityCount(developer, "Commits")),
      PR_Open: Math.max(max.PR_Open, findActivityCount(developer, "PR Open")),
      PR_Merged: Math.max(
        max.PR_Merged,
        findActivityCount(developer, "PR Merged")
      ),
      PR_Reviewed: Math.max(
        max.PR_Reviewed,
        findActivityCount(developer, "PR Reviewed")
      ),
      PR_Comments: Math.max(
        max.PR_Comments,
        findActivityCount(developer, "PR Comments")
      ),
    }),
    {
      Commits: 0,
      PR_Open: 0,
      PR_Merged: 0,
      PR_Reviewed: 0,
      PR_Comments: 0,
    }
  )

  const totalValues = filteredDevelopers.reduce(
    (total: MaxValues, developer: DeveloperWorklogRow) => ({
      Commits: total.Commits + findActivityCount(developer, "Commits"),
      PR_Open: total.PR_Open + findActivityCount(developer, "PR Open"),
      PR_Merged: total.PR_Merged + findActivityCount(developer, "PR Merged"),
      PR_Reviewed:
        total.PR_Reviewed + findActivityCount(developer, "PR Reviewed"),
      PR_Comments:
        total.PR_Comments + findActivityCount(developer, "PR Comments"),
    }),
    {
      Commits: 0,
      PR_Open: 0,
      PR_Merged: 0,
      PR_Reviewed: 0,
      PR_Comments: 0,
    }
  )

  const Developerss = [...filteredDevelopers]
    .map((developer) => ({
      ...developer,
      score: calculateScore(developer, maxValues),
    }))
    .sort((a, b) => b.score - a.score)
  const rankedDevelopers = Developerss.slice(0, 5)

  console.log(
    filteredDevelopers.find((developer) => developer.name === developerFilter),
    "rankedDevelopers"
  )

  const filteredDeveloperData: CombinedActivities[] = developerFilter
    ? combineDayWiseActivitiesForDeveloper(
        filteredDevelopers.find(
          (developer) => developer.name === developerFilter
        ) as DeveloperWorklogRow
      )
    : combinedActivities
  const activityMetaaa = useActivityMeta()
  console.log(activityMetaaa, "activityMetaaa")
  const activityColors = {
    Commits: "#FAC76E",
    PR_Open: "#EF6B6B",
    PR_Merged: "#61CDBB",
    PR_Reviewed: "#C2528B",
    PR_Comments: "#0396A6",
  }
  return (
    <>
      <div
        style={{
          display: "flex",
          width: "100%",
          // height: "1000px",
          marginBottom: "230px",
        }}
      >
        <div
          style={{
            width: "40%",
            height: "300px",
            backgroundColor: "#f1f1f1",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingLeft: "10px",
              paddingRight: "10px",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                paddingLeft: "20px",
              }}
            >
              Overview
            </h2>
          </div>

          <Card
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                }}
              >
                <span>Total Values</span>
                <UnorderedListOutlined style={{ marginLeft: "10px" }} />
              </div>
            }
            bordered
            style={{
              width: "100%",
              maxWidth: "800px",
              margin: "auto",
              backgroundColor: "#f1f1f1",
            }}
          >
            <List
              dataSource={Object.keys(totalValues)}
              renderItem={(key) => (
                <List.Item
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 24px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "70%",
                    }}
                  >
                    <Badge
                      color={activityColors[key as keyof typeof activityColors]}
                      count={totalValues[key as keyof typeof totalValues]}
                      style={{ marginRight: "12px" }}
                    />
                    <Text strong>{key.replace(/_/g, " ")}</Text>
                  </div>
                  <div>{totalValues[key as keyof typeof totalValues]}</div>
                </List.Item>
              )}
            />

            {/* <Divider /> */}
          </Card>

          <Card
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                }}
              >
                <span>Analytics</span>
                <UnorderedListOutlined style={{ marginLeft: "10px" }} />
              </div>
            }
            bordered
            style={{
              width: "100%",
              maxWidth: "800px",
              margin: "auto",
              backgroundColor: "#f1f1f1",
              // marginTop: "24px", // Adjust margin top as needed
            }}
          >
            <List.Item>
              <DoughnutChart totalValue={totalValues} />
            </List.Item>
          </Card>
        </div>
        <div
          style={{
            // border: "2px solid black",
            width: "60%",
            textAlign: "center",
          }}
        >
          {/* <h2>Developer Activity Dashboard</h2> */}
          <Box>
            <div
              style={{
                // border: "2px solid black",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px",
                paddingLeft: "40px",
                paddingRight: "40px",
              }}
            >
              <Space wrap>
                <Select
                  placeholder="Select a developer"
                  style={{ width: 250, height: "50px" }}
                  onChange={handleFilterChange}
                  allowClear
                >
                  <Option value="">All Developers</Option>
                  {names.map((name, index) => (
                    <Option key={index} value={name}>
                      {name}
                    </Option>
                  ))}
                </Select>
              </Space>
              <div
                style={{
                  display: "flex",
                  width: "40%",
                  justifyContent: "end",
                  gap: "16px",
                }}
              >
                <BellOutlined />
                <Space size={16}>
                  <Avatar
                    style={{ backgroundColor: "#87d068" }}
                    icon={<UserOutlined />}
                  />
                  <Text strong>Developer name</Text>
                  <DownOutlined />
                </Space>
              </div>
            </div>
            <h2>Top 5 Developer</h2>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <RankingChart data={rankedDevelopers} />
            </Box>
          </Box>
          <h2>Daily Performance Metrics</h2>
          <ChartComponent combinedActivities={filteredDeveloperData} />
        </div>
      </div>
      <DeveloperTable data={Developerss} />
    </>
  )
}

export default DeveloperActivityDashboard
