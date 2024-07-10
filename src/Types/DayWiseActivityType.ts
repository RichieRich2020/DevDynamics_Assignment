import ActivityDetail from "./ActivityDetailType"

type DayWiseActivity = {
  date: string
  data: {
    children: ActivityDetail[]
  }
}

export default DayWiseActivity
