function getTemperatureUnit(countryCode?: string) {
  const region =
    countryCode?.toUpperCase() ||
    Intl.DateTimeFormat().resolvedOptions().locale.split('-')[1]?.toUpperCase()

  const fahrenheitCountries = ['US', 'BS', 'BZ', 'KY', 'PW', 'LR', 'FM', 'MH']

  return region && fahrenheitCountries.includes(region)
    ? 'fahrenheit'
    : 'celsius'
}

export function formatTemperature(K: number, countryCode?: string) {
  const unit = getTemperatureUnit(countryCode)

  const value = unit === 'fahrenheit' ? ((K - 273.15) * 9) / 5 + 32 : K - 273.15

  return new Intl.NumberFormat(navigator.language, {
    style: 'unit',
    unit,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatSunsetTime(unixTimestamp: number) {
  const date = new Date(unixTimestamp * 1000)

  return new Intl.DateTimeFormat(navigator.language, {
    timeStyle: 'short',
  }).format(date)
}

export function formatPrecipitation(pop: number) {
  return new Intl.NumberFormat(navigator.language, {
    style: 'percent',
    maximumFractionDigits: 0,
  }).format(pop)
}
