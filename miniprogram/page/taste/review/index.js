const { listRecords } = require('../common/record-service')
const { RECORD_TYPE_LABELS, MOOD_LABELS } = require('../common/constants')

Page({
  data: {
    loading: false,
    records: []
  },

  onShow() {
    this.loadRecords()
  },

  async loadRecords() {
    this.setData({ loading: true })
    try {
      const records = await listRecords(100)
      const viewData = records.map(item => ({
        ...item,
        typeText: RECORD_TYPE_LABELS[item.type] || item.type,
        moodText: MOOD_LABELS[item.mood] || item.mood
      }))
      this.setData({ records: viewData })
    } catch (error) {
      wx.showToast({ title: '读取失败，请检查数据库权限', icon: 'none' })
      console.error('loadRecords failed', error)
    } finally {
      this.setData({ loading: false })
    }
  },

  goDetail(event) {
    const { id } = event.currentTarget.dataset
    wx.navigateTo({ url: `/page/taste/detail/index?id=${id}` })
  }
})
