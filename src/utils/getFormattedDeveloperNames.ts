import DeveloperWorklogRow from "../Types/DeveloperWorklogRowType"

const getFormattedDeveloperNames = (
  developers: DeveloperWorklogRow[]
): string[] => {
  const formattedNames: string[] = []

  developers.forEach((developer) => {
    let name = getFormattedDeveloperName(developer.name)

    formattedNames.push(name)
  })

  console.log(formattedNames, "formattedNames")
  return formattedNames
}
const getFormattedDeveloperName = (name: string): string => {
  name = name.trim()
  if (name.includes("@")) {
    name = name.split("@")[0]
  }
  const firstName = name.split(".")[0]
  return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()
}

export { getFormattedDeveloperNames, getFormattedDeveloperName }
