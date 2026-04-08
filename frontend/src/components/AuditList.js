import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const statusStyles = {
    planned: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    complete: 'bg-green-100 text-green-800',
};

const AuditList = () => {
    const navigate = useNavigate();
    const [audits, setAudits] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const token = localStorage.getItem('access');
const headers = { Authorization: `Bearer ${token}` };


    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URI}/api/audits/`, { headers })
        .then(res => {
            // Handle Django REST pagination format
const auditsData = res.data.results || res.data;
setAudits(Array.isArray(auditsData) ? auditsData : []);

            setLoading(false);
        })
        .catch(() => {
            setError('Failed to load audits.');
            setLoading(false);
        });
    }, []);

    const filtered = filter === 'all'
        ? audits
        : audits.filter(a => a.status === filter);

    if (loading) return (
        <p className="text-gray-400">Loading audits...</p>
    );
    if (error) return (
        <p className="text-red-500">{error}</p>
    );

    return (
        <div>
            {/* Filter Buttons */}
            <div className="flex gap-2 mb-4">
                {['all', 'planned', 'in_progress', 'complete'].map(s => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold uppercase transition ${
                            filter === s
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        {s === 'all' ? 'All' :
                         s === 'in_progress' ? 'In Progress' :
                         s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                ))}
            </div>

            {/* Audit Count */}
            <p className="text-sm text-gray-400 mb-3">
                Showing {filtered.length} of {audits.length} audits
            </p>

            {/* Audit Cards */}
            {filtered.length === 0 ? (
                <p className="text-gray-400">
                    No audits match this filter.
                </p>
            ) : (
                <div className="space-y-3">
                    {filtered.map(audit => (
                        <div
                            key={audit.id}
                            onClick={() => navigate(`/audit/${audit.id}`)}
                            className="bg-white rounded shadow p-4 flex justify-between items-center cursor-pointer hover:shadow-md transition"
                        >
                            <div>
                                <h3 className="font-semibold text-gray-800">
                                    {audit.title}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {audit.auditor} — {audit.date}
                                </p>
                            </div>
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full uppercase ${statusStyles[audit.status]}`}>
                                {audit.status}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AuditList;
