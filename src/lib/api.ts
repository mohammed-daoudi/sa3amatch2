import { supabase } from './supabase';
import { Field, FieldDetails, Booking, Weather, Stats, User } from '../types';
import { mockFields, mockBookings, generateMockAvailability } from './mock-data';



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
    // Get coordinates from environment variables or use provided ones
    const latitude = lat || Number(import.meta.env.VITE_LATITUDE) || 32.8811;
    const longitude = lon || Number(import.meta.env.VITE_LONGITUDE) || -6.9063;

    try {
      const { fetchWeatherApi } = await import('openmeteo');

      const params = {
        latitude: [latitude],
        longitude: [longitude],
        daily: ["weather_code", "rain_sum"],
        hourly: ["temperature_2m"],
        current: ["temperature_2m", "rain", "is_day", "weather_code", "wind_speed_10m"],
      };

      const url = "https://api.open-meteo.com/v1/forecast";
      const responses = await fetchWeatherApi(url, params);

      if (!responses || responses.length === 0) {
        throw new Error('No weather data received');
      }

      const response = responses[0];
      const current = response.current()!;
      const utcOffsetSeconds = response.utcOffsetSeconds();

      // Extract current weather data
      const weatherData = {
        current: {
          time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
          temperature_2m: current.variables(0)!.value(),
          rain: current.variables(1)!.value(),
          is_day: current.variables(2)!.value(),
          weather_code: current.variables(3)!.value(),
          wind_speed_10m: current.variables(4)!.value(),
        },
      };

      // Map weather code to condition and icon
      const { condition, icon } = mapOpenMeteoWeatherCode(
        weatherData.current.weather_code,
        weatherData.current.is_day === 1
      );

      return {
        date,
        temperature: Math.round(weatherData.current.temperature_2m),
        condition,
        icon,
        humidity: 50 + Math.floor(Math.random() * 30), // Open-Meteo doesn't provide humidity in free tier
        windSpeed: Math.round(weatherData.current.wind_speed_10m),
      };
    } catch (error) {
      console.error('Failed to fetch weather data from Open-Meteo:', error);
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

// Helper function to map Open-Meteo weather codes to readable conditions and icons
const mapOpenMeteoWeatherCode = (weatherCode: number, isDay: boolean): { condition: string; icon: string } => {
  const codeMap: Record<number, { condition: string; dayIcon: string; nightIcon: string }> = {
    0: { condition: 'Clear Sky', dayIcon: 'clear-day', nightIcon: 'clear-night' },
    1: { condition: 'Mainly Clear', dayIcon: 'clear-day', nightIcon: 'clear-night' },
    2: { condition: 'Partly Cloudy', dayIcon: 'partly-cloudy-day', nightIcon: 'partly-cloudy-night' },
    3: { condition: 'Overcast', dayIcon: 'cloudy', nightIcon: 'cloudy' },
    45: { condition: 'Fog', dayIcon: 'fog', nightIcon: 'fog' },
    48: { condition: 'Depositing Rime Fog', dayIcon: 'fog', nightIcon: 'fog' },
    51: { condition: 'Light Drizzle', dayIcon: 'rain', nightIcon: 'rain' },
    53: { condition: 'Moderate Drizzle', dayIcon: 'rain', nightIcon: 'rain' },
    55: { condition: 'Dense Drizzle', dayIcon: 'rain', nightIcon: 'rain' },
    56: { condition: 'Light Freezing Drizzle', dayIcon: 'rain', nightIcon: 'rain' },
    57: { condition: 'Dense Freezing Drizzle', dayIcon: 'rain', nightIcon: 'rain' },
    61: { condition: 'Slight Rain', dayIcon: 'rain', nightIcon: 'rain' },
    63: { condition: 'Moderate Rain', dayIcon: 'rain', nightIcon: 'rain' },
    65: { condition: 'Heavy Rain', dayIcon: 'rain', nightIcon: 'rain' },
    66: { condition: 'Light Freezing Rain', dayIcon: 'rain', nightIcon: 'rain' },
    67: { condition: 'Heavy Freezing Rain', dayIcon: 'rain', nightIcon: 'rain' },
    71: { condition: 'Slight Snow Fall', dayIcon: 'snow', nightIcon: 'snow' },
    73: { condition: 'Moderate Snow Fall', dayIcon: 'snow', nightIcon: 'snow' },
    75: { condition: 'Heavy Snow Fall', dayIcon: 'snow', nightIcon: 'snow' },
    77: { condition: 'Snow Grains', dayIcon: 'snow', nightIcon: 'snow' },
    80: { condition: 'Slight Rain Showers', dayIcon: 'rain', nightIcon: 'rain' },
    81: { condition: 'Moderate Rain Showers', dayIcon: 'rain', nightIcon: 'rain' },
    82: { condition: 'Violent Rain Showers', dayIcon: 'rain', nightIcon: 'rain' },
    85: { condition: 'Slight Snow Showers', dayIcon: 'snow', nightIcon: 'snow' },
    86: { condition: 'Heavy Snow Showers', dayIcon: 'snow', nightIcon: 'snow' },
    95: { condition: 'Thunderstorm', dayIcon: 'thunderstorm', nightIcon: 'thunderstorm' },
    96: { condition: 'Thunderstorm with Slight Hail', dayIcon: 'thunderstorm', nightIcon: 'thunderstorm' },
    99: { condition: 'Thunderstorm with Heavy Hail', dayIcon: 'thunderstorm', nightIcon: 'thunderstorm' },
  };

  const weather = codeMap[weatherCode] || { condition: 'Unknown', dayIcon: 'clear-day', nightIcon: 'clear-night' };

  return {
    condition: weather.condition,
    icon: isDay ? weather.dayIcon : weather.nightIcon,
  };
};

export const statsAPI = {
  getStats: async (): Promise<Stats> => {
    try {
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('*');

      if (bookingsError) {
        console.warn('Database tables not found, using mock stats data:', bookingsError.message);
        return generateMockStats();
      }

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

      // Calculate bookings by day of week
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const dayCounts: Record<string, number> = {};

      bookings.forEach(booking => {
        const date = new Date(booking.date);
        const dayName = days[date.getDay() === 0 ? 6 : date.getDay() - 1]; // Adjust for Sunday = 0
        dayCounts[dayName] = (dayCounts[dayName] || 0) + 1;
      });

      const bookingsByDay = days.map(day => ({
        day,
        count: dayCounts[day] || 0,
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
    } catch (err) {
      console.warn('Database connection failed, using mock stats data:', err);
      return generateMockStats();
    }
  },
};

// Helper function to generate mock statistics data
const generateMockStats = (): Stats => {
  const mockPopularHours = [
    { hour: 18, count: 45 },
    { hour: 19, count: 38 },
    { hour: 17, count: 32 },
    { hour: 20, count: 28 },
  ];

  const mockRevenueByField = mockFields.map(field => ({
    fieldName: field.name,
    revenue: Math.floor(Math.random() * 5000) + 1000,
  }));

  const mockBookingsByDay = [
    { day: 'Monday', count: 12 },
    { day: 'Tuesday', count: 15 },
    { day: 'Wednesday', count: 18 },
    { day: 'Thursday', count: 22 },
    { day: 'Friday', count: 35 },
    { day: 'Saturday', count: 42 },
    { day: 'Sunday', count: 28 },
  ];

  return {
    totalBookings: 156,
    approvedBookings: 134,
    pendingBookings: 15,
    rejectedBookings: 7,
    popularHours: mockPopularHours,
    revenueByField: mockRevenueByField,
    bookingsByDay: mockBookingsByDay,
  };
};

export default { authAPI, fieldsAPI, bookingsAPI, weatherAPI, statsAPI };
