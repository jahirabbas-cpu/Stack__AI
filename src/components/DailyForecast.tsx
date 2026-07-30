import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sun, Wind, CloudRain } from 'lucide-react';
import { DailyWeatherData, TemperatureUnit, WindSpeedUnit } from '../types/weather';
import { convertTemp, formatTemp, formatWind } from '../services/openMeteo';
import { WeatherIcon } from './WeatherIcon';
import { getWmoCondition } from '../utils/weatherCodes';

interface DailyForecastProps {
  daily: DailyWeatherData;
  timezone: string;
  tempUnit: TemperatureUnit;
  windUnit: WindSpeedUnit;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({
  daily,
  timezone,
  tempUnit,
  windUnit,
}) => {
  const [expandedDay, setExpandedDay] = useState<number | null>(0); // Default expand today

  if (!daily || !daily.time || daily.time.length === 0) return null;

  // Compute week's absolute min and max for temperature bar calculation
  const allMaxsC = daily.temperature2mMax;
  const allMinsC = daily.temperature2mMin;

  const weekMinC = Math.min(...allMinsC);
  const weekMaxC = Math.max(...allMaxsC);
  const weekRangeC = Math.max(1, weekMaxC - weekMinC);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            7-Day Extended Forecast
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            Daily temperature trends &amp; rain probability
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        {daily.time.slice(0, 7).map((dateIso, idx) => {
          const dateObj = new Date(dateIso + 'T00:00:00');
          const isToday = idx === 0;

          const dayName = isToday
            ? 'Today'
            : dateObj.toLocaleDateString('en-US', { weekday: 'short' });

          const dateFormatted = dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });

          const maxC = daily.temperature2mMax[idx] ?? 0;
          const minC = daily.temperature2mMin[idx] ?? 0;
          const code = daily.weatherCode[idx] ?? 0;
          const condition = getWmoCondition(code);
          const rainProb = daily.precipitationProbabilityMax[idx] ?? 0;
          const rainSum = daily.precipitationSum[idx] ?? 0;
          const windMax = daily.windSpeed10mMax[idx] ?? 0;
          const uvMax = daily.uvIndexMax[idx] ?? 0;

          const isExpanded = expandedDay === idx;

          // Temperature range bar percentages relative to full week
          const leftPercent = ((minC - weekMinC) / weekRangeC) * 100;
          const widthPercent = Math.max(8, ((maxC - minC) / weekRangeC) * 100);

          return (
            <div
              key={dateIso}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isExpanded
                  ? 'bg-slate-50 dark:bg-slate-800/80 border-sky-300 dark:border-sky-800 shadow-xs'
                  : 'bg-white dark:bg-slate-900/60 border-slate-200/70 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {/* Summary Row */}
              <div
                onClick={() => setExpandedDay(isExpanded ? null : idx)}
                className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
              >
                {/* Day & Date */}
                <div className="flex items-center gap-3 min-w-[140px]">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sky-600 dark:text-sky-400">
                    <WeatherIcon name={condition.iconName} className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                      <span>{dayName}</span>
                      {isToday && (
                        <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.2 rounded bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
                          Now
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400">{dateFormatted}</div>
                  </div>
                </div>

                {/* Condition Label */}
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 sm:w-32 truncate">
                  {condition.label}
                </div>

                {/* Rain Chance Pill */}
                <div className="min-w-[80px]">
                  {rainProb > 0 ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-300 font-bold text-xs border border-blue-200/60 dark:border-blue-900/60">
                      💧 {rainProb}%
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">0% Rain</span>
                  )}
                </div>

                {/* Temperature Range Visualizer Bar */}
                <div className="flex-1 flex items-center gap-2 max-w-xs min-w-[180px]">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 w-10 text-right">
                    {formatTemp(minC, tempUnit)}
                  </span>

                  <div className="relative flex-1 h-2 bg-slate-200 dark:bg-slate-700/60 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 bg-gradient-to-r from-sky-400 to-amber-400 rounded-full"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                    />
                  </div>

                  <span className="text-xs font-bold text-slate-900 dark:text-white w-10">
                    {formatTemp(maxC, tempUnit)}
                  </span>
                </div>

                <div className="text-slate-400 self-center">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </div>

              {/* Expanded Detailed Breakdown */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 bg-white/50 dark:bg-slate-900/50 text-xs grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <CloudRain className="w-3.5 h-3.5 text-blue-500" />
                      Precipitation Volume
                    </span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      {rainSum} mm total
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <Wind className="w-3.5 h-3.5 text-sky-500" />
                      Max Wind Gusts
                    </span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      {formatWind(windMax, windUnit)}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      Max UV Index
                    </span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      {uvMax.toFixed(1)} / 12
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400 font-medium">Feels Like Range</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      {formatTemp(daily.apparentTemperatureMin[idx] ?? minC, tempUnit)} to{' '}
                      {formatTemp(daily.apparentTemperatureMax[idx] ?? maxC, tempUnit)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
