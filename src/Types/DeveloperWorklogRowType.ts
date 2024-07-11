import Activity from "./ActivityType"
import DayWiseActivity from "./DayWiseActivityType"

type DeveloperWorklogRow = {
  name: string
  score?: number
  totalActivity: Activity[]
  dayWiseActivity: DayWiseActivity[]
  activeDays: {
    days: number
    isBurnOut: boolean
    insight: string[]
  }
}

export default DeveloperWorklogRow
