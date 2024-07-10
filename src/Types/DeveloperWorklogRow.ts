import Activity from "./Activity"
import DayWiseActivity from "./DayWiseActivity"

type DeveloperWorklogRow = {
  name: string
  totalActivity: Activity[]
  dayWiseActivity: DayWiseActivity[]
  activeDays: {
    days: number
    isBurnOut: boolean
    insight: string[]
  }
}

export default DeveloperWorklogRow
