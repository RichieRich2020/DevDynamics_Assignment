import React, { useState } from "react"
import { Select, Space, Badge, List, Card, Typography, Avatar } from "antd"
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
import DeveloperTable from "./DeveloperTable"

import { useActivityMeta } from "../Context/ActivityMetaContext"

import CombinedActivities from "../Types/CombinedActivitiesType"
import DeveloperWorklogRow from "../Types/DeveloperWorklogRowType"
import ContributionInfo from "../Types/ContributionInfoType"
import MaxValues from "../Types/MaxValuesType"

import {
  getFormattedDeveloperNames,
  getFormattedDeveloperName,
} from "../utils/getFormattedDeveloperNames"
import combineDayWiseActivities from "../utils/combineDayWiseActivities"
import combineDayWiseActivitiesForDeveloper from "../utils/combineDayWiseActivitiesForDeveloper"
import calculateScore from "../utils/calculateScore"
import findActivityCount from "../utils/findActivityCount"

interface DashboardProps {
  data: ContributionInfo[]
}

const { Option } = Select

const { Text, Link } = Typography

const DeveloperActivityDashboard: React.FC<DashboardProps> = ({ data }) => {
  const combinedActivities = combineDayWiseActivities(data)
  const [developerFilter, setDeveloperFilter] = useState("")
  const activityMetaaa = useActivityMeta()

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

  const filteredDeveloperData: CombinedActivities[] = developerFilter
    ? combineDayWiseActivitiesForDeveloper(
        filteredDevelopers.find((developer) => {
          return getFormattedDeveloperName(developer.name) === developerFilter
        }) as DeveloperWorklogRow
      )
    : combinedActivities

  console.log(developerFilter, "filteredDeveloperData")
  const activityColors: any = {}
  activityMetaaa?.forEach((meta) => {
    activityColors[meta.label.replace(" ", "_")] = meta.fillColor
  })
  return (
    <>
      <div
        style={{
          display: "flex",
          width: "100%",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            width: "40%",
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
            }}
          >
            <List.Item>
              <DoughnutChart totalValue={totalValues} />
            </List.Item>
          </Card>
        </div>
        <div
          style={{
            width: "60%",
            textAlign: "center",
            borderBottom: "1px solid #f1f1f1",
            borderRight: "1px solid #f1f1f1",
          }}
        >
          <Box>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px",
                paddingLeft: "40px",
                paddingRight: "40px",
                borderBottom: "1px solid #f1f1f1",
                borderTop: "1px solid #f1f1f1",
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
            {developerFilter == "" ? (
              <h2>Top 5 Developes</h2>
            ) : (
              <h2>Performnaces</h2>
            )}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "100px",
              }}
            >
              <RankingChart data={rankedDevelopers} />
            </Box>
          </Box>
          {developerFilter == "" ? (
            <h2>Daily Performance Metrics Of Team</h2>
          ) : (
            <h2>Daily Performance Metrics</h2>
          )}
          <ChartComponent combinedActivities={filteredDeveloperData} />
        </div>
      </div>
      <DeveloperTable data={Developerss} />
    </>
  )
}

export default DeveloperActivityDashboard
