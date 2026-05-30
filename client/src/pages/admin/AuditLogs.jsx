import { useState, useEffect } from 'react';
import { HiClipboardList } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { adminAPI } from '../../utils/api';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getAuditLogs()
      .then((res) => setLogs(res.data.logs))
      .catch(() => toast.error('Failed to load audit logs.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-nacos-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center shadow-lg">
          <HiClipboardList className="text-white text-2xl" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Audit Logs</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Track all system activities</p>
        </div>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <th className="text-left py-3 px-2 font-semibold text-gray-500">User</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-500">Action</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-500">Resource</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-500">Details</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-3 px-2 font-medium text-gray-900 dark:text-gray-100">
                    {log.user?.fullName || 'System'}
                    <span className="block text-xs text-gray-400">{log.user?.email || ''}</span>
                  </td>
                  <td className="py-3 px-2"><span className="badge-info">{log.action}</span></td>
                  <td className="py-3 px-2 text-gray-500">{log.resource}</td>
                  <td className="py-3 px-2 text-gray-500 text-xs max-w-xs truncate">
                    {log.details ? JSON.stringify(log.details).slice(0, 60) : '-'}
                  </td>
                  <td className="py-3 px-2 text-gray-400 text-xs">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr><td colSpan={5} className="text-center py-8 text-gray-400">No audit logs yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
