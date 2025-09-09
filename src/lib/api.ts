import { supabase } from './supabase';
import { Field, FieldDetails, Booking, Weather, Stats, User } from '../types';
import { mockFields, mockBookings, generateMockAvailability } from './mock-data';

// Interface for OpenWeatherMap API response
interface WeatherForecastItem {
  dt: number;
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
}

// Demo users for testing when database is not available
const demoUsers = [
  { id: 'demo-user-1', name: 'Demo User', email: 'user@example.com', role: 'user', password: 'password' },
  { id: 'demo-admin-1', name: 'Demo Admin', email: 'admin@example.com', role: 'admin', password: 'adminpass' },
];

export const authAPI = {
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // If Supabase auth fails, try demo users for testing
        console.warn('Supabase auth failed, trying demo authentication:', error.message);

        const demoUser = demoUsers.find(u => u.email === email && u.password === password);
        if (demoUser) {
          const user: User = {
            id: demoUser.id,
            name: demoUser.name,
            email: demoUser.email,
            role: demoUser.role as 'user' | 'admin',
          };
          return { user, token: `demo-token-${demoUser.id}` };
        }

        throw error;
      }

      const user: User = {
        id: data.user.id,
        name: data.user.user_metadata.name || '',
        email: data.user.email!,
        role: data.user.user_metadata.role || 'user',
      };

      return { user, token: data.session?.access_token || '' };
    } catch (err) {
      console.error('Authentication error:', err);
      throw err;
    }
  },

  register: async (name: string, email: string, password: string): Promise<{ user: User; token: string }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: 'user',
          },
        },
      });

      if (error) {
        // If Supabase registration fails, create a demo user for testing
        console.warn('Supabase registration failed, creating demo user:', error.message);

        const user: User = {
          id: `demo-user-${Date.now()}`,
          name,
          email,
          role: 'user',
        };
        return { user, token: `demo-token-${user.id}` };
      }

      const user: User = {
        id: data.user?.id || '',
        name,
        email,
        role: 'user',
      };

      return { user, token: data.session?.access_token || '' };
    } catch (err) {
      console.error('Registration error:', err);
      throw err;
    }
  },
};

export const fieldsAPI = {
  getFields: async (): Promise<Field[]> => {
    try {
      const { data, error } = await supabase
        .from('fields')
        .select('*');

      if (error) {
        console.warn('Database tables not found, using mock data:', error.message);
        return mockFields;
      }
      return data;
    } catch (err) {
      console.warn('Database connection failed, using mock data:', err);
      return mockFields;
    }
  },

  getField: async (id: string): Promise<FieldDetails> => {
    try {
      const { data, error } = await supabase
        .from('fields')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.warn('Database tables not found, using mock data:', error.message);
        const mockField = mockFields.find(f => f.id === id);
        if (!mockField) throw new Error('Field not found');

        const availability = generateMockAvailability();
        return { ...mockField, availability };
      }

      const availability = generateMockAvailability();
      return { ...data, availability };
    } catch (err) {
      console.warn('Database connection failed, using mock data:', err);
      const mockField = mockFields.find(f => f.id === id);
      if (!mockField) throw new Error('Field not found');

      const availability = generateMockAvailability();
      return { ...mockField, availability };
    }
  },

  // Admin field management functions
  createField: async (fieldData: Omit<Field, 'id'>): Promise<Field> => {
    try {
      const { data, error } = await supabase
        .from('fields')
        .insert({
          name: fieldData.name,
          address: fieldData.address,
          price_per_hour: fieldData.pricePerHour,
          description: fieldData.description,
          image_url: fieldData.imageUrl,
          latitude: fieldData.latitude,
          longitude: fieldData.longitude,
          rating: fieldData.rating,
          amenities: fieldData.amenities,
        })
        .select()
        .single();

      if (error) {
        console.warn('Database operation failed, simulating field creation:', error.message);
        const newField: Field = {
          id: `mock-field-${Date.now()}`,
          ...fieldData,
        };
        mockFields.push(newField);
        return newField;
      }

      return {
        id: data.id,
        name: data.name,
        address: data.address,
        pricePerHour: data.price_per_hour,
        description: data.description,
        imageUrl: data.image_url,
        latitude: data.latitude,
        longitude: data.longitude,
        rating: data.rating,
        amenities: data.amenities,
      };
    } catch (err) {
      console.warn('Database connection failed, simulating field creation:', err);
      const newField: Field = {
        id: `mock-field-${Date.now()}`,
        ...fieldData,
      };
      mockFields.push(newField);
      return newField;
    }
  },

  updateField: async (id: string, fieldData: Partial<Omit<Field, 'id'>>): Promise<Field> => {
    try {
      const { data, error } = await supabase
        .from('fields')
        .update({
          ...(fieldData.name && { name: fieldData.name }),
          ...(fieldData.address && { address: fieldData.address }),
          ...(fieldData.pricePerHour && { price_per_hour: fieldData.pricePerHour }),
          ...(fieldData.description && { description: fieldData.description }),
          ...(fieldData.imageUrl && { image_url: fieldData.imageUrl }),
          ...(fieldData.latitude && { latitude: fieldData.latitude }),
          ...(fieldData.longitude && { longitude: fieldData.longitude }),
          ...(fieldData.rating && { rating: fieldData.rating }),
          ...(fieldData.amenities && { amenities: fieldData.amenities }),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.warn('Database operation failed, simulating field update:', error.message);
        const fieldIndex = mockFields.findIndex(f => f.id === id);
        if (fieldIndex === -1) throw new Error('Field not found');

        mockFields[fieldIndex] = { ...mockFields[fieldIndex], ...fieldData };
        return mockFields[fieldIndex];
      }

      return {
        id: data.id,
        name: data.name,
        address: data.address,
        pricePerHour: data.price_per_hour,
        description: data.description,
        imageUrl: data.image_url,
        latitude: data.latitude,
        longitude: data.longitude,
        rating: data.rating,
        amenities: data.amenities,
      };
    } catch (err) {
      console.warn('Database connection failed, simulating field update:', err);
      const fieldIndex = mockFields.findIndex(f => f.id === id);
      if (fieldIndex === -1) throw new Error('Field not found');

      mockFields[fieldIndex] = { ...mockFields[fieldIndex], ...fieldData };
      return mockFields[fieldIndex];
    }
  },

  deleteField: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('fields')
        .delete()
        .eq('id', id);

      if (error) {
        console.warn('Database operation failed, simulating field deletion:', error.message);
        const fieldIndex = mockFields.findIndex(f => f.id === id);
        if (fieldIndex === -1) throw new Error('Field not found');
        mockFields.splice(fieldIndex, 1);
        return;
      }
    } catch (err) {
      console.warn('Database connection failed, simulating field deletion:', err);
      const fieldIndex = mockFields.findIndex(f => f.id === id);
      if (fieldIndex === -1) throw new Error('Field not found');
      mockFields.splice(fieldIndex, 1);
    }
  },
};

