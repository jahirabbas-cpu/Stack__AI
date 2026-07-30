export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type WindSpeedUnit = 'kmh' | 'mph' | 'ms';

export interface LocationResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  admin1?: string; // state/region
  admin2?: string;
  admin3?: string;
  admin4?: string;
  country?: string;
  timezone: string;
  population?: number;
}

export interface WmoCondition {
  code: number;
  label: string;
  description: string;
  iconName: string; // lucide icon identifier key
  category: 'clear' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'thunderstorm';
  bgGradientDay: string;
  bgGradientNight: string;
}

export interface CurrentWeatherData {
  time: string;
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  isDay: boolean;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weatherCode: number;
  cloudCover: number;
  pressureMsl: number;
  surfacePressure: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  condition: WmoCondition;
}

export interface HourlyWeatherData {
  time: string[]; // ISO timestamps
  temperature2m: number[];
  relativeHumidity2m: number[];
  apparentTemperature: number[];
  precipitationProbability: number[];
  precipitation: number[];
  weatherCode: number[];
  pressureMsl: number[];
  cloudCover: number[];
  windSpeed10m: number[];
  windDirection10m: number[];
  uvIndex: number[];
}

export interface DailyWeatherData {
  time: string[]; // dates YYYY-MM-DD
  weatherCode: number[];
  temperature2mMax: number[];
  temperature2mMin: number[];
  apparentTemperatureMax: number[];
  apparentTemperatureMin: number[];
  sunrise: string[];
  sunset: string[];
  uvIndexMax: number[];
  precipitationSum: number[];
  rainSum: number[];
  showersSum: number[];
  snowfallSum: number[];
  precipitationHours: number[];
  precipitationProbabilityMax: number[];
  windSpeed10mMax: number[];
  windGusts10mMax: number[];
  windDirection10mDominant: number[];
}

export interface ProcessedWeatherData {
  location: LocationResult;
  current: CurrentWeatherData;
  hourly: HourlyWeatherData;
  daily: DailyWeatherData;
  timezone: string;
  utcOffsetSeconds: number;
}

export interface ActivityRating {
  name: string;
  icon: string;
  score: number; // 0 to 100
  status: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Hazardous';
  reason: string;
  colorClass: string;
}

export interface ClothingRecommendation {
  summary: string;
  items: string[];
  tips: string[];
  umbrellaNeeded: boolean;
  sunscreenNeeded: boolean;
  heavyCoatNeeded: boolean;
}

export interface BestTimeSlot {
  period: string;
  timeRange: string;
  avgTemp: number;
  conditionLabel: string;
  precipitationProb: number;
  suitabilityScore: number;
  recommendation: string;
}

export interface PlannerAdvice {
  clothing: ClothingRecommendation;
  activities: ActivityRating[];
  bestTimeSlots: BestTimeSlot[];
  alertsAndHighlights: {
    type: 'warning' | 'info' | 'success';
    title: string;
    description: string;
  }[];
}
