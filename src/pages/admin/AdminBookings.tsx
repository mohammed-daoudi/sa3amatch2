import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Search, Download, Filter } from 'lucide-react';
import { bookingsAPI } from '../../lib/api';
import { Booking } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import BookingCard from '../../components/bookings/BookingCard';
import toast from 'react-hot-toast';

const AdminBookings: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = React.useState<Booking[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeFilter, setActiveFilter] = React.useState<string>('all');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [dateFilter, setDateFilter] = React.useState('');
  const [showFilters, setShowFilters] = React.useState(false);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const bookingsData = await bookingsAPI.getBookings();
      setBookings(bookingsData);
      setFilteredBookings(bookingsData);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBookings();
  }, []);

  React.useEffect(() => {
    let filtered = [...bookings];

    // Filter by status
    if (activeFilter !== 'all') {
      filtered = filtered.filter((booking) => booking.status === activeFilter);
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((booking) =>
        booking.field?.name.toLowerCase().includes(searchLower) ||
        booking.field?.address.toLowerCase().includes(searchLower) ||
        booking.reference.toLowerCase().includes(searchLower)
      );
    }

    // Filter by date
    if (dateFilter) {
      filtered = filtered.filter((booking) => booking.date === dateFilter);
    }

    setFilteredBookings(filtered);
  }, [activeFilter, bookings, searchTerm, dateFilter]);

  const getBookingStats = () => {
    const total = bookings.length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    const approved = bookings.filter(b => b.status === 'approved').length;
    const rejected = bookings.filter(b => b.status === 'rejected').length;

    return { total, pending, approved, rejected };
  };

  const exportBookings = () => {
    try {
      const csvContent = [
        ['Reference', 'Field', 'Date', 'Time', 'Status', 'Payment Type'].join(','),
        ...filteredBookings.map(booking => [
          booking.reference,
          booking.field?.name || 'N/A',
          booking.date,
          `${booking.hour}:00-${booking.hour + 1}:00`,
          booking.status,
          booking.paymentType
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', `bookings-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success('Bookings exported successfully');
    } catch (error) {
      console.error('Error exporting bookings:', error);
      toast.error('Failed to export bookings');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDateFilter('');
    setActiveFilter('all');
  };

  const stats = getBookingStats();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Bookings</h1>
          <p className="text-gray-600">
            Review and manage all field reservations - {filteredBookings.length} of {stats.total} bookings
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" onClick={exportBookings} disabled={filteredBookings.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={() => navigate('/admin')}>
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-500">Total Bookings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-500">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <div className="text-sm text-gray-500">Approved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-sm text-gray-500">Rejected</div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Advanced Filters
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="text"
                    placeholder="Search by field name, address, or reference..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((_, index) => (
            <div key={index} className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-16">
          <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-1">No bookings found</h3>
          <p className="text-gray-600 mb-4">
            {activeFilter === 'all'
              ? "There are no bookings in the system yet."
              : `There are no ${activeFilter} bookings.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              isAdmin={true}
              onStatusChange={fetchBookings}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
