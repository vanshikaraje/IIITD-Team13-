import { Upload, Search, Truck, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload or Request",
    description: "Upload prescription or request consultation",
    color: "text-primary",
    bgColor: "bg-primary"
  },
  {
    icon: Search,
    title: "We Find Nearby",
    description: "Instant match with nearest verified pharmacy",
    color: "text-secondary",
    bgColor: "bg-secondary"
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Medicine delivered in 10-20 minutes",
    color: "text-accent",
    bgColor: "bg-accent"
  },
  {
    icon: CheckCircle,
    title: "Get Well Soon",
    description: "Start your treatment immediately",
    color: "text-primary",
    bgColor: "bg-primary"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Medy-Era Works
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple, fast, and reliable healthcare delivery in 4 easy steps
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-20" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div 
                  key={index}
                  className="text-center animate-slide-up"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="relative inline-block mb-6">
                    <div className={`w-20 h-20 rounded-full ${step.bgColor} flex items-center justify-center shadow-[var(--shadow-glow)] hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{index + 1}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
