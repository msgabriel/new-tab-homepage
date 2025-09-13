import { useState } from 'react'
import {
  formatPrecipitation,
  formatSunsetTime,
  formatTemperature,
} from '../../helpers/weather.helpers'
import { useChromeStorage } from '../../hooks/useChromeStorage'
import { useFetch } from '../../hooks/useFetch'
import { IForecastWeather, IRealtimeWeather } from '../../types'
import { Button } from '../Button'
import { Modal } from '../Modal'
import styles from './Weather.module.css'
import { Location, WeatherForm } from './WeatherForm'

const STORAGE_KEYS = {
  API_KEY: 'openweather_api_key',
  LOCATION: 'openweather_location',
}

export function Weather() {
  const [apiKey, setApiKey, isLoadingApiKey] = useChromeStorage<string | null>(
    STORAGE_KEYS.API_KEY,
    null,
  )
  const [location, setLocation, isLoadingLocation] =
    useChromeStorage<Location | null>(STORAGE_KEYS.LOCATION, null)
  const [modalOpen, setModalOpen] = useState(false)

  const isLoading = isLoadingApiKey || isLoadingLocation

  const realtimeUrl =
    apiKey && location
      ? `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${apiKey}`
      : null

  const forecastUrl =
    apiKey && location
      ? `https://api.openweathermap.org/data/2.5/forecast?lat=${location.latitude}&lon=${location.longitude}&appid=${apiKey}`
      : null

  const { status: realtimeStatus, data: realtimeWeather } =
    useFetch<IRealtimeWeather>(realtimeUrl)
  const { status: forecastStatus, data: forecastWeather } =
    useFetch<IForecastWeather>(forecastUrl)

  function handleSetupComplete(newApiKey: string, newLocation: Location) {
    setApiKey(newApiKey)
    setLocation(newLocation)
    setModalOpen(false)
  }

  // show setup button
  if (!apiKey || !location) {
    return (
      <>
        <div className={styles.stats}>
          <Button variant="secondary" onClick={() => setModalOpen(true)}>
            Setup Weather
          </Button>
        </div>
        <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)}>
          <WeatherForm
            initialApiKey={apiKey ?? ''}
            onComplete={handleSetupComplete}
            onCancel={() => setModalOpen(false)}
          />
        </Modal>
      </>
    )
  }

  // loading
  if (
    realtimeStatus === 'fetching' ||
    forecastStatus === 'fetching' ||
    isLoading
  ) {
    return (
      <>
        <div className={styles.weather}>
          <p className={styles.temperature}>?°C</p>
          <p>loading...</p>
        </div>
        <div className={styles.stats}>
          <div>
            <p className="label">wind</p>
            <svg height="20" width="75">
              <circle className="dot" cx="29" cy="10" r="2"></circle>
              <circle className="dot" cx="16" cy="10" r="2"></circle>
              <circle className="dot" cx="3" cy="10" r="2"></circle>
            </svg>
          </div>
          <div>
            <p className="label">humidity</p>
            <svg height="20" width="75">
              <circle className="dot" cx="29" cy="10" r="2"></circle>
              <circle className="dot" cx="16" cy="10" r="2"></circle>
              <circle className="dot" cx="3" cy="10" r="2"></circle>
            </svg>
          </div>
          <div>
            <p className="label">precipitation </p>
            <svg height="20" width="75">
              <circle className="dot" cx="29" cy="10" r="2"></circle>
              <circle className="dot" cx="16" cy="10" r="2"></circle>
              <circle className="dot" cx="3" cy="10" r="2"></circle>
            </svg>
          </div>
        </div>
      </>
    )
  }

  // error
  if (realtimeStatus === 'error' || forecastStatus === 'error') {
    return (
      <>
        <div className={styles.stats}>
          <Button variant="secondary" onClick={() => setModalOpen(true)}>
            Retry setup
          </Button>
        </div>

        <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)}>
          <WeatherForm
            onComplete={handleSetupComplete}
            onCancel={() => setModalOpen(false)}
            initialApiKey={apiKey}
          />
        </Modal>
      </>
    )
  }

  if (realtimeWeather && forecastWeather) {
    return (
      <>
        <div className={styles.weather}>
          <p className={styles.temperature}>
            {formatTemperature(
              realtimeWeather.main.temp,
              realtimeWeather.sys.country,
            )}
          </p>
          <p>{realtimeWeather.weather[0].description}</p>
        </div>
        <div className={styles.stats}>
          <div>
            <p className="label">sunset</p>
            {formatSunsetTime(realtimeWeather.sys.sunset)}
          </div>
          <div>
            <p className="label">humidity</p>
            {realtimeWeather.main.humidity}%
          </div>
          <div>
            <p className="label">precipitation</p>
            {formatPrecipitation(forecastWeather.list[0].pop)}
          </div>
        </div>
        <Button
          variant="icon"
          showOnHover
          absolutePosition
          onClick={() => setModalOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4" />
            <path d="m21 2-9.6 9.6" />
            <circle cx="7.5" cy="15.5" r="5.5" />
          </svg>
        </Button>
        <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)}>
          <WeatherForm
            onComplete={handleSetupComplete}
            onCancel={() => setModalOpen(false)}
            initialApiKey={apiKey}
          />
        </Modal>
      </>
    )
  }

  return
}
