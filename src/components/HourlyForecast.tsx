import React from 'react';
import { HourlyWeatherData, TemperatureUnit, WindSpeedUnit } from '../types/weather';
import { convertTemp, formatTemp, formatWind } from '../services/openMeteo';
import { WeatherIcon } from './WeatherIcon';
import { getWmoCondition } from '../utils/weatherCodes';

interface HourlyForecastProps {
  hourly: HourlyWeatherData;
  timezone: string;
  tempUnit: TemperatureUnit;
  windUnit: WindSpeedUnit;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({
  hourly,
  timezone,
  tempUnit,
  windUnit,
}) => {
  // Show 24 hours
  const hours = hourly.time.slice(0, 24);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Hourly Weather Timeline
        </h3>
        <span className="text-xs text-slate-400 font-medium">Next 24 Hours</span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
        {hours.map((timeIso, idx) => {
          const rawTemp = hourly.temperature2m[idx] ?? 0;
          const code = hourly.weatherCode[idx] ?? 0;
          const rainProb = hourly.precipitationProbability[idx] ?? 0;
          const wind = hourly.windSpeed10m[idx] ?? 0;
          const condition = getWmoCondition(code);

          const timeLabel = new Date(timeIso).toLocaleTimeString('en-US', {
            hour: 'numeric',
            hour12: true,
            timeZone: timezone || undefined,
          });

          const isNow = idx === 0;

          return (
            <div
              key={timeIso}
              className={`flex-none w-24 p-3.5 rounded-2xl flex flex-col items-center justify-between text-center transition-all duration-200 border ${
                isNow
                  ? 'bg-sky-50 dark:bg-sky-950/50 border-sky-300 dark:border-sky-800 shadow-xs'
                  : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 hover:border-sky-200 dark:hover:border-slate-700'
              }`}
            >
              <span
                className={`text-xs font-bold ${
                  isNow
                    ? 'text-sky-600 dark:text-sky-400'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {isNow ? 'Now' : timeLabel}
              </span>

              <div className="my-2 text-sky-600 dark:text-sky-400">
                <WeatherIcon name={condition.iconName} className="w-7 h-7" />
              </div>

              <span className="text-base font-extrabold text-slate-900 dark:text-white">
                {formatTemp(rawTemp, tempUnit)}
              </span>

              {/* Rain Chance Pill */}
              <div className="mt-1.5 w-full">
                {rainProb > 0 ? (
                  <span className="inline-block w-full py-0.5 px-1 rounded-md bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-bold text-[10px]">
                    💧 {rainProb}%
                  </span>
                ) : (
                  <span className="inline-block w-full text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate">
                    {formatWind(wind, windUnit)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
