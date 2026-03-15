const config = require('../../../config')
const { listRecords } = require('../common/record-service')

Page({
  data: {
    version: 'v0.2',
    envId: config.envId,
    recordCount: 0
  },

  onShow() {
    this.loadCount()
  },

  async loadCount() {
    try {
      const records = await listRecords(200)
      this.setData({ recordCount: records.length })
    } catch (error) {
      console.error('load count failed', error)
    }
  }
})
