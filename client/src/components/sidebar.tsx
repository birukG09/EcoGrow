import { Button } from "@/components/ui/button";
import { X, Gauge, Thermometer, Sliders, Leaf, TrendingUp, Bell, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navItems = [
    { icon: Gauge, label: "Dashboard", href: "#dashboard", active: true },
    { icon: Thermometer, label: "Sensors", href: "#sensors" },
    { icon: Sliders, label: "Controls", href: "#controls" },
    { icon: Leaf, label: "Plant Health", href: "#plants" },
    { icon: TrendingUp, label: "Analytics", href: "#analytics" },
    { icon: Bell, label: "Alerts", href: "#alerts" },
    { icon: Settings, label: "Settings", href: "#settings" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      <div 
        className={cn(
          "lg:hidden fixed inset-0 z-50 bg-black/50",
          isOpen ? "block" : "hidden"
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-secondary text-secondary-foreground transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-secondary/20">
          <div className="flex items-center space-x-2">
            <Leaf className="text-2xl text-primary" />
            <span className="text-xl font-bold">GreenIoT</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="lg:hidden"
            onClick={onClose}
            data-testid="button-close-sidebar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-lg transition-colors",
                item.active 
                  ? "bg-primary/20 text-primary font-medium" 
                  : "hover:bg-secondary/20"
              )}
              data-testid={`link-nav-${item.label.toLowerCase().replace(' ', '-')}`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </a>
          ))}
        </nav>

        {/* User Section */}
        <div className="px-4 py-4 border-t border-secondary/20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-medium">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium" data-testid="text-username">Admin User</p>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
