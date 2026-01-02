import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface ConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConsent: (data: { employeeName: string; managerName: string }) => void;
}

const ConsentModal = ({ isOpen, onClose, onConsent }: ConsentModalProps) => {
  const [employeeName, setEmployeeName] = useState("");
  const [managerName, setManagerName] = useState("");
  const [managerConsent, setManagerConsent] = useState(false);
  const [employeeConsent, setEmployeeConsent] = useState(false);

  const canProceed =
    employeeName.trim() &&
    managerName.trim() &&
    managerConsent &&
    employeeConsent;

  const handleSubmit = () => {
    if (canProceed) {
      onConsent({ employeeName, managerName });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg mx-4 bg-card rounded-xl shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">
              Voice Recording Consent
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <ScrollArea className="h-[400px]">
          <div className="p-6 space-y-6">
            <p className="text-muted-foreground text-center">
              Before we begin, please review and provide your consent
            </p>

            {/* Purpose section */}
            <div className="bg-accent/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-3">
                Purpose of This Session
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  Conduct a structured performance review conversation
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  Record and transcribe the discussion for documentation
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  Generate insights and feedback based on the conversation
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  Create a comprehensive review report for HR records
                </li>
              </ul>
            </div>

            {/* Name inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Employee Name
                </label>
                <Input
                  placeholder="Enter Employee Name"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  className="border-primary/30 focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Manager Name
                </label>
                <Input
                  placeholder="Enter Manager Name"
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                />
              </div>
            </div>

            {/* Consent checkboxes */}
            <div className="space-y-4">
              <div
                className={cn(
                  "p-4 rounded-lg border-l-4 transition-colors",
                  managerConsent
                    ? "bg-sage-light/50 border-primary"
                    : "bg-muted/50 border-muted-foreground/30"
                )}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="manager-consent"
                    checked={managerConsent}
                    onCheckedChange={(checked) =>
                      setManagerConsent(checked as boolean)
                    }
                    className="mt-0.5"
                  />
                  <div>
                    <label
                      htmlFor="manager-consent"
                      className="text-sm font-medium text-primary cursor-pointer"
                    >
                      Manager Consent
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      I consent to having this performance review session recorded
                      and transcribed. I understand the recording will be used for
                      documentation and HR purposes.
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={cn(
                  "p-4 rounded-lg border-l-4 transition-colors",
                  employeeConsent
                    ? "bg-sage-light/50 border-primary"
                    : "bg-muted/50 border-muted-foreground/30"
                )}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="employee-consent"
                    checked={employeeConsent}
                    onCheckedChange={(checked) =>
                      setEmployeeConsent(checked as boolean)
                    }
                    className="mt-0.5"
                  />
                  <div>
                    <label
                      htmlFor="employee-consent"
                      className="text-sm font-medium text-primary cursor-pointer"
                    >
                      Employee Consent
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      I consent to having this performance review session recorded
                      and transcribed. I understand the recording will be used for
                      documentation and HR purposes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canProceed}>
            Provide Consent to Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConsentModal;
