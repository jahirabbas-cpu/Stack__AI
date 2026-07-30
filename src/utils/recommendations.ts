import {
  ProcessedWeatherData,
  PlannerAdvice,
  ActivityRating,
  ClothingRecommendation,
  BestTimeSlot,
} from '../types/weather';
import { getWmoCondition } from './weatherCodes';

export function generatePlannerAdvice(data: ProcessedWeatherData): PlannerAdvice {
  const current = data.current;
  const temp = current.temperature; // Always numeric in Celsius from API before client-side display conversion
  const apparentTemp = current.apparentTemperature;
  const windKm = current.windSpeed;
  const rainMm = current.precipitation;
  const weatherCode = current.weatherCode;
  const conditionCategory = current.condition.category;

  // Hourly arrays
  const hourlyTime = data.hourly.time;
  const hourlyTemp = data.hourly.temperature2m;
  const hourlyRainProb = data.hourly.precipitationProbability;
  const hourlyWeatherCode = data.hourly.weatherCode;

  // Daily arrays (today is index 0)
  const maxTemp = data.daily.temperature2mMax[0] ?? temp;
  const minTemp = data.daily.temperature2mMin[0] ?? temp;
  const maxUv = data.daily.uvIndexMax[0] ?? 0;
  const rainProbToday = data.daily.precipitationProbabilityMax[0] ?? 0;

  // 1. Clothing logic
  const clothing: ClothingRecommendation = {
    summary: '',
    items: [],
    tips: [],
    umbrellaNeeded: rainProbToday > 40 || rainMm > 0.5 || conditionCategory === 'rain' || conditionCategory === 'drizzle',
    sunscreenNeeded: maxUv >= 4,
    heavyCoatNeeded: temp < 8,
  };

  if (temp < 0) {
    clothing.summary = 'Freezing cold outside! Heavy winter thermal layers essential.';
    clothing.items = ['Heavy insulated winter parka', 'Thermal underwear & wool socks', 'Beanie or warm hat', 'Insulated gloves & scarf', 'Waterproof winter boots'];
    clothing.tips = ['Cover all exposed skin to prevent windburn', 'Layering keeps warm air trapped efficiently'];
  } else if (temp < 10) {
    clothing.summary = 'Chilly weather. A warm jacket or coat is needed.';
    clothing.items = ['Warm jacket or fleece coat', 'Long trousers / pants', 'Sweater or hoodie', 'Comfortable closed shoes'];
    clothing.tips = ['A lightweight scarf helps with wind gusts', 'Layer with a warm sweater underneath'];
  } else if (temp < 18) {
    clothing.summary = 'Mild to cool. Light jacket or sweater recommended.';
    clothing.items = ['Light jacket or cardigan', 'Jeans or long pants', 'Long-sleeve shirt or t-shirt with layer', 'Sneakers'];
    clothing.tips = ['Easy to remove a layer if walking in direct sun'];
  } else if (temp < 26) {
    clothing.summary = 'Pleasantly warm! Comfortable summer/spring clothing.';
    clothing.items = ['Breathable cotton t-shirt', 'Shorts or light trousers', 'Sunglasses', 'Light sneakers or sandals'];
    clothing.tips = ['Great weather for short-sleeve tops', 'Stay hydrated if walking prolonged distances'];
  } else if (temp < 33) {
    clothing.summary = 'Warm to hot! Wear lightweight, loose-fitting clothes.';
    clothing.items = ['Short-sleeve shirt / tank top', 'Light shorts or linen pants', 'Sunglasses & sun hat', 'Open footwear or breathable mesh shoes'];
    clothing.tips = ['Opt for light-colored breathable fabrics like linen or moisture-wicking cotton'];
  } else {
    clothing.summary = 'Very hot weather! Ultra-light clothes and strict heat precautions.';
    clothing.items = ['Ultra-light breathable top', 'Shorts', 'Wide-brimmed UV hat', 'UV protection sunglasses'];
    clothing.tips = ['Avoid dark colors', 'Carry a water bottle everywhere'];
  }

  if (clothing.umbrellaNeeded) {
    clothing.items.push('Compact umbrella or raincoat');
    clothing.tips.push('Waterproof footwear recommended due to rain chance');
  }

  if (clothing.sunscreenNeeded) {
    clothing.items.push('Broad-spectrum SPF 30+ sunscreen');
  }

  // 2. Activity Suitability Ratings
  const activities: ActivityRating[] = [];

  // Running / Cycling
  let runScore = 100;
  let runReason = 'Great temperature & mild conditions for a run.';
  if (temp < 2 || temp > 30) {
    runScore -= 35;
    runReason = temp > 30 ? 'High heat strain risk; run early morning or late evening.' : 'Near-freezing temperatures; wear thermals and watch for slick ground.';
  } else if (temp > 24) {
    runScore -= 15;
    runReason = 'Warm temperatures; carry hydration and wear light performance apparel.';
  }
  if (rainProbToday > 60 || conditionCategory === 'rain') {
    runScore -= 40;
    runReason = 'Wet roads and active rain; slick surfaces and low visibility.';
  } else if (rainProbToday > 30) {
    runScore -= 15;
  }
  if (windKm > 35) {
    runScore -= 30;
    runReason += ' Strong crosswinds.';
  }
  runScore = Math.max(10, Math.min(100, runScore));

  activities.push({
    name: 'Running & Jogging',
    icon: 'Activity',
    score: runScore,
    status: getStatusText(runScore),
    reason: runReason,
    colorClass: getStatusColor(runScore),
  });

  // Cycling
  let cycleScore = 100;
  let cycleReason = 'Clear roads and comfortable breeze for cycling.';
  if (windKm > 30) {
    cycleScore -= 45;
    cycleReason = 'High wind speeds make cycling difficult and unsafe on open roads.';
  }
  if (conditionCategory === 'rain' || rainProbToday > 50) {
    cycleScore -= 40;
    cycleReason = 'Rain causes slippery tire traction and reduced brake control.';
  }
  if (temp < 5) {
    cycleScore -= 25;
    cycleReason = 'Cold windchill on face and hands; full thermal cycling gloves needed.';
  }
  cycleScore = Math.max(10, Math.min(100, cycleScore));

  activities.push({
    name: 'Cycling & Biking',
    icon: 'Bike',
    score: cycleScore,
    status: getStatusText(cycleScore),
    reason: cycleReason,
    colorClass: getStatusColor(cycleScore),
  });

  // Picnic & Outdoors
  let picnicScore = 100;
  let picnicReason = 'Lovely conditions for a outdoor picnic or park stroll.';
  if (conditionCategory === 'rain' || conditionCategory === 'drizzle' || rainProbToday > 40) {
    picnicScore -= 65;
    picnicReason = 'Rain or high precipitation chance makes ground damp and blankets wet.';
  }
  if (temp < 14) {
    picnicScore -= 30;
    picnicReason = 'Cool ground temperatures; bring extra insulated seating mats.';
  } else if (temp > 32) {
    picnicScore -= 35;
    picnicReason = 'Hot sun exposure; choose a shaded park under trees.';
  }
  if (windKm > 25) {
    picnicScore -= 25;
    picnicReason += ' Gusty winds may blow away food and napkins.';
  }
  picnicScore = Math.max(10, Math.min(100, picnicScore));

  activities.push({
    name: 'Picnic & Park Outing',
    icon: 'TreePine',
    score: picnicScore,
    status: getStatusText(picnicScore),
    reason: picnicReason,
    colorClass: getStatusColor(picnicScore),
  });

  // Driving & Road Travel
  let driveScore = 100;
  let driveReason = 'Normal driving conditions with good roadway visibility.';
  if (conditionCategory === 'fog') {
    driveScore -= 50;
    driveReason = 'Dense fog alert! Drive with low beams and maintain high safety distance.';
  } else if (conditionCategory === 'rain' && rainMm > 5) {
    driveScore -= 35;
    driveReason = 'Heavy rain and spray on windshields; hydroplaning risk on highways.';
  } else if (conditionCategory === 'snow' || weatherCode >= 70) {
    driveScore -= 60;
    driveReason = 'Icy or snow-covered roads; winter tires or snow chains recommended.';
  } else if (windKm > 45) {
    driveScore -= 30;
    driveReason = 'Strong side gusts affecting high-profile vehicles and highway driving.';
  }
  driveScore = Math.max(10, Math.min(100, driveScore));

  activities.push({
    name: 'Road Travel & Driving',
    icon: 'Car',
    score: driveScore,
    status: getStatusText(driveScore),
    reason: driveReason,
    colorClass: getStatusColor(driveScore),
  });

  // Clothes Drying
  let dryingScore = 100;
  let dryingReason = 'Dry air and breeze will dry laundry quickly outdoors.';
  if (rainProbToday > 30 || conditionCategory === 'rain' || conditionCategory === 'drizzle') {
    dryingScore = 10;
    dryingReason = 'High rain probability! Hang clothes indoors or use a dryer.';
  } else if (current.relativeHumidity > 75) {
    dryingScore -= 45;
    dryingReason = 'High humidity slows down evaporation significantly.';
  } else if (windKm < 5) {
    dryingScore -= 15;
    dryingReason = 'Stagnant air; drying will take a bit longer.';
  }
  dryingScore = Math.max(10, Math.min(100, dryingScore));

  activities.push({
    name: 'Outdoor Clothes Drying',
    icon: 'Shirt',
    score: dryingScore,
    status: getStatusText(dryingScore),
    reason: dryingReason,
    colorClass: getStatusColor(dryingScore),
  });

  // 3. Best Time Slots Analysis for Today
  const bestTimeSlots: BestTimeSlot[] = [];
  
  // Group next 24 hours into 3 periods: Morning (06:00-11:00), Afternoon (12:00-17:00), Evening (18:00-22:00)
  const periods = [
    { key: 'Morning', label: 'Morning', startHour: 6, endHour: 11 },
    { key: 'Afternoon', label: 'Afternoon', startHour: 12, endHour: 17 },
    { key: 'Evening', label: 'Evening', startHour: 18, endHour: 22 },
  ];

  periods.forEach((p) => {
    let count = 0;
    let sumTemp = 0;
    let maxProb = 0;
    let mainCodes: number[] = [];

    hourlyTime.slice(0, 24).forEach((timeIso, idx) => {
      const date = new Date(timeIso);
      const hour = date.getHours();
      if (hour >= p.startHour && hour <= p.endHour) {
        count++;
        sumTemp += hourlyTemp[idx] ?? 20;
        maxProb = Math.max(maxProb, hourlyRainProb[idx] ?? 0);
        mainCodes.push(hourlyWeatherCode[idx] ?? 0);
      }
    });

    if (count > 0) {
      const avgTemp = Math.round(sumTemp / count);
      // Most frequent weather code
      const dominantCode = mainCodes.length > 0 ? mainCodes[0] : 0;
      const cond = getWmoCondition(dominantCode);

      let score = 100;
      if (maxProb > 50) score -= 50;
      else if (maxProb > 20) score -= 20;

      if (avgTemp < 5 || avgTemp > 32) score -= 30;
      else if (avgTemp >= 18 && avgTemp <= 25) score += 10;

      score = Math.max(20, Math.min(100, score));

      let recommendation = 'Ideal window for errands and walks.';
      if (maxProb > 50) recommendation = 'Expect wet spells; bring rain gear.';
      else if (avgTemp > 28) recommendation = 'Warmest part of day; seek shade and stay hydrated.';
      else if (avgTemp < 8) recommendation = 'Crisp & cold; wear thick layers.';

      bestTimeSlots.push({
        period: p.label,
        timeRange: `${String(p.startHour).padStart(2, '0')}:00 – ${String(p.endHour).padStart(2, '0')}:00`,
        avgTemp,
        conditionLabel: cond.label,
        precipitationProb: maxProb,
        suitabilityScore: score,
        recommendation,
      });
    }
  });

  // 4. Alerts and Highlights
  const alertsAndHighlights: PlannerAdvice['alertsAndHighlights'] = [];

  // Rain alert
  if (rainProbToday >= 60 || current.precipitation > 0) {
    alertsAndHighlights.push({
      type: 'warning',
      title: 'Rain Hazard Notice',
      description: `High precipitation likelihood today (${rainProbToday}% max chance). Keep an umbrella or raincoat handy.`,
    });
  }

  // UV Alert
  if (maxUv >= 6) {
    alertsAndHighlights.push({
      type: 'warning',
      title: `High UV Radiation Index (${maxUv.toFixed(1)})`,
      description: 'Peak solar UV rays around midday. Apply sunscreen (SPF 30+) and wear protective sunglasses.',
    });
  }

  // Wind Alert
  if (current.windSpeed > 35 || current.windGusts > 45) {
    alertsAndHighlights.push({
      type: 'warning',
      title: 'Wind Advisory',
      description: `Gusty winds reaching up to ${Math.round(current.windGusts || current.windSpeed)} km/h. Secure loose outdoor objects.`,
    });
  }

  // Pleasant weather highlight
  if (alertsAndHighlights.length === 0 && temp >= 16 && temp <= 26 && rainProbToday < 20) {
    alertsAndHighlights.push({
      type: 'success',
      title: 'Optimal Weather Conditions',
      description: 'Mild temperatures and minimal rain risk today. Perfect day for outdoor activities, sports, and dining!',
    });
  }

  return {
    clothing,
    activities,
    bestTimeSlots,
    alertsAndHighlights,
  };
}

function getStatusText(score: number): ActivityRating['status'] {
  if (score >= 85) return 'Excellent';
  if (score >= 65) return 'Good';
  if (score >= 45) return 'Fair';
  if (score >= 25) return 'Poor';
  return 'Hazardous';
}

function getStatusColor(score: number): string {
  if (score >= 85) return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800/60';
  if (score >= 65) return 'bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-300 dark:border-sky-800/60';
  if (score >= 45) return 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800/60';
  if (score >= 25) return 'bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-300 dark:border-orange-800/60';
  return 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-800/60';
}
