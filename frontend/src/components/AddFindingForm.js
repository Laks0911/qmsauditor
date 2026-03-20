import { useState } from 'react';
import axios from 'axios';

const AddFindingForm = ({ auditId, token, onFindingAdded }) => {
    const [description, setDescription] = useState('');
    const [severity, setSeverity] = useState('minor');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description.trim()) {
            setError('Description is required.');
            return;
        }
        setSubmitting(true);
        setError('');
        try {
            const res = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/findings/`,
                {
                    audit: auditId,
                    description,
                    severity,
                    status: 'open',
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setDescription('');
            setSeverity('minor');
            onFindingAdded(res.data);
        } catch (err) {
            setError('Failed to add finding. Check your permissions.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded shadow p-6 mb-6">
            <h4 className="font-bold text-gray-700 mb-4">
                Add Finding
            </h4>
            <form onSubmit={handleSubmit}>
                <textarea
                    placeholder="Describe the finding..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border rounded p-2 mb-3 text-sm"
                    rows={3}
                />
                <div className="flex gap-3 items-center">
                    <select
                        value={severity}
                        onChange={(e) => setSeverity(e.target.value)}
                        className="border rounded p-2 text-sm"
                    >
                        <option value="minor">Minor</option>
                        <option value="major">Major</option>
                        <option value="critical">Critical</option>
                    </select>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                    >
                        {submitting ? 'Adding...' : 'Add Finding'}
                    </button>
                </div>
                {error && (
                    <p className="text-red-500 text-sm mt-2">{error}</p>
                )}
            </form>
        </div>
    );
};

export default AddFindingForm;
