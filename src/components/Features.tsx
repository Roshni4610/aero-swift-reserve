import { Shield, Clock, Wallet, Headphones } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Secure Booking",
    description: "Your data is protected with industry-leading security standards",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Our team is always here to help you with any questions",
  },
  {
    icon: Wallet,
    title: "Best Prices",
    description: "We guarantee the most competitive prices on all flights",
  },
  {
    icon: Headphones,
    title: "Easy Changes",
    description: "Flexible booking options with hassle-free modifications",
  },
];

const Features = () => {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
