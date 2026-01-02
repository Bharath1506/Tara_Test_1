import { MessageSquareQuote } from "lucide-react";

interface FeedbackItemProps {
    question: string;
    answer: string;
}

const FeedbackItem = ({ question, answer }: FeedbackItemProps) => (
    <div className="space-y-3">
        <h4 className="text-[11px] font-black text-gray-800 uppercase tracking-widest leading-tight">
            {question}
        </h4>
        <div className="bg-[#fcfdfa] rounded-xl p-6 border border-[#f0f4e8] shadow-sm">
            <p className="text-[13px] text-gray-500 font-medium">
                {answer || "Not provided during review"}
            </p>
        </div>
    </div>
);

interface FeedbackSummaryProps {
    accomplishments?: string;
    plans?: string;
    managerComments?: string;
}

const FeedbackSummary = ({ accomplishments, plans, managerComments }: FeedbackSummaryProps) => {
    return (
        <section className="space-y-8">
            <div className="flex items-center gap-2 border-b-2 border-[#8da356] w-fit">
                <h2 className="text-2xl font-black text-gray-800 tracking-tight pb-1">Feedback Summary</h2>
            </div>

            <div className="space-y-6">
                <div className="space-y-1">
                    <h3 className="text-lg font-bold text-gray-700">Job-related Performance Feedback</h3>
                    <p className="text-sm text-gray-400 leading-relaxed max-w-4xl">
                        Based on the review discussion, here are the key highlights and performance feedback captured during the session.
                    </p>
                </div>

                <div className="space-y-8 pt-4">
                    <FeedbackItem
                        question="WHAT ARE YOUR KEY ACCOMPLISHMENTS IN THE LAST QUARTER?"
                        answer={accomplishments || ""}
                    />
                    <FeedbackItem
                        question="WHAT IS YOUR PLAN FOR THE NEXT QUARTER?"
                        answer={plans || ""}
                    />
                    <div className="space-y-3">
                        <h4 className="flex items-center gap-2 text-[11px] font-black text-gray-800 uppercase tracking-widest leading-tight">
                            OVERALL MANAGER COMMENTS
                        </h4>
                        <div className="bg-[#fcfdfa] rounded-xl p-6 border border-[#f0f4e8] shadow-sm italic">
                            <p className="text-[13px] text-gray-500 font-medium whitespace-pre-line">
                                {managerComments || "No specific manager comments recorded."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeedbackSummary;
