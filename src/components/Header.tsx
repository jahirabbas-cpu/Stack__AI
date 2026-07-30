import React from 'react';
import { CloudSun, RotateCw } from 'lucide-react';
import { LocationResult, TemperatureUnit, WindSpeedUnit } from '../types/weather';
import { CitySearch } from './CitySearch';

interface HeaderProps {
  onSelectLocation: (loc: LocationResult) => void;
  currentLocation: LocationResult;
  tempUnit: TemperatureUnit;
  onToggleTempUnit: (unit: TemperatureUnit) => void;
  windUnit: WindSpeedUnit;
  onChangeWindUnit: (unit: WindSpeedUnit) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectLocation,
  currentLocation,
  tempUnit,
  onToggleTempUnit,
  windUnit,
  onChangeWindUnit,
  onRefresh,
  isRefreshing,
}) => {
  return (
    <header className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-sky-500 to-blue-600 rounded-2xl shadow-md text-white">
              <CloudSun className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 dark:text-white text-lg tracking-tight leading-tight">
                Weather &amp; Planner
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Live Open-Meteo &amp; Smart Forecasts
              </p>
            </div>
          </div>

          {/* Unit Toggles for Mobile */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-xl transition disabled:opacity-50"
              title="Refresh Weather Data"
            >
              <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <div className="inline-flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-xs font-semibold">
              <button
                onClick={() => onToggleTempUnit('celsius')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  tempUnit === 'celsius'
                    ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                °C
              </button>
              <button
                onClick={() => onToggleTempUnit('fahrenheit')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  tempUnit === 'fahrenheit'
                    ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                °F
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full md:max-w-xl">
          <CitySearch
            onSelectLocation={onSelectLocation}
            currentLocation={currentLocation}
          />
        </div>

        {/* Desktop Units & Refresh */}
        <div className="hidden md:flex items-center gap-3">
          {/* Temperature Toggle */}
          <div className="inline-flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-semibold border border-slate-200/60 dark:border-slate-700/60">
            <button
              onClick={() => onToggleTempUnit('celsius')}
              className={`px-3 py-1.5 rounded-lg transition ${
                tempUnit === 'celsius'
                  ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              °C
            </button>
            <button
              onClick={() => onToggleTempUnit('fahrenheit')}
              className={`px-3 py-1.5 rounded-lg transition ${
                tempUnit === 'fahrenheit'
                  ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              °F
            </button>
          </div>

          {/* Wind Unit Selector */}
          <select
            value={windUnit}
            onChange={(e) => onChangeWindUnit(e.target.value as WindSpeedUnit)}
            className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
          >
            <option value="kmh">km/h</option>
            <option value="mph">mph</option>
            <option value="ms">m/s</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 rounded-xl transition border border-slate-200/60 dark:border-slate-700/60 disabled:opacity-50"
            title="Refresh weather data"
          >
            <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-sky-500' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
