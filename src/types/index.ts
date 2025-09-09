export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Field {
  id: string;
  name: string;
  address: string;
  pricePerHour: number;
  description: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  rating: number;
  amenities: string[];
}

export interface FieldDetails extends Field {
  availability: {
    date: string;
    slots: {
      hour: number;
      isAvailable: boolean;
    }[];
  }[];
}

export interface Booking {
  id: string;
  userId: string;
  fieldId: string;
  field?: Field;
  date: string;
  hour: number;
  paymentType: 'cash' | 'bank_transfer';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reference: string;
  isFavorite?: boolean;
}

export interface Weather {
  date: string;
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

export interface Stats {
  totalBookings: number;
  approvedBookings: number;
  pendingBookings: number;
  rejectedBookings: number;
  popularHours: { hour: number; count: number }[];
  revenueByField: { fieldName: string; revenue: number }[];
  bookingsByDay: { day: string; count: number }[];
}