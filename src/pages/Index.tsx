import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import AgentCard from "@/components/AgentCard";
import FeatureBadge from "@/components/FeatureBadge";
import ConsentModal from "@/components/ConsentModal";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);
  const [sessionData, setSessionData] = useState<{
    employeeName: string;
    managerName: string;
  } | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleConnect = () => {
    setIsConsentModalOpen(true);
  };

  const handleConsent = (data: { employeeName: string; managerName: string }) => {
    setSessionData(data);
    setIsConsentModalOpen(false);
    toast({
      title: "Session Started",
      description: `Performance review session for ${data.employeeName} with ${data.managerName} is ready.`,
    });
    navigate("/meeting", { state: data });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 gap-8">
        <AgentCard onConnect={handleConnect} />
        <FeatureBadge />
      </main>

      <ConsentModal
        isOpen={isConsentModalOpen}
        onClose={() => setIsConsentModalOpen(false)}
        onConsent={handleConsent}
      />
    </div>
  );
};

export default Index;
