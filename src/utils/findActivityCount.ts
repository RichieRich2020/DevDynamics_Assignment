import DeveloperWorklogRow from "../Types/DeveloperWorklogRow"

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
