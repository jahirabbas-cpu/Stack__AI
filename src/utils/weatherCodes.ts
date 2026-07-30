import { WmoCondition } from '../types/weather';

export const WMO_CODES: Record<number, WmoCondition> = {
  0: {
    code: 0,
    label: 'Clear Sky',
    description: 'Bright and clear skies with maximum sunlight',
    iconName: 'Sun',
    category: 'clear',
    bgGradientDay: 'from-amber-400/20 via-sky-400/20 to-blue-500/20 border-amber-300/30',
    bgGradientNight: 'from-slate-900 via-indigo-950 to-slate-900 border-indigo-500/20',
  },
  1: {
    code: 1,
    label: 'Mainly Clear',
    description: 'Mostly sunny with faint high clouds',
    iconName: 'SunDim',
    category: 'clear',
    bgGradientDay: 'from-amber-300/20 via-sky-300/20 to-blue-400/20 border-sky-300/30',
    bgGradientNight: 'from-slate-900 via-slate-800 to-indigo-950 border-slate-700/30',
  },
  2: {
    code: 2,
    label: 'Partly Cloudy',
    description: 'Mix of sunshine and scattered clouds',
    iconName: 'CloudSun',
    category: 'cloudy',
    bgGradientDay: 'from-sky-400/20 via-blue-400/20 to-slate-500/20 border-sky-400/30',
    bgGradientNight: 'from-slate-900 via-indigo-900/60 to-slate-800 border-indigo-800/30',
  },
  3: {
    code: 3,
    label: 'Overcast',
    description: 'Dense cloud cover blocking direct sunlight',
    iconName: 'Cloud',
    category: 'cloudy',
    bgGradientDay: 'from-slate-400/20 via-gray-400/20 to-zinc-500/20 border-slate-300/30',
    bgGradientNight: 'from-zinc-900 via-slate-900 to-zinc-950 border-zinc-800/30',
  },
  45: {
    code: 45,
    label: 'Foggy',
    description: 'Thick fog reducing visibility significantly',
    iconName: 'CloudFog',
    category: 'fog',
    bgGradientDay: 'from-slate-300/30 via-zinc-400/20 to-gray-500/20 border-slate-300/40',
    bgGradientNight: 'from-slate-900 via-zinc-900 to-slate-950 border-zinc-700/30',
  },
  48: {
    code: 48,
    label: 'Rime Fog',
    description: 'Freezing fog creating icy surfaces',
    iconName: 'CloudFog',
    category: 'fog',
    bgGradientDay: 'from-cyan-300/20 via-slate-300/20 to-blue-400/20 border-cyan-300/30',
    bgGradientNight: 'from-cyan-950 via-slate-900 to-indigo-950 border-cyan-800/30',
  },
  51: {
    code: 51,
    label: 'Light Drizzle',
    description: 'Very light, fine rain misting through the air',
    iconName: 'CloudDrizzle',
    category: 'drizzle',
    bgGradientDay: 'from-sky-300/20 via-blue-300/20 to-slate-400/20 border-sky-300/30',
    bgGradientNight: 'from-slate-900 via-blue-950 to-slate-900 border-blue-900/30',
  },
  53: {
    code: 53,
    label: 'Moderate Drizzle',
    description: 'Steady light drizzle wet surface conditions',
    iconName: 'CloudDrizzle',
    category: 'drizzle',
    bgGradientDay: 'from-blue-400/20 via-sky-400/20 to-slate-500/20 border-blue-300/30',
    bgGradientNight: 'from-slate-900 via-sky-950 to-slate-900 border-blue-800/30',
  },
  55: {
    code: 55,
    label: 'Dense Drizzle',
    description: 'Heavy drizzle with high humidity and mist',
    iconName: 'CloudDrizzle',
    category: 'drizzle',
    bgGradientDay: 'from-blue-500/20 via-slate-400/20 to-indigo-500/20 border-blue-400/30',
    bgGradientNight: 'from-slate-950 via-blue-900/40 to-slate-900 border-blue-700/30',
  },
  56: {
    code: 56,
    label: 'Light Freezing Drizzle',
    description: 'Freezing mist causing slippery roads and paths',
    iconName: 'CloudHail',
    category: 'drizzle',
    bgGradientDay: 'from-cyan-400/20 via-sky-300/20 to-blue-400/20 border-cyan-300/30',
    bgGradientNight: 'from-cyan-950 via-slate-900 to-indigo-950 border-cyan-800/30',
  },
  57: {
    code: 57,
    label: 'Dense Freezing Drizzle',
    description: 'Heavy freezing drizzle with ice buildup',
    iconName: 'CloudHail',
    category: 'drizzle',
    bgGradientDay: 'from-cyan-500/25 via-blue-400/20 to-slate-500/20 border-cyan-400/30',
    bgGradientNight: 'from-cyan-950 via-blue-950 to-slate-950 border-cyan-700/30',
  },
  61: {
    code: 61,
    label: 'Slight Rain',
    description: 'Gentle rainfall, sporadic wet spells',
    iconName: 'CloudRain',
    category: 'rain',
    bgGradientDay: 'from-blue-400/20 via-sky-500/20 to-slate-600/20 border-blue-300/30',
    bgGradientNight: 'from-slate-900 via-blue-950 to-slate-950 border-blue-800/30',
  },
  63: {
    code: 63,
    label: 'Moderate Rain',
    description: 'Continuous steady rain shower',
    iconName: 'CloudRain',
    category: 'rain',
    bgGradientDay: 'from-blue-500/20 via-indigo-400/20 to-slate-600/20 border-blue-400/30',
    bgGradientNight: 'from-slate-950 via-indigo-950 to-blue-950 border-indigo-800/30',
  },
  65: {
    code: 65,
    label: 'Heavy Rain',
    description: 'Torrential downpour with puddles and runoff',
    iconName: 'CloudRainWind',
    category: 'rain',
    bgGradientDay: 'from-blue-600/25 via-slate-600/20 to-indigo-700/20 border-blue-500/30',
    bgGradientNight: 'from-slate-950 via-blue-950 to-zinc-950 border-blue-700/30',
  },
  66: {
    code: 66,
    label: 'Light Freezing Rain',
    description: 'Cold rain freezing upon ground contact',
    iconName: 'CloudHail',
    category: 'rain',
    bgGradientDay: 'from-sky-400/20 via-cyan-400/20 to-slate-500/20 border-sky-300/30',
    bgGradientNight: 'from-slate-900 via-cyan-950 to-slate-950 border-cyan-800/30',
  },
  67: {
    code: 67,
    label: 'Heavy Freezing Rain',
    description: 'Dangerous freezing rain creating black ice',
    iconName: 'CloudHail',
    category: 'rain',
    bgGradientDay: 'from-cyan-600/25 via-slate-500/20 to-blue-600/20 border-cyan-400/30',
    bgGradientNight: 'from-slate-950 via-cyan-950 to-blue-950 border-cyan-700/30',
  },
  71: {
    code: 71,
    label: 'Slight Snow',
    description: 'Light snowfall dusting surfaces',
    iconName: 'CloudSnow',
    category: 'snow',
    bgGradientDay: 'from-sky-200/30 via-indigo-200/20 to-cyan-300/20 border-sky-200/40',
    bgGradientNight: 'from-slate-900 via-indigo-950 to-slate-900 border-indigo-800/30',
  },
  73: {
    code: 73,
    label: 'Moderate Snow',
    description: 'Steady snowfall accumulating on roads and grass',
    iconName: 'CloudSnow',
    category: 'snow',
    bgGradientDay: 'from-sky-300/30 via-slate-200/20 to-indigo-300/20 border-sky-300/40',
    bgGradientNight: 'from-slate-950 via-sky-950 to-indigo-950 border-sky-800/30',
  },
  75: {
    code: 75,
    label: 'Heavy Snow',
    description: 'Dense snowstorm with heavy accumulation',
    iconName: 'Snowflake',
    category: 'snow',
    bgGradientDay: 'from-indigo-300/30 via-sky-200/30 to-blue-300/20 border-indigo-300/40',
    bgGradientNight: 'from-slate-950 via-indigo-900/60 to-slate-950 border-indigo-700/30',
  },
  77: {
    code: 77,
    label: 'Snow Grains',
    description: 'Tiny white opaque ice grains falling',
    iconName: 'Snowflake',
    category: 'snow',
    bgGradientDay: 'from-cyan-200/30 via-sky-200/20 to-slate-300/20 border-cyan-300/40',
    bgGradientNight: 'from-slate-900 via-slate-800 to-cyan-950 border-cyan-800/30',
  },
  80: {
    code: 80,
    label: 'Slight Rain Showers',
    description: 'Brief passing light rain showers with clear breaks',
    iconName: 'CloudRain',
    category: 'rain',
    bgGradientDay: 'from-sky-400/20 via-blue-400/20 to-amber-300/20 border-sky-300/30',
    bgGradientNight: 'from-slate-900 via-blue-950 to-indigo-950 border-blue-900/30',
  },
  81: {
    code: 81,
    label: 'Moderate Rain Showers',
    description: 'Periodic heavy bursts of rain',
    iconName: 'CloudRain',
    category: 'rain',
    bgGradientDay: 'from-blue-500/20 via-sky-500/20 to-slate-500/20 border-blue-400/30',
    bgGradientNight: 'from-slate-950 via-blue-950 to-slate-900 border-blue-800/30',
  },
  82: {
    code: 82,
    label: 'Violent Rain Showers',
    description: 'Sudden downpours with flash flooding risks',
    iconName: 'CloudRainWind',
    category: 'rain',
    bgGradientDay: 'from-blue-600/25 via-indigo-600/20 to-slate-700/20 border-blue-500/30',
    bgGradientNight: 'from-slate-950 via-blue-950 to-zinc-950 border-blue-700/30',
  },
  85: {
    code: 85,
    label: 'Light Snow Showers',
    description: 'Passing bursts of flurries',
    iconName: 'CloudSnow',
    category: 'snow',
    bgGradientDay: 'from-sky-300/30 via-cyan-200/20 to-slate-300/20 border-sky-300/40',
    bgGradientNight: 'from-slate-900 via-indigo-950 to-slate-900 border-indigo-800/30',
  },
  86: {
    code: 86,
    label: 'Heavy Snow Showers',
    description: 'Intense sudden snow squalls',
    iconName: 'Snowflake',
    category: 'snow',
    bgGradientDay: 'from-indigo-300/30 via-cyan-300/30 to-slate-300/20 border-indigo-300/40',
    bgGradientNight: 'from-slate-950 via-indigo-950 to-cyan-950 border-indigo-700/30',
  },
  95: {
    code: 95,
    label: 'Thunderstorm',
    description: 'Thunder and lightning with rain showers',
    iconName: 'CloudLightning',
    category: 'thunderstorm',
    bgGradientDay: 'from-amber-500/20 via-purple-600/20 to-slate-700/25 border-amber-400/30',
    bgGradientNight: 'from-slate-950 via-purple-950 to-slate-950 border-amber-500/20',
  },
  96: {
    code: 96,
    label: 'Thunderstorm with Hail',
    description: 'Severe storm with small ice hail pellets',
    iconName: 'CloudLightning',
    category: 'thunderstorm',
    bgGradientDay: 'from-amber-500/20 via-indigo-600/25 to-slate-800/25 border-amber-400/30',
    bgGradientNight: 'from-slate-950 via-indigo-950 to-purple-950 border-amber-500/20',
  },
  99: {
    code: 99,
    label: 'Heavy Hail Thunderstorm',
    description: 'Severe thunderstorm with large damaging hail',
    iconName: 'CloudLightning',
    category: 'thunderstorm',
    bgGradientDay: 'from-red-500/20 via-purple-700/25 to-slate-900/30 border-red-400/30',
    bgGradientNight: 'from-slate-950 via-purple-950 to-red-950 border-red-500/20',
  },
};

