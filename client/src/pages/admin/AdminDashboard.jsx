import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HiUsers, HiBadgeCheck, HiClock, HiCollection, HiChartBar,
  HiAcademicCap, HiCog, HiClipboardList, HiUserAdd,
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import { adminAPI, electionAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      return navigate('/login');
    }
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const [statsRes, electionRes] = await Promise.all([
        adminAPI.getDashboard(),
        electionAPI.getAll(),
      ]);
      setStats(statsRes.data);
      setElections(electionRes.data.elections);
    } catch (err) {
      toast.error('Failed to load dashboard.');
    } finally {
      setLoading(false);
    }
  };

  const handleElectionStatus = async (id, status) => {
    try {
      await electionAPI.updateStatus(id, status);
      toast.success(`Election ${status} successfully.`);
      loadData();
    } catch {
      toast.error('Failed to update election status.');
    }
  };

  const handleDeleteElection = async (id, title) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await electionAPI.delete(id);
      toast.success('Election deleted.');
      loadData();
    } catch {
      toast.error('Failed to delete election.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-nacos-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center shadow-lg">
            <HiAcademicCap className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back, {user?.fullName}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/voters" className="btn-secondary text-sm py-2 px-4 flex items-center gap-2">
            <HiUsers /> Voters
          </Link>
          <Link to="/admin/audit" className="btn-secondary text-sm py-2 px-4 flex items-center gap-2">
            <HiClipboardList /> Audit
          </Link>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={HiUsers} label="Total Voters" value={stats.totalVoters} color="nacos" />
          <StatCard icon={HiBadgeCheck} label="Approved" value={stats.approvedVoters} color="green" />
          <StatCard icon={HiClock} label="Pending" value={stats.pendingApprovals} color="yellow" />
          <StatCard icon={HiCollection} label="Elections" value={stats.totalElections} color="blue" />
          <StatCard icon={HiChartBar} label="Active" value={stats.activeElections} color="green" />
          <StatCard icon={HiUsers} label="Candidates" value={stats.totalCandidates} color="nacos" />
          <StatCard icon={HiBadgeCheck} label="Total Votes" value={stats.totalVotes} color="blue" />
        </div>
      )}

      <div className="card mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Elections</h2>
          <Link to="/admin/elections/new" className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
            <HiUserAdd /> New Election
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <th className="text-left py-3 px-2 font-semibold text-gray-500 dark:text-gray-400">Title</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-500 dark:text-gray-400">Status</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-500 dark:text-gray-400">Positions</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-500 dark:text-gray-400">Period</th>
                <th className="text-right py-3 px-2 font-semibold text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {elections.map((el) => (
                <tr key={el._id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-3 px-2 font-medium text-gray-900 dark:text-gray-100">{el.title}</td>
                  <td className="py-3 px-2">
                    <span className={`badge ${
                      el.status === 'active' ? 'badge-success' :
                      el.status === 'pending' ? 'badge-warning' :
                      el.status === 'paused' ? 'badge-info' :
                      'badge-danger'
                    }`}>{el.status}</span>
                  </td>
                  <td className="py-3 px-2 text-gray-500">{el.positions?.length || 0}</td>
                  <td className="py-3 px-2 text-gray-500 text-xs">
                    {new Date(el.startDate).toLocaleDateString()} - {new Date(el.endDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-2 text-right">
                    <div className="flex gap-2 justify-end">
                      {el.status === 'pending' && (
                        <button onClick={() => handleElectionStatus(el._id, 'active')} className="btn-success text-xs py-1.5 px-3">Start</button>
                      )}
                      {el.status === 'active' && (
                        <>
                          <button onClick={() => handleElectionStatus(el._id, 'paused')} className="badge-info text-xs py-1.5 px-3 border-0 cursor-pointer">Pause</button>
                          <button onClick={() => handleElectionStatus(el._id, 'ended')} className="btn-danger text-xs py-1.5 px-3">End</button>
                        </>
                      )}
                      {el.status === 'paused' && (
                        <button onClick={() => handleElectionStatus(el._id, 'active')} className="btn-success text-xs py-1.5 px-3">Resume</button>
                      )}
                      <Link to={`/admin/elections/${el._id}/candidates`} className="btn-secondary text-xs py-1.5 px-3">Candidates</Link>
                      <Link to={`/admin/elections/${el._id}`} className="btn-secondary text-xs py-1.5 px-3">Edit</Link>
                      <button onClick={() => handleDeleteElection(el._id, el.title)} className="btn-danger text-xs py-1.5 px-3">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {elections.length === 0 && (
                <tr><td colSpan={5} className="text-center py-8 text-gray-400">No elections created yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
