import React, { useState } from 'react';
import { HourlyWeatherData, TemperatureUnit } from '../types/weather';
import { convertTemp, formatTemp } from '../services/openMeteo';
import { getWmoCondition } from '../utils/weatherCodes';

interface WeatherChartProps {
  hourly: HourlyWeatherData;
  timezone: string;
  tempUnit: TemperatureUnit;
}

export const WeatherChart: React.FC<WeatherChartProps> = ({
  hourly,
  timezone,
  tempUnit,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Take next 24 hours
  const hours = hourly.time.slice(0, 24);
  const tempsCelsius = hourly.temperature2m.slice(0, 24);
  const tempsConverted = tempsCelsius.map((t) => convertTemp(t, tempUnit));
  const rainProbs = hourly.precipitationProbability.slice(0, 24);
  const weatherCodes = hourly.weatherCode.slice(0, 24);

  if (hours.length === 0) return null;

  const minTemp = Math.min(...tempsConverted);
  const maxTemp = Math.max(...tempsConverted);
  const tempRange = Math.max(1, maxTemp - minTemp);

  // SVG dimensions
  const width = 800;
  const height = 180;
  const paddingX = 30;
  const paddingY = 30;
  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  // Calculate points
  const points = tempsConverted.map((temp, i) => {
    const x = paddingX + (i / (hours.length - 1)) * chartW;
    const y = height - paddingY - ((temp - minTemp) / tempRange) * chartH;
    return { x, y, temp, rawTempC: tempsCelsius[i], rainProb: rainProbs[i] ?? 0, code: weatherCodes[i] ?? 0, timeIso: hours[i] };
  });

  // Construct SVG Path
  const dPath = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  // Construct Gradient Area Path
  const areaPath = `${dPath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  const activePoint = hoveredIdx !== null ? points[hoveredIdx] : null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>24-Hour Weather Curve</span>
            <span className="text-xs font-normal text-slate-400">
              (Temperature &amp; Rain Probability)
            </span>
          </h3>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-sky-500 rounded-full" />
            Temperature
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-indigo-400/40 rounded-xs" />
            Rain Chance (%)
          </span>
        </div>
      </div>

      {/* SVG Container */}
      <div className="relative w-full overflow-x-auto no-scrollbar">
        <div className="min-w-[650px]">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto overflow-visible select-none"
          >
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Rain Chance Bar Backgrounds */}
            {points.map((p, i) => {
              const barH = (p.rainProb / 100) * (chartH * 0.5);
              const barY = height - paddingY - barH;
              return (
                <rect
                  key={`rain-${i}`}
                  x={p.x - 8}
                  y={barY}
                  width="16"
                  height={barH}
                  rx="3"
                  className="fill-indigo-500/20 dark:fill-indigo-400/25"
                />
              );
            })}

            {/* Area Fill */}
            <path d={areaPath} fill="url(#tempGradient)" />

            {/* Temperature Line */}
            <path
              d={dPath}
              fill="none"
              stroke="#0284c7"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data Points */}
            {points.map((p, i) => {
              const isSelected = hoveredIdx === i;
              return (
                <g key={`pt-${i}`}>
                  {/* Invisible hit box */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="12"
                    className="fill-transparent cursor-pointer"
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  />

                  {/* Dot */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isSelected ? '6' : '3.5'}
                    className={`transition-all duration-200 ${
                      isSelected
                        ? 'fill-sky-500 stroke-white dark:stroke-slate-900 stroke-2'
                        : 'fill-sky-600 dark:fill-sky-400'
                    }`}
                  />
                </g>
              );
            })}
          </svg>

          {/* Time Labels beneath */}
          <div className="flex justify-between px-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500">
            {points.filter((_, idx) => idx % 3 === 0).map((p, idx) => {
              const timeLabel = new Date(p.timeIso).toLocaleTimeString('en-US', {
                hour: 'numeric',
                timeZone: timezone || undefined,
              });
              return <span key={idx}>{timeLabel}</span>;
            })}
          </div>
        </div>
      </div>

      {/* Interactive Tooltip Card when hovering */}
      {activePoint && (
        <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-xs animate-fadeIn">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-900 dark:text-white text-sm">
              {new Date(activePoint.timeIso).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: timezone || undefined,
              })}
            </span>
            <span className="font-medium text-slate-600 dark:text-slate-300">
              Condition: {getWmoCondition(activePoint.code).label}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-bold text-sky-600 dark:text-sky-400 text-sm">
              {formatTemp(activePoint.rawTempC, tempUnit)}
            </span>
            <span className="text-indigo-600 dark:text-indigo-300 font-semibold">
              ☔ {activePoint.rainProb}% rain chance
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
