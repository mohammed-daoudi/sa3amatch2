import React from 'react';
import { Weather } from '../../types';

interface WeatherCardProps {
  weather: Weather;
  className?: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather, className }) => {
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

  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium text-gray-900">Weather Forecast</h3>
          <p className="text-sm text-gray-500">{new Date(weather.date).toLocaleDateString()}</p>
        </div>
        <div className="text-3xl">{getWeatherIcon(weather.icon)}</div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold">{weather.temperature}°C</span>
          <span className="text-gray-600">{weather.condition}</span>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center">
            <span className="text-gray-500 mr-1">Humidity:</span>
            <span>{weather.humidity}%</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-500 mr-1">Wind:</span>
            <span>{weather.windSpeed} km/h</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
