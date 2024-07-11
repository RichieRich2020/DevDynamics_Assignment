import React from "react"
import { Table, Tag, Avatar } from "antd"
import { UserOutlined } from "@ant-design/icons"

import { useActivityMeta } from "../Context/ActivityMetaContext"

import { getFormattedDeveloperName } from "../utils/getFormattedDeveloperNames"
import DeveloperWorklogRow from "../Types/DeveloperWorklogRowType"
import ActivityMeta from "../Types/ActivityMetaType"

interface DeveloperTableProps {
  data: DeveloperWorklogRow[]
}

const DeveloperTable: React.FC<DeveloperTableProps> = ({ data }) => {
  const activityMeta: ActivityMeta[] = useActivityMeta() || [] // Provide a default empty array

  const getActivityColor = (activityName: string) => {
    const activity = activityMeta.find((meta) => meta.label === activityName)
    return activity ? activity.fillColor : "#CCCCCC"
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name: string) => (
        <span>
          <Avatar
            style={{ backgroundColor: "#87d068", marginRight: 8 }}
            icon={<UserOutlined />}
          />
          {name}
        </span>
      ),
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
      render: (score: number) => <span>{score.toFixed(2)}</span>, // Render score with 2 decimal places
    },
    ...activityMeta.map((activity) => ({
      title: activity.label,
      dataIndex: activity.label,
      key: activity.label,
      render: (value: number) => (
        <Tag color={getActivityColor(activity.label)}>{value}</Tag>
      ),
    })),
  ]

  const dataSource = data.map((developer, index) => {
    const activityData = activityMeta.reduce((acc, activity) => {
      acc[activity.label] = parseInt(
        developer.totalActivity.find((item) => item.name === activity.label)
          ?.value || "0",
        10
      )
      return acc
    }, {} as { [key: string]: number })

    return {
      key: index,
      name: getFormattedDeveloperName(developer.name),
      score: Math.floor((developer.score || 0) / 100),
      ...activityData,
    }
  })

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      pagination={{ pageSize: 6 }}
    />
  )
}

export default DeveloperTable
