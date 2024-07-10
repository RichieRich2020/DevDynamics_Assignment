import CombinedActivities from "../Types/CombinedActivities"
import DeveloperWorklogRow from "../Types/DeveloperWorklogRow"

const combineDayWiseActivitiesForDeveloper = (
  developer: DeveloperWorklogRow
) => {
  const combinedData: CombinedActivities[] = []
  console.log(developer, "deveeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
  developer.dayWiseActivity.forEach((day) => {
    const existingEntry = combinedData.find((entry) => entry.date === day.date)

    if (existingEntry) {
      day.data.children.forEach((child) => {
        if (existingEntry.combinedData[child.label]) {
          existingEntry.combinedData[child.label] += parseInt(child.count, 10)
        } else {
          existingEntry.combinedData[child.label] = parseInt(child.count, 10)
        }
      })
    } else {
      const newDataEntry: CombinedActivities = {
        date: day.date,
        combinedData: {},
      }

      day.data.children.forEach((child) => {
        newDataEntry.combinedData[child.label] = parseInt(child.count, 10)
      })

      combinedData.push(newDataEntry)
    }
  })
  console.log(combinedData)

  return combinedData
}

export default combineDayWiseActivitiesForDeveloper