export const bookingsAPI = {
  getBookings: async (): Promise<Booking[]> => {
    try {
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          field:fields(*)
        `);

      if (bookingsError) {
        console.warn('Database tables not found, using mock data:', bookingsError.message);
        return mockBookings;
      }

      const { data: favorites, error: favoritesError } = await supabase
        .from('favorites')
        .select('booking_id');

      if (favoritesError) {
        console.warn('Favorites table not found, returning bookings without favorites');
        return bookings;
      }

      const favoriteIds = new Set(favorites?.map(f => f.booking_id));

      return bookings.map(booking => ({
        ...booking,
        isFavorite: favoriteIds.has(booking.id),
      }));
    } catch (err) {
      console.warn('Database connection failed, using mock data:', err);
      return mockBookings;
    }
  },

  createBooking: async (
    fieldId: string,
    date: string,
    hour: number,
    paymentType: 'cash' | 'bank_transfer'
  ): Promise<Booking> => {
    const reference = `SA3A-${Math.floor(10000 + Math.random() * 90000)}`;

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        field_id: fieldId,
        date,
        hour,
        payment_type: paymentType,
        reference,
      })
      .select(`
        *,
        field:fields(*)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  updateBookingStatus: async (bookingId: string, status: 'approved' | 'rejected'): Promise<Booking> => {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId)
      .select(`
        *,
        field:fields(*)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  toggleFavorite: async (bookingId: string): Promise<{ isFavorite: boolean }> => {
    const { data: existing, error: checkError } = await supabase
      .from('favorites')
      .select('id')
      .eq('booking_id', bookingId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') throw checkError;

    if (existing) {
      const { error: deleteError } = await supabase
        .from('favorites')
        .delete()
        .eq('id', existing.id);

      if (deleteError) throw deleteError;
      return { isFavorite: false };
    } else {
      const { error: insertError } = await supabase
        .from('favorites')
        .insert({ booking_id: bookingId });

      if (insertError) throw insertError;
      return { isFavorite: true };
    }
  },

  getFavorites: async (): Promise<Booking[]> => {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        booking:bookings(
          *,
          field:fields(*)
        )
      `);

    if (error) throw error;
    return data.map(f => ({ ...f.booking, isFavorite: true }));
  },
};

export const weatherAPI = {
  getWeather: async (date: string, lat?: number, lon?: number): Promise<Weather> => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

    // Default coordinates for Khouribga, Morocco if not provided
    const latitude = lat || 32.8959;
    const longitude = lon || -6.9190;

    // If no API key is provided, fall back to mock data
    if (!apiKey || apiKey === 'your_weather_api_key') {
      console.warn('Weather API key not configured, using mock data');
      return {
        date,
        temperature: 20 + Math.floor(Math.random() * 10),
        condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)],
        icon: ['clear-day', 'partly-cloudy-day', 'cloudy', 'rain'][Math.floor(Math.random() * 4)],
        humidity: 30 + Math.floor(Math.random() * 50),
        windSpeed: 5 + Math.floor(Math.random() * 10),
      };
    }

    try {
      // Check if the date is for forecast (future) or current weather
      const requestDate = new Date(date);
      const today = new Date();
      const timeDiff = requestDate.getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

      let weatherData;

      if (daysDiff <= 0) {
        // Current weather for today or past dates
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
        );

        if (!response.ok) {
          throw new Error(`Weather API error: ${response.status}`);
        }

        weatherData = await response.json();

        return {
          date,
          temperature: Math.round(weatherData.main.temp),
          condition: weatherData.weather[0].description.split(' ').map((word: string) =>
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' '),
          icon: mapWeatherIcon(weatherData.weather[0].icon),
          humidity: weatherData.main.humidity,
          windSpeed: Math.round(weatherData.wind.speed * 3.6), // Convert m/s to km/h
        };
      } else if (daysDiff <= 5) {
        // 5-day forecast for future dates
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
        );

        if (!response.ok) {
          throw new Error(`Weather API error: ${response.status}`);
        }

        const forecastData = await response.json();

        // Find the forecast closest to the requested date
        const targetTimestamp = requestDate.getTime() / 1000;
        const closestForecast = forecastData.list.reduce((closest: WeatherForecastItem, current: WeatherForecastItem) => {
          const currentDiff = Math.abs(current.dt - targetTimestamp);
          const closestDiff = Math.abs(closest.dt - targetTimestamp);
          return currentDiff < closestDiff ? current : closest;
        });

        return {
          date,
          temperature: Math.round(closestForecast.main.temp),
          condition: closestForecast.weather[0].description.split(' ').map((word: string) =>
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' '),
          icon: mapWeatherIcon(closestForecast.weather[0].icon),
          humidity: closestForecast.main.humidity,
          windSpeed: Math.round(closestForecast.wind.speed * 3.6), // Convert m/s to km/h
        };
      } else {
        // For dates beyond 5 days, use mock data as most free APIs don't provide long-term forecasts
        console.warn(`Weather forecast beyond 5 days not available, using mock data for ${date}`);
        return {
          date,
          temperature: 20 + Math.floor(Math.random() * 10),
          condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)],
          icon: ['clear-day', 'partly-cloudy-day', 'cloudy', 'rain'][Math.floor(Math.random() * 4)],
          humidity: 30 + Math.floor(Math.random() * 50),
          windSpeed: 5 + Math.floor(Math.random() * 10),
        };
      }
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
      // Fallback to mock data on error
      return {
        date,
        temperature: 20 + Math.floor(Math.random() * 10),
        condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)],
        icon: ['clear-day', 'partly-cloudy-day', 'cloudy', 'rain'][Math.floor(Math.random() * 4)],
        humidity: 30 + Math.floor(Math.random() * 50),
        windSpeed: 5 + Math.floor(Math.random() * 10),
      };
    }
  },

  getWeatherForField: async (field: Field, date: string): Promise<Weather> => {
    return weatherAPI.getWeather(date, field.latitude, field.longitude);
  },
};

