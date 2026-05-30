import { useState, useEffect } from 'react';
import { HiChartBar, HiDownload, HiExclamationCircle } from 'react-icons/hi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import toast from 'react-hot-toast';
import { electionAPI, resultAPI } from '../utils/api';

const COLORS = ['#6f42c1', '#7c14ff', '#28a745', '#ffc107', '#dc3545', '#17a2b8', '#fd7e14', '#e83e8c'];

export default function Results() {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    electionAPI.getAll()
      .then((res) => setElections(res.data.elections))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedElection) {
      resultAPI.getResults(selectedElection)
        .then((res) => setResults(res.data))
        .catch(() => toast.error('Failed to load results'));
    }
  }, [selectedElection]);

  const handleExport = async (format) => {
    if (!selectedElection) return;
    try {
      const fn = format === 'pdf' ? resultAPI.exportPDF : resultAPI.exportExcel;
      const res = await fn(selectedElection);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `election-results.${format}`;
      a.click();
      toast.success(`${format.toUpperCase()} downloaded!`);
    } catch {
      toast.error('Export failed.');
    }
  };

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
          <HiChartBar className="text-white text-2xl" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Election Results</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Real-time vote counts and statistics</p>
        </div>
      </div>

      <div className="card mb-8">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Election</label>
        <select
          className="input-field"
          value={selectedElection || ''}
          onChange={(e) => setSelectedElection(e.target.value || null)}
        >
          <option value="">-- Choose an election --</option>
          {elections.map((el) => (
            <option key={el._id} value={el._id}>
              {el.title} ({el.status})
            </option>
          ))}
        </select>
      </div>

      {results && (
        <div className="space-y-8 animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="card text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Votes</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{results.totalVotesCast}</p>
            </div>
            {results.totalVoters !== null && (
              <div className="card text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Voters</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{results.totalVoters}</p>
              </div>
            )}
            <div className="card text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Positions</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{results.results.length}</p>
            </div>
            <div className="card text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
              <p className="text-3xl font-bold uppercase">
                <span className={results.isEnded ? 'text-green-500' : 'text-yellow-500'}>
                  {results.isEnded ? 'Ended' : 'Active'}
                </span>
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => handleExport('pdf')} className="btn-secondary flex items-center gap-2">
              <HiDownload /> Export PDF
            </button>
            <button onClick={() => handleExport('excel')} className="btn-secondary flex items-center gap-2">
              <HiDownload /> Export Excel
            </button>
          </div>

          {results.results.map((positionResult) => (
            <div key={positionResult.position} className="card">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">{positionResult.position}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Total: {positionResult.totalVotes} votes</p>

              <div className="h-64 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={positionResult.candidates}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="fullName" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      }}
                    />
                    <Bar dataKey="voteCount" radius={[8, 8, 0, 0]}>
                      {positionResult.candidates.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2">
                {positionResult.candidates.map((c, idx) => (
                  <div
                    key={c.id}
                    className={`flex items-center justify-between p-3 rounded-xl ${
                      c.isWinner ? 'bg-green-50 dark:bg-green-900/20 ring-1 ring-green-200 dark:ring-green-800' : 'bg-gray-50 dark:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-gray-400">{idx + 1}</span>
                      <div>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{c.fullName}</span>
                        {c.isWinner && <span className="badge-success ml-2">Winner</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-gray-900 dark:text-gray-100">{c.voteCount}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">({c.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {!results && selectedElection && (
        <div className="text-center py-12">
          <HiExclamationCircle className="text-4xl text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No results available yet.</p>
        </div>
      )}
    </div>
  );
}
