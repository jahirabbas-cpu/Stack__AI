# Weather Forecast & Planner 🌤️

A modern, responsive weather application built with React, TypeScript, and Tailwind CSS. Powered by the free and open-source **Open-Meteo Weather API**, it delivers accurate current weather conditions, 24-hour hourly trends, a 7-day extended forecast, and automated activity and apparel planning recommendations.

---

## ✨ Features

- **Global City Search & Geolocation**:
  - Global city search with instant auto-suggestions.
  - "Near Me" GPS location detection using browser geolocation & reverse geocoding.
  - Bookmark favorite cities and quickly access recent searches.
  - Quick-select buttons for popular worldwide metropolises (New York, London, Tokyo, Paris, Sydney, etc.).

- **Current Weather Dashboard**:
  - Live temperature, "feels like" reading, and daily high/low range.
  - WMO weather condition badges with dynamic sky gradient themes.
  - Metrics grid: Wind speed & direction, humidity comfort level, UV index category, surface pressure, cloud cover, and sunrise/sunset times.

- **Interactive 24-Hour Hourly Timeline & Chart**:
  - Interactive SVG visual curve charting 24-hour temperature and rain probability trends.
  - Scrollable hourly timeline cards with weather icons and rain chance indicators.

- **7-Day Extended Forecast**:
  - Relative temperature range bar visualizers comparing daily highs and lows.
  - Expandable daily details including precipitation volume (mm), max wind gusts, max UV index, and apparent temperature ranges.

- **Smart Outdoor Activity & Outfit Planner**:
  - **What to Wear Today**: Dynamic outfit recommendations and clothing checklists based on current temperature and precipitation.
  - **Gear Alerts**: Automatic detection if an umbrella, raincoat, or sunscreen (SPF 30+) is required.
  - **Outdoor Activity Ratings**: Calculated suitability scores (0-100%) for Running & Jogging, Cycling, Picnics, Road Travel, and Outdoor Clothes Drying.
  - **Optimal Outdoor Time Windows**: Morning, Afternoon, and Evening suitability analysis.

- **Customization**:
  - Seamless unit conversion between Celsius (°C) and Fahrenheit (°F).
  - Configurable wind speed units (km/h, mph, m/s).
  - Preference persistence in browser local storage.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Server**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Weather Data Source**: [Open-Meteo API](https://open-meteo.com/) (No API key required)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Running Locally

1. **Clone or export repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start the development server**:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000`.

---

## 📜 License

This project is open-source and licensed under the Apache-2.0 License.
