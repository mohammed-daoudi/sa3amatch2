import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, AlertCircle } from 'lucide-react';
import { bookingsAPI } from '../lib/api';
import { Booking } from '../types';
import { Button } from '../components/ui/Button';
import BookingCard from '../components/bookings/BookingCard';
import PageLoading from '../components/ui/PageLoading';
import toast from 'react-hot-toast';

const BookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = React.useState<Booking[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [activeFilter, setActiveFilter] = React.useState<string>('all');

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const bookingsData = await bookingsAPI.getBookings();
      setBookings(bookingsData);
      setFilteredBookings(bookingsData);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load bookings';
      setError(errorMessage);
      toast.error('Failed to load bookings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBookings();
  }, []);

  React.useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter((booking) => booking.status === activeFilter));
    }
  }, [activeFilter, bookings]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
          <p className="text-gray-600">
            Manage all your field reservations in one place
          </p>
        </div>

        <Button onClick={() => navigate('/fields')}>
          Book a Field
        </Button>
      </div>

      <div className="flex overflow-x-auto pb-2 mb-6">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 whitespace-nowrap rounded-md mr-2 ${
            activeFilter === 'all'
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          All Bookings
        </button>
        <button
          onClick={() => setActiveFilter('pending')}
          className={`px-4 py-2 whitespace-nowrap rounded-md mr-2 ${
            activeFilter === 'pending'
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setActiveFilter('approved')}
          className={`px-4 py-2 whitespace-nowrap rounded-md mr-2 ${
            activeFilter === 'approved'
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          Approved
        </button>
        <button
          onClick={() => setActiveFilter('rejected')}
          className={`px-4 py-2 whitespace-nowrap rounded-md mr-2 ${
            activeFilter === 'rejected'
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          Rejected
        </button>
      </div>

      {isLoading ? (
        <PageLoading showSkeleton={true} skeletonType="cards" />
      ) : error ? (
        <div className="text-center py-16">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-1">Failed to load bookings</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchBookings}>
            Try Again
          </Button>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-16">
          <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-1">No bookings found</h3>
          <p className="text-gray-600 mb-4">
            {activeFilter === 'all'
              ? "You haven't made any bookings yet."
              : `You don't have any ${activeFilter} bookings.`}
          </p>
          <Button onClick={() => navigate('/fields')}>Book a Field</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onStatusChange={fetchBookings}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
