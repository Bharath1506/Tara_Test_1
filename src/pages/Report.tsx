import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import TaraLogo from "@/components/TaraLogo";
import { OKRTable } from "@/components/report/OKRTable";
import { CompetencyTable } from "@/components/report/CompetencyTable";
import RadarChart from "@/components/report/RadarChart";
import FeedbackSummary from "@/components/report/FeedbackSummary";
import SentimentAnalysis from "@/components/report/SentimentAnalysis";
import CompetencyDetailChart from "@/components/report/CompetencyDetailChart";
import { Button } from "@/components/ui/button";
import { Printer, ChevronLeft, Target, BarChart3, TrendingUp } from "lucide-react";
import { fetchReviewForm, fetchOKRs } from "@/services/okrService";
import { toast } from "sonner";

const Report = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [reportOKRs, setReportOKRs] = useState<any[]>([]);

    // Retrieve data from meeting session if available
    const {
        employeeName = "Employee",
        managerName = "Manager",
        evaluationData = null
    } = location.state || {};

    // Map evaluation data to competency format
    const [competencyData, setCompetencyData] = useState<any[]>([]);

    useEffect(() => {
        // Process evaluation data for competencies if it exists
        if (evaluationData && evaluationData.competencies) {
            const comps = [
                { name: "Ownership & Accountability", self: evaluationData.competencies["Ownership and Accountability"]?.employeeRating || 0, manager: evaluationData.competencies["Ownership and Accountability"]?.managerRating || 0 },
                { name: "Professionalism", self: evaluationData.competencies["Professionalism"]?.employeeRating || 0, manager: evaluationData.competencies["Professionalism"]?.managerRating || 0 },
                { name: "Customer Focus", self: evaluationData.competencies["Customer Focus"]?.employeeRating || 0, manager: evaluationData.competencies["Customer Focus"]?.managerRating || 0 },
                { name: "Leadership", self: evaluationData.competencies["Leadership"]?.employeeRating || 0, manager: evaluationData.competencies["Leadership"]?.managerRating || 0 },
                { name: "Collaboration", self: evaluationData.competencies["Collaboration"]?.employeeRating || 0, manager: evaluationData.competencies["Collaboration"]?.managerRating || 0 },
            ].map(c => ({
                ...c,
                average: Number(((c.self + c.manager) / 2).toFixed(2))
            }));
            setCompetencyData(comps);
        }

        const loadReportData = async () => {
            try {
                setIsLoading(true);
                const okrResponse = await fetchOKRs();

                if (okrResponse && Array.isArray(okrResponse)) {
                    const mappedOKRs = okrResponse.map((o: any) => {
                        const objectiveName = o.objective || o.title || o.name || "Untitled Objective";

                        // Try to find ratings for this objective from evaluationData
                        const objEval = evaluationData?.okrRatings?.[o.id] || evaluationData?.okrRatings?.[o.title];

                        return {
                            ...o,
                            objective: objectiveName,
                            employeeRating: objEval?.employeeRating || o.employeeRating || 0,
                            managerRating: objEval?.managerRating || o.managerRating || 0,
                            keyResults: (o.keyResults || []).map((kr: any) => {
                                const krEval = evaluationData?.okrRatings?.[kr.id] || evaluationData?.okrRatings?.[kr.description];
                                return {
                                    ...kr,
                                    description: kr.description || kr.title || kr.name || "Untitled Key Result",
                                    employeeRating: krEval?.employeeRating || kr.employeeRating || 0,
                                    managerRating: krEval?.managerRating || kr.managerRating || 0
                                };
                            })
                        };
                    });
                    setReportOKRs(mappedOKRs);
                }
            } catch (error) {
                console.error("Failed to load report data:", error);
                toast.error("Failed to load live OKR data.");
            } finally {
                setIsLoading(false);
            }
        };

        loadReportData();
    }, [evaluationData]);

    const handlePrint = () => {
        window.print();
    };

    // Calculate aggregated scores
    const overallRating = competencyData.length > 0
        ? (competencyData.reduce((acc, curr) => acc + curr.average, 0) / competencyData.length).toFixed(2)
        : "0.00";

    const totalAchievement = reportOKRs.length > 0
        ? (reportOKRs.reduce((acc, obj) => {
            const krAchievement = obj.keyResults?.length > 0
                ? (obj.keyResults.reduce((kAcc: number, kr: any) => kAcc + (kr.achievement || 0), 0) / obj.keyResults.length)
                : 0;
            return acc + krAchievement;
        }, 0) / reportOKRs.length).toFixed(1)
        : "0.0";

    return (
        <div className="min-h-screen bg-white">
            <div className="border-b border-gray-100 bg-white sticky top-0 z-10 print:hidden">
                <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-primary gap-2"
                        onClick={() => navigate("/")}
                    >
                        <ChevronLeft className="w-4 h-4" /> Home
                    </Button>

                    <TaraLogo size="xs" className="h-8" />

                    <Button
                        variant="outline"
                        size="sm"
                        className="text-gray-600 border-gray-200 gap-2"
                        onClick={handlePrint}
                    >
                        <Printer className="w-4 h-4" /> Print Report
                    </Button>
                </div>
            </div>

            <main className="container max-w-6xl mx-auto px-4 py-8 space-y-12">
                <div className="bg-[#fcfdfa] rounded-2xl p-8 border border-[#f0f4e8] shadow-sm relative overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
                        <div className="space-y-4">
                            <span className="inline-block px-3 py-1 bg-[#f0f4e8] text-[#7c914b] text-[10px] font-bold tracking-wider uppercase rounded-full">
                                Performance Review Report
                            </span>
                            <div className="space-y-1">
                                <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
                                    {employeeName}
                                </h1>
                                <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-400 font-medium">
                                    <p>Manager: <span className="text-gray-500 font-semibold">{managerName}</span></p>
                                    <p>Period: <span className="text-gray-500 font-semibold">Self Evaluation 2025</span></p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 self-stretch md:self-center">
                            <div className="flex-1 md:w-36 bg-white rounded-2xl p-4 shadow-sm border border-gray-50 flex flex-col items-center justify-center space-y-1">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Overall Rating</span>
                                <span className="text-4xl font-black text-[#5e7133]">{overallRating}</span>
                            </div>
                            <div className="flex-1 md:w-36 bg-white rounded-2xl p-4 shadow-sm border border-gray-50 flex flex-col items-center justify-center space-y-1">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Achievement</span>
                                <span className="text-4xl font-black text-[#d946ef] leading-none">{totalAchievement}%</span>
                                <div className="w-16 h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
                                    <div className="bg-[#d946ef] h-full" style={{ width: `${totalAchievement}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="space-y-6">
                    <div className="flex items-center gap-2">
                        <div className="text-[#8da356]">
                            <Target size={24} />
                        </div>
                        <h2 className="text-xl font-black text-gray-800 tracking-tight">Objectives & Key Results</h2>
                    </div>
                    {isLoading ? (
                        <div className="py-20 flex justify-center items-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8da356]"></div>
                        </div>
                    ) : (
                        <OKRTable okrs={reportOKRs} />
                    )}
                </section>

                <section className="space-y-8">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-black text-gray-800 tracking-tight">Competency Overview & Gaps</h2>
                        <h3 className="text-lg font-bold text-gray-700">Overall Competency Overview</h3>
                    </div>

                    <div className="bg-[#fcfdfa] rounded-2xl p-8 border border-[#f0f4e8] shadow-sm">
                        <p className="text-sm text-gray-500 leading-relaxed max-w-4xl mb-12">
                            The Competency Comparison Overview breaks down your assessment results based on your responses against your assessment results based on your Manager's responses and allows for an easy gap analysis.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <RadarChart
                                data={competencyData}
                                dataKeys={[
                                    { key: 'self', name: 'Self Score', color: '#8db431', fill: '#8db431' },
                                    { key: 'manager', name: 'Manager Score', color: '#ec4899', fill: '#ec4899' }
                                ]}
                            />
                            <RadarChart
                                data={competencyData}
                                dataKeys={[
                                    { key: 'average', name: 'Average Score', color: '#8db431', fill: '#8db431' }
                                ]}
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <span className="text-[#ec4899]">
                                <BarChart3 size={20} />
                            </span>
                            <h2 className="text-xl font-black text-gray-800 tracking-tight">Competency Assessment Table</h2>
                        </div>
                        <CompetencyTable data={competencyData} />
                    </div>

                    <div className="space-y-8 pt-8">
                        <div className="flex items-center gap-2">
                            <span className="text-[#8da356]">
                                <TrendingUp size={20} />
                            </span>
                            <h2 className="text-xl font-black text-gray-800 tracking-tight uppercase">Individual Competency Performance</h2>
                        </div>

                        <div className="space-y-6">
                            {competencyData.map((comp) => (
                                <CompetencyDetailChart
                                    key={comp.name}
                                    title={comp.name}
                                    self={comp.self}
                                    manager={comp.manager}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                <FeedbackSummary
                    accomplishments={evaluationData?.feedback?.accomplishments}
                    plans={evaluationData?.feedback?.plans}
                    managerComments={evaluationData?.feedback?.managerComments}
                />

                <SentimentAnalysis comments={evaluationData?.feedback?.managerComments} />
            </main>
        </div>
    );
};

export default Report;
