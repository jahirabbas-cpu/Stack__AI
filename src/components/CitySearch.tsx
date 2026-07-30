import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Star, History, Loader2, X } from 'lucide-react';
import { LocationResult } from '../types/weather';
import { searchCities, reverseGeocode } from '../services/openMeteo';
import { POPULAR_CITIES } from '../utils/popularCities';

interface CitySearchProps {
  onSelectLocation: (location: LocationResult) => void;
  currentLocation: LocationResult;
}

export const CitySearch: React.FC<CitySearchProps> = ({
  onSelectLocation,
  currentLocation,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // Favorites & Recents in local state
  const [favorites, setFavorites] = useState<LocationResult[]>(() => {
    try {
      const saved = localStorage.getItem('weather_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recents, setRecents] = useState<LocationResult[]>(() => {
    try {
      const saved = localStorage.getItem('weather_recents');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search call
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      const data = await searchCities(query);
      setResults(data);
      setIsLoading(false);
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (loc: LocationResult) => {
    onSelectLocation(loc);
    setQuery('');
    setIsOpen(false);

    // Save to recents (max 5)
    setRecents((prev) => {
      const filtered = prev.filter((item) => item.id !== loc.id);
      const updated = [loc, ...filtered].slice(0, 5);
      try {
        localStorage.setItem('weather_recents', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save recents', err);
      }
      return updated;
    });
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const loc = await reverseGeocode(position.coords.latitude, position.coords.longitude);
          handleSelect(loc);
        } catch (err) {
          console.error('Failed to resolve current location:', err);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        alert(`Location access denied or unavailable: ${error.message}`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const toggleFavorite = (e: React.MouseEvent, loc: LocationResult) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const isFav = prev.some((item) => item.id === loc.id);
      const updated = isFav ? prev.filter((item) => item.id !== loc.id) : [...prev, loc];
      try {
        localStorage.setItem('weather_favorites', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save favorites', err);
      }
      return updated;
    });
  };

  const isCurrentFavorite = favorites.some((f) => f.id === currentLocation.id);

  return (
    <div className="w-full max-w-2xl mx-auto" ref={searchContainerRef}>
      <div className="relative">
        <div className="relative flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-sky-500 focus-within:border-sky-500 transition-all duration-200">
          <div className="pl-4 text-slate-400">
            <Search className="w-5 h-5" />
          </div>

          <input
            type="text"
            className="w-full py-3.5 pl-3 pr-24 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 bg-transparent text-base focus:outline-none"
            placeholder="Search city, region, or country..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
          />

          <div className="absolute right-3 flex items-center gap-1.5">
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setResults([]);
                }}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              title="Use current GPS location"
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/60 rounded-xl transition border border-sky-200 dark:border-sky-800/50 disabled:opacity-50"
            >
              {isLocating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <MapPin className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">{isLocating ? 'Locating...' : 'Near Me'}</span>
            </button>
          </div>
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 max-h-[420px] overflow-y-auto">
            {/* Search Results */}
            {isLoading ? (
              <div className="flex items-center justify-center p-6 text-slate-400 text-sm gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
                <span>Searching locations worldwide...</span>
              </div>
            ) : query.trim().length >= 2 ? (
              results.length > 0 ? (
                <div className="py-2">
                  <div className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Search Results ({results.length})
                  </div>
                  {results.map((loc) => {
                    const isFav = favorites.some((f) => f.id === loc.id);
                    return (
                      <div
                        key={loc.id}
                        onClick={() => handleSelect(loc)}
                        className="w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition"
                      >
                        <div>
                          <div className="font-medium text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                            <span>{loc.name}</span>
                            {loc.country_code && (
                              <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                                {loc.country_code}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {[loc.admin1, loc.country].filter(Boolean).join(', ')}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => toggleFavorite(e, loc)}
                          className="p-1.5 text-slate-400 hover:text-amber-500 rounded-full transition"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              isFav ? 'fill-amber-400 text-amber-400' : 'text-slate-400'
                            }`}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 text-center text-slate-500 dark:text-slate-400 text-sm">
                  No matching cities found for &quot;{query}&quot;. Try searching with another spelling.
                </div>
              )
            ) : null}

            {/* Saved Favorites Section */}
            {favorites.length > 0 && !query && (
              <div className="py-2">
                <div className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  Favorite Cities
                </div>
                {favorites.map((fav) => (
                  <div
                    key={fav.id}
                    onClick={() => handleSelect(fav)}
                    className="w-full px-4 py-2 flex items-center justify-between hover:bg-amber-50/50 dark:hover:bg-amber-950/20 cursor-pointer transition text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {fav.name}
                      </span>
                      <span className="text-xs text-slate-400">
                        {[fav.admin1, fav.country].filter(Boolean).join(', ')}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(e, fav)}
                      className="p-1 text-amber-500 hover:text-slate-400 transition"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {recents.length > 0 && !query && (
              <div className="py-2">
                <div className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5" />
                  Recent Searches
                </div>
                {recents.map((rec) => (
                  <div
                    key={rec.id}
                    onClick={() => handleSelect(rec)}
                    className="w-full px-4 py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition text-sm"
                  >
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {rec.name}
                    </span>
                    <span className="text-xs text-slate-400">{rec.country}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Popular Cities */}
            {!query && (
              <div className="py-2.5 px-4 bg-slate-50/60 dark:bg-slate-950/40">
                <div className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-2">
                  Popular Worldwide Cities
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_CITIES.slice(0, 6).map((city) => (
                    <button
                      key={city.id}
                      type="button"
                      onClick={() => handleSelect(city)}
                      className="px-2.5 py-1 text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-lg text-slate-700 dark:text-slate-300 hover:border-sky-400 hover:text-sky-600 dark:hover:text-sky-400 transition"
                    >
                      {city.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Favorite Star Button on current city */}
      <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <span className="text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap">
            Popular:
          </span>
          {POPULAR_CITIES.map((pop) => (
            <button
              key={pop.id}
              onClick={() => handleSelect(pop)}
              className={`px-2 py-0.5 rounded-full text-xs font-medium transition whitespace-nowrap ${
                currentLocation.id === pop.id
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {pop.name}
            </button>
          ))}
        </div>

        <button
          onClick={(e) => toggleFavorite(e, currentLocation)}
          className="flex items-center gap-1 ml-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-amber-500 transition whitespace-nowrap"
        >
          <Star
            className={`w-3.5 h-3.5 ${
              isCurrentFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-400'
            }`}
          />
          <span>{isCurrentFavorite ? 'Favorited' : 'Bookmark City'}</span>
        </button>
      </div>
    </div>
  );
};
