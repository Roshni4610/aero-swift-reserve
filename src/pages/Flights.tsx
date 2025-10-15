import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plane, Clock, ArrowRight } from "lucide-react";
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
  available_seats: number;
  aircraft_type: string;
  class_type: string;
}

const Flights = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);

  const origin = searchParams.get("origin") || "";
  const destination = searchParams.get("destination") || "";

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        let query = supabase.from("flights").select("*").gte("departure_time", new Date().toISOString());

        if (origin) {
          query = query.ilike("origin", `%${origin}%`);
        }
        if (destination) {
          query = query.ilike("destination", `%${destination}%`);
        }

        const { data, error } = await query.order("departure_time", { ascending: true });

        if (error) throw error;
        setFlights(data || []);
      } catch (error: any) {
        toast.error("Failed to load flights");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [origin, destination]);

  const handleBookFlight = (flightId: string) => {
    navigate(`/booking/${flightId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading flights...</p>
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
          <Button variant="secondary" onClick={() => navigate("/my-bookings")}>
            My Bookings
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Available Flights</h1>
          {(origin || destination) && (
            <p className="text-lg text-muted-foreground">
              {origin && destination
                ? `From ${origin} to ${destination}`
                : origin
                ? `From ${origin}`
                : `To ${destination}`}
            </p>
          )}
        </div>

        {flights.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-lg text-muted-foreground">
                No flights found matching your search criteria.
              </p>
              <Button className="mt-4" onClick={() => navigate("/")}>
                Search Again
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {flights.map((flight) => (
              <Card key={flight.id} className="hover:shadow-[var(--shadow-elegant)] transition-all">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Flight Details */}
                    <div className="md:col-span-8">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-primary">{flight.flight_number}</span>
                        <span className="text-sm text-muted-foreground">• {flight.airline}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-2xl font-bold">
                            {format(new Date(flight.departure_time), "HH:mm")}
                          </p>
                          <p className="text-sm text-muted-foreground">{flight.origin}</p>
                        </div>
                        <div className="flex-1 flex items-center gap-2">
                          <div className="flex-1 border-t-2 border-dashed border-muted-foreground/30"></div>
                          <Plane className="h-4 w-4 text-muted-foreground rotate-90" />
                          <div className="flex-1 border-t-2 border-dashed border-muted-foreground/30"></div>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">
                            {format(new Date(flight.arrival_time), "HH:mm")}
                          </p>
                          <p className="text-sm text-muted-foreground">{flight.destination}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {format(new Date(flight.departure_time), "MMM dd, yyyy")}
                        </span>
                        <span>• {flight.aircraft_type}</span>
                        <span>• {flight.available_seats} seats available</span>
                      </div>
                    </div>

                    {/* Price & Book Button */}
                    <div className="md:col-span-4 flex flex-col items-end gap-3">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">From</p>
                        <p className="text-3xl font-bold text-primary">
                          ${flight.price}
                        </p>
                        <p className="text-xs text-muted-foreground uppercase">
                          {flight.class_type}
                        </p>
                      </div>
                      <Button
                        className="w-full md:w-auto"
                        onClick={() => handleBookFlight(flight.id)}
                      >
                        Book Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
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

export default Flights;
