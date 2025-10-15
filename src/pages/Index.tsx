import { Plane } from "lucide-react";
import SearchForm from "@/components/SearchForm";
import FeaturedDestinations from "@/components/FeaturedDestinations";
import Features from "@/components/Features";
import heroImage from "@/assets/hero-airplane.jpg";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 px-4 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-2 rounded-xl">
              <Plane className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold text-white">SkyWings</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-white hover:text-white/80 transition-colors font-medium">
              Flights
            </a>
            <a href="#" className="text-white hover:text-white/80 transition-colors font-medium">
              Destinations
            </a>
            <a href="#" className="text-white hover:text-white/80 transition-colors font-medium">
              Deals
            </a>
            <a href="#" className="text-white hover:text-white/80 transition-colors font-medium">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Airplane in sky"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 mb-32">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in">
            Your Journey Begins Here
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-8">
            Book flights to destinations worldwide with confidence and ease
          </p>
        </div>

        {/* Search Form positioned at bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-4 transform translate-y-1/2 z-20">
          <SearchForm />
        </div>
      </section>

      {/* Spacer for the floating search form */}
      <div className="h-32" />

      {/* Features */}
      <Features />

      {/* Featured Destinations */}
      <FeaturedDestinations />

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary-foreground text-primary p-2 rounded-xl">
                <Plane className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold">SkyWings</span>
            </div>
            <p className="text-primary-foreground/80">
              Your trusted partner for air travel worldwide
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Press</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">FAQs</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-primary-foreground/20 text-center text-primary-foreground/60">
          <p>&copy; 2025 SkyWings. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
