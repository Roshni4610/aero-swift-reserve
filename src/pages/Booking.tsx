import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plane } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface Flight {
  id: string;
  flight_number: string;
  airline: string;
  origin: string;
  destination: string;
  departure_time: string;
  arrival_time: string;
  price: number;
  aircraft_type: string;
}

interface Passenger {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  passportNumber: string;
  nationality: string;
}

const Booking = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [numPassengers, setNumPassengers] = useState(1);
  const [passengers, setPassengers] = useState<Passenger[]>([
    { firstName: "", lastName: "", dateOfBirth: "", passportNumber: "", nationality: "" },
  ]);

  useEffect(() => {
    const checkAuthAndFetchFlight = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast.error("Please sign in to book a flight");
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("flights")
        .select("*")
        .eq("id", flightId)
        .single();

      if (error || !data) {
        toast.error("Flight not found");
        navigate("/flights");
      } else {
        setFlight(data);
      }
      setLoading(false);
    };

    checkAuthAndFetchFlight();
  }, [flightId, navigate]);

  const updatePassengerCount = (count: number) => {
    setNumPassengers(count);
    const newPassengers = Array(count)
      .fill(null)
      .map((_, i) => passengers[i] || { firstName: "", lastName: "", dateOfBirth: "", passportNumber: "", nationality: "" });
    setPassengers(newPassengers);
  };

  const updatePassenger = (index: number, field: keyof Passenger, value: string) => {
    const newPassengers = [...passengers];
    newPassengers[index] = { ...newPassengers[index], [field]: value };
    setPassengers(newPassengers);
  };

  const handleBooking = async () => {
    if (!flight) return;

    // Validate all passengers
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.firstName || !p.lastName || !p.dateOfBirth) {
        toast.error(`Please fill in all required fields for passenger ${i + 1}`);
        return;
      }
    }

    setBooking(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast.error("Please sign in to complete booking");
        navigate("/auth");
        return;
      }

      // Generate booking reference
      const bookingRef = `SW${Date.now().toString().slice(-8)}`;

      // Create booking
      const { data: bookingData, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          user_id: session.user.id,
          flight_id: flight.id,
          booking_reference: bookingRef,
          total_passengers: numPassengers,
          total_price: flight.price * numPassengers,
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Create passenger records
      const passengerRecords = passengers.map((p) => ({
        booking_id: bookingData.id,
        first_name: p.firstName,
        last_name: p.lastName,
        date_of_birth: p.dateOfBirth,
        passport_number: p.passportNumber || null,
        nationality: p.nationality || null,
      }));

      const { error: passengerError } = await supabase
        .from("passengers")
        .insert(passengerRecords);

      if (passengerError) throw passengerError;

      toast.success("Booking confirmed! Redirecting...");
      setTimeout(() => navigate("/my-bookings"), 2000);
    } catch (error: any) {
      console.error(error);
      toast.error("Booking failed. Please try again.");
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!flight) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-6 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <Plane className="h-6 w-6" />
          <span className="text-2xl font-bold">SkyWings</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Complete Your Booking</h1>

        {/* Flight Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Flight Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">{flight.flight_number}</span> • {flight.airline}
              </p>
              <p className="text-lg">
                {flight.origin} → {flight.destination}
              </p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(flight.departure_time), "MMMM dd, yyyy 'at' HH:mm")}
              </p>
              <p className="text-2xl font-bold text-primary mt-4">
                ${flight.price} × {numPassengers} = ${flight.price * numPassengers}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Number of Passengers */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Number of Passengers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((num) => (
                <Button
                  key={num}
                  variant={numPassengers === num ? "default" : "outline"}
                  onClick={() => updatePassengerCount(num)}
                >
                  {num}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Passenger Information */}
        {passengers.map((passenger, index) => (
          <Card key={index} className="mb-6">
            <CardHeader>
              <CardTitle>Passenger {index + 1}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`firstName-${index}`}>
                    First Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`firstName-${index}`}
                    value={passenger.firstName}
                    onChange={(e) => updatePassenger(index, "firstName", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`lastName-${index}`}>
                    Last Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`lastName-${index}`}
                    value={passenger.lastName}
                    onChange={(e) => updatePassenger(index, "lastName", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`dob-${index}`}>
                    Date of Birth <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`dob-${index}`}
                    type="date"
                    value={passenger.dateOfBirth}
                    onChange={(e) => updatePassenger(index, "dateOfBirth", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`passport-${index}`}>Passport Number</Label>
                  <Input
                    id={`passport-${index}`}
                    value={passenger.passportNumber}
                    onChange={(e) => updatePassenger(index, "passportNumber", e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor={`nationality-${index}`}>Nationality</Label>
                  <Input
                    id={`nationality-${index}`}
                    value={passenger.nationality}
                    onChange={(e) => updatePassenger(index, "nationality", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button className="w-full h-14 text-lg" onClick={handleBooking} disabled={booking}>
          {booking ? "Processing..." : `Confirm Booking - $${flight.price * numPassengers}`}
        </Button>
      </div>
    </div>
  );
};

export default Booking;
