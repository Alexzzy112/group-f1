import { HiUser, HiBadgeCheck, HiClock } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { voteAPI } from '../utils/api';
import { useState, useEffect } from 'react';

export default function Profile() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    voteAPI.getHistory()
      .then((res) => setHistory(res.data.votes))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card mb-8">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 gradient-bg rounded-2xl flex items-center justify-center shadow-lg">
            <HiUser className="text-white text-4xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{user.fullName}</h1>
            <p className="text-gray-500 dark:text-gray-400">{user.matricNumber}</p>
            <div className="flex gap-2 mt-2">
              <span className="badge-info">{user.department}</span>
              <span className="badge-info">{user.level}</span>
              {user.isApproved ? (
                <span className="badge-success">Approved</span>
              ) : (
                <span className="badge-warning">Pending Approval</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <HiClock className="text-nacos-500" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Voting History</h2>
        </div>
        {loading ? (
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-12 bg-gray-100 dark:bg-gray-700 rounded-xl" />)}
          </div>
        ) : history.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No votes cast yet.</p>
        ) : (
          <div className="space-y-3">
            {history.map((vote) => (
              <div key={vote._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{vote.candidate?.fullName}</p>
                  <p className="text-sm text-gray-500">{vote.position} &middot; {vote.election?.title}</p>
                </div>
                <div className="text-right text-xs text-gray-400">
                  {new Date(vote.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
