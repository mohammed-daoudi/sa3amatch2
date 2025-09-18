import { Field, Booking, User } from '../types';

export const mockFields: Field[] = [
  {
    id: '1',
    name: 'Stadium Khouribga',
    address: 'Boulevard Mohammed V, Khouribga',
    pricePerHour: 150,
    description: 'Modern football field with high-quality grass and professional lighting',
    imageUrl: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    latitude: 32.8959,
    longitude: -6.9190,
    rating: 4.5,
    amenities: ['Parking', 'Restrooms', 'Lighting', 'Seating'],
  },
  {
    id: '2',
    name: 'Complex Sportif Al Wifaq',
    address: 'Hay Al Wifaq, Khouribga',
    pricePerHour: 120,
    description: 'Community sports complex with multiple fields and facilities',
    imageUrl: 'https://images.unsplash.com/photo-1487466365202-1ee7eba506ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    latitude: 32.8844,
    longitude: -6.9067,
    rating: 4.2,
    amenities: ['Parking', 'Restrooms', 'Cafeteria'],
  },
  {
    id: '3',
    name: 'Terrain Synthétique Benguerir',
    address: 'Avenue Hassan II, Benguerir',
    pricePerHour: 180,
    description: 'Premium synthetic field with international standards',
    imageUrl: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    latitude: 32.2355,
    longitude: -7.9514,
    rating: 4.8,
    amenities: ['Parking', 'Restrooms', 'Lighting', 'Seating', 'Locker Rooms'],
  }
];

export const mockBookings: Booking[] = [
  {
    id: '1',
    user_id: 'user1',
    field_id: '1',
    date: '2025-09-15',
    hour: 18,
    payment_type: 'bank_transfer',
    status: 'approved',
    reference: 'SA3A-12345',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    field: mockFields[0],
    isFavorite: false,
  },
  {
    id: '2',
    user_id: 'user1',
    field_id: '2',
    date: '2025-09-20',
    hour: 20,
    payment_type: 'cash',
    status: 'pending',
    reference: 'SA3A-12346',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    field: mockFields[1],
    isFavorite: true,
  }
];

export const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
  },
  {
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@sa3amatch.com',
    role: 'admin',
  }
];

export function generateMockAvailability() {
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dateString = date.toISOString().split('T')[0];

    return {
      date: dateString,
      slots: Array.from({ length: 14 }, (_, j) => ({
        hour: j + 8, // 8 AM to 10 PM
        isAvailable: Math.random() > 0.3, // 70% chance of being available
      })),
    };
  });
}
