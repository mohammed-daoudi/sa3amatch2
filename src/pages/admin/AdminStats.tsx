import React from 'react';
import { useNavigate } from 'react-router-dom';
import { statsAPI } from '../../lib/api';
import { Stats } from '../../types';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

const AdminStats: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = React.useState<Stats | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const statsData = await statsAPI.getStats();
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
          <div className="h-64 bg-gray-200 rounded mb-8"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Statistics</h1>
          <p className="text-gray-600">
            Detailed analytics and booking statistics
          </p>
        </div>

        <Button variant="outline" onClick={() => navigate('/admin')}>
          Back to Dashboard
        </Button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Most Popular Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.popularHours}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" label={{ value: 'Hour of Day', position: 'bottom' }} />
                  <YAxis label={{ value: 'Number of Bookings', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => [`${value} bookings`, 'Count']} />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Field</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.revenueByField}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="revenue"
                    nameKey="fieldName"
                    label={({ fieldName, percent }) =>
                      `${fieldName.split(' ')[0]} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {stats?.revenueByField.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} MAD`, 'Revenue']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Bookings by Day of Week</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.bookingsByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} bookings`, 'Count']} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
            <div className="text-3xl font-bold text-primary-600">
              {stats?.revenueByField.reduce((acc, field) => acc + field.revenue, 0)} MAD
            </div>
            <p className="text-sm text-gray-500 mt-1">From all bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">Average Bookings</h3>
            <div className="text-3xl font-bold text-secondary-600">
              {(stats?.totalBookings / 7).toFixed(1)}
            </div>
            <p className="text-sm text-gray-500 mt-1">Per day</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">Approval Rate</h3>
            <div className="text-3xl font-bold text-green-600">
              {stats ? ((stats.approvedBookings / stats.totalBookings) * 100).toFixed(0) : 0}%
            </div>
            <p className="text-sm text-gray-500 mt-1">Approved bookings</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminStats;
