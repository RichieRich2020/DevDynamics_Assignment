import ActivityDetail from "./ActivityDetail"

type DayWiseActivity = {
  date: string
  data: {
    children: ActivityDetail[]
  }
}

export default DayWiseActivity
