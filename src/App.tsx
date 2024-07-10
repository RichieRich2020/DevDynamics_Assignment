import DeveloperActivityDashboard from "./Components/DeveloperActivityDashboard"
import data from "./data"
import getActivityMetaFromContributionInfo from "./utils/getActivityMetaFromContributionInfo"

import React, { useState } from "react"
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  BarChartOutlined,
  UserOutlined,
  FileTextOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons"
import { Button, Layout, Menu, theme, Typography } from "antd"
import { ActivityMetaProvider } from "./Context/ActivityMetaContext"
import ActivityMeta from "./Types/ActivityMetaType"

const { Header, Sider, Content } = Layout
const { Text } = Typography

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const ActivityMeta: ActivityMeta[] = getActivityMetaFromContributionInfo(data)
  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ backgroundColor: "#ffffff" }}
      >
        <div
          className="logo-container"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px 0",
            textAlign: "center",
          }}
        >
          <img
            alt=""
            src="https://cdn.prod.website-files.com/642535c7875ea6e60927dd49/65cb115f23533388f1d0b7e2_DevDynamics_Logo.svg"
            style={{
              padding: "10px",
              width: "80%",
            }}
          />
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          style={{
            backgroundColor: "#ffffff",
            color: "#1e201f",
          }}
          items={[
            {
              key: "1",
              icon: <UserOutlined />,
              label: <Text strong>Overview</Text>,
            },
            {
              key: "2",
              icon: <BarChartOutlined />,
              label: <Text strong>Growth Report</Text>,
            },
            {
              key: "3",
              icon: <FileTextOutlined />,
              label: <Text strong> Report</Text>,
            },
            {
              key: "4",
              icon: <CustomerServiceOutlined />,
              label: <Text strong>Support</Text>,
            },
            {
              key: "5",
              icon: <SettingOutlined />,
              label: <Text strong>Setting</Text>,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Content
          style={{
            margin: "0px 10px",
            padding: 15,
            minHeight: 280,
            background: colorBgContainer,
            // borderRadius: borderRadiusLG,
          }}
        >
          <ActivityMetaProvider value={ActivityMeta}>
            <DeveloperActivityDashboard data={data} />
          </ActivityMetaProvider>
        </Content>
      </Layout>
    </Layout>
  )
}

export default App
