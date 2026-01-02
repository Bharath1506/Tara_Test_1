import { useState, Fragment } from 'react';
import {
    ChevronDown,
    ChevronRight,
    Target,
    Star,
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';

export interface KeyResult {
    id: string;
    description: string;
    target: string;
    current: string;
    metrics: string;
    employeeRating: number;
    managerRating: number;
    dueDate?: string;
    weight?: number;
}

export interface OKR {
    id: string;
    objective: string;
    weight?: number;
    dueDate?: string;
    progress?: number;
    employeeRating: number;
    managerRating: number;
    keyResults: KeyResult[];
}

interface OKRTableProps {
    okrs: OKR[];
}

export const OKRTable = ({ okrs }: OKRTableProps) => {
    const [expandedObjectives, setExpandedObjectives] = useState<Record<string, boolean>>(
        okrs.reduce((acc, okr) => ({ ...acc, [okr.id]: true }), {})
    );

    const toggleObjective = (id: string) => {
        setExpandedObjectives(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const StarRating = ({ rating }: { rating: number }) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={16}
                        className={`${star <= rating
                            ? 'fill-[#8da356] text-[#8da356]'
                            : 'text-gray-200'
                            }`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <Table>
                <TableHeader className="bg-[#fafbf8]">
                    <TableRow className="hover:bg-transparent border-b border-gray-100">
                        <TableHead className="w-[400px] text-[10px] font-bold uppercase tracking-wider text-gray-400 py-4 px-6">OBJECTIVE</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-wider text-gray-400 py-4 px-6 text-center">DUE DATE</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-wider text-gray-400 py-4 px-6 text-center">WEIGHT</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-wider text-gray-400 py-4 px-6">PROGRESS</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-wider text-gray-400 py-4 px-6">EMPLOYEE RATING</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-wider text-gray-400 py-4 px-6">MANAGER RATING</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {okrs.map((okr) => (
                        <Fragment key={okr.id}>
                            <TableRow className="group border-b border-gray-50 transition-colors hover:bg-gray-50/30">
                                <TableCell className="py-6 px-6">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => toggleObjective(okr.id)}
                                            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                                        >
                                            {expandedObjectives[okr.id] ? (
                                                <ChevronDown size={18} className="text-gray-400" />
                                            ) : (
                                                <ChevronRight size={18} className="text-gray-400" />
                                            )}
                                        </button>
                                        <Checkbox className="h-4 w-4 rounded border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                                        <div className="flex items-center gap-2">
                                            <div className="text-gray-400">
                                                <Target size={18} />
                                            </div>
                                            <span className="font-bold text-gray-700 text-[14px]">
                                                {okr.objective}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-6 px-6 text-[13px] text-gray-500 font-medium text-center">
                                    {okr.dueDate || '31 Jan 2026'}
                                </TableCell>
                                <TableCell className="py-6 px-6 text-[13px] text-gray-500 font-medium text-center">
                                    {okr.weight || '50'}
                                </TableCell>
                                <TableCell className="py-6 px-6">
                                    <div className="flex flex-col gap-1 min-w-[100px]">
                                        <div className="flex h-2 w-full overflow-hidden rounded-full bg-gray-100">
                                            <div
                                                className="bg-[#22c55e] h-full transition-all duration-500 ease-in-out"
                                                style={{ width: `${okr.progress || 75}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-500">
                                            {okr.progress || 75}%
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-6 px-6">
                                    <StarRating rating={okr.employeeRating} />
                                </TableCell>
                                <TableCell className="py-6 px-6">
                                    <StarRating rating={okr.managerRating} />
                                </TableCell>
                            </TableRow>

                            {/* Key Results Rows */}
                            {expandedObjectives[okr.id] && okr.keyResults.map((kr) => (
                                <TableRow key={kr.id} className="bg-white border-b border-gray-50/50 hover:bg-gray-50/20">
                                    <TableCell className="py-4 px-6">
                                        <div className="flex items-center gap-3 pl-10">
                                            <Checkbox className="h-3.5 w-3.5 rounded border-gray-200" />
                                            <div className="flex items-center gap-2">
                                                <div className="text-gray-300">
                                                    <Target size={14} />
                                                </div>
                                                <span className="text-[13px] text-gray-600 font-medium">
                                                    {kr.description}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 px-6 text-[12px] text-gray-400 text-center">
                                        {kr.dueDate || okr.dueDate || '31 Jan 2026'}
                                    </TableCell>
                                    <TableCell className="py-4 px-6 text-[12px] text-gray-400 text-center">
                                        {kr.weight || '25'}
                                    </TableCell>
                                    <TableCell className="py-4 px-6">
                                        <div className="flex flex-col gap-1 min-w-[80px]">
                                            <div className="w-full bg-gray-50 rounded-full h-1.5 flex overflow-hidden">
                                                <div className="bg-[#22c55e] h-1.5 rounded-full" style={{ width: `${kr.employeeRating > 0 ? 100 : 0}%` }}></div>
                                            </div>
                                            <span className="text-[10px] text-gray-400 font-medium">{kr.employeeRating > 0 ? '100%' : '0%'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 px-6">
                                        <StarRating rating={kr.employeeRating} />
                                    </TableCell>
                                    <TableCell className="py-4 px-6">
                                        <StarRating rating={kr.managerRating} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </Fragment>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
