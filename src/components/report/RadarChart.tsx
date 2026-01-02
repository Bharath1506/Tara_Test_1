import {
    Radar,
    RadarChart as RechartsRadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Legend
} from 'recharts';

interface RadarChartProps {
    data: any[];
    dataKeys: { key: string; name: string; color: string; fill: string }[];
    title?: string;
}

const RadarChart = ({ data, dataKeys, title }: RadarChartProps) => {
    return (
        <div className="w-full h-[400px] flex flex-col items-center">
            {title && <h3 className="text-sm font-bold text-gray-500 mb-8 uppercase tracking-wider">{title}</h3>}
            <ResponsiveContainer width="100%" height="100%">
                <RechartsRadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis
                        dataKey="name"
                        tick={{ fill: '#4b5563', fontSize: 11, fontWeight: 600 }}
                    />
                    <PolarRadiusAxis
                        angle={90}
                        domain={[0, 5]}
                        tick={false}
                        axisLine={false}
                    />
                    {dataKeys.map((dk) => (
                        <Radar
                            key={dk.key}
                            name={dk.name}
                            dataKey={dk.key}
                            stroke={dk.color}
                            strokeWidth={2}
                            fill={dk.fill}
                            fillOpacity={0.4}
                        />
                    ))}
                    <Legend
                        verticalAlign="top"
                        height={36}
                        iconType="square"
                        iconSize={12}
                        formatter={(value) => <span className="text-sm font-bold ml-1">{value}</span>}
                    />
                </RechartsRadarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RadarChart;
