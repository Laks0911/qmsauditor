const StatsCards = ({ audits, findings }) => {

    const totalAudits = audits.length;
    const planned = audits.filter(a => a.status === 'planned').length;
    const inProgress = audits.filter(a => a.status === 'in_progress').length;
    const complete = audits.filter(a => a.status === 'complete').length;

    const totalFindings = findings.length;
    const openFindings = findings.filter(f => f.status === 'open').length;
    const criticalFindings = findings.filter(f => f.severity === 'critical').length;
    const closedFindings = findings.filter(f => f.status === 'closed').length;

    const cards = [
        {
            label: 'Total Audits',
            value: totalAudits,
            colour: 'bg-blue-50 border-blue-200 text-blue-700'
        },
        {
            label: 'In Progress',
            value: inProgress,
            colour: 'bg-yellow-50 border-yellow-200 text-yellow-700'
        },
        {
            label: 'Complete',
            value: complete,
            colour: 'bg-green-50 border-green-200 text-green-700'
        },
        {
            label: 'Open Findings',
            value: openFindings,
            colour: 'bg-red-50 border-red-200 text-red-700'
        },
        {
            label: 'Critical',
            value: criticalFindings,
            colour: 'bg-orange-50 border-orange-200 text-orange-700'
        },
        {
            label: 'Closed Findings',
            value: closedFindings,
            colour: 'bg-gray-50 border-gray-200 text-gray-700'
        },
    ];

    return (
        <div className="grid grid-cols-3 gap-4 mb-8">
            {cards.map((card, i) => (
                <div
                    key={i}
                    className={`border rounded-lg p-4 ${card.colour}`}
                >
                    <p className="text-sm font-medium opacity-75">
                        {card.label}
                    </p>
                    <p className="text-3xl font-bold mt-1">
                        {card.value}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default StatsCards;
