import DeveloperWorklogRow from "../Types/DeveloperWorklogRowType"
import findActivityCount from "./findActivityCount"

const normalize = (value: number, max: number) => {
  if (max === 0) {
    return 0
  }
  return (value / max) * 100
}

const weights = {
  Commits: 25,
  PR_Open: 15,
  PR_Merged: 25,
  PR_Reviewed: 2,
  PR_Comments: 15,
}

const calculateScore = (developer: DeveloperWorklogRow, maxValues: any) => {
  let score = 0

  score +=
    normalize(
      Number(findActivityCount(developer, "Commits")),
      maxValues.Commits
    ) * weights.Commits
  score +=
    normalize(
      Number(findActivityCount(developer, "PR Open")),
      maxValues.PR_Open
    ) * weights.PR_Open
  score +=
    normalize(
      Number(findActivityCount(developer, "PR Merged")),
      maxValues.PR_Merged
    ) * weights.PR_Merged
  score +=
    normalize(
      Number(findActivityCount(developer, "PR Reviewed")),
      maxValues.PR_Reviewed
    ) * weights.PR_Reviewed
  score +=
    normalize(
      Number(findActivityCount(developer, "PR Comments")),
      maxValues.PR_Comments
    ) * weights.PR_Comments

  return score
}

export default calculateScore
