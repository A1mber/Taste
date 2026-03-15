function padNumber(n) {
  return n < 10 ? `0${n}` : `${n}`
}

function toDateString(date = new Date()) {
  const year = date.getFullYear()
  const month = padNumber(date.getMonth() + 1)
  const day = padNumber(date.getDate())
  return `${year}-${month}-${day}`
}

function monthBoundary(year, month) {
  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0)
  return {
    start: toDateString(startDate),
    end: toDateString(endDate)
  }
}

function formatDisplayDate(dateString) {
  if (!dateString) return ''
  const [year, month, day] = dateString.split('-')
  return `${year}年${Number(month)}月${Number(day)}日`
}

module.exports = {
  toDateString,
  monthBoundary,
  formatDisplayDate
}
