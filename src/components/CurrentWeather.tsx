import React from 'react';
import {
  Thermometer,
  Wind,
  Droplets,
  Sun,
  Eye,
  Gauge,
  Cloud,
  Compass,
  ArrowDown,
  ArrowUp,
  Sunrise,
  Sunset,
  Sparkles,
} from 'lucide-react';
import { ProcessedWeatherData, TemperatureUnit, WindSpeedUnit } from '../types/weather';
import { formatTemp, formatWind } from '../services/openMeteo';
import { WeatherIcon } from './WeatherIcon';
import { formatWindDirection, getUvCategory, getAirHumidityComfort } from '../utils/weatherCodes';

interface CurrentWeatherProps {
  data: ProcessedWeatherData;
  tempUnit: TemperatureUnit;
  windUnit: WindSpeedUnit;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  data,
  tempUnit,
  windUnit,
}) => {
  const { location, current, daily } = data;
  const condition = current.condition;

  const maxTempToday = daily.temperature2mMax[0] ?? current.temperature;
  const minTempToday = daily.temperature2mMin[0] ?? current.temperature;
  const uvMaxToday = daily.uvIndexMax[0] ?? 0;

  const bgGradient = current.isDay ? condition.bgGradientDay : condition.bgGradientNight;
  const uvInfo = getUvCategory(uvMaxToday);
  const humidityComfort = getAirHumidityComfort(current.relativeHumidity);

  // Format local time
  const localTimeStr = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: data.timezone || undefined,
  });

  const sunriseTime = daily.sunrise[0]
    ? new Date(daily.sunrise[0]).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: data.timezone || undefined,
      })
    : '--:--';

  const sunsetTime = daily.sunset[0]
    ? new Date(daily.sunset[0]).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: data.timezone || undefined,
      })
    : '--:--';

  return (
    <div className="space-y-6">
      {/* Hero Current Weather Banner */}
      <div
        className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br ${bgGradient} border backdrop-blur-xl shadow-lg transition-all duration-300`}
      >
        {/* Subtle decorative glow */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left: Location & Main Condition */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-slate-900/10 dark:bg-white/10 text-slate-800 dark:text-slate-100 backdrop-blur-md">
                Current Conditions
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                Local Time: {localTimeStr}
              </span>
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {location.name}
              </h2>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-1">
                {[location.admin1, location.country].filter(Boolean).join(', ')}
                {location.elevation !== undefined && location.elevation > 0 && (
                  <span className="ml-2 text-xs opacity-75">({Math.round(location.elevation)}m elev)</span>
                )}
              </p>
            </div>

            {/* Condition badge & description */}
            <div className="flex items-center gap-3 pt-1">
              <div className="p-3 bg-white/40 dark:bg-slate-800/50 rounded-2xl border border-white/40 dark:border-slate-700/50 shadow-xs">
                <WeatherIcon
                  name={condition.iconName}
                  className="w-8 h-8 text-sky-600 dark:text-sky-300"
                />
              </div>
              <div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">
                  {condition.label}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1">
                  {condition.description}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Big Temperature & Range */}
          <div className="flex flex-col md:items-end justify-center">
            <div className="flex items-baseline gap-2">
              <span className="text-6xl sm:text-7xl font-black text-slate-900 dark:text-white tracking-tighter">
                {formatTemp(current.temperature, tempUnit)}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
              <span className="flex items-center gap-1">
                <Thermometer className="w-4 h-4 text-sky-500" />
                Feels like {formatTemp(current.apparentTemperature, tempUnit)}
              </span>

              <span className="text-slate-400">•</span>

              <div className="flex items-center gap-2 text-xs bg-white/40 dark:bg-slate-800/40 px-2.5 py-1 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                <span className="flex items-center text-emerald-600 dark:text-emerald-400">
                  <ArrowDown className="w-3.5 h-3.5" />
                  {formatTemp(minTempToday, tempUnit)}
                </span>
                <span className="text-slate-300">/</span>
                <span className="flex items-center text-rose-600 dark:text-rose-400">
                  <ArrowUp className="w-3.5 h-3.5" />
                  {formatTemp(maxTempToday, tempUnit)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Essential Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Wind */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Wind</span>
            <Wind className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            {formatWind(current.windSpeed, windUnit)}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {formatWindDirection(current.windDirection)} ({current.windDirection}°)
            </span>
          </div>
        </div>

        {/* Humidity */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Humidity</span>
            <Droplets className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            {current.relativeHumidity}%
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 truncate" title={humidityComfort}>
            {humidityComfort}
          </div>
        </div>

        {/* UV Index */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">UV Index</span>
            <Sun className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              {uvMaxToday.toFixed(1)}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-md font-semibold border ${uvInfo.colorClass}`}>
              {uvInfo.label}
            </span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
            Peak UV level today
          </div>
        </div>

        {/* Precipitation */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Precipitation</span>
            <Cloud className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            {current.precipitation} mm
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {daily.precipitationProbabilityMax[0] ?? 0}% rain chance
          </div>
        </div>

        {/* Air Pressure */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Pressure</span>
            <Gauge className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            {Math.round(current.pressureMsl)} hPa
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {current.cloudCover}% cloud cover
          </div>
        </div>

        {/* Sunrise & Sunset */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Sun Cycle</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex flex-col gap-1 text-xs">
            <div className="flex items-center justify-between text-slate-800 dark:text-slate-200 font-medium">
              <span className="flex items-center gap-1 text-amber-500">
                <Sunrise className="w-3.5 h-3.5" />
                Rise:
              </span>
              <span>{sunriseTime}</span>
            </div>
            <div className="flex items-center justify-between text-slate-800 dark:text-slate-200 font-medium">
              <span className="flex items-center gap-1 text-rose-500">
                <Sunset className="w-3.5 h-3.5" />
                Set:
              </span>
              <span>{sunsetTime}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
