import React from 'react';
import { Heart, Clock, Calendar, MapPin } from 'lucide-react';
import { Booking } from '../../types';
import { Card, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { bookingsAPI } from '../../lib/api';
import toast from 'react-hot-toast';

interface BookingCardProps {
  booking: Booking;
  onStatusChange?: () => void;
  isAdmin?: boolean;
}

const BookingCard: React.FC<BookingCardProps> = React.memo(({ booking, onStatusChange, isAdmin = false }) => {
  const [isFavorite, setIsFavorite] = React.useState(booking.isFavorite || false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusAriaLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Booking approved';
      case 'pending':
        return 'Booking pending approval';
      case 'rejected':
        return 'Booking rejected';
      default:
        return `Booking status: ${status}`;
    }
  };

  const toggleFavorite = async () => {
    try {
      setIsLoading(true);
      const { isFavorite: newStatus } = await bookingsAPI.toggleFavorite(booking.id);
      setIsFavorite(newStatus);
      toast.success(newStatus ? 'Added to favorites' : 'Removed from favorites');
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (status: 'approved' | 'rejected') => {
    try {
      setIsLoading(true);
      await bookingsAPI.updateBookingStatus(booking.id, status);
      toast.success(`Booking ${status} successfully`);
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(`Failed to ${status} booking. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatHour = (hour: number) => {
    return `${hour}:00 - ${hour + 1}:00`;
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
      className="overflow-hidden focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2"
      role="article"
      aria-labelledby={`booking-title-${booking.id}`}
      aria-describedby={`booking-details-${booking.id}`}
    >
      <div className="h-32 overflow-hidden relative bg-gray-200">
        {!imageLoaded && !imageError && (
          <div
            className="absolute inset-0 bg-gray-200 animate-pulse"
            aria-hidden="true"
          />
        )}
        {!imageError ? (
          <img
            src={booking.field?.imageUrl}
            alt={`${booking.field?.name} football field`}
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
            <MapPin className="h-8 w-8 text-gray-500" aria-hidden="true" />
          </div>
        )}
        {!isAdmin && (
          <button
            className={`absolute top-2 right-2 p-2 rounded-full ${isFavorite ? 'bg-red-500' : 'bg-white'} shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
            onClick={toggleFavorite}
            disabled={isLoading}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-pressed={isFavorite}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'text-white fill-current' : 'text-gray-500'}`} aria-hidden="true" />
          </button>
        )}
      </div>
      <CardContent className="pt-4">
        <div className="flex justify-between items-start mb-2">
          <h3
            id={`booking-title-${booking.id}`}
            className="text-lg font-semibold"
          >
            {booking.field?.name}
          </h3>
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(booking.status)}`}
            aria-label={getStatusAriaLabel(booking.status)}
          >
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
        </div>

        <div
          id={`booking-details-${booking.id}`}
          className="space-y-2 text-sm text-gray-600"
          role="group"
          aria-label="Booking details"
        >
          <div className="flex items-center">
            <MapPin className="h-4 w-4 text-gray-500 mr-2" aria-hidden="true" />
            <span>{booking.field?.address}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-gray-500 mr-2" aria-hidden="true" />
            <span>{formatDate(booking.date)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-gray-500 mr-2" aria-hidden="true" />
            <span>{formatHour(booking.hour)}</span>
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-gray-100 text-sm" role="group" aria-label="Payment information">
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Method:</span>
            <span className="font-medium">{booking.paymentType.replace('_', ' ').toUpperCase()}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-gray-600">Reference:</span>
            <span className="font-medium">{booking.reference}</span>
          </div>
        </div>
      </CardContent>

      {isAdmin && booking.status === 'pending' && (
        <CardFooter className="flex justify-between space-x-2 pt-4">
          <Button
            variant="default"
            size="sm"
            className="flex-1"
            onClick={() => handleStatusChange('approved')}
            isLoading={isLoading}
            aria-label={`Approve booking for ${booking.field?.name}`}
          >
            Approve
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex-1"
            onClick={() => handleStatusChange('rejected')}
            isLoading={isLoading}
            aria-label={`Reject booking for ${booking.field?.name}`}
          >
            Reject
          </Button>
        </CardFooter>
      )}
    </Card>
  );
});

BookingCard.displayName = 'BookingCard';

export default BookingCard;
