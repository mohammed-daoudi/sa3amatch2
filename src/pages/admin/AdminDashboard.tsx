import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, BarChart3, MapPin, AlertCircle } from 'lucide-react';
import { statsAPI, bookingsAPI } from '../../lib/api';
import { Booking, Stats } from '../../types';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import BookingCard from '../../components/bookings/BookingCard';
import PageLoading from '../../components/ui/PageLoading';
import toast from 'react-hot-toast';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = React.useState<Stats | null>(null);
  const [recentBookings, setRecentBookings] = React.useState<Booking[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [statsData, bookingsData] = await Promise.all([
        statsAPI.getStats(),
        bookingsAPI.getBookings(),
      ]);

      setStats(statsData);
      setRecentBookings(bookingsData.slice(0, 3));
    } catch (error) {
      console.error('Error fetching admin data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load dashboard data';
      setError(errorMessage);
      toast.error('Failed to load dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const statusColors = {
    approved: '#10B981',
    pending: '#F59E0B',
    rejected: '#EF4444',
  };

  const statusData = stats
    ? [
        { name: 'Approved', value: stats.approvedBookings, color: statusColors.approved },
        { name: 'Pending', value: stats.pendingBookings, color: statusColors.pending },
        { name: 'Rejected', value: stats.rejectedBookings, color: statusColors.rejected },
      ]
    : [];

  if (isLoading) {
    return <PageLoading text="Loading dashboard..." />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-1">Failed to load dashboard</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchData}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">
            Manage fields, bookings and view statistics
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
          <Button variant="outline" onClick={() => navigate('/admin/fields')}>
            <MapPin className="h-4 w-4 mr-2" />
            Manage Fields
          </Button>
          <Button variant="outline" onClick={() => navigate('/admin/bookings')}>
            <Calendar className="h-4 w-4 mr-2" />
            Manage Bookings
          </Button>
          <Button variant="outline" onClick={() => navigate('/admin/stats')}>
            <BarChart3 className="h-4 w-4 mr-2" />
            View Statistics
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                <Calendar className="h-6 w-6 text-primary-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                <h3 className="text-2xl font-bold">{stats?.totalBookings || 0}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Approved</p>
                <h3 className="text-2xl font-bold">{stats?.approvedBookings || 0}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
                <svg className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <h3 className="text-2xl font-bold">{stats?.pendingBookings || 0}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Rejected</p>
                <h3 className="text-2xl font-bold">{stats?.rejectedBookings || 0}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Booking Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} bookings`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Popular Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.popularHours}>
                  <XAxis dataKey="hour" label={{ value: 'Hour of Day', position: 'bottom' }} />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} bookings`, 'Count']} />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Bookings</CardTitle>
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/bookings')}>
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  isAdmin={true}
                  onStatusChange={fetchData}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500">No recent bookings found.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
