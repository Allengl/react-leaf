import { useState } from 'react'
import { AddItemFloatButton } from '../components/AddItemFloatButton'
import { TimeRangePicker } from '../components/TimeRangePicker'
import { TopNav } from '../components/TopNav'
import { TopMenu } from '../components/TopMenu'
import { useMenuStore } from '../stores/useMenuStore'
import type { TimeRange } from '../components/TimeRangePicker'
import { Gradient } from '../components/Gradient'
import { Icon } from '../components/Icon'
import { timeRangeToStartAndEnd } from '../lib/timeRangeToStartAndEnd'
import { time } from '../lib/time'
import { ItemsList } from './ItemsPage/ItemsList'
import { ItemsSummary } from './ItemsPage/ItemsSummary'

export const ItemsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>({
    name: 'thisMonth',
    start: time().firstDayOfMonth,
    end: time().lastDayOfMonth.add(1, 'day')
  })
  const { start, end } = timeRangeToStartAndEnd(timeRange)
  const { visible, setVisible } = useMenuStore()
  return (
    <div>
      <Gradient>
        <TopNav title='账目列表' icon={
          <Icon name="menu" className='w-24px h-24px'
            onClick={() => { setVisible(!visible) }}
          />
        } />
      </Gradient>
      <TimeRangePicker selected={timeRange} onSelect={setTimeRange} />
      <ItemsSummary />
      <ItemsList start={start} end={end} />
      <AddItemFloatButton />
      <TopMenu visible={visible} onClickMask={() => { setVisible(false) }} />
    </div>
  )
}
