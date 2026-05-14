import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const statusStyles = {
    planned: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    complete: 'bg-green-100 text-green-800',
};

const AuditList = () => {
  // ... state declarations ...

  // ADD THIS NEW FUNCTION HERE
  const fetchAudits = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URI}/api/audits/`,
        { headers }
      );
      setAudits(Array.isArray(response.data.results) ? response.data.results : []);
      setLoading(false);
    } catch (err) {
      setError('Failed to load audits.');
      setLoading(false);
    }
  };

  // NOW USE IT IN USEEFFECT
  useEffect(() => {
    fetchAudits();
  }, []);

  // NOW IT WORKS IN HANDLECREATEAUDIT
  const handleCreateAudit = async () => {
    // ... your code ...
    fetchAudits();  // THIS WILL NOW WORK ✅
  };

  // ... rest of component ...
};

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
    /'. /;'
        ? audits
        : audits.filter(a => a.status === filter);

    if (loading) return (
        <p className="text-gray-400">Loading audits...</p>
    );
    if (error) return (
        <p className="text-red-500">{error}</p>
    );
const handleCreateAudit = async () => {
  if (!newAudit.title.trim()) {
    alert('Please enter an audit title');
    return;
  }

  try {
    const response = await axios.post(
  `${process.env.REACT_APP_API_URI}/api/audits/`,
  {
    title: newAudit.title,
    date: new Date().toISOString().split('T')[0],
    auditor: 'laks',  // Use logged-in user
    status: newAudit.status
  }
);

    
    // Reset form and close modal
    setNewAudit({ title: '', description: '', status: 'planned' });
    setShowCreateModal(false);
    
    // Refresh audits list
    fetchAudits();
  } catch (err) {
    alert('Failed to create audit: ' + err.message);
  }
};

    return (
        <div>
            {/* Filter Buttons */}
            <div className="flex gap-2 mb-4">
                <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <h2>Audits</h2>
  <button 
    onClick={() => setShowCreateModal(true)}
    style={{
      backgroundColor: '#3b82f6',
      color: 'white',
      padding: '8px 16px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: 'bold'
    }}
  >
    + New Audit
  </button>
</div>

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
        {showCreateModal && (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  }}>
    <div style={{
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '8px',
      width: '90%',
      maxWidth: '500px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <h3>Create New Audit</h3>
      
      <input
        type="text"
        placeholder="Audit Title (e.g., ISO 9001 Q2 2026)"
        value={newAudit.title}
        onChange={(e) => setNewAudit({ ...newAudit, title: e.target.value })}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '15px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          boxSizing: 'border-box'
        }}
      />
      
      <textarea
        placeholder="Description (optional)"
        value={newAudit.description}
        onChange={(e) => setNewAudit({ ...newAudit, description: e.target.value })}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '15px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          boxSizing: 'border-box',
          minHeight: '80px'
        }}
      />
      
      <select
        value={newAudit.status}
        onChange={(e) => setNewAudit({ ...newAudit, status: e.target.value })}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '15px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          boxSizing: 'border-box'
        }}
      >
        <option value="planned">Planned</option>
        <option value="in_progress">In Progress</option>
        <option value="complete">Complete</option>
      </select>
      
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button
          onClick={() => setShowCreateModal(false)}
          style={{
            padding: '10px 20px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            backgroundColor: '#f3f4f6'
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleCreateAudit}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            backgroundColor: '#3b82f6',
            color: 'white',
            fontWeight: 'bold'
          }}
        >
          Create Audit
        </button>
      </div>
    </div>
  </div>
)}

        </div>
    );
;

export default AuditList;
