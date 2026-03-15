const { toDateString, monthBoundary } = require('./date')

const COLLECTION_NAME = 'taste_records'

function getDb() {
  return wx.cloud.database()
}

function normalizeRecord(doc) {
  if (!doc) return null
  return {
    ...doc,
    id: doc._id || doc.id,
    images: Array.isArray(doc.images) ? doc.images : []
  }
}

function ensureArray(value) {
  return Array.isArray(value) ? value : []
}

async function uploadImages(localImagePaths) {
  const filePaths = ensureArray(localImagePaths)
  const uploaded = []
  for (let i = 0; i < filePaths.length; i += 1) {
    const filePath = filePaths[i]
    const extMatch = filePath.match(/\.[^.]+$/)
    const ext = extMatch ? extMatch[0] : '.jpg'
    const cloudPath = `taste/${Date.now()}-${i}${ext}`
    const { fileID } = await wx.cloud.uploadFile({
      cloudPath,
      filePath
    })
    uploaded.push(fileID)
  }
  return uploaded
}

async function createRecord(payload) {
  const db = getDb()
  const now = Date.now()
  const imageFileIds = await uploadImages(payload.localImagePaths)
  const data = {
    title: payload.title || '',
    images: imageFileIds,
    type: payload.type || 'moment',
    mood: payload.mood || 'calm',
    appetite: payload.appetite || 'normal',
    note: payload.note || '',
    foodName: payload.foodName || '',
    date: payload.date || toDateString(new Date()),
    createdAt: now,
    updatedAt: now
  }
  const result = await db.collection(COLLECTION_NAME).add({ data })
  return result._id
}

async function listRecords(limit = 50) {
  const db = getDb()
  const { data } = await db
    .collection(COLLECTION_NAME)
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get()
  return data.map(normalizeRecord)
}

async function getRecordById(id) {
  const db = getDb()
  const record = await db.collection(COLLECTION_NAME).doc(id).get()
  return normalizeRecord(record.data)
}

async function getMonthMarkedDates(year, month) {
  const db = getDb()
  const _ = db.command
  const { start, end } = monthBoundary(year, month)
  const { data } = await db
    .collection(COLLECTION_NAME)
    .where({
      date: _.gte(start).and(_.lte(end))
    })
    .field({ date: true })
    .get()

  return data.reduce((acc, item) => {
    acc[item.date] = true
    return acc
  }, {})
}

module.exports = {
  createRecord,
  listRecords,
  getRecordById,
  getMonthMarkedDates
}
