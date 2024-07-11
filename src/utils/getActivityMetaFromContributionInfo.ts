import data from "../data"
import ActivityMeta from "../Types/ActivityMetaType"
import ContributionInfo from "../Types/ContributionInfoType"
import DayWiseActivity from "../Types/DayWiseActivityType"
function getActivityMetaFromContributionInfo(
  data: ContributionInfo[]
): ActivityMeta[] {
  const processedData: ActivityMeta[] = []
  const labelSet = new Set<string>()

  data.forEach((contribution) => {
    const { dayWiseActivity } = contribution.data.AuthorWorklog.rows[0]

    dayWiseActivity.forEach((dayActivity) => {
      const children = dayActivity.data.children

      children.forEach((child) => {
        if (!labelSet.has(child.label)) {
          processedData.push({
            label: child.label,
            fillColor: child.fillColor,
          })
          labelSet.add(child.label)
        }
      })
    })
  })

  return processedData
}
export default getActivityMetaFromContributionInfo
