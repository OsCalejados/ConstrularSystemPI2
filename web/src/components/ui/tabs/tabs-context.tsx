import { createContext, ReactNode, useContext, useState } from 'react'
import { Tabs } from '@/types/tabs'

interface TabsProviderProps {
  children?: ReactNode
  tabs: Tabs[]
}

interface TabsContextType {
  tabs: Tabs[]
  selectedTab: string
  setSelectedTab: (tab: string) => void
}

const TabsContext = createContext<TabsContextType>({} as TabsContextType)

export const useTabsContext = () => useContext(TabsContext)

export default function TabsProvider({ tabs, children }: TabsProviderProps) {
  const [selectedTab, setSelectedTab] = useState(tabs[0].id)

  return (
    <TabsContext.Provider value={{ tabs, selectedTab, setSelectedTab }}>
      {children}
    </TabsContext.Provider>
  )
}
