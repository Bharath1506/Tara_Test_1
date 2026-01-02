import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

interface CompetencyDetailChartProps {
    title: string;
    self: number;
    manager: number;
}

const CompetencyDetailChart = ({ title, self, manager }: CompetencyDetailChartProps) => {
    const data = [
        { name: 'Self Present & Prev Feedback', value: self },
        { name: 'Manager Present & Prev Feedback', value: manager },
    ];

    const satisfactionLabels = [
        { label: 'Highly Satisfactory', score: 4 },
        { label: 'Satisfactory', score: 3 },
        { label: 'Unsatisfactory', score: 2 },
        { label: 'Highly Unsatisfactory', score: 1 },
    ];

    return (
        <div className="bg-white py-12 border-b border-gray-100 last:border-none">
            <h3 className="text-2xl font-bold text-gray-900 mb-12">{title}</h3>

            <div className="flex gap-2 min-h-[400px]">
                {/* Custom Left Labels Column */}
                <div className="relative w-48 mr-4">
                    {satisfactionLabels.map((item) => {
                        // Calculate position based on 0-5 scale
                        const bottom = `${(item.score / 5) * 100}%`;
                        return (
                            <div
                                key={item.label}
                                className="absolute right-0 flex items-center gap-2 transform translate-y-1/2"
                                style={{ bottom }}
                            >
                                <span className="text-[12px] font-medium text-gray-400 whitespace-nowrap">
                                    {item.label}
                                </span>
                                <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-600">
                                    {item.score}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Chart Area */}
                <div className="flex-1 h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{ top: 10, right: 30, left: 0, bottom: 40 }}
                            barGap={60}
                        >
                            <CartesianGrid
                                vertical={false}
                                stroke="#f0f0f0"
                                strokeWidth={1}
                            />
                            <XAxis
                                dataKey="name"
                                axisLine={{ stroke: '#e5e7eb' }}
                                tickLine={false}
                                tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 500 }}
                                dy={10}
                            />
                            <YAxis
                                domain={[0, 5]}
                                ticks={[0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]}
                                axisLine={{ stroke: '#e5e7eb' }}
                                tickLine={false}
                                tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 500 }}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Bar
                                dataKey="value"
                                fill="#0000FF"
                                barSize={120}
                                radius={[2, 2, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default CompetencyDetailChart;
