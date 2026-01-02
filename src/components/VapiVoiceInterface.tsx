import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Mic, MicOff, Loader2, Send, ChevronRight } from "lucide-react";
import { Input } from "./ui/input";
import { useVapi } from "@/hooks/useVapi";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import TaraLogo from "@/components/TaraLogo";



interface VapiVoiceInterfaceProps {
    employeeName: string;
    managerName: string;
    okrData?: any; // Accepting OKR data
    onCallEnd?: (data?: any) => void;
}

const VapiVoiceInterface = ({ employeeName, managerName, okrData, onCallEnd }: VapiVoiceInterfaceProps) => {
    const {
        isSessionActive,
        isSpeaking,
        status,
        messages,
        sessionEvaluation,
        lastUpdate,
        startCall,
        endCall,
        toggleCall,
        sendTextMessage,
        isMuted,
        toggleMute
    } = useVapi(employeeName, managerName, okrData);

    const [inputText, setInputText] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    const hasStartedCall = useRef(false);

    // Auto-start call on mount
    useEffect(() => {
        if (!hasStartedCall.current) {
            startCall();
            hasStartedCall.current = true;
        }
        return () => {
            endCall();
            hasStartedCall.current = false;
        };
    }, [startCall, endCall]);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputText.trim()) return;
        sendTextMessage(inputText);
        setInputText("");
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-5 h-[600px] w-full max-w-6xl mx-auto gap-6">
            {/* Card 1: Visualizer & Connection Status */}
            <div className="md:col-span-2 bg-card rounded-xl border shadow-sm p-6 flex flex-col items-center justify-center space-y-8 h-full">
                <div className={`relative flex items-center justify-center w-40 h-40 rounded-full transition-all duration-300 ${status === "active" ? (isSpeaking ? "bg-primary/20 scale-110" : "bg-primary/10") : "bg-white border-4 border-gray-50 shadow-inner animate-float"
                    }`}>
                    <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${status === "active" ? "bg-primary shadow-lg shadow-primary/40 animate-pulse" : "bg-white shadow-sm border border-gray-100"
                        }`}>
                        {status === "connecting" ? (
                            <Loader2 className="w-12 h-12 text-primary animate-spin" />
                        ) : (
                            // Showing Logo instead of Mic
                            <div className={cn("transition-transform duration-300 flex items-center justify-center w-full h-full", status === "active" && "scale-110")}>
                                <TaraLogo showText={false} size="md" className="w-28 h-28" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="text-center space-y-4 w-full">
                    <h2 className="text-xl font-semibold">
                        {status === "connecting" && "Connecting..."}
                        {status === "active" && (isSpeaking ? "Speaking..." : "Listening...")}
                        {status === "idle" && "Ready to Start"}
                        {status === "error" && "Connection Error"}
                    </h2>

                    {/* Database Sync Badge */}
                    {lastUpdate && (
                        <div className="flex items-center justify-center gap-2 bg-green-50 border border-green-100 px-3 py-1 rounded-full animate-in fade-in zoom-in duration-300">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">
                                Sync: Progress set to {lastUpdate.value}%
                            </span>
                        </div>
                    )}

                    {/* Reconnect Button - Only shown here if NOT active */}
                    {!isSessionActive && (
                        <Button
                            variant="default" // Primary action when disconnected
                            size="lg"
                            onClick={startCall}
                            className="w-full gap-2 font-semibold shadow-md"
                        >
                            <Mic className="w-5 h-5" />
                            {status === 'error' ? 'Retry Connection' : 'Start Session'}
                        </Button>
                    )}

                    {/* Mute/Unmute Controls */}
                    <div className="flex gap-2 w-full">
                        <Button
                            variant={isMuted ? "outline" : "default"}
                            size="sm"
                            onClick={() => toggleMute(false)}
                            disabled={!isMuted || !isSessionActive}
                            className="flex-1 gap-2 shadow-sm"
                        >
                            <Mic className="w-4 h-4" />
                            Unmute
                        </Button>
                        <Button
                            variant={!isMuted ? "outline" : "default"}
                            size="sm"
                            onClick={() => toggleMute(true)}
                            disabled={isMuted || !isSessionActive}
                            className="flex-1 gap-2 shadow-sm"
                        >
                            <MicOff className="w-4 h-4" />
                            Mute
                        </Button>
                    </div>
                </div>
            </div>

            {/* Card 2: Live Conversation & Controls */}
            <div className="md:col-span-3 bg-card rounded-xl border shadow-sm flex flex-col overflow-hidden h-full">
                {/* Controls Header */}
                <div className="p-4 border-b bg-muted/10 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                        Live Conversation
                        <span className="flex h-2 w-2 relative">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status === 'active' ? 'bg-green-400' : 'bg-gray-300'}`}></span>
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        </span>
                    </h3>
                    <div className="flex gap-2">
                        {isSessionActive && (
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={endCall}
                                className="gap-2 shadow-sm"
                            >
                                <MicOff className="w-4 h-4" /> End Call
                            </Button>
                        )}
                    </div>
                </div>

                <ScrollArea className="flex-1 p-6">
                    <div className="space-y-6" ref={scrollRef}>
                        {messages.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 space-y-2 mt-10">
                                <Mic className="w-12 h-12" />
                                <p>Start the call to see the transcript...</p>
                            </div>
                        )}
                        {messages.map((msg, idx) => (
                            <div key={idx} className={cn(
                                "flex w-full animate-in fade-in slide-in-from-bottom-2",
                                msg.role === "user" ? "justify-end" : "justify-start"
                            )}>
                                <div className={cn(
                                    "max-w-[85%] rounded-2xl px-5 py-3 text-sm shadow-sm",
                                    msg.role === "user"
                                        ? "bg-primary text-primary-foreground rounded-br-none"
                                        : "bg-muted text-foreground rounded-bl-none border border-gray-100"
                                )}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                {/* Generate Report Section */}
                <div className="p-4 border-t border-b bg-gradient-to-r from-green-50 to-emerald-50">
                    <Button
                        variant="default"
                        size="lg"
                        onClick={() => onCallEnd && onCallEnd(sessionEvaluation)}
                        className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md"
                    >
                        Generate Report <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="p-4 border-t bg-muted/20 flex gap-2">
                    <Input
                        placeholder="Type a message..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        disabled={status !== "active"}
                        className="flex-1 bg-white border-muted-foreground/20 focus-visible:ring-primary"
                    />
                    <Button type="submit" size="icon" disabled={status !== "active" || !inputText.trim()} className="shadow-sm">
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default VapiVoiceInterface;
