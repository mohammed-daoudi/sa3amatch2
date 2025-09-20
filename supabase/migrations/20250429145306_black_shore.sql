/*
  # Initial Schema Setup for Sa3aMatch

  1. New Tables
    - `users` (handled by Supabase Auth)
    - `fields`
      - `id` (uuid, primary key)
      - `name` (text)
      - `address` (text)
      - `price_per_hour` (integer)
      - `description` (text)
      - `image_url` (text)
      - `latitude` (double precision)
      - `longitude` (double precision)
      - `rating` (double precision)
      - `amenities` (text[])
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `bookings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `field_id` (uuid, references fields)
      - `date` (date)
      - `hour` (integer)
      - `payment_type` (text)
      - `status` (text)
      - `reference` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `favorites`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `booking_id` (uuid, references bookings)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add policies for admin users
*/

-- Create fields table
CREATE TABLE IF NOT EXISTS fields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  price_per_hour integer NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  rating double precision DEFAULT 0,
  amenities text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  field_id uuid REFERENCES fields NOT NULL,
  date date NOT NULL,
  hour integer NOT NULL CHECK (hour >= 0 AND hour < 24),
  payment_type text NOT NULL CHECK (payment_type IN ('cash', 'bank_transfer')),
  status text NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  reference text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  booking_id uuid REFERENCES bookings NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, booking_id)
);

-- Enable Row Level Security
ALTER TABLE fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Fields Policies
CREATE POLICY "Fields are viewable by everyone"
  ON fields FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can insert fields"
  ON fields FOR INSERT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can update fields"
  ON fields FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Bookings Policies
CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can create their own bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Only admins can update booking status"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Favorites Policies
CREATE POLICY "Users can view their own favorites"
  ON favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own favorites"
  ON favorites FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_fields_updated_at
  BEFORE UPDATE ON fields
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();