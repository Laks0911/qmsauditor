import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const statusStyles = {
    planned: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    complete: 'bg-green-100 text-green-800',
};

const severityStyles = {
    minor: 'bg-gray-100 text-gray-800',
    major: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800',
};

const findingStatusStyles = {
    open: 'bg-red-100 text-red-800',
    closed: 'bg-green-100 text-green-800',
};

const AuditDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('access');
    const user = jwtDecode(token);

    const [audit, setAudit] = useState(null);
    const [findings, setFindings] = useState([]);
    const [loading, setLoading] = useState(true);

    const headers = { Authorization: `Bearer ${token}` };
    const API = process.env.REACT_APP_API_URL;

    useEffect(() => {
        Promise.all([
            axios.get(`${API}/api/audits/${id}/`, { headers }),
            axios.get(`${API}/api/findings/?audit_id=${id}`, { headers })
        ]).then(([auditRes, findingsRes]) => {
            setAudit(auditRes.data);
            setFindings(findingsRes.data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <p className="text-gray-400">Loading audit...</p>
        </div>
    );

    if (!audit) return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <p className="text-red-500">Audit not found.</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow px-8 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-blue-600">QMSAuditor</h1>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-sm text-gray-500 hover:text-gray-700"
                    >
                        ← Back to Dashboard
                    </button>
                    <span className="text-gray-600">{user.username}</span>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full uppercase">
                        {user.role}
                    </span>
                </div>
            </nav>

            <main className="p-8 max-w-4xl mx-auto">
                {/* Audit Header */}
                <div className="bg-white rounded shadow p-6 mb-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                {audit.title}
                            </h2>
                            <p className="text-gray-500 mt-1">
                                {audit.auditor} — {audit.date}
                            </p>
                        </div>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full uppercase ${statusStyles[audit.status]}`}>
                            {audit.status}
                        </span>
                    </div>
                </div>

                {/* Findings Section */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-700">
                        Findings ({findings.length})
                    </h3>
                </div>

                {findings.length === 0 ? (
                    <p className="text-gray-400 mt-2">
                        No findings recorded yet.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {findings.map(finding => (
                            <div key={finding.id}
                                className="bg-white rounded shadow p-4">
                                <div className="flex justify-between items-start">
                                    <p className="text-gray-800 flex-1 mr-4">
                                        {finding.description}
                                    </p>
                                    <div className="flex gap-2 shrink-0">
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-full uppercase ${severityStyles[finding.severity]}`}>
                                            {finding.severity}
                                        </span>
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-full uppercase ${findingStatusStyles[finding.status]}`}>
                                            {finding.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default AuditDetail;
