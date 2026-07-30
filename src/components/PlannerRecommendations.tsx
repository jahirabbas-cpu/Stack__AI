import React from 'react';
import {
  Shirt,
  Umbrella,
  Sun,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Bike,
  TreePine,
  Car,
  Sparkles,
  Info,
} from 'lucide-react';
import { ProcessedWeatherData, TemperatureUnit } from '../types/weather';
import { generatePlannerAdvice } from '../utils/recommendations';
import { formatTemp } from '../services/openMeteo';

interface PlannerRecommendationsProps {
  data: ProcessedWeatherData;
  tempUnit: TemperatureUnit;
}

export const PlannerRecommendations: React.FC<PlannerRecommendationsProps> = ({
  data,
  tempUnit,
}) => {
  const advice = generatePlannerAdvice(data);
  const { clothing, activities, bestTimeSlots, alertsAndHighlights } = advice;

  const getActivityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Activity':
        return <Activity className="w-5 h-5" />;
      case 'Bike':
        return <Bike className="w-5 h-5" />;
      case 'TreePine':
        return <TreePine className="w-5 h-5" />;
      case 'Car':
        return <Car className="w-5 h-5" />;
      case 'Shirt':
        return <Shirt className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-2xl text-white shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Smart Planning Recommendations
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Calculated for {data.location.name} based on live atmospheric metrics
            </p>
          </div>
        </div>
      </div>

      {/* Alerts & Highlights Banner */}
      {alertsAndHighlights.length > 0 && (
        <div className="space-y-3">
          {alertsAndHighlights.map((alert, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border flex items-start gap-3.5 shadow-xs ${
                alert.type === 'warning'
                  ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800/60 text-amber-900 dark:text-amber-200'
                  : alert.type === 'success'
                  ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
                  : 'bg-sky-50/90 dark:bg-sky-950/40 border-sky-300 dark:border-sky-800/60 text-sky-900 dark:text-sky-200'
              }`}
            >
              <div className="mt-0.5">
                {alert.type === 'warning' ? (
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                ) : alert.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Info className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                )}
              </div>
              <div>
                <h4 className="font-bold text-sm">{alert.title}</h4>
                <p className="text-xs mt-0.5 opacity-90 leading-relaxed">
                  {alert.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Grid: Clothing & Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Clothing & Outfit Recommendations */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-xl">
                  <Shirt className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                  What to Wear Today
                </h4>
              </div>

              {/* Quick gear requirements badges */}
              <div className="flex items-center gap-2">
                {clothing.umbrellaNeeded && (
                  <span
                    className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                    title="Umbrella / Rainwear Needed"
                  >
                    <Umbrella className="w-4 h-4" />
                  </span>
                )}
                {clothing.sunscreenNeeded && (
                  <span
                    className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                    title="Sunscreen & UV Shield Needed"
                  >
                    <Sun className="w-4 h-4" />
                  </span>
                )}
              </div>
            </div>

            {/* Summary */}
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 leading-relaxed">
              &quot;{clothing.summary}&quot;
            </p>

            {/* Item checklist */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Recommended Apparel Checklist
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {clothing.items.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tips */}
          {clothing.tips.length > 0 && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-1">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Comfort Tip:
              </span>{' '}
              {clothing.tips.join(' • ')}
            </div>
          )}
        </div>

        {/* Activity Suitability Scores */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-slate-900 dark:text-white text-base">
              Outdoor Activity Index
            </h4>
            <span className="text-xs text-slate-400">Score out of 100</span>
          </div>

          <div className="space-y-3.5">
            {activities.map((act) => (
              <div
                key={act.name}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-2xs">
                      {getActivityIcon(act.icon)}
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {act.name}
                    </span>
                  </div>

                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-lg font-bold border ${act.colorClass}`}
                  >
                    {act.status} ({act.score}%)
                  </span>
                </div>

                {/* Score Progress Bar */}
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700/80 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-400 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${act.score}%` }}
                  />
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  {act.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Best Outdoor Time Slots Today */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Clock className="w-5 h-5 text-amber-500" />
          <h4 className="font-bold text-slate-900 dark:text-white text-base">
            Optimal Outdoor Time Windows Today
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bestTimeSlots.map((slot) => (
            <div
              key={slot.period}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-2.5 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {slot.period}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {slot.timeRange}
                </span>
              </div>

              <div className="flex items-baseline justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">
                  {slot.conditionLabel}
                </span>
                <span className="font-extrabold text-slate-900 dark:text-white text-base">
                  {formatTemp(slot.avgTemp, tempUnit)}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium border-t border-slate-200/60 dark:border-slate-700/60 pt-2">
                {slot.recommendation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
