import AuditList from '../components/AuditList';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('access');
    const user = jwtDecode(token);

    const handleLogout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow px-8 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-blue-600">QMSAuditor</h1>
                <div className="flex items-center gap-4">
                    <span className="text-gray-600">
                        {user.username}
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full uppercase">
                        {user.role}
                    </span>
                    <button
                        onClick={handleLogout}
                        className="text-sm text-red-500 hover:text-red-700"
                    >
                        Log out
                    </button>
                </div>
            </nav>
            <main className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Welcome back, {user.username} 👋l
                </h2>
                <p className="text-gray-500">
                    You are logged in as <strong>{user.role}</strong>.
                </p><AuditList />
            </main>
        </div>
    );
};

export default Dashboard;
