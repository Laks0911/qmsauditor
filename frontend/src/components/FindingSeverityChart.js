import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const FindingSeverityChart = (findings) => {
  // Handle DRF pagination - extract results array if needed
  const findingsArray = Array.isArray(findings) ? findings : (findings.results || []);



    const data = [
        {
            severity: 'Minor',
            Open: findingsArray.filter(f => f.severity === 'minor' && f.status === 'open').length,
            Closed: findingsArray.filter(f => f.severity === 'minor' && f.status === 'closed').length,
        },
        {
            severity: 'Major',
            Open: findingsArray.filter(f => f.severity === 'major' && f.status === 'open').length,
            Closed: findingsArray.filter(f => f.severity === 'major' && f.status === 'closed').length,
        },
        {
            severity: 'Critical',
            Open: findingsArray.filter(f => f.severity === 'critical' && f.status === 'open').length,
            Closed: findingsArray.filter(f => f.severity === 'critical' && f.status === 'closed').length,
        },
    ];

    if (findings.length === 0) return (
        <div className="bg-white rounded shadow p-6 flex items-center justify-center h-64">
            <p className="text-gray-400">No findings data yet.</p>
        </div>
    );

    return (
        <div className="bg-white rounded shadow p-6">
            <h3 className="font-bold text-gray-700 mb-4">
                Findings by Severity
            </h3>
            <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="severity" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Open" fill="#EF4444" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Closed" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default FindingSeverityChart;
