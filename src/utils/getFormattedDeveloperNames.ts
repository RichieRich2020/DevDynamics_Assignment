import DeveloperWorklogRow from "../Types/DeveloperWorklogRow"

const getFormattedDeveloperNames = (
  developers: DeveloperWorklogRow[]
): string[] => {
  const formattedNames: string[] = []

  developers.forEach((developer) => {
    let name = developer.name.trim() // Trim leading and trailing spaces
    if (name.startsWith("@")) {
      name = name.substring(1) // Remove leading '@'
    }
    //  name = name.replace(/\./g, " ") // Replace all '.' with spaces
    //  name = name.charAt(0).toUpperCase() + name.slice(1) // Capitalize first letter

    formattedNames.push(name)
  })
  console.log(formattedNames, "formattedNames")
  return formattedNames
}

export default getFormattedDeveloperNames
