import Activity from "./ActivityType"
import DayWiseActivity from "./DayWiseActivityType"

type SimulateData = {
  score: number
  name: string
  totalActivity: Activity[]
  dayWiseActivity: DayWiseActivity[]
  activeDays: {
    days: number
    isBurnOut: boolean
    insight: string[]
  }
}

export default SimulateData

// import React from "react"
// import logo from "./logo.svg"
// import "./App.css"
// import DeveloperActivityDashboard from "./components/DeveloperActivityDashboard"
// import data from "./data"
// import getActivityMetaFromContributionInfo from "./utils/getActivityMetaFromContributionInfo"
// import { ActivityMetaProvider } from "./Context/ActivityMetaContext"

// function App() {
//   const ActivityMetaa = getActivityMetaFromContributionInfo(data)

//   console.log(ActivityMetaa, "hhhhhhhhhhhhhhhhhhhh")
//   return (
//     <div className="App">
//       <ActivityMetaProvider value={ActivityMetaa}>
//         <DeveloperActivityDashboard data={data} />
//       </ActivityMetaProvider>
//     </div>
//   )
// }

// export default App
