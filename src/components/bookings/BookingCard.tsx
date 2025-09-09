import React from 'react';
import { Heart, Clock, Calendar, MapPin } from 'lucide-react';
import { Booking } from '../../types';
import { Card, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { bookingsAPI } from '../../lib/api';

interface BookingCardProps {
  booking: Booking;
  onStatusChange?: () => void;
  isAdmin?: boolean;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onStatusChange, isAdmin = false }) => {
  const [isFavorite, setIsFavorite] = React.useState(booking.isFavorite || false);
  const [isLoading, setIsLoading] = React.useState(false);

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

  const toggleFavorite = async () => {
    try {
      setIsLoading(true);
      const { isFavorite: newStatus } = await bookingsAPI.toggleFavorite(booking.id);
      setIsFavorite(newStatus);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (status: 'approved' | 'rejected') => {
    try {
      setIsLoading(true);
      await bookingsAPI.updateBookingStatus(booking.id, status);
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (error) {
      console.error('Error updating status:', error);
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

  return (
    <Card className="overflow-hidden">
      <div className="h-32 overflow-hidden relative">
        <img 
          src={booking.field?.imageUrl} 
          alt={booking.field?.name} 
          className="w-full h-full object-cover"
        />
        {!isAdmin && (
          <button 
            className={`absolute top-2 right-2 p-2 rounded-full ${isFavorite ? 'bg-red-500' : 'bg-white'} shadow-md`}
            onClick={toggleFavorite}
            disabled={isLoading}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'text-white fill-current' : 'text-gray-500'}`} />
          </button>
        )}
      </div>
      <CardContent className="pt-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{booking.field?.name}</h3>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(booking.status)}`}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 text-gray-500 mr-2" />
            <span>{booking.field?.address}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-gray-500 mr-2" />
            <span>{formatDate(booking.date)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-gray-500 mr-2" />
            <span>{formatHour(booking.hour)}</span>
          </div>
        </div>
        
        <div className="mt-2 pt-2 border-t border-gray-100 text-sm">
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
          >
            Approve
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            className="flex-1" 
            onClick={() => handleStatusChange('rejected')}
            isLoading={isLoading}
          >
            Reject
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default BookingCard;