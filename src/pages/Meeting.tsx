import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import VapiVoiceInterface from "@/components/VapiVoiceInterface";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { fetchOKRs, Objective } from "@/services/okrService";
import { Loader2 } from "lucide-react";

const Meeting = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { employeeName, managerName } = location.state || {};
  const [okrs, setOkrs] = useState<Objective[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!employeeName || !managerName) {
      toast.error("Missing session data. Please start from the home page.");
      navigate("/");
      return;
    }

    const loadData = async () => {
      try {
        const data = await fetchOKRs();
        console.log("📍 MEETING DEBUG: Fetched OKRs:", JSON.stringify(data, null, 2));
        setOkrs(data);
      } catch (error) {
        toast.error("Failed to fetch OKR data.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [employeeName, managerName, navigate]);

  if (!employeeName || !managerName) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Preparing your review session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 gap-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Performance Review In Progress</h1>
          <p className="text-muted-foreground">
            With {employeeName} and {managerName}
          </p>
          {/* Diagnostic Button */}
          <button
            onClick={async () => {
              if (okrs && okrs[0]?.keyResults[0]) {
                const kr = okrs[0].keyResults[0];
                toast.info(`Testing API for KR: ${kr.id}...`);
                try {
                  const res = await fetch(import.meta.env.VITE_UPDATE_KEY_RESULT_API_URL, {
                    method: "POST",
                    headers: {
                      "Authorization": `Bearer ${import.meta.env.VITE_EMPLOYEE_API_KEY}`,
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id: kr.id, currentValue: 99 }),
                  });
                  const data = await res.json();
                  console.log("🛠️ DIAGNOSTIC RESULT:", data);
                  toast.success("API Test Successful! Check console.");
                } catch (e: any) {
                  console.error("❌ DIAGNOSTIC FAILED:", e);
                  toast.error(`API Test Failed: ${e.message}`);
                }
              }
            }}
            className="text-[10px] text-gray-300 hover:text-gray-500 transition-colors"
          >
            [ Diagnostic: Test API Sync ]
          </button>
        </div>

        <div className="w-full max-w-4xl bg-card rounded-xl shadow-lg p-8 border border-border/50">
          <VapiVoiceInterface
            employeeName={employeeName}
            managerName={managerName}
            okrData={okrs} // Pass fetched data
            onCallEnd={(evaluationData) => {
              toast.success("Session completed.");
              navigate("/report", {
                state: {
                  employeeName,
                  managerName,
                  okrData: okrs,
                  evaluationData: evaluationData // Pass the captured results
                }
              });
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default Meeting;
