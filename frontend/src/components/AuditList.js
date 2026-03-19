import { useEffect, useState } from 'react';
import axios from 'axios';

const statusStyles = {
    planned: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    complete: 'bg-green-100 text-green-800',
};

const AuditList = () => {
    const [audits, setAudits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const token = localStorage.getItem('access');

    useEffect(() => {
        axios.get(
            `${process.env.REACT_APP_API_URL}/api/audits/`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(res => {
            setAudits(res.data);
            setLoading(false);
        })
        .catch(() => {
            setError('Failed to load audits.');
            setLoading(false);
        });
    }, []);

    if (loading) return <p className="text-gray-400">Loading audits...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (audits.length === 0) return <p className="text-gray-400">No audits found.</p>;

    return (
        <div className="mt-6 space-y-4">
            {audits.map(audit => (
                <div key={audit.id} className="bg-white rounded shadow p-4 flex justify-between items-center">
                    <div>
                        <h3 className="font-semibold text-gray-800">{audit.title}</h3>
                        <p className="text-sm text-gray-500">{audit.auditor} — {audit.date}</p>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full uppercase ${statusStyles[audit.status]}`}>
                        {audit.status}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default AuditList;
