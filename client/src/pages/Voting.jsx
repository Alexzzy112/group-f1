import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiShieldCheck, HiExclamationCircle, HiCheck } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { electionAPI, candidateAPI, voteAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Voting() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [election, setElection] = useState(null);
  const [groupedCandidates, setGroupedCandidates] = useState({});
  const [selections, setSelections] = useState({});
  const [votedPositions, setVotedPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!user) return navigate('/login');
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const electionRes = await electionAPI.getActive();
      if (!electionRes.data.election) {
        setLoading(false);
        return;
      }
      const activeElection = electionRes.data.election;
      setElection(activeElection);

      const [candRes, statusRes] = await Promise.all([
        candidateAPI.getByElection(activeElection._id),
        voteAPI.getStatus(activeElection._id),
      ]);

      setVotedPositions(statusRes.data.votedPositions);

      const grouped = {};
      candRes.data.candidates.forEach((c) => {
        if (!grouped[c.position]) grouped[c.position] = [];
        grouped[c.position].push(c);
      });
      setGroupedCandidates(grouped);
    } catch (err) {
      toast.error('Failed to load election data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (position, candidateId) => {
    if (votedPositions.includes(position)) return;
    setSelections((prev) => ({
      ...prev,
      [position]: prev[position] === candidateId ? null : candidateId,
    }));
  };

  const handleSubmitVotes = async () => {
    setSubmitting(true);
    try {
      const entries = Object.entries(selections).filter(([, v]) => v);
      for (const [position, candidateId] of entries) {
        await voteAPI.cast({
          electionId: election._id,
          candidateId,
          position,
        });
      }
      toast.success('All votes cast successfully!');
      navigate('/results');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Vote submission failed.');
    } finally {
      setSubmitting(false);
      setShowConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-nacos-500 border-t-transparent" />
      </div>
    );
  }

  if (!election) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center card max-w-md">
          <HiExclamationCircle className="text-5xl text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No Active Election</h2>
          <p className="text-gray-500 dark:text-gray-400">There is no active election at the moment. Please check back later.</p>
        </div>
      </div>
    );
  }

  const positionsWithCandidates = election.positions.filter((p) => (groupedCandidates[p] || []).length > 0);
  const selectedCount = Object.values(selections).filter(Boolean).length;
  const totalPositions = election.positions.length;
  const allSelected = Object.keys(selections).filter((p) => (groupedCandidates[p] || []).length > 0).length === positionsWithCandidates.length;

  const getCandidateName = (position, id) => {
    const c = groupedCandidates[position]?.find((c) => c._id === id);
    return c ? c.fullName : '';
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center shadow-lg shadow-nacos-600/20">
          <HiShieldCheck className="text-white text-2xl" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{election.title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{selectedCount} of {totalPositions} positions selected</p>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); setShowConfirm(true); }} className="space-y-6">
        {election.positions.map((position) => {
          const posCandidates = groupedCandidates[position] || [];
          const alreadyVoted = votedPositions.includes(position);
          const hasCandidates = posCandidates.length > 0;
          return (
            <div key={position} className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{position}</h2>
                {alreadyVoted && <span className="badge-success"><HiCheck className="mr-1" /> Voted</span>}
              </div>
              {!hasCandidates && !alreadyVoted && (
                <p className="text-gray-400 text-center py-4 text-sm">No candidates have been added for this position yet.</p>
              )}
              {!hasCandidates && alreadyVoted && (
                <p className="text-gray-400 text-center py-4 text-sm">No candidates were available for this position.</p>
              )}
              <div className="space-y-3">
                {posCandidates.map((candidate) => {
                  const isSelected = selections[position] === candidate._id;
                  return (
                    <label
                      key={candidate._id}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        alreadyVoted
                          ? 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 cursor-not-allowed opacity-60'
                          : isSelected
                            ? 'border-nacos-500 bg-nacos-50 dark:bg-nacos-900/20 shadow-sm'
                            : 'border-gray-100 dark:border-gray-700 hover:border-nacos-300 dark:hover:border-nacos-600 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      }`}
                    >
                      <div className="relative">
                        <input
                          type="radio"
                          name={position}
                          value={candidate._id}
                          checked={isSelected}
                          onChange={() => handleSelect(position, candidate._id)}
                          disabled={alreadyVoted}
                          className="sr-only"
                        />
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? 'border-nacos-500 bg-nacos-500'
                            : 'border-gray-300 dark:border-gray-500'
                        }`}>
                          {isSelected && <HiCheck className="text-white text-sm" />}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{candidate.fullName}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{candidate.department}</p>
                        {candidate.slogan && (
                          <p className="text-xs italic text-nacos-600 dark:text-nacos-400 mt-1">&ldquo;{candidate.slogan}&rdquo;</p>
                        )}
                      </div>
                      {candidate.manifesto && (
                        <details className="text-xs shrink-0">
                          <summary className="text-nacos-500 cursor-pointer hover:text-nacos-600 font-medium">Manifesto</summary>
                          <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-xs">{candidate.manifesto}</p>
                        </details>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div className="text-center pt-4">
          <button
            type="submit"
            disabled={!allSelected || submitting}
            className="btn-primary text-lg px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit All Votes'}
          </button>
        </div>
      </form>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowConfirm(false)}>
          <div className="card max-w-md w-full animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Confirm Your Votes</h2>
            <div className="space-y-3 mb-6">
              {Object.entries(selections).filter(([, v]) => v).map(([position, candidateId]) => (
                <div key={position} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{position}</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{getCandidateName(position, candidateId)}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowConfirm(false)} className="btn-secondary flex-1">Cancel</button>
              <button type="button" onClick={handleSubmitVotes} disabled={submitting} className="btn-primary flex-1">
                {submitting ? 'Submitting...' : 'Confirm & Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
