import React, { createContext, useContext, ReactNode } from "react"

// Define a type for ActivityMetaa
export type ActivityMetaType = {
  label: string
  fillColor: string
}[]

// Create context and provide initial value
const ActivityMetaContext = createContext<ActivityMetaType | undefined>(
  undefined
)

// Custom hook to consume ActivityMetaContext
export const useActivityMeta = () => useContext(ActivityMetaContext)

// Provider component to wrap your app
interface ActivityMetaProviderProps {
  value: ActivityMetaType
  children: ReactNode // Allow children prop
}

export const ActivityMetaProvider: React.FC<ActivityMetaProviderProps> = ({
  value,
  children,
}) => {
  return (
    <ActivityMetaContext.Provider value={value}>
      {children}
    </ActivityMetaContext.Provider>
  )
}
