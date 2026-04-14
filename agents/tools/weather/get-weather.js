import { tool } from 'ai'
import { z } from 'zod'

function resolveDate (input) {
  const today = new Date()
  const lower = input.toLowerCase().trim()

  if (lower === 'today') return today.toISOString().split('T')[0]
  if (lower === 'tomorrow') {
    const d = new Date(today)
    d.setDate(d.getDate() + 1)
    return d.toISOString().split('T')[0]
  }
  if (lower === 'yesterday') {
    const d = new Date(today)
    d.setDate(d.getDate() - 1)
    return d.toISOString().split('T')[0]
  }

  const daysAheadMatch = lower.match(/^in (\d+) days?$/)
  if (daysAheadMatch) {
    const d = new Date(today)
    d.setDate(d.getDate() + parseInt(daysAheadMatch[1]))
    return d.toISOString().split('T')[0]
  }

  const daysAgoMatch = lower.match(/^(\d+) days? ago$/)
  if (daysAgoMatch) {
    const d = new Date(today)
    d.setDate(d.getDate() - parseInt(daysAgoMatch[1]))
    return d.toISOString().split('T')[0]
  }

  return input
}

function isHistorical (dateStr) {
  const today = new Date().toISOString().split('T')[0]
  return dateStr < today
}

const todayStr = new Date().toISOString().split('T')[0]

export default tool({
  description: `Get weather for a city. Returns current weather by default, or weather for a specific date (past or future up to 16 days ahead). Today is ${todayStr}.`,
  parameters: z.object({
    city: z.string().describe('City name, e.g. "London" or "New York"'),
    date: z.string().optional().describe('Date for weather lookup. Accepts YYYY-MM-DD, "today", "tomorrow", "yesterday", "in N days", or "N days ago". If omitted, returns current weather.')
  }),
  execute: async ({ city, date }) => {
    const geoUrl = new URL('https://geocoding-api.open-meteo.com/v1/search')
    geoUrl.searchParams.set('name', city)
    geoUrl.searchParams.set('count', '1')

    const geoRes = await fetch(geoUrl)
    const geoData = await geoRes.json()

    if (!geoData.results?.length) {
      return { error: `City not found: ${city}` }
    }

    const { latitude, longitude, name, country } = geoData.results[0]

    if (date) {
      const resolvedDate = resolveDate(date)
      const baseUrl = isHistorical(resolvedDate)
        ? 'https://archive-api.open-meteo.com/v1/archive'
        : 'https://api.open-meteo.com/v1/forecast'

      const weatherUrl = new URL(baseUrl)
      weatherUrl.searchParams.set('latitude', String(latitude))
      weatherUrl.searchParams.set('longitude', String(longitude))
      weatherUrl.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max')
      weatherUrl.searchParams.set('start_date', resolvedDate)
      weatherUrl.searchParams.set('end_date', resolvedDate)

      const weatherRes = await fetch(weatherUrl)
      const weatherData = await weatherRes.json()

      if (weatherData.error) {
        return { error: weatherData.reason || weatherData.error }
      }

      const daily = weatherData.daily
      return {
        city: name,
        country,
        date: resolvedDate,
        type: isHistorical(resolvedDate) ? 'historical' : 'forecast',
        temperature_max: daily.temperature_2m_max[0],
        temperature_min: daily.temperature_2m_min[0],
        precipitation: daily.precipitation_sum[0],
        wind_speed_max: daily.wind_speed_10m_max[0]
      }
    }

    const weatherUrl = new URL('https://api.open-meteo.com/v1/forecast')
    weatherUrl.searchParams.set('latitude', String(latitude))
    weatherUrl.searchParams.set('longitude', String(longitude))
    weatherUrl.searchParams.set('current', 'temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code')

    const weatherRes = await fetch(weatherUrl)
    const weatherData = await weatherRes.json()

    return {
      city: name,
      country,
      type: 'current',
      ...weatherData.current
    }
  }
})
