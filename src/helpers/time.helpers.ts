export const now: Date = new Date()
export const unixtime = now.getTime() / 1000

export function getDate(date: Date) {
  return new Intl.DateTimeFormat(navigator.language, {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
  })
    .format(date)
    .replace(/\./g, '')
}

export function getTime(date: Date) {
  return new Intl.DateTimeFormat(navigator.language, {
    timeStyle: 'short',
  }).format(date)
}