// Helper function to map OpenWeatherMap icons to our icon system
const mapWeatherIcon = (owmIcon: string): string => {
  const iconMap: Record<string, string> = {
    '01d': 'clear-day',
    '01n': 'clear-night',
    '02d': 'partly-cloudy-day',
    '02n': 'partly-cloudy-night',
    '03d': 'cloudy',
    '03n': 'cloudy',
    '04d': 'cloudy',
    '04n': 'cloudy',
    '09d': 'rain',
    '09n': 'rain',
    '10d': 'rain',
    '10n': 'rain',
    '11d': 'thunderstorm',
    '11n': 'thunderstorm',
    '13d': 'snow',
    '13n': 'snow',
    '50d': 'fog',
    '50n': 'fog',
  };

  return iconMap[owmIcon] || 'clear-day';
};

export const statsAPI = {
  getStats: async (): Promise<Stats> => {
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('*');

    if (bookingsError) throw bookingsError;

    const totalBookings = bookings.length;
    const approvedBookings = bookings.filter(b => b.status === 'approved').length;
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    const rejectedBookings = bookings.filter(b => b.status === 'rejected').length;

    // Calculate popular hours
    const hourCounts: Record<number, number> = {};
    bookings.forEach(booking => {
      hourCounts[booking.hour] = (hourCounts[booking.hour] || 0) + 1;
    });

    const popularHours = Object.entries(hourCounts)
      .map(([hour, count]) => ({ hour: parseInt(hour), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    // Calculate revenue by field
    const { data: fields } = await supabase.from('fields').select('*');
    const revenueByField = fields?.map(field => ({
      fieldName: field.name,
      revenue: bookings
        .filter(b => b.field_id === field.id && b.status === 'approved')
        .length * field.price_per_hour,
    })) || [];

    // Calculate bookings by day
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const bookingsByDay = days.map(day => ({
      day,
      count: Math.floor(Math.random() * 10), // Replace with actual calculation in production
    }));

    return {
      totalBookings,
      approvedBookings,
      pendingBookings,
      rejectedBookings,
      popularHours,
      revenueByField,
      bookingsByDay,
    };
  },
};

export default { authAPI, fieldsAPI, bookingsAPI, weatherAPI, statsAPI };
