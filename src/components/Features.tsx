import { Package, Video, Home, Shield, Clock, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Clock,
    title: "10-20 Min Delivery",
    description: "Lightning-fast medicine delivery from verified local pharmacies when you need it most.",
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    icon: Video,
    title: "Doctor Teleconsultation",
    description: "Connect with qualified doctors instantly for expert medical advice and prescriptions.",
    color: "text-secondary",
    bgColor: "bg-secondary/10"
  },
  {
    icon: Home,
    title: "Doctor Home Visits",
    description: "Get doctors at your doorstep for diagnosis, tests, and immediate prescriptions.",
    color: "text-accent",
    bgColor: "bg-accent/10"
  },
  {
    icon: Package,
    title: "Prescription Upload",
    description: "Simply upload your prescription and get medicines delivered instantly.",
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    icon: Shield,
    title: "Verified Stores",
    description: "Only certified and licensed pharmacies in our network for your safety.",
    color: "text-secondary",
    bgColor: "bg-secondary/10"
  },
  {
    icon: Users,
    title: "Pharmacist Assistance",
    description: "Get expert guidance on OTC medications from qualified pharmacists.",
    color: "text-accent",
    bgColor: "bg-accent/10"
  }
];

const Features = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Complete Healthcare{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Ecosystem
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need for healthcare access, delivered faster than you can imagine
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-[var(--shadow-card)] group animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className={`${feature.bgColor} w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
