import DeveloperWorklogRow from "./DeveloperWorklogRow"

type ContributionInfo = {
  data: {
    AuthorWorklog: {
      rows: DeveloperWorklogRow[]
    }
  }
}

export default ContributionInfo
