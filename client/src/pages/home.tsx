import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Thermometer, 
  Droplets, 
  Lightbulb, 
  Wifi, 
  Brain, 
  Smartphone,
  GitBranch,
  ArrowRight,
  Leaf,
  BarChart3,
  Settings,
  Camera,
  Play
} from "lucide-react";
import forestMistImage from "@/assets/forest-mist.jpg";
import greenTunnelImage from "@/assets/green-tunnel.jpg";

export default function HomePage() {
  const [sensorValues, setSensorValues] = useState({
    temperature: 22.5,
    humidity: 65,
    soilMoisture: 45,
    lightLevel: 2800
  });

  const [animatedNumbers, setAnimatedNumbers] = useState({
    files: 0,
    sensors: 0,
    accuracy: 0
  });

  // Simulate real-time sensor data changes
  useEffect(() => {
    const interval = setInterval(() => {
      setSensorValues(prev => ({
        temperature: Math.max(18, Math.min(28, prev.temperature + (Math.random() - 0.5) * 0.5)),
        humidity: Math.max(50, Math.min(80, prev.humidity + (Math.random() - 0.5) * 2)),
        soilMoisture: Math.max(30, Math.min(70, prev.soilMoisture + (Math.random() - 0.5) * 1.5)),
        lightLevel: Math.max(2000, Math.min(4000, prev.lightLevel + (Math.random() - 0.5) * 100))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Animated counters
  useEffect(() => {
    const animateNumbers = () => {
      let start = 0;
      const duration = 2000;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        setAnimatedNumbers({
          files: Math.floor(120 * progress),
          sensors: Math.floor(4 * progress),
          accuracy: Math.floor(95.5 * progress)
        });

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    };

    const timer = setTimeout(animateNumbers, 500);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: Thermometer,
      title: "Intelligent Monitoring",
      description: "Track temperature, humidity, soil moisture, and lighting in real-time.",
      color: "text-red-500"
    },
    {
      icon: Settings,
      title: "Automated Control",
      description: "Automatically adjust irrigation, lighting, and ventilation for optimal growth.",
      color: "text-blue-500"
    },
    {
      icon: Brain,
      title: "AI Plant Health Detection",
      description: "Detect plant diseases early with built-in AI and machine learning models.",
      color: "text-purple-500"
    },
    {
      icon: Smartphone,
      title: "Cloud & Mobile Access",
      description: "Monitor and control your greenhouse from anywhere via web or mobile app.",
      color: "text-green-500"
    },
    {
      icon: GitBranch,
      title: "Modular & Scalable",
      description: "Easily add new sensors, actuators, or dashboards as your greenhouse grows.",
      color: "text-orange-500"
    }
  ];

  const techStack = [
    { name: "C/C++", description: "Embedded Firmware" },
    { name: "Python", description: "AI & Analytics" },
    { name: "JavaScript", description: "Web Dashboard" },
    { name: "Java", description: "Mobile App" },
    { name: "Assembly", description: "Low-level Control" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900/20 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${forestMistImage})` }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[0.5px]" />
        </div>

        {/* Animated Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
          <div className="space-y-6 animate-fade-in-up">
            <Badge variant="secondary" className="text-sm font-medium bg-primary/10 text-primary border-primary/20">
              <Leaf className="w-4 h-4 mr-2" />
              Smart IoT Greenhouse System
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
                GreenMind
              </span>
              <br />
              <span className="text-3xl md:text-4xl font-light">
                The Smart, AI-Powered Greenhouse
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto font-light">
              Monitor. Automate. Optimize. Grow smarter with our fully automated IoT greenhouse system.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/dashboard">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-medium group">
                  Explore the Dashboard
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8 py-4 text-lg font-medium backdrop-blur-sm">
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>

        {/* Real-time Sensor Data Overlay */}
        <div className="absolute bottom-8 left-8 right-8 z-20">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white animate-pulse">
                  {sensorValues.temperature.toFixed(1)}°C
                </div>
                <div className="text-xs text-gray-300">Temperature</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white animate-pulse">
                  {sensorValues.humidity.toFixed(0)}%
                </div>
                <div className="text-xs text-gray-300">Humidity</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white animate-pulse">
                  {sensorValues.soilMoisture.toFixed(0)}%
                </div>
                <div className="text-xs text-gray-300">Soil Moisture</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white animate-pulse">
                  {sensorValues.lightLevel.toFixed(0)}
                </div>
                <div className="text-xs text-gray-300">Light (lux)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Why <span className="text-primary">GreenMind</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Advanced technology meets sustainable agriculture in our comprehensive IoT solution
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50 border-0 shadow-lg"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className={`w-8 h-8 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section 
        className="py-20 px-4 relative"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${greenTunnelImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            How <span className="text-primary">GreenMind</span> Works
          </h2>
          <p className="text-xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
            GreenMind integrates embedded firmware, IoT sensors, actuators, AI algorithms, and cloud services 
            to create a fully automated greenhouse. Our system collects sensor data, makes intelligent decisions, 
            and provides insights through a web dashboard and mobile app.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 group hover:bg-white/20 transition-all duration-300">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Wifi className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Collect Data</h3>
              <p className="text-gray-300">IoT sensors continuously monitor environmental conditions</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 group hover:bg-white/20 transition-all duration-300">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">AI Analysis</h3>
              <p className="text-gray-300">Machine learning algorithms analyze data and predict optimal conditions</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 group hover:bg-white/20 transition-all duration-300">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Settings className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Automate Control</h3>
              <p className="text-gray-300">Smart actuators adjust environment automatically for optimal growth</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/5 to-emerald-100/50 dark:from-primary/10 dark:to-emerald-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-4">
              <div className="text-5xl md:text-6xl font-bold text-primary">
                {animatedNumbers.files}+
              </div>
              <div className="text-xl font-medium text-foreground">Source Files</div>
              <div className="text-muted-foreground">Across multiple programming languages</div>
            </div>
            
            <div className="space-y-4">
              <div className="text-5xl md:text-6xl font-bold text-primary">
                {animatedNumbers.sensors}
              </div>
              <div className="text-xl font-medium text-foreground">IoT Sensors</div>
              <div className="text-muted-foreground">Real-time environmental monitoring</div>
            </div>
            
            <div className="space-y-4">
              <div className="text-5xl md:text-6xl font-bold text-primary">
                {animatedNumbers.accuracy}%
              </div>
              <div className="text-xl font-medium text-foreground">AI Accuracy</div>
              <div className="text-muted-foreground">Plant health detection precision</div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Built with <span className="text-primary">Cutting-Edge</span> Technology
            </h2>
            <p className="text-xl text-muted-foreground">
              Full-stack development across embedded systems, IoT, AI, and web technologies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {techStack.map((tech, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 dark:border-gray-700"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-2xl font-bold text-primary mb-2">{tech.name}</div>
                <div className="text-sm text-muted-foreground">{tech.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-primary/5 dark:from-gray-900 dark:to-primary/10">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
            About This <span className="text-primary">Project</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-12">
            GreenMind is designed for developers, students, and hobbyists who want to explore embedded systems, 
            IoT, and AI in agriculture. With 120+ files across C, C++, Python, Java, C#, Assembly, and web 
            technologies, this project demonstrates full-stack hardware and software integration.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-2">
              <BarChart3 className="w-12 h-12 text-primary mx-auto" />
              <div className="font-semibold text-foreground">Real-time Analytics</div>
            </div>
            <div className="space-y-2">
              <Camera className="w-12 h-12 text-primary mx-auto" />
              <div className="font-semibold text-foreground">AI Vision</div>
            </div>
            <div className="space-y-2">
              <Wifi className="w-12 h-12 text-primary mx-auto" />
              <div className="font-semibold text-foreground">IoT Connectivity</div>
            </div>
            <div className="space-y-2">
              <GitBranch className="w-12 h-12 text-primary mx-auto" />
              <div className="font-semibold text-foreground">Open Source</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to grow smarter?
          </h2>
          <p className="text-xl mb-12 text-primary-foreground/90">
            Explore the project on GitHub and start building your own intelligent greenhouse today!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100 px-8 py-4 text-lg font-medium">
                <BarChart3 className="mr-2 w-5 h-5" />
                Explore Dashboard
              </Button>
            </Link>
            
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-medium">
              <GitBranch className="mr-2 w-5 h-5" />
              View on GitHub
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}