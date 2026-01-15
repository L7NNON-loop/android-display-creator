import { Tv } from "lucide-react";
import PriceBadge from "./PriceBadge";

const HeroSection = () => {
  return (
    <div className="text-center space-y-4 pt-8 pb-6 no-select">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 animate-float">
        <Tv className="w-8 h-8 text-primary" />
      </div>
      
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight glow-text">
          FUTEBOL AO
          <br />
          VIVO
        </h1>
        <p className="text-sm text-muted-foreground max-w-[200px] mx-auto">
          Assista aos melhores jogos de futebol em seu celular
        </p>
      </div>

      <PriceBadge />
    </div>
  );
};

export default HeroSection;
