import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLOURS = {
    planned: '#3B82F6',
    in_progress: '#F59E0B',
    complete: '#10B981',
};

const LABELS = {
    planned: 'Planned',
    in_progress: 'In Progress',
    complete: 'Complete',
};

const AuditStatusChart = ({ audits }) => {
    const data = ['planned', 'in_progress', 'complete']
        .map(status => ({
            name: LABELS[status],
            value: audits.filter(a => a.status === status).length,
            colour: COLOURS[status],
        }))
        .filter(d => d.value > 0);

    if (data.length === 0) return (
        <div className="bg-white rounded shadow p-6 flex items-center justify-center h-64">
            <p className="text-gray-400">No audit data yet.</p>
        </div>
    );

    return (
        <div className="bg-white rounded shadow p-6">
            <h3 className="font-bold text-gray-700 mb-4">
                Audit Status
            </h3>
            <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.colour}
                            />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AuditStatusChart;
