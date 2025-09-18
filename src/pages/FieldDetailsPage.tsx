import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Clock, Star, AlertCircle } from 'lucide-react';
import { fieldsAPI, weatherAPI, bookingsAPI } from '../lib/api';
import { FieldDetails, Weather } from '../types';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import WeatherCard from '../components/ui/WeatherCard';
import AvailabilityPicker from '../components/fields/AvailabilityPicker';
import FieldMap from '../components/map/FieldMap';
import PageLoading from '../components/ui/PageLoading';
import { useAuthStore } from '../lib/auth';
import toast from 'react-hot-toast';

const FieldDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [field, setField] = React.useState<FieldDetails | null>(null);
  const [weather, setWeather] = React.useState<Weather | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);
  const [selectedHour, setSelectedHour] = React.useState<number | null>(null);
  const [paymentType, setPaymentType] = React.useState<'cash' | 'bank_transfer'>('cash');
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isBooking, setIsBooking] = React.useState(false);
  const [bookingSuccess, setBookingSuccess] = React.useState(false);
  const [bookingReference, setBookingReference] = React.useState('');

  const fetchField = React.useCallback(async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);
      const fieldData = await fieldsAPI.getField(id);
      setField(fieldData);

      // Set default selected date to today
      if (fieldData.availability.length > 0) {
        setSelectedDate(fieldData.availability[0].date);

        // Fetch weather for selected date using field coordinates
        try {
          const weatherData = await weatherAPI.getWeatherForField(fieldData, fieldData.availability[0].date);
          setWeather(weatherData);
        } catch (weatherError) {
          console.warn('Failed to load weather data:', weatherError);
          // Weather is not critical, continue without it
        }
      }
    } catch (error) {
      console.error('Error fetching field:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load field details';
      setError(errorMessage);
      toast.error('Failed to load field details');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    fetchField();
  }, [fetchField]);

  const handleDateTimeSelect = async (date: string, hour: number) => {
    setSelectedDate(date);
    setSelectedHour(hour);

    try {
      if (field) {
        const weatherData = await weatherAPI.getWeatherForField(field, date);
        setWeather(weatherData);
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
    }
  };

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to book a field');
      navigate('/login');
      return;
    }

    if (!id || !selectedDate || selectedHour === null) {
      toast.error('Please select a date and time');
      return;
    }

    try {
      setIsBooking(true);
      const booking = await bookingsAPI.createBooking(
        id,
        selectedDate,
        selectedHour,
        paymentType
      );

      setBookingSuccess(true);
      setBookingReference(booking.reference);
      toast.success('Booking successful!');
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking');
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return <PageLoading showSkeleton={true} skeletonType="form" />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
        <h2 className="text-2xl font-bold mb-4">Failed to load field details</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <div className="flex justify-center gap-4">
          <Button onClick={fetchField}>Try Again</Button>
          <Button variant="outline" onClick={() => navigate('/fields')}>Browse Fields</Button>
        </div>
      </div>
    );
  }

  if (!field) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Field not found</h2>
        <p className="text-gray-600 mb-6">The field you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/fields')}>Browse Fields</Button>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Your booking for {field.name} on {new Date(selectedDate!).toLocaleDateString()} at {selectedHour}:00 has been confirmed.
          </p>

          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <div className="text-sm text-gray-600 mb-1">Booking Reference:</div>
            <div className="text-xl font-semibold">{bookingReference}</div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate('/bookings')}>
              View My Bookings
            </Button>
            <Button onClick={() => navigate('/fields')}>
              Book Another Field
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative h-80 overflow-hidden rounded-lg mb-6">
            <img
              src={field.imageUrl}
              alt={field.name}
              className="w-full h-full object-cover"
            />
          </div>

          <h1 className="text-3xl font-bold mb-2">{field.name}</h1>

          <div className="flex items-center mb-4">
            <div className="flex items-center text-yellow-500 mr-4">
              <Star className="h-5 w-5 fill-current" />
              <span className="ml-1 font-medium">{field.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{field.address}</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">About this field</h2>
            <p className="text-gray-600 mb-4">{field.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {field.amenities.map((amenity, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Location</h2>
            <div className="h-64 rounded-lg overflow-hidden">
              <FieldMap
                fields={[field]}
                center={[field.latitude, field.longitude]}
                zoom={15}
                height="100%"
                selectedFieldId={field.id}
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Card className="p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-primary-600">
                  {field.pricePerHour} MAD
                </span>
                <span className="text-gray-500">per hour</span>
              </div>

              {weather && (
                <WeatherCard weather={weather} className="mb-6" />
              )}

              <div className="mb-6">
                <AvailabilityPicker
                  availability={field.availability}
                  onSelect={handleDateTimeSelect}
                  selectedDate={selectedDate || undefined}
                  selectedHour={selectedHour ?? undefined}
                />
              </div>

              {selectedDate && selectedHour !== null && (
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Payment Method</h3>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentType('cash')}
                      className={`flex-1 py-2 px-3 rounded-md border ${
                        paymentType === 'cash'
                          ? 'border-primary-500 bg-primary-50 text-primary-800'
                          : 'border-gray-300 text-gray-700'
                      }`}
                    >
                      Cash
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentType('bank_transfer')}
                      className={`flex-1 py-2 px-3 rounded-md border ${
                        paymentType === 'bank_transfer'
                          ? 'border-primary-500 bg-primary-50 text-primary-800'
                          : 'border-gray-300 text-gray-700'
                      }`}
                    >
                      Bank Transfer
                    </button>
                  </div>
                </div>
              )}

              <Button
                className="w-full"
                disabled={!selectedDate || selectedHour === null || isBooking}
                isLoading={isBooking}
                onClick={handleBooking}
              >
                Book Now
              </Button>

              <div className="mt-4 text-center text-sm text-gray-500">
                You won't be charged yet. Payment details will be collected after booking.
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Contact Field Owner</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-500 mr-2" />
                  <span>+212 6XX XXX XXX</span>
                </div>
                <div className="flex items-start">
                  <Clock className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">Opening Hours</p>
                    <p className="text-sm text-gray-600">8:00 AM - 10:00 PM</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldDetailsPage;
