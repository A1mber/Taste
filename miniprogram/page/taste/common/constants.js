const RECORD_TYPES = [
  { value: 'cook', label: '自己做的' },
  { value: 'eat-out', label: '外面吃的' },
  { value: 'takeout', label: '外卖' },
  { value: 'moment', label: '生活瞬间' }
]

const MOOD_TYPES = [
  { value: 'happy', label: '开心' },
  { value: 'calm', label: '平静' },
  { value: 'sad', label: '难过' },
  { value: 'tired', label: '疲惫' },
  { value: 'anxious', label: '焦虑' }
]

const APPETITE_TYPES = [
  { value: 'good', label: '胃口好' },
  { value: 'normal', label: '胃口一般' },
  { value: 'bad', label: '胃口不好' }
]

function buildLabelMap(list) {
  return list.reduce((acc, item) => {
    acc[item.value] = item.label
    return acc
  }, {})
}

module.exports = {
  RECORD_TYPES,
  MOOD_TYPES,
  APPETITE_TYPES,
  RECORD_TYPE_LABELS: buildLabelMap(RECORD_TYPES),
  MOOD_LABELS: buildLabelMap(MOOD_TYPES),
  APPETITE_LABELS: buildLabelMap(APPETITE_TYPES)
}
