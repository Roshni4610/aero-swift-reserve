import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane, Calendar, Users, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface Booking {
  id: string;
  booking_reference: string;
  total_passengers: number;
  total_price: number;
  status: string;
  booking_date: string;
  flights: {
    flight_number: string;
    airline: string;
    origin: string;
    destination: string;
    departure_time: string;
    arrival_time: string;
  };
  passengers: Array<{
    first_name: string;
    last_name: string;
  }>;
}

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast.error("Please sign in to view your bookings");
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          flights (*),
          passengers (first_name, last_name)
        `)
        .eq("user_id", session.user.id)
        .order("booking_date", { ascending: false });

      if (error) {
        console.error(error);
        toast.error("Failed to load bookings");
      } else {
        setBookings(data || []);
      }
      setLoading(false);
    };

    fetchBookings();

    // Listen for real-time updates
    const channel = supabase
      .channel("booking-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bookings",
        },
        () => {
          fetchBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
    toast.success("Signed out successfully");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-6 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <Plane className="h-6 w-6" />
            <span className="text-2xl font-bold">SkyWings</span>
          </div>
          <Button variant="secondary" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
          <p className="text-lg text-muted-foreground">
            View and manage your flight reservations
          </p>
        </div>

        {bookings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Plane className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg text-muted-foreground mb-4">
                You haven't made any bookings yet.
              </p>
              <Button onClick={() => navigate("/flights")}>Browse Flights</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-[var(--shadow-elegant)] transition-all">
                <CardHeader className="bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-primary">{booking.booking_reference}</span>
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Booked on {format(new Date(booking.booking_date), "MMMM dd, yyyy")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        ${booking.total_price}
                      </p>
                      <p className="text-sm text-muted-foreground uppercase">
                        {booking.status}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Plane className="h-4 w-4" />
                        Flight Details
                      </h3>
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="font-semibold">{booking.flights.flight_number}</span> •{" "}
                          {booking.flights.airline}
                        </p>
                        <p className="text-lg font-medium">
                          {booking.flights.origin} → {booking.flights.destination}
                        </p>
                        <p className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(booking.flights.departure_time), "MMMM dd, yyyy 'at' HH:mm")}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Passengers ({booking.total_passengers})
                      </h3>
                      <div className="space-y-1 text-sm">
                        {booking.passengers.map((passenger, index) => (
                          <p key={index}>
                            {passenger.first_name} {passenger.last_name}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
