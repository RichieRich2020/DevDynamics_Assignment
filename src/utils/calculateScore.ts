import DeveloperWorklogRow from "../Types/DeveloperWorklogRowType"
import Parameters from "../Types/ParametersType"
import findActivityCount from "./findActivityCount"

const normalize = (value: number, max: number) => {
  if (max === 0) {
    return 0
  }
  return (value / max) * 100
}

const weights: any = {
  Commits: 25,
  PR_Open: 15,
  PR_Merged: 25,
  PR_Reviewed: 2,
  PR_Comments: 15,
}

const calculateScore = (
  developer: DeveloperWorklogRow,
  maxValues: Parameters
): number => {
  let score = 0

  Object.keys(maxValues).forEach((activityName) => {
    const normalizedCount = normalize(
      Number(findActivityCount(developer, activityName.replace("_", " "))),
      maxValues[activityName as keyof Parameters]
    )
    const weight = weights[activityName]
    if (weight !== undefined) {
      score += normalizedCount * weight
    }
  })

  return score
}
export default calculateScore
