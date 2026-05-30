import { useState, useEffect } from 'react';
import { HiUsers, HiCheck, HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { adminAPI } from '../../utils/api';

export default function VotersManagement() {
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getVoters()
      .then((res) => setVoters(res.data.voters))
      .catch(() => toast.error('Failed to load voters.'))
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id, name) => {
    try {
      await adminAPI.approveVoter(id);
      toast.success(`${name} approved.`);
      setVoters((prev) => prev.map((v) => v._id === id ? { ...v, isApproved: true } : v));
    } catch {
      toast.error('Failed to approve.');
    }
  };

  const handleReject = async (id) => {
    if (!confirm('Delete this voter registration?')) return;
    try {
      await adminAPI.rejectVoter(id);
      toast.success('Voter removed.');
      setVoters((prev) => prev.filter((v) => v._id !== id));
    } catch {
      toast.error('Failed to reject.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-nacos-500 border-t-transparent" />
      </div>
    );
  }

  const pending = voters.filter((v) => !v.isApproved);
  const approved = voters.filter((v) => v.isApproved);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center shadow-lg">
          <HiUsers className="text-white text-2xl" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Voters Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{pending.length} pending approval</p>
        </div>
      </div>

      {pending.length > 0 && (
        <div className="card mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Pending Approvals</h2>
          <div className="space-y-3">
            {pending.map((v) => (
              <div key={v._id} className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border border-yellow-200 dark:border-yellow-800">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{v.fullName}</p>
                  <p className="text-sm text-gray-500">{v.matricNumber} &middot; {v.department} &middot; {v.level}</p>
                  <p className="text-xs text-gray-400">{v.email}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleApprove(v._id, v.fullName)} className="btn-success text-sm py-2 px-4 flex items-center gap-1">
                    <HiCheck /> Approve
                  </button>
                  <button onClick={() => handleReject(v._id)} className="btn-danger text-sm py-2 px-4 flex items-center gap-1">
                    <HiX /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">All Voters ({voters.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <th className="text-left py-3 px-2 font-semibold text-gray-500">Name</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-500">Matric</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-500">Department</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-500">Level</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-500">Status</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-500">Voted</th>
              </tr>
            </thead>
            <tbody>
              {voters.map((v) => (
                <tr key={v._id} className="border-b border-gray-50 dark:border-gray-800">
                  <td className="py-3 px-2 font-medium text-gray-900 dark:text-gray-100">{v.fullName}</td>
                  <td className="py-3 px-2 text-gray-500">{v.matricNumber}</td>
                  <td className="py-3 px-2 text-gray-500">{v.department}</td>
                  <td className="py-3 px-2 text-gray-500">{v.level}</td>
                  <td className="py-3 px-2">
                    {v.isApproved ? <span className="badge-success">Approved</span> : <span className="badge-warning">Pending</span>}
                  </td>
                  <td className="py-3 px-2">
                    {v.hasVoted ? <span className="badge-info">Yes</span> : <span className="badge">No</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
