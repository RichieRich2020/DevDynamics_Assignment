import DeveloperWorklogRow from "../Types/DeveloperWorklogRowType"

function findActivityCount(
  developer: DeveloperWorklogRow,
  activityLabel: string
) {
  const activity = developer.totalActivity.find(
    (activity) => activity.name === activityLabel
  )
  return activity ? Number(activity.value) : 0
}

export default findActivityCount
