export interface IRealtimeWeather {
  main: {
    feels_like: number
    humidity: number
    temp: number
  }
  sys: {
    country: string
    sunrise: number
    sunset: number
  }
  weather: [
    {
      description: string
      main: string
    },
  ]
  wind: {
    deg: number
    speed: number
  }
}

export interface IForecastWeather {
  list: [
    {
      pop: number
    },
  ]
}
