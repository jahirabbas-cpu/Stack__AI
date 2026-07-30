import { useState, useEffect, useCallback } from 'react';
import {
  CloudSun,
  Calendar,
  Sparkles,
  Loader2,
  AlertCircle,
  RefreshCw,
  Clock,
  Compass,
} from 'lucide-react';
import { LocationResult, ProcessedWeatherData, TemperatureUnit, WindSpeedUnit } from './types/weather';
import { fetchWeatherData } from './services/openMeteo';
import { DEFAULT_CITY } from './utils/popularCities';
import { Header } from './components/Header';
import { CurrentWeather } from './components/CurrentWeather';
import { WeatherChart } from './components/WeatherChart';
import { HourlyForecast } from './components/HourlyForecast';
import { DailyForecast } from './components/DailyForecast';
import { PlannerRecommendations } from './components/PlannerRecommendations';

export default function App() {
  // Selected location state (saved to localStorage if present)
  const [location, setLocation] = useState<LocationResult>(() => {
    try {
      const saved = localStorage.getItem('weather_selected_location');
      return saved ? JSON.parse(saved) : DEFAULT_CITY;
    } catch {
      return DEFAULT_CITY;
    }
  });

  // Weather state
  const [weatherData, setWeatherData] = useState<ProcessedWeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Preference units
  const [tempUnit, setTempUnit] = useState<TemperatureUnit>(() => {
    try {
      return (localStorage.getItem('weather_temp_unit') as TemperatureUnit) || 'celsius';
    } catch {
      return 'celsius';
    }
  });

  const [windUnit, setWindUnit] = useState<WindSpeedUnit>(() => {
    try {
      return (localStorage.getItem('weather_wind_unit') as WindSpeedUnit) || 'kmh';
    } catch {
      return 'kmh';
    }
  });

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<'all' | 'forecast' | 'planner'>('all');

  // Load weather data
  const loadWeather = useCallback(async (loc: LocationResult, isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    else setIsLoading(true);

    setError(null);

    try {
      const data = await fetchWeatherData(loc);
      setWeatherData(data);
    } catch (err: unknown) {
      console.error('Error fetching weather:', err);
      const msg = err instanceof Error ? err.message : 'Unable to connect to Open-Meteo weather service.';
      setError(msg);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadWeather(location);
  }, [location, loadWeather]);

  const handleSelectLocation = (newLoc: LocationResult) => {
    setLocation(newLoc);
    try {
      localStorage.setItem('weather_selected_location', JSON.stringify(newLoc));
    } catch (err) {
      console.error('Failed to save selected location', err);
    }
  };

  const handleToggleTempUnit = (unit: TemperatureUnit) => {
    setTempUnit(unit);
    try {
      localStorage.setItem('weather_temp_unit', unit);
    } catch (err) {
      console.error('Failed to save temp unit', err);
    }
  };

  const handleChangeWindUnit = (unit: WindSpeedUnit) => {
    setWindUnit(unit);
    try {
      localStorage.setItem('weather_wind_unit', unit);
    } catch (err) {
      console.error('Failed to save wind unit', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Header with Search and Units */}
      <Header
        onSelectLocation={handleSelectLocation}
        currentLocation={location}
        tempUnit={tempUnit}
        onToggleTempUnit={handleToggleTempUnit}
        windUnit={windUnit}
        onChangeWindUnit={handleChangeWindUnit}
        onRefresh={() => loadWeather(location, true)}
        isRefreshing={isRefreshing}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-1 bg-slate-200/60 dark:bg-slate-900 p-1 rounded-2xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Full Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('forecast')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                activeTab === 'forecast'
                  ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>7-Day &amp; Hourly</span>
            </button>

            <button
              onClick={() => setActiveTab('planner')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                activeTab === 'planner'
                  ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Activity Planner</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Clock className="w-3.5 h-3.5 text-sky-500" />
            <span>Updated live from Open-Meteo</span>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && !isRefreshing && (
          <div className="py-24 flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 bg-sky-50 dark:bg-sky-950/60 rounded-full text-sky-500 border border-sky-200 dark:border-sky-800">
              <Loader2 className="w-10 h-10 animate-spin" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">
                Fetching Live Weather Data...
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Gathering satellite &amp; meteorological metrics for {location.name}
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-6 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800/80 rounded-3xl text-center space-y-3 max-w-xl mx-auto my-8">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
              Failed to Load Weather
            </h3>
            <p className="text-xs text-rose-700 dark:text-rose-300">{error}</p>
            <button
              onClick={() => loadWeather(location)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs rounded-xl shadow-xs transition inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try Again
            </button>
          </div>
        )}

        {/* Weather Dashboard Views */}
        {weatherData && !isLoading && (
          <div className="space-y-8 animate-fadeIn">
            {/* View 1: Full Overview or Tab Specific */}
            {(activeTab === 'all' || activeTab === 'forecast') && (
              <CurrentWeather
                data={weatherData}
                tempUnit={tempUnit}
                windUnit={windUnit}
              />
            )}

            {/* Hourly & Temperature Curve */}
            {(activeTab === 'all' || activeTab === 'forecast') && (
              <div className="space-y-6">
                <HourlyForecast
                  hourly={weatherData.hourly}
                  timezone={weatherData.timezone}
                  tempUnit={tempUnit}
                  windUnit={windUnit}
                />

                <WeatherChart
                  hourly={weatherData.hourly}
                  timezone={weatherData.timezone}
                  tempUnit={tempUnit}
                />
              </div>
            )}

            {/* 7-Day Extended Forecast */}
            {(activeTab === 'all' || activeTab === 'forecast') && (
              <DailyForecast
                daily={weatherData.daily}
                timezone={weatherData.timezone}
                tempUnit={tempUnit}
                windUnit={windUnit}
              />
            )}

            {/* Smart Activity Planner */}
            {(activeTab === 'all' || activeTab === 'planner') && (
              <PlannerRecommendations
                data={weatherData}
                tempUnit={tempUnit}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium">
            <CloudSun className="w-4 h-4 text-sky-500" />
            <span>Weather Forecast &amp; Planner</span>
          </div>

          <div>
            Powered by{' '}
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-sky-600 dark:text-sky-400 hover:underline"
            >
              Open-Meteo Weather API
            </a>{' '}
            &amp; OpenStreetMap
          </div>
        </div>
      </footer>
    </div>
  );
}
