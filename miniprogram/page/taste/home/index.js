const { listRecords } = require('../common/record-service')
const { RECORD_TYPE_LABELS, MOOD_LABELS } = require('../common/constants')

Page({
  data: {
    loading: false,
    records: []
  },

  onShow() {
    this.loadRecentRecords()
  },

  async loadRecentRecords() {
    this.setData({ loading: true })
    try {
      const records = await listRecords(5)
      const viewData = records.map(item => ({
        ...item,
        typeText: RECORD_TYPE_LABELS[item.type] || item.type,
        moodText: MOOD_LABELS[item.mood] || item.mood
      }))
      this.setData({ records: viewData })
    } catch (error) {
      wx.showToast({ title: '读取记录失败', icon: 'none' })
      console.error('loadRecentRecords failed', error)
    } finally {
      this.setData({ loading: false })
    }
  },

  goCreate() {
    wx.switchTab({ url: '/page/taste/create/index' })
  },

  goReview() {
    wx.switchTab({ url: '/page/taste/review/index' })
  },

  goDetail(event) {
    const { id } = event.currentTarget.dataset
    wx.navigateTo({ url: `/page/taste/detail/index?id=${id}` })
  }
})
