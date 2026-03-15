const { getRecordById } = require('../common/record-service')
const { RECORD_TYPE_LABELS, MOOD_LABELS, APPETITE_LABELS } = require('../common/constants')
const { formatDisplayDate } = require('../common/date')

Page({
  data: {
    record: null,
    typeText: '',
    moodText: '',
    appetiteText: '',
    displayDate: ''
  },

  async onLoad(query) {
    const { id } = query
    if (!id) {
      wx.showToast({ title: '记录不存在', icon: 'none' })
      return
    }

    try {
      const record = await getRecordById(id)
      if (!record) {
        wx.showToast({ title: '记录不存在', icon: 'none' })
        return
      }
      this.setData({
        record,
        typeText: RECORD_TYPE_LABELS[record.type] || record.type,
        moodText: MOOD_LABELS[record.mood] || record.mood,
        appetiteText: APPETITE_LABELS[record.appetite] || record.appetite,
        displayDate: formatDisplayDate(record.date)
      })
    } catch (error) {
      wx.showToast({ title: '读取详情失败', icon: 'none' })
      console.error('load detail failed', error)
    }
  },

  previewImage(event) {
    const { src } = event.currentTarget.dataset
    const images = this.data.record ? this.data.record.images : []
    wx.previewImage({ current: src, urls: images })
  }
})
