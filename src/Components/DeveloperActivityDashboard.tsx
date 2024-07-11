import React, { useState, useMemo } from "react"
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

import {
  getFormattedDeveloperNames,
  getFormattedDeveloperName,
} from "../utils/getFormattedDeveloperNames"
import combineDayWiseActivities from "../utils/combineDayWiseActivities"
import combineDayWiseActivitiesForDeveloper from "../utils/combineDayWiseActivitiesForDeveloper"
import calculateScore from "../utils/calculateScore"
import findActivityCount from "../utils/findActivityCount"
import Parameters from "../Types/ParametersType"

interface DashboardProps {
  data: ContributionInfo[]
}

const { Option } = Select

const { Text, Link } = Typography

const DeveloperActivityDashboard: React.FC<DashboardProps> = ({ data }) => {
  const combinedActivities = useMemo(
    () => combineDayWiseActivities(data),
    [data]
  )
  const [developerFilter, setDeveloperFilter] = useState("")
  const activityMeta = useActivityMeta() || []

  const names = useMemo(
    () => getFormattedDeveloperNames(data[0].data.AuthorWorklog.rows),
    [data]
  )

  const handleFilterChange = (value: any) => {
    setDeveloperFilter(value)
  }

  const filteredDevelopers = useMemo(() => {
    return developerFilter
      ? data[0].data.AuthorWorklog.rows.filter(
          (developer: DeveloperWorklogRow) =>
            getFormattedDeveloperName(developer.name)
              .toLowerCase()
              .includes(developerFilter.toLowerCase())
        )
      : data[0].data.AuthorWorklog.rows
  }, [developerFilter, data])

  const maxValues: Parameters = useMemo(() => {
    return filteredDevelopers.reduce(
      (max: Parameters, developer: DeveloperWorklogRow) => {
        activityMeta.forEach((activity) => {
          const activityName = activity.label.replace(
            " ",
            "_"
          ) as keyof Parameters
          max[activityName] = Math.max(
            max[activityName] || 0,
            findActivityCount(developer, activity.label)
          )
        })
        return max
      },
      {} as Parameters
    )
  }, [filteredDevelopers, activityMeta])

  const totalValues = useMemo(() => {
    return filteredDevelopers.reduce(
      (total: Parameters, developer: DeveloperWorklogRow) => {
        activityMeta.forEach((activity) => {
          const activityName = activity.label.replace(
            " ",
            "_"
          ) as keyof Parameters
          total[activityName] =
            (total[activityName] || 0) +
            findActivityCount(developer, activity.label)
        })
        return total
      },
      {} as Parameters
    )
  }, [filteredDevelopers, activityMeta])

  const Developerss = useMemo(() => {
    return [...filteredDevelopers]
      .map((developer) => ({
        ...developer,
        score: calculateScore(developer, maxValues),
      }))
      .sort((a, b) => b.score - a.score)
  }, [filteredDevelopers, maxValues])

  const rankedDevelopers = useMemo(() => Developerss.slice(0, 5), [Developerss])

  const filteredDeveloperData: CombinedActivities[] = useMemo(() => {
    return developerFilter
      ? combineDayWiseActivitiesForDeveloper(
          filteredDevelopers.find((developer) => {
            return getFormattedDeveloperName(developer.name) === developerFilter
          }) as DeveloperWorklogRow
        )
      : combinedActivities
  }, [developerFilter, filteredDevelopers, combinedActivities])

  const activityColors: any = useMemo(() => {
    const colors: any = {}
    activityMeta.forEach((meta) => {
      colors[meta.label.replace(" ", "_")] = meta.fillColor
    })
    return colors
  }, [activityMeta])

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
                {developerFilter == "" ? (
                  <span>Team Activity </span>
                ) : (
                  <span>Activity</span>
                )}

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
              <h2>Top 5 Developers</h2>
            ) : (
              <h2>Performances</h2>
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
            <h2>Daily Performances Metrics Of Team</h2>
          ) : (
            <h2>Daily Performances Metrics</h2>
          )}
          <ChartComponent combinedActivities={filteredDeveloperData} />
        </div>
      </div>
      <DeveloperTable data={Developerss} />
    </>
  )
}

export default DeveloperActivityDashboard
