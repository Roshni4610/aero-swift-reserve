import { Card, CardContent } from "@/components/ui/card";
import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const destinations = [
  {
    city: "Paris",
    country: "France",
    price: "$589",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop",
  },
  {
    city: "Tokyo",
    country: "Japan",
    price: "$899",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop",
  },
  {
    city: "New York",
    country: "USA",
    price: "$449",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&auto=format&fit=crop",
  },
  {
    city: "Dubai",
    country: "UAE",
    price: "$729",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop",
  },
];

const FeaturedDestinations = () => {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Popular Destinations
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover amazing places around the world with our best flight deals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination) => (
            <Card 
              key={destination.city}
              className="group overflow-hidden hover:shadow-[var(--shadow-elegant)] transition-all duration-300 cursor-pointer"
            >
              <CardContent className="p-0">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.city}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center gap-1 mb-1">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{destination.country}</span>
                    </div>
                    <h3 className="text-2xl font-bold">{destination.city}</h3>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">From</p>
                    <p className="text-2xl font-bold text-primary">{destination.price}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="group-hover:text-accent transition-colors"
                  >
                    View Flights
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;
