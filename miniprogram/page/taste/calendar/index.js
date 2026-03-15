const { getMonthMarkedDates } = require('../common/record-service')
const { toDateString } = require('../common/date')

function buildCalendar(year, month, markedMap) {
  const firstDay = new Date(year, month - 1, 1)
  const totalDays = new Date(year, month, 0).getDate()
  const weekPadding = firstDay.getDay()
  const cells = []

  for (let i = 0; i < weekPadding; i += 1) {
    cells.push({ empty: true, key: `e-${i}` })
  }

  const today = toDateString(new Date())

  for (let day = 1; day <= totalDays; day += 1) {
    const date = toDateString(new Date(year, month - 1, day))
    cells.push({
      key: date,
      empty: false,
      day,
      date,
      hasRecord: !!markedMap[date],
      isToday: date === today
    })
  }

  return cells
}

Page({
  data: {
    year: 0,
    month: 0,
    cells: [],
    weekTitles: ['日', '一', '二', '三', '四', '五', '六']
  },

  onShow() {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    this.loadCalendar(year, month)
  },

  async loadCalendar(year, month) {
    try {
      const markedMap = await getMonthMarkedDates(year, month)
      this.setData({
        year,
        month,
        cells: buildCalendar(year, month, markedMap)
      })
    } catch (error) {
      wx.showToast({ title: '读取日历数据失败', icon: 'none' })
      console.error('loadCalendar failed', error)
    }
  },

  prevMonth() {
    let { year, month } = this.data
    month -= 1
    if (month === 0) {
      month = 12
      year -= 1
    }
    this.loadCalendar(year, month)
  },

  nextMonth() {
    let { year, month } = this.data
    month += 1
    if (month === 13) {
      month = 1
      year += 1
    }
    this.loadCalendar(year, month)
  },

  onTapDay(event) {
    const { date, has } = event.currentTarget.dataset
    if (!date) return
    if (has) {
      wx.showToast({ title: `${date} 有记录`, icon: 'none' })
    } else {
      wx.showToast({ title: `${date} 暂无记录`, icon: 'none' })
    }
  }
})
