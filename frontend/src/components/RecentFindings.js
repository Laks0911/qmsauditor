import { useNavigate } from 'react-router-dom';

const severityStyles = {
    minor: 'bg-gray-100 text-gray-700',
    major: 'bg-orange-100 text-orange-700',
    critical: 'bg-red-100 text-red-700',
};

const statusStyles = {
    open: 'bg-red-100 text-red-700',
    closed: 'bg-green-100 text-green-700',
};

const RecentFindings = ({ findings, audits }) => {
    const navigate = useNavigate();

    const recent = [...findings]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);

    const getAuditTitle = (auditId) => {
        const getAuditTitle = (auditId) => {
  const auditsArray = Array.isArray(audits) ? audits : (audits.results || []);
  const audit = auditsArray.find(a => a.id === auditId);

        return audit ? audit.title : 'Unknown Audit';
    };

    if (findings.length === 0) return (
        <div className="bg-white rounded shadow p-6">
            <h3 className="font-bold text-gray-700 mb-4">
                Recent Findings
            </h3>
            <p className="text-gray-400 text-sm">
                No findings recorded yet.
            </p>
        </div>
    );

    return (
        <div className="bg-white rounded shadow p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-700">
                    Recent Findings
                </h3>
                <span className="text-xs text-gray-400">
                    Last {recent.length} of {findings.length} total
                </span>
            </div>
            <div className="space-y-3">
                {recent.map(finding => (
                    <div
                        key={finding.id}
                        onClick={() => navigate(`/audit/${finding.audit}`)}
                        className="flex justify-between items-start p-3 rounded border border-gray-100 hover:bg-gray-50 cursor-pointer transition"
                    >
                        <div className="flex-1 mr-4">
                            <p className="text-sm text-gray-800 line-clamp-1">
                                {finding.description}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                {getAuditTitle(finding.audit)}
                            </p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full uppercase ${severityStyles[finding.severity]}`}>
                                {finding.severity}
                            </span>
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full uppercase ${statusStyles[finding.status]}`}>
                                {finding.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentFindings;
