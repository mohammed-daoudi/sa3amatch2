import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, AlertCircle } from 'lucide-react';
import { bookingsAPI } from '../lib/api';
import { Booking } from '../types';
import { Button } from '../components/ui/Button';
import BookingCard from '../components/bookings/BookingCard';
import PageLoading from '../components/ui/PageLoading';
import toast from 'react-hot-toast';

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = React.useState<Booking[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchFavorites = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const favoritesData = await bookingsAPI.getFavorites();
      setFavorites(favoritesData);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load favorites';
      setError(errorMessage);
      toast.error('Failed to load favorites. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Favorites</h1>
          <p className="text-gray-600">
            Bookings you've saved for quick reference
          </p>
        </div>

        <Button onClick={() => navigate('/bookings')} variant="outline" className="mt-4 md:mt-0">
          View All Bookings
        </Button>
      </div>

      {isLoading ? (
        <PageLoading showSkeleton={true} skeletonType="cards" />
      ) : error ? (
        <div className="text-center py-16">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-1">Failed to load favorites</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchFavorites}>
            Try Again
          </Button>
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-1">No favorites yet</h3>
          <p className="text-gray-600 mb-4">
            You haven't added any bookings to your favorites.
          </p>
          <Button onClick={() => navigate('/bookings')} variant="outline">
            Go to My Bookings
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onStatusChange={fetchFavorites}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
