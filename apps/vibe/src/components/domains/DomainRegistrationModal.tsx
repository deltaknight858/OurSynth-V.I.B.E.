import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Shield, Clock, Sparkles } from "lucide-react";

interface DomainRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  domainName?: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
}

const AnimatedParticles = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const createParticles = () => {
      const newParticles: Particle[] = [];
      const colors = ["#00ffff", "#ff00ff", "#8b5cf6", "#06b6d4"];
      
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.1,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
      setParticles(newParticles);
    };

    createParticles();

    const animateParticles = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: (particle.x + particle.speedX + 100) % 100,
        y: (particle.y + particle.speedY + 100) % 100,
        opacity: Math.sin(Date.now() * 0.001 + particle.id) * 0.3 + 0.4
      })));
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full blur-sm animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
          }}
        />
      ))}
    </div>
  );
};

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-8 h-8">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: `linear-gradient(45deg, #00ffff, #ff00ff)`,
              boxShadow: "0 0 10px currentColor",
              transform: `rotate(${i * 60}deg) translateY(-12px)`,
              animation: `neonPulse 1.5s ease-in-out infinite`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default function DomainRegistrationModal({ 
  isOpen, 
  onClose, 
  domainName = "example.com" 
}: DomainRegistrationModalProps) {
  const [renewalPeriod, setRenewalPeriod] = useState("1");
  const [whoisPrivacy, setWhoisPrivacy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredField, setHoveredField] = useState<string | null>(null);

  const handleConfirm = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    onClose();
  };

  const calculatePrice = () => {
    const basePrice = 12.99;
    const years = parseInt(renewalPeriod);
    const privacyFee = whoisPrivacy ? 9.99 : 0;
    return (basePrice * years + privacyFee).toFixed(2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 bg-transparent border-none shadow-none overflow-hidden">
        <div className="relative">
          {/* Animated Background Particles */}
          <AnimatedParticles />
          
          {/* Main Modal Container */}
          <div className="relative bg-slate-900/20 backdrop-blur-3xl border border-slate-700/30 rounded-3xl p-8 shadow-2xl">
            {/* Rim Lighting Effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-magenta-500/20 blur-xl -z-10" />
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-400/10 via-transparent to-magenta-400/10" />
            
            {/* Inner Glow */}
            <div className="absolute inset-1 rounded-3xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 group"
            >
              <X className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
            </button>

            {/* Header */}
            <DialogHeader className="mb-8">
              <DialogTitle className="text-3xl font-bold text-white text-center tracking-tight">
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-magenta-400 bg-clip-text text-transparent drop-shadow-sm">
                  Register Domain
                </span>
              </DialogTitle>
              <div className="flex items-center justify-center gap-2 mt-4">
                <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
                <span className="text-xl font-semibold text-white drop-shadow-sm">
                  {domainName}
                </span>
                <Sparkles className="w-5 h-5 text-magenta-400 animate-pulse" />
              </div>
            </DialogHeader>

            {/* Form Content */}
            <div className="space-y-8">
              {/* Gossamer Lines */}
              <div className="absolute left-8 top-32 w-px h-64 bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent" />
              
              {/* Renewal Period */}
              <div 
                className="relative group"
                onMouseEnter={() => setHoveredField("renewal")}
                onMouseLeave={() => setHoveredField(null)}
              >
                <Label className="text-white font-medium mb-3 block drop-shadow-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  Registration Period
                </Label>
                <Select value={renewalPeriod} onValueChange={setRenewalPeriod}>
                  <SelectTrigger className={`bg-slate-800/30 border-slate-600/50 text-white backdrop-blur-sm transition-all duration-300 ${
                    hoveredField === "renewal" ? "border-cyan-400/70 shadow-lg shadow-cyan-500/20" : ""
                  }`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800/95 backdrop-blur-xl border-slate-600/50">
                    <SelectItem value="1" className="text-white hover:bg-slate-700/50">1 Year - $12.99</SelectItem>
                    <SelectItem value="2" className="text-white hover:bg-slate-700/50">2 Years - $25.98</SelectItem>
                    <SelectItem value="3" className="text-white hover:bg-slate-700/50">3 Years - $38.97</SelectItem>
                    <SelectItem value="5" className="text-white hover:bg-slate-700/50">5 Years - $64.95</SelectItem>
                  </SelectContent>
                </Select>
                {hoveredField === "renewal" && (
                  <div className="absolute -right-2 top-1/2 w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50" />
                )}
              </div>

              {/* WHOIS Privacy */}
              <div 
                className="relative group"
                onMouseEnter={() => setHoveredField("privacy")}
                onMouseLeave={() => setHoveredField(null)}
              >
                <div className="flex items-center space-x-3 p-4 rounded-xl bg-slate-800/20 border border-slate-600/30 backdrop-blur-sm transition-all duration-300 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20">
                  <Checkbox
                    id="whois-privacy"
                    checked={whoisPrivacy}
                    onCheckedChange={(checked) => setWhoisPrivacy(checked as boolean)}
                    className="border-slate-500 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-magenta-500 data-[state=checked]:border-transparent"
                  />
                  <div className="flex-1">
                    <Label htmlFor="whois-privacy" className="text-white font-medium cursor-pointer flex items-center gap-2 drop-shadow-sm">
                      <Shield className="w-4 h-4 text-purple-400" />
                      WHOIS Privacy Protection
                    </Label>
                    <p className="text-slate-300 text-sm mt-1">
                      Hide your personal information from public WHOIS records (+$9.99/year)
                    </p>
                  </div>
                </div>
                {hoveredField === "privacy" && (
                  <div className="absolute -right-2 top-1/2 w-2 h-2 bg-purple-400 rounded-full animate-pulse shadow-lg shadow-purple-400/50" />
                )}
              </div>

              {/* Price Summary */}
              <div className="bg-gradient-to-r from-slate-800/40 to-slate-700/40 backdrop-blur-sm rounded-xl p-6 border border-slate-600/30">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-300 font-medium">Domain Registration ({renewalPeriod} year{renewalPeriod !== "1" ? "s" : ""})</span>
                  <span className="text-white font-semibold">${(12.99 * parseInt(renewalPeriod)).toFixed(2)}</span>
                </div>
                {whoisPrivacy && (
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-slate-300 font-medium">WHOIS Privacy Protection</span>
                    <span className="text-white font-semibold">$9.99</span>
                  </div>
                )}
                <div className="border-t border-slate-600/50 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold text-lg">Total</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-magenta-400 bg-clip-text text-transparent">
                      ${calculatePrice()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-white hover:border-slate-500 transition-all duration-300"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirm}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-magenta-500 hover:from-cyan-400 hover:via-purple-400 hover:to-magenta-400 text-white font-bold border-none shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <LoadingSpinner />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <span className="drop-shadow-sm">Confirm Registration</span>
                  )}
                </Button>
              </div>
            </div>

            {/* Lens Flare Effects */}
            <div className="absolute top-4 left-4 w-32 h-32 bg-gradient-radial from-cyan-400/20 to-transparent rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-24 h-24 bg-gradient-radial from-magenta-400/20 to-transparent rounded-full blur-2xl pointer-events-none" />
          </div>
        </div>
      </DialogContent>

      <style jsx>{`
        @keyframes neonPulse {
          0%, 100% { opacity: 0.4; transform: rotate(var(--rotation)) translateY(-12px) scale(0.8); }
          50% { opacity: 1; transform: rotate(var(--rotation)) translateY(-12px) scale(1.2); }
        }
      `}</style>
    </Dialog>
  );
}
