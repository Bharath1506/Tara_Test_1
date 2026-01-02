import { cn } from "@/lib/utils";
import logoFull from "@/assets/talentspotify-logo.png";
import logoIcon from "@/assets/talentspotify-icon.png";

interface TaraLogoProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg";
  showText?: boolean;
}

const TaraLogo = ({ className, size = "md", showText = true }: TaraLogoProps) => {
  const sizeClasses = {
    xs: "h-8",
    sm: "h-10",
    md: "h-16",
    lg: "h-24",
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <img
        src={showText ? logoFull : logoIcon}
        alt="TalentSpotify"
        className={cn(
          showText
            ? cn(sizeClasses[size], "w-auto object-contain")
            : "w-full h-full object-cover rounded-full"
        )}
      />
    </div>
  );
};

export default TaraLogo;
