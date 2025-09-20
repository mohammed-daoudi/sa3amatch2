export interface Database {
  public: {
    Tables: {
      fields: {
        Row: {
          id: string;
          name: string;
          address: string;
          price_per_hour: number;
          description: string;
          image_url: string;
          latitude: number;
          longitude: number;
          rating: number;
          amenities: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          address: string;
          price_per_hour: number;
          description: string;
          image_url: string;
          latitude: number;
          longitude: number;
          rating?: number;
          amenities?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          address?: string;
          price_per_hour?: number;
          description?: string;
          image_url?: string;
          latitude?: number;
          longitude?: number;
          rating?: number;
          amenities?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          user_id: string;
          field_id: string;
          date: string;
          hour: number;
          payment_type: string;
          status: string;
          reference: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          field_id: string;
          date: string;
          hour: number;
          payment_type: string;
          status?: string;
          reference: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          field_id?: string;
          date?: string;
          hour?: number;
          payment_type?: string;
          status?: string;
          reference?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          booking_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          booking_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          booking_id?: string;
          created_at?: string;
        };
      };
    };
  };
}
