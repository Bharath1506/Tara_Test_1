import { useEffect, useState, useRef, useCallback } from "react";
import Vapi from "@vapi-ai/web";
import { toast } from "sonner";
import { updateKeyResult } from "@/services/okrService";

export interface Message {
    role: "user" | "assistant" | "system";
    content: string;
    timestamp: number;
}

export const useVapi = (employeeName: string, managerName: string, okrData?: any) => {
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [status, setStatus] = useState<"idle" | "connecting" | "active" | "error">("idle");
    const [messages, setMessages] = useState<Message[]>([]);
    const [sessionEvaluation, setSessionEvaluation] = useState<any>(null);
    const [lastUpdate, setLastUpdate] = useState<{ id: string, value: number, time: number } | null>(null);

    const vapiRef = useRef<Vapi | null>(null);

    useEffect(() => {
        const publicKey = import.meta.env.VITE_VOICE_AGENT_PUBLIC_KEY;
        if (!publicKey) return;

        console.log("🛠️ VAPI INIT: Using Public Key", publicKey.slice(0, 8) + "...");
        const vapi = new Vapi(publicKey);
        vapiRef.current = vapi;

        const onCallStart = () => {
            console.log("🟢 VAPI CALL STARTED");
            setStatus("active");
            setIsSessionActive(true);
            toast.success("Voice session started successfully");
            setMessages([]);

            // Simplify OKR data for the prompt to avoid token overflow
            const simplifiedOKRs = (okrData || []).map((obj: any) => ({
                id: obj.id,
                title: obj.title || obj.objective,
                keyResults: (obj.keyResults || []).map((kr: any) => ({
                    id: kr.id,
                    description: kr.description || kr.title || kr.name
                }))
            }));

            const contextPrompt = `
You are TARA, an OKR Evaluation Agent. 
Reviewing OKRs for Employee (${employeeName}) with Manager (${managerName}).

# LIVE OKR DATA (IDs for updates):
${JSON.stringify(simplifiedOKRs)}

# YOUR PROTOCOL:
1. Greet them and ask permission.
2. Review OKRs one by one. Ask for progress and use 'update_key_result' to update database.
3. Collect 1-5 ratings for each OKR and 5 Competencies from both.
4. Call 'submit_review' at the very end.

STAY IN CHARACTER as TARA. ASK ONE QUESTION AT A TIME.
`;

            vapi.send({
                type: "add-message",
                message: {
                    role: "system",
                    content: contextPrompt
                }
            });
        };

        const onCallEnd = () => {
            console.log("🔴 VAPI CALL ENDED");
            setStatus("idle");
            setIsSessionActive(false);
            setIsSpeaking(false);
        };

        const onMessage = (message: any) => {
            console.log("📩 VAPI MSG:", message.type, message);

            if (message.type === "transcript" && message.transcriptType === "final") {
                const role = message.role === "assistant" ? "assistant" : "user";
                setMessages(prev => [...prev, {
                    role: role,
                    content: message.transcript,
                    timestamp: Date.now()
                }]);
            }

            if (message.type === "tool-call") {
                const toolCall = message.toolCall;
                console.warn("🚨 TOOL CALL:", toolCall.function.name, toolCall.function.arguments);

                if (toolCall.function.name === "update_key_result") {
                    const { keyResultId, value } = toolCall.function.arguments;
                    updateKeyResult(keyResultId, value)
                        .then(() => {
                            console.log("✅ DB UPDATE SUCCESS");
                            setLastUpdate({ id: keyResultId, value: value, time: Date.now() });
                            vapi.send({
                                type: "add-message",
                                message: {
                                    role: "tool",
                                    content: "Key result updated successfully.",
                                    toolCallId: toolCall.id
                                } as any
                            });
                        })
                        .catch((err) => {
                            console.error("❌ DB UPDATE FAILED", err);
                            vapi.send({
                                type: "add-message",
                                message: {
                                    role: "tool",
                                    content: `Update failed: ${err.message}`,
                                    toolCallId: toolCall.id
                                } as any
                            });
                        });
                }

                if (toolCall.function.name === "submit_review") {
                    console.log("💾 SAVING EVALUATION DATA");
                    setSessionEvaluation(toolCall.function.arguments);
                    vapi.send({
                        type: "add-message",
                        message: {
                            role: "tool",
                            content: "Review successfully saved.",
                            toolCallId: toolCall.id
                        } as any
                    });
                    toast.success("Ratings captured!");
                }
            }
        };

        const onError = (e: any) => {
            console.error("❌ VAPI ERROR:", e);
            setStatus("error");
            const errDetail = e.message || JSON.stringify(e);
            toast.error(`Vapi Error: ${errDetail.slice(0, 100)}`);
        };

        vapi.on("call-start", onCallStart);
        vapi.on("call-end", onCallEnd);
        vapi.on("speech-start", () => setIsSpeaking(true));
        vapi.on("speech-end", () => setIsSpeaking(false));
        vapi.on("message", onMessage);
        vapi.on("error", onError);

        return () => {
            vapi.stop();
            vapiRef.current = null;
        };
    }, [employeeName, managerName, okrData]);

    const startCall = useCallback(async () => {
        const assistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID;
        if (!vapiRef.current || !assistantId) {
            console.error("Vapi not ready or Assistant ID missing");
            return;
        }

        console.log("📡 ATTEMPTING VAPI START WITH ID:", assistantId);

        // Minimal overrides to avoid 400 Bad Request
        const assistantOverrides: any = {
            firstMessage: `Hello ${managerName} and ${employeeName}. May I have your permission to start the OKR evaluation for this review session?`,
            model: {
                provider: "openai",
                model: "gpt-4",
                tools: [
                    {
                        type: "function",
                        function: {
                            name: "update_key_result",
                            description: "Updates the actual progress value of a specific Key Result in the database.",
                            parameters: {
                                type: "object",
                                properties: {
                                    keyResultId: { type: "string", description: "The unique ID of the key result to update." },
                                    value: { type: "number", description: "The new progress value (numeric percentage or absolute value)." }
                                },
                                required: ["keyResultId", "value"]
                            }
                        }
                    },
                    {
                        type: "function",
                        function: {
                            name: "submit_review",
                            description: "Submits all collected ratings and feedback at the end of the session.",
                            parameters: {
                                type: "object",
                                properties: {
                                    okrRatings: { type: "object" },
                                    competencies: { type: "object" },
                                    feedback: { type: "object" }
                                }
                            }
                        }
                    }
                ]
            }
        };

        setStatus("connecting");
        try {
            await vapiRef.current.start(assistantId, assistantOverrides);
        } catch (err: any) {
            console.error("🔥 VAPI START EXCEPTION:", err);
            setStatus("error");
            toast.error(`Connection Failed: ${err.message}`);
        }
    }, [employeeName, managerName]);

    return {
        isSessionActive,
        isSpeaking,
        status,
        messages,
        sessionEvaluation,
        lastUpdate,
        startCall,
        endCall: () => vapiRef.current?.stop(),
        toggleCall: () => isSessionActive ? vapiRef.current?.stop() : startCall(),
        sendTextMessage: (t: string) => {
            if (!vapiRef.current) return;
            setMessages(prev => [...prev, { role: "user", content: t, timestamp: Date.now() }]);
            vapiRef.current.send({ type: "add-message", message: { role: "user", content: t } });
        },
        isMuted,
        toggleMute: (m: boolean) => {
            vapiRef.current?.setMuted(m);
            setIsMuted(m);
        }
    };
};
