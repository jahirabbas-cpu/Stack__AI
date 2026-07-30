import { LocationResult, ProcessedWeatherData } from '../types/weather';
import { getWmoCondition } from '../utils/weatherCodes';

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1';
const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export async function searchCities(query: string): Promise<LocationResult[]> {
  if (!query || query.trim().length < 2) return [];

  const url = `${GEOCODING_BASE_URL}/search?name=${encodeURIComponent(query.trim())}&count=10&language=en&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Geocoding failed with status ${response.status}`);
    }
    const data = await response.json();
    return data.results || [];
  } catch (err) {
    console.error('Error searching cities:', err);
    return [];
  }
}

export async function reverseGeocode(latitude: number, longitude: number): Promise<LocationResult> {
  // Open-Meteo does not have a direct reverse geocoding endpoint, so we can construct a location result or search nearby if needed, or query BigDataCloud/OpenStreetMap free API, or fallback nicely.
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
      { headers: { 'Accept-Language': 'en' } }
    );
    if (response.ok) {
      const data = await response.json();
      const name = data.address?.city || data.address?.town || data.address?.village || data.address?.county || 'Current Location';
      const country = data.address?.country || '';
      const country_code = data.address?.country_code?.toUpperCase() || '';
      const admin1 = data.address?.state || data.address?.region || '';

      return {
        id: Math.floor(latitude * 1000 + longitude),
        name,
        latitude,
        longitude,
        country,
        country_code,
        admin1,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto',
      };
    }
  } catch (err) {
    console.warn('Reverse geocoding failed, falling back to default location object:', err);
  }

  return {
    id: 999999,
    name: 'Your Location',
    latitude,
    longitude,
    country: 'Detected GPS',
    country_code: '',
    admin1: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto',
  };
}

export async function fetchWeatherData(location: LocationResult): Promise<ProcessedWeatherData> {
  const params = new URLSearchParams({
    latitude: location.latitude.toString(),
    longitude: location.longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'rain',
      'showers',
      'snowfall',
      'weather_code',
      'cloud_cover',
      'pressure_msl',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
    ].join(','),
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'precipitation_probability',
      'precipitation',
      'weather_code',
      'pressure_msl',
      'cloud_cover',
      'wind_speed_10m',
      'wind_direction_10m',
      'uv_index',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_sum',
      'rain_sum',
      'showers_sum',
      'snowfall_sum',
      'precipitation_hours',
      'precipitation_probability_max',
      'wind_speed_10m_max',
      'wind_gusts_10m_max',
      'wind_direction_10m_dominant',
    ].join(','),
    timezone: location.timezone || 'auto',
  });

  const url = `${FORECAST_BASE_URL}?${params.toString()}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch weather data from Open-Meteo (${response.status})`);
  }

  const raw = await response.json();

  const currentRaw = raw.current;
  const weatherCode = currentRaw.weather_code ?? 0;
  const condition = getWmoCondition(weatherCode);

  return {
    location,
    current: {
      time: currentRaw.time,
      temperature: currentRaw.temperature_2m,
      apparentTemperature: currentRaw.apparent_temperature,
      relativeHumidity: currentRaw.relative_humidity_2m,
      isDay: Boolean(currentRaw.is_day),
      precipitation: currentRaw.precipitation,
      rain: currentRaw.rain,
      showers: currentRaw.showers,
      snowfall: currentRaw.snowfall,
      weatherCode: weatherCode,
      cloudCover: currentRaw.cloud_cover,
      pressureMsl: currentRaw.pressure_msl,
      surfacePressure: currentRaw.surface_pressure,
      windSpeed: currentRaw.wind_speed_10m,
      windDirection: currentRaw.wind_direction_10m,
      windGusts: currentRaw.wind_gusts_10m,
      condition,
    },
    hourly: {
      time: raw.hourly.time || [],
      temperature2m: raw.hourly.temperature_2m || [],
      relativeHumidity2m: raw.hourly.relative_humidity_2m || [],
      apparentTemperature: raw.hourly.apparent_temperature || [],
      precipitationProbability: raw.hourly.precipitation_probability || [],
      precipitation: raw.hourly.precipitation || [],
      weatherCode: raw.hourly.weather_code || [],
      pressureMsl: raw.hourly.pressure_msl || [],
      cloudCover: raw.hourly.cloud_cover || [],
      windSpeed10m: raw.hourly.wind_speed_10m || [],
      windDirection10m: raw.hourly.wind_direction_10m || [],
      uvIndex: raw.hourly.uv_index || [],
    },
    daily: {
      time: raw.daily.time || [],
      weatherCode: raw.daily.weather_code || [],
      temperature2mMax: raw.daily.temperature_2m_max || [],
      temperature2mMin: raw.daily.temperature_2m_min || [],
      apparentTemperatureMax: raw.daily.apparent_temperature_max || [],
      apparentTemperatureMin: raw.daily.apparent_temperature_min || [],
      sunrise: raw.daily.sunrise || [],
      sunset: raw.daily.sunset || [],
      uvIndexMax: raw.daily.uv_index_max || [],
      precipitationSum: raw.daily.precipitation_sum || [],
      rainSum: raw.daily.rain_sum || [],
      showersSum: raw.daily.showers_sum || [],
      snowfallSum: raw.daily.snowfall_sum || [],
      precipitationHours: raw.daily.precipitation_hours || [],
      precipitationProbabilityMax: raw.daily.precipitation_probability_max || [],
      windSpeed10mMax: raw.daily.wind_speed_10m_max || [],
      windGusts10mMax: raw.daily.wind_gusts_10m_max || [],
      windDirection10mDominant: raw.daily.wind_direction_10m_dominant || [],
    },
    timezone: raw.timezone || location.timezone,
    utcOffsetSeconds: raw.utc_offset_seconds || 0,
  };
}

// Unit conversion helpers
export function convertTemp(celsius: number, unit: 'celsius' | 'fahrenheit'): number {
  if (unit === 'fahrenheit') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function formatTemp(celsius: number, unit: 'celsius' | 'fahrenheit'): string {
  const val = convertTemp(celsius, unit);
  return `${val}°${unit === 'celsius' ? 'C' : 'F'}`;
}

export function convertWind(kmh: number, unit: 'kmh' | 'mph' | 'ms'): number {
  if (unit === 'mph') {
    return Math.round(kmh * 0.621371);
  }
  if (unit === 'ms') {
    return Math.round((kmh / 3.6) * 10) / 10;
  }
  return Math.round(kmh);
}

export function formatWind(kmh: number, unit: 'kmh' | 'mph' | 'ms'): string {
  const val = convertWind(kmh, unit);
  const label = unit === 'kmh' ? 'km/h' : unit === 'mph' ? 'mph' : 'm/s';
  return `${val} ${label}`;
}
