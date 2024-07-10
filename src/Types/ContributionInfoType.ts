import DeveloperWorklogRow from "./DeveloperWorklogRowType"

type ContributionInfo = {
  data: {
    AuthorWorklog: {
      rows: DeveloperWorklogRow[]
    }
  }
}

export default ContributionInfo