export function getWmoCondition(code: number): WmoCondition {
  return (
    WMO_CODES[code] || {
      code,
      label: 'Unknown Weather',
      description: 'Weather condition information unavailable',
      iconName: 'Cloud',
      category: 'cloudy',
      bgGradientDay: 'from-sky-400/20 via-blue-400/20 to-slate-400/20 border-sky-300/30',
      bgGradientNight: 'from-slate-900 via-slate-800 to-indigo-950 border-slate-700/30',
    }
  );
}

export function formatWindDirection(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index];
}

export function getUvCategory(uv: number): { label: string; colorClass: string; advice: string } {
  if (uv <= 2) {
    return {
      label: 'Low',
      colorClass: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/50',
      advice: 'Minimal sun danger. Great for outdoor walks without extra gear.',
    };
  } else if (uv <= 5) {
    return {
      label: 'Moderate',
      colorClass: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/50',
      advice: 'Wear sunglasses and apply SPF 30+ if staying outdoors over 45 minutes.',
    };
  } else if (uv <= 7) {
    return {
      label: 'High',
      colorClass: 'text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800/50',
      advice: 'Sun protection essential! Wear a wide hat, sunglasses, and reapply sunscreen.',
    };
  } else if (uv <= 10) {
    return {
      label: 'Very High',
      colorClass: 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/50',
      advice: 'Avoid midday sun exposure between 11 AM – 3 PM. Seek shade and cover up.',
    };
  } else {
    return {
      label: 'Extreme',
      colorClass: 'text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/50',
      advice: 'Dangerous solar radiation! Stay indoors or fully covered if outdoors.',
    };
  }
}

export function getAirHumidityComfort(humidity: number): string {
  if (humidity < 30) return 'Dry Air (Hydrate & moisturize)';
  if (humidity <= 55) return 'Comfortable & Pleasant';
  if (humidity <= 70) return 'Slightly Humid / Sticky';
  return 'Very Humid / Muggy';
}
