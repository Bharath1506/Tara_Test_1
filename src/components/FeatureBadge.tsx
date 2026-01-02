import { Radio } from "lucide-react";

const FeatureBadge = () => {
  return (
    <div className="bg-card rounded-xl shadow-md px-6 py-4 max-w-lg w-full">
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="flex items-center gap-2 text-primary">
          <Radio className="w-4 h-4" />
          <span className="font-medium">Performance reviews made simple</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Natural conversation • Instant insights • Personalized feedback
        </p>
      </div>
    </div>
  );
};

export default FeatureBadge;
