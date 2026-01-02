import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface CompetencyScore {
    name: string;
    self: number;
    manager: number;
    average: number;
}

interface CompetencyTableProps {
    data: CompetencyScore[];
}

export const CompetencyTable = ({ data }: CompetencyTableProps) => {
    return (
        <div className="w-full overflow-hidden rounded-t-xl border border-gray-100 shadow-sm mb-8">
            <Table>
                <TableHeader className="bg-[#8da356]">
                    <TableRow className="hover:bg-transparent border-none">
                        <TableHead className="w-[450px] text-white font-black py-4 px-6 text-sm uppercase tracking-wider"></TableHead>
                        <TableHead className="text-white font-black text-center py-4 px-6 text-sm uppercase tracking-wider">Self</TableHead>
                        <TableHead className="text-white font-black text-center py-4 px-6 text-sm uppercase tracking-wider">Manager</TableHead>
                        <TableHead className="text-white font-black text-center py-4 px-6 text-sm uppercase tracking-wider">Average</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item, idx) => (
                        <TableRow key={idx} className="border-b border-gray-100 bg-[#f9fafb]/50 hover:bg-white transition-colors">
                            <TableCell className="py-4 px-6 font-bold text-gray-800 text-lg">
                                {item.name}
                            </TableCell>
                            <TableCell className="py-4 px-6 text-center text-gray-600 font-medium">
                                {item.self || ''}
                            </TableCell>
                            <TableCell className="py-4 px-6 text-center text-gray-600 font-medium">
                                {item.manager || ''}
                            </TableCell>
                            <TableCell className="py-4 px-6 flex justify-center items-center">
                                <div className="bg-[#dce4c9] rounded-full w-12 h-12 flex items-center justify-center font-bold text-gray-700 border border-[#8da356]/20">
                                    {item.average.toFixed(2)}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
