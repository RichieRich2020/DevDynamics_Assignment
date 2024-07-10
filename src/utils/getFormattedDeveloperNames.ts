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
  name = name.trim() // Trim leading and trailing spaces
  if (name.includes("@")) {
    name = name.split("@")[0] // Take the part before '@'
  }
  const firstName = name.split(".")[0] // Take only the first part before '.'
  return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase() // Capitalize first part
}

export { getFormattedDeveloperNames, getFormattedDeveloperName }
