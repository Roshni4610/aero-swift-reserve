-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create flights table
CREATE TABLE public.flights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flight_number TEXT NOT NULL UNIQUE,
  airline TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  departure_time TIMESTAMPTZ NOT NULL,
  arrival_time TIMESTAMPTZ NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  available_seats INTEGER NOT NULL,
  aircraft_type TEXT,
  class_type TEXT NOT NULL DEFAULT 'economy',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on flights (public read access)
ALTER TABLE public.flights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view flights"
  ON public.flights FOR SELECT
  USING (true);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  flight_id UUID NOT NULL REFERENCES public.flights(id) ON DELETE CASCADE,
  booking_reference TEXT NOT NULL UNIQUE,
  total_passengers INTEGER NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed',
  booking_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create passengers table
CREATE TABLE public.passengers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  passport_number TEXT,
  nationality TEXT,
  seat_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on passengers
ALTER TABLE public.passengers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view passengers for their bookings"
  ON public.passengers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = passengers.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create passengers for their bookings"
  ON public.passengers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = passengers.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger for profiles updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

-- Trigger to auto-create profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Insert sample flights
INSERT INTO public.flights (flight_number, airline, origin, destination, departure_time, arrival_time, price, available_seats, aircraft_type, class_type) VALUES
('SW101', 'SkyWings', 'New York (JFK)', 'Los Angeles (LAX)', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days 6 hours', 299.99, 150, 'Boeing 737', 'economy'),
('SW102', 'SkyWings', 'Los Angeles (LAX)', 'New York (JFK)', NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days 6 hours', 289.99, 145, 'Boeing 737', 'economy'),
('SW201', 'SkyWings', 'London (LHR)', 'Paris (CDG)', NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day 2 hours', 149.99, 120, 'Airbus A320', 'economy'),
('SW202', 'SkyWings', 'Paris (CDG)', 'London (LHR)', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days 2 hours', 159.99, 118, 'Airbus A320', 'economy'),
('SW301', 'SkyWings', 'Tokyo (NRT)', 'Singapore (SIN)', NOW() + INTERVAL '4 days', NOW() + INTERVAL '4 days 7 hours', 599.99, 200, 'Boeing 787', 'economy'),
('SW401', 'SkyWings', 'Dubai (DXB)', 'Mumbai (BOM)', NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day 3 hours', 399.99, 180, 'Airbus A350', 'economy'),
('SW501', 'SkyWings', 'New York (JFK)', 'London (LHR)', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days 8 hours', 799.99, 250, 'Boeing 777', 'business'),
('SW601', 'SkyWings', 'Sydney (SYD)', 'Tokyo (NRT)', NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days 9 hours', 699.99, 220, 'Boeing 787', 'economy');

-- Enable realtime for bookings
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;