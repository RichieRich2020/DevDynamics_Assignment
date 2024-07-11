import React, { createContext, useContext, ReactNode } from "react"

export type ActivityMetaType = {
  label: string
  fillColor: string
}[]

const ActivityMetaContext = createContext<ActivityMetaType | undefined>(
  undefined
)

export const useActivityMeta = () => useContext(ActivityMetaContext)

interface ActivityMetaProviderProps {
  value: ActivityMetaType
  children: ReactNode
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
