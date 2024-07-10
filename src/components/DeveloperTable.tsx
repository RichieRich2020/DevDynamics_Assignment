import React from "react"
import { Table, Tag, Avatar } from "antd"
import { UserOutlined } from "@ant-design/icons"
import SimulateData from "../Types/SimulateDataType"
import { useActivityMeta } from "../Context/ActivityMetaContext"

interface DeveloperTableProps {
  data: SimulateData[]
}

const DeveloperTable: React.FC<DeveloperTableProps> = ({ data }) => {
  const activityMeta = useActivityMeta() // Assuming this provides color information

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
      render: (score: number) => <span>{score.toFixed(2)}</span>,
    },
    {
      title: "PR Open",
      dataIndex: "PR_Open",
      key: "PR_Open",
      render: (PR_Open: number) => (
        <Tag color={getActivityColor("PR Open")}>{PR_Open}</Tag>
      ),
    },
    {
      title: "PR Merged",
      dataIndex: "PR_Merged",
      key: "PR_Merged",
      render: (PR_Merged: number) => (
        <Tag color={getActivityColor("PR Merged")}>{PR_Merged}</Tag>
      ),
    },
    {
      title: "Commits",
      dataIndex: "Commits",
      key: "Commits",
      render: (Commits: number) => (
        <Tag color={getActivityColor("Commits")}>{Commits}</Tag>
      ),
    },
    {
      title: "PR Reviewed",
      dataIndex: "PR_Reviewed",
      key: "PR_Reviewed",
      render: (PR_Reviewed: number) => (
        <Tag color={getActivityColor("PR Reviewed")}>{PR_Reviewed}</Tag>
      ),
    },
    {
      title: "PR Comments",
      dataIndex: "PR_Comments",
      key: "PR_Comments",
      render: (PR_Comments: number) => (
        <Tag color={getActivityColor("PR Comments")}>{PR_Comments}</Tag>
      ),
    },
  ]

  // Function to get color from ActivityMeta based on activity name
  const getActivityColor = (activityName: string) => {
    const activity =
      activityMeta && activityMeta.find((meta) => meta.label === activityName)
    return activity ? activity.fillColor : "#CCCCCC" // Default color if not found
  }

  // Transforming data to match column keys and applying color codes
  const dataSource = data.map((developer, index) => ({
    key: index,
    avatar: (
      <Avatar style={{ backgroundColor: "#87d068" }} icon={<UserOutlined />} />
    ),
    name: developer.name,
    score: parseFloat(developer.score.toFixed(2)), // Show score up to starting 2 digits
    PR_Open: parseInt(
      developer.totalActivity.find((item) => item.name === "PR Open")?.value ||
        "0",
      10
    ),
    PR_Merged: parseInt(
      developer.totalActivity.find((item) => item.name === "PR Merged")
        ?.value || "0",
      10
    ),
    Commits: parseInt(
      developer.totalActivity.find((item) => item.name === "Commits")?.value ||
        "0",
      10
    ),
    PR_Reviewed: parseInt(
      developer.totalActivity.find((item) => item.name === "PR Reviewed")
        ?.value || "0",
      10
    ),
    PR_Comments: parseInt(
      developer.totalActivity.find((item) => item.name === "PR Comments")
        ?.value || "0",
      10
    ),
  }))

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      pagination={{ pageSize: 6 }}
    />
  )
}

export default DeveloperTable
