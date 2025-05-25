import Badge from '../badge'

import { useTabsContext } from './tabs-context'
import { cn } from '@/lib/utils'

export default function Selectors() {
  const { tabs, selectedTab, setSelectedTab } = useTabsContext()

  return (
    <div className="border-primary text-secondary flex gap-4 mt-2 border-b">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setSelectedTab(tab.id)}
          className={cn(
            'h-10 border-contrast flex items-center justify-center gap-2',
            selectedTab === tab.id && 'border-b-2 font-medium text-contrast',
          )}
        >
          <span>{tab.label}</span>
          <Badge
            className={cn(
              selectedTab === tab.id && 'bg-contrast text-contrast',
            )}
          >
            {tab.value}
          </Badge>
        </button>
      ))}
    </div>
  )
}
