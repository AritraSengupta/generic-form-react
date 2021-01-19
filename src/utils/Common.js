export function changeToUSDateStyle(value) {
  const arr = value.split('-')
  const usStyle = [arr[1], arr[0], arr[2]].join('-')
  return usStyle
}

export function isValidDate(d) {
  return d instanceof Date && !isNaN(d)
}

export function formatInputIfDate(date) {
  if (!date || typeof date !== 'string') return date
  const dateArray = date.split('-')
  if (dateArray.length === 3 && !isValidDate(new Date(date))) {
    // Try to format if not a valid date
    const openApiDate = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`
    const dateObj = new Date(openApiDate)
    if (isValidDate(dateObj)) {
      return openApiDate
    }
  }
  return date
}

export function getDateString(date, month, year) {
  return `${date}-${month + 1}-${year}`
}

export const getFormattedDate = (date) => {
  if (!isValidDate(new Date(date))) return date

  const dateObj = new Date(date)
  return getDateString(
    dateObj.getDate(),
    dateObj.getMonth(),
    dateObj.getFullYear()
  )
}

export const formatToFixed = (value, decimalPlaces, defaultValue) => {
  const numericalValue = parseFloat(value).toFixed(decimalPlaces)
  if (!isNaN(numericalValue)) {
    return numericalValue
  }
  return defaultValue
}

export const twoDecimals = (value, decimalPoints) => {
  if (value === 0) return 0
  const t = value ? `${value}` : ''
  if (Number(t) < 0 || t === '-') {
    return ''
  }
  const newValue =
    t.indexOf('.') >= 0
      ? t.substr(0, t.indexOf('.')) +
        t.substr(t.indexOf('.'), decimalPoints + 1)
      : t
  return newValue
}

export const convertToArray = (hashMap) =>
  Object.keys(hashMap).filter((key) => hashMap[key])
