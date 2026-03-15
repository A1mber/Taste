const { RECORD_TYPES, MOOD_TYPES, APPETITE_TYPES } = require('../common/constants')
const { toDateString } = require('../common/date')
const { createRecord } = require('../common/record-service')

Page({
  data: {
    typeOptions: RECORD_TYPES,
    moodOptions: MOOD_TYPES,
    appetiteOptions: APPETITE_TYPES,
    title: '',
    foodName: '',
    note: '',
    type: 'cook',
    mood: 'calm',
    appetite: 'normal',
    date: toDateString(new Date()),
    localImagePaths: [],
    submitting: false
  },

  onInputTitle(event) {
    this.setData({ title: event.detail.value })
  },

  onInputFoodName(event) {
    this.setData({ foodName: event.detail.value })
  },

  onInputNote(event) {
    this.setData({ note: event.detail.value })
  },

  onDateChange(event) {
    this.setData({ date: event.detail.value })
  },

  onSelectType(event) {
    this.setData({ type: event.currentTarget.dataset.value })
  },

  onSelectMood(event) {
    this.setData({ mood: event.currentTarget.dataset.value })
  },

  onSelectAppetite(event) {
    this.setData({ appetite: event.currentTarget.dataset.value })
  },

  chooseImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: res => {
        const paths = res.tempFiles.map(item => item.tempFilePath)
        this.setData({ localImagePaths: paths })
      }
    })
  },

  previewImage() {
    if (!this.data.localImagePaths.length) return
    wx.previewImage({ urls: this.data.localImagePaths })
  },

  async submitRecord() {
    const { title, type, mood, appetite, note, foodName, date, localImagePaths, submitting } = this.data
    if (submitting) return

    if (!title.trim()) {
      wx.showToast({ title: '请填写标题', icon: 'none' })
      return
    }

    this.setData({ submitting: true })
    wx.showLoading({ title: '保存中' })

    try {
      await createRecord({
        title: title.trim(),
        type,
        mood,
        appetite,
        note: note.trim(),
        foodName: foodName.trim(),
        date,
        localImagePaths
      })
      wx.hideLoading()
      wx.showToast({ title: '已保存这份味道', icon: 'success' })
      setTimeout(() => {
        wx.switchTab({ url: '/page/taste/review/index' })
      }, 500)
    } catch (error) {
      wx.hideLoading()
      wx.showToast({ title: '保存失败，请检查权限', icon: 'none' })
      console.error('submitRecord failed', error)
    } finally {
      this.setData({ submitting: false })
    }
  }
})
