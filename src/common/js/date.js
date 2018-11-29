export function padDate (v) {
  v = v < 10 ? '0' + v : v
  return v
}

export function formatDate (timestamp) {
  var date = new Date(timestamp)
  var h = date.getHours() + ':'
  var m = padDate(date.getMinutes())
  return h + m
}

export function getTimeArray (startTime, endTime) {
  var timeArray = []
  while (startTime <= endTime) {
    timeArray.push(formatDate(startTime))
    startTime = startTime + 60000
  }
  return timeArray
}
