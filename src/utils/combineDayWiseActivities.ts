import CombinedActivities from "../Types/CombinedActivitiesType"
import ContributionInfo from "../Types/ContributionInfoType"
import DeveloperWorklogRow from "../Types/DeveloperWorklogRowType"

const combineDayWiseActivities = (data: ContributionInfo[]) => {
  const combinedData: CombinedActivities[] = []

  data.forEach((contribution) => {
    contribution.data.AuthorWorklog.rows.forEach((row) => {
      row.dayWiseActivity.forEach((day) => {
        const existingEntry = combinedData.find(
          (entry) => entry.date === day.date
        )

        if (existingEntry) {
          day.data.children.forEach((child) => {
            if (existingEntry.combinedData[child.label]) {
              existingEntry.combinedData[child.label] += parseInt(
                child.count,
                10
              )
            } else {
              existingEntry.combinedData[child.label] = parseInt(
                child.count,
                10
              )
            }
          })
        } else {
          const newDataEntry: CombinedActivities = {
            date: day.date,
            combinedData: {},
          }

          day.data.children.forEach((child: any) => {
            newDataEntry.combinedData[child.label] = parseInt(child.count, 10)
          })

          combinedData.push(newDataEntry)
        }
      })
    })
  })

  return combinedData
}

export default combineDayWiseActivities
