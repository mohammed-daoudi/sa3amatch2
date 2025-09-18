import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Star } from 'lucide-react';
import { Field, Weather } from '../../types';
import { Card, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { weatherAPI } from '../../lib/api';

interface FieldCardProps {
  field: Field;
}

const FieldCard: React.FC<FieldCardProps> = React.memo(({ field }) => {
  const [weather, setWeather] = React.useState<Weather | null>(null);
  const [weatherLoading, setWeatherLoading] = React.useState(true);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  React.useEffect(() => {
    const fetchWeather = async () => {
      try {
        setWeatherLoading(true);
        // Get weather for today
        const today = new Date().toISOString().split('T')[0];
        const weatherData = await weatherAPI.getWeatherForField(field, today);
        setWeather(weatherData);
      } catch (error) {
        console.error('Error fetching weather for field:', error);
      } finally {
        setWeatherLoading(false);
      }
    };

    fetchWeather();
  }, [field]);

  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case 'clear-day':
        return '☀️';
      case 'clear-night':
        return '🌙';
      case 'partly-cloudy-day':
        return '⛅';
      case 'partly-cloudy-night':
        return '🌙';
      case 'cloudy':
        return '☁️';
      case 'rain':
        return '🌧️';
      case 'thunderstorm':
        return '⛈️';
      case 'snow':
        return '❄️';
      case 'fog':
        return '🌫️';
      default:
        return '☀️';
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <Card
      className="overflow-hidden h-full flex flex-col transform transition-transform duration-300 hover:scale-[1.02] focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2"
      role="article"
      aria-labelledby={`field-title-${field.id}`}
    >
      <div className="h-48 overflow-hidden relative bg-gray-200">
        {!imageLoaded && !imageError && (
          <div
            className="absolute inset-0 bg-gray-200 animate-pulse"
            aria-hidden="true"
          />
        )}
        {!imageError ? (
          <img
            src={field.imageUrl}
            alt={`${field.name} football field`}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full bg-gray-300 flex items-center justify-center"
            aria-label="Image not available"
          >
            <MapPin className="h-12 w-12 text-gray-500" aria-hidden="true" />
          </div>
        )}
      </div>
      <CardContent className="flex-grow">
        <div className="mt-2 mb-1 flex items-center">
          <h3
            id={`field-title-${field.id}`}
            className="text-xl font-semibold tracking-tight"
          >
            {field.name}
          </h3>
          <div className="ml-auto flex items-center" aria-label={`Rating: ${field.rating} out of 5 stars`}>
            <Star className="h-4 w-4 text-yellow-400 fill-current" aria-hidden="true" />
            <span className="ml-1 text-sm font-medium">{field.rating}</span>
          </div>
        </div>
        <div className="flex items-start text-sm text-gray-500 mb-2">
          <MapPin className="h-4 w-4 text-primary-500 mr-1 mt-0.5 shrink-0" aria-hidden="true" />
          <span className="line-clamp-1">{field.address}</span>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2 mb-2">{field.description}</p>

        {/* Weather Information */}
        <div className="bg-gray-50 rounded-lg p-2 mb-2" role="region" aria-label="Current weather information">
          {weatherLoading ? (
            <div className="flex items-center justify-center py-1">
              <div className="animate-pulse text-sm text-gray-500">Loading weather...</div>
            </div>
          ) : weather ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-lg mr-2" aria-hidden="true">{getWeatherIcon(weather.icon)}</span>
                <div>
                  <div className="text-sm font-medium text-gray-900">{weather.temperature}°C</div>
                  <div className="text-xs text-gray-500">{weather.condition}</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                <div>Humidity: {weather.humidity}%</div>
                <div>Wind: {weather.windSpeed} km/h</div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-gray-500 text-center py-1">Weather unavailable</div>
          )}
        </div>

        <div className="flex flex-wrap gap-1 mb-2" role="list" aria-label="Field amenities">
          {field.amenities.map((amenity, index) => (
            <span
              key={index}
              role="listitem"
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
            >
              {amenity}
            </span>
          ))}
        </div>
        <div className="flex items-center mt-2 text-sm font-medium text-gray-700">
          <Clock className="h-4 w-4 text-gray-500 mr-1" aria-hidden="true" />
          <span>Starting from</span>
          <span className="ml-auto text-primary-600 font-semibold">{field.pricePerHour} MAD / hour</span>
        </div>
      </CardContent>
      <CardFooter className="pt-4 border-t">
        <Link to={`/fields/${field.id}`} className="w-full">
          <Button
            className="w-full"
            aria-label={`View details for ${field.name}`}
          >
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
});

FieldCard.displayName = 'FieldCard';

export default FieldCard;
