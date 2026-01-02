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

    // Store latest props in refs so listeners always have fresh data
    const propsRef = useRef({ employeeName, managerName, okrData });
    useEffect(() => {
        propsRef.current = { employeeName, managerName, okrData };
    }, [employeeName, managerName, okrData]);

    // Initialize Vapi instance only once based on Public Key
    useEffect(() => {
        const publicKey = import.meta.env.VITE_VOICE_AGENT_PUBLIC_KEY;
        if (!publicKey) return;

        const vapi = new Vapi(publicKey);
        vapiRef.current = vapi;

        const onCallStart = () => {
            console.log("🟢 VAPI CALL STARTED");
            setStatus("active");
            setIsSessionActive(true);
            setMessages([]);

            // Inject the system prompt immediately after start
            const contextPrompt = `
You are TARA, a professional OKR Evaluation Agent.
You are conducting a review for ${propsRef.current.employeeName} with Manager ${propsRef.current.managerName}.

# LIVE OKR DATA:
${JSON.stringify(propsRef.current.okrData || [])}

# YOUR PROTOCOL:
1. Greet them and ask permission to begin.
2. Go through each OKR. When they report progress, use 'update_key_result'.
3. Then gather 1-5 ratings for all OKRs and the 5 competencies (Ownership, Professionalism, Customer Focus, Leadership, Collaboration).
4. Finally, gather qualitative feedback (accomplishments, plans, manager comments).
5. Call 'submit_review' to finish.
`;

            vapi.send({
                type: "add-message",
                message: { role: "system", content: contextPrompt }
            });
        };

        const onCallEnd = () => {
            console.log("🔴 VAPI CALL ENDED");
            setStatus("idle");
            setIsSessionActive(false);
            setIsSpeaking(false);
        };

        const onMessage = (message: any) => {
            if (message.type === "transcript" && message.transcriptType === "final") {
                setMessages(prev => [...prev, {
                    role: message.role === "assistant" ? "assistant" : "user",
                    content: message.transcript,
                    timestamp: Date.now()
                }]);
            }

            if (message.type === "tool-call") {
                const toolCall = message.toolCall;
                console.log("🛠️ Tool Call:", toolCall.function.name, toolCall.function.arguments);

                if (toolCall.function.name === "update_key_result") {
                    const { keyResultId, value } = toolCall.function.arguments;
                    if (keyResultId) {
                        updateKeyResult(keyResultId, value)
                            .then(() => {
                                setLastUpdate({ id: keyResultId, value: value, time: Date.now() });
                                vapi.send({
                                    type: "add-message",
                                    message: { role: "tool", content: "Success", toolCallId: toolCall.id } as any
                                });
                            })
                            .catch(err => {
                                vapi.send({
                                    type: "add-message",
                                    message: { role: "tool", content: err.message, toolCallId: toolCall.id } as any
                                });
                            });
                    }
                }

                if (toolCall.function.name === "submit_review") {
                    setSessionEvaluation(toolCall.function.arguments);
                    vapi.send({
                        type: "add-message",
                        message: { role: "tool", content: "Stored", toolCallId: toolCall.id } as any
                    });
                    toast.success("Final evaluation captured!");
                }
            }
        };

        const onError = (e: any) => {
            console.error("Vapi Error Event:", e);
            setStatus("error");
            toast.error("Vapi connection error. Check console.");
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
    }, []); // Run only once

    const startCall = useCallback(async () => {
        const assistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID;
        if (!vapiRef.current || !assistantId) return;

        // Bare minimum overrides to avoid the 400 error.
        // We will inject the complex prompt later via onCallStart message injection.
        const assistantOverrides = {
            firstMessage: `Hello. I am TARA. May I have your permission to start the OKR evaluation for ${managerName} and ${employeeName}?`,
            model: {
                provider: "openai",
                model: "gpt-4o",
                tools: [
                    {
                        type: "function",
                        function: {
                            name: "update_key_result",
                            description: "Update the progress of a key result.",
                            parameters: {
                                type: "object",
                                properties: {
                                    keyResultId: { type: "string" },
                                    value: { type: "number" }
                                },
                                required: ["keyResultId", "value"]
                            }
                        }
                    },
                    {
                        type: "function",
                        function: {
                            name: "submit_review",
                            description: "Submits the final evaluation.",
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
            console.error("Vapi start exception:", err);
            setStatus("error");
            toast.error("Failed to connect to Vapi");
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
