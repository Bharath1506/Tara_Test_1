import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import TaraLogo from "./TaraLogo";

interface AgentCardProps {
  onConnect: () => void;
  isReady?: boolean;
}

const AgentCard = ({ onConnect, isReady = true }: AgentCardProps) => {
  return (
    <div className="bg-card rounded-2xl shadow-lg p-8 max-w-md w-full">
      <div className="flex flex-col items-center text-center space-y-6">
        {/* Logo circle */}
        <div className="bg-background rounded-full p-0 shadow-inner overflow-hidden w-36 h-36 flex items-center justify-center animate-float">
          <TaraLogo size="lg" showText={false} className="w-full h-full" />
        </div>

        {/* Agent info */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground tracking-wide">
            TARA
          </h1>
          <p className="text-muted-foreground">
            Your HR performance review voice assistant
          </p>
        </div>

        {/* Connect button */}
        <Button
          size="lg"
          onClick={onConnect}
          className="w-full max-w-xs gap-2 text-base py-6"
        >
          <Phone className="w-5 h-5" />
          Connect with Tara
        </Button>

        {/* Status indicator */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span
            className={`w-2 h-2 rounded-full ${isReady ? "bg-success animate-pulse" : "bg-muted-foreground"
              }`}
          />
          <span>
            {isReady ? "Voice assistant ready" : "Connecting..."}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AgentCard;
