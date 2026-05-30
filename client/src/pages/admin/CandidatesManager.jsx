import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiUserGroup, HiPlus, HiTrash, HiSave } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { electionAPI, candidateAPI } from '../../utils/api';

export default function CandidatesManager() {
  const { id: electionId } = useParams();
  const navigate = useNavigate();
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [form, setForm] = useState({
    position: '', fullName: '', department: 'Computer Science',
    level: '', slogan: '', manifesto: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [electionId]);

  const loadData = async () => {
    try {
      const [electionRes, candRes] = await Promise.all([
        electionAPI.getAll(),
        candidateAPI.getByElection(electionId),
      ]);
      const el = electionRes.data.elections.find((e) => e._id === electionId);
      setElection(el);
      setCandidates(candRes.data.candidates);
      if (el?.positions?.length) {
        setForm((prev) => ({ ...prev, position: el.positions[0] }));
      }
    } catch {
      toast.error('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.position) {
      return toast.error('Name and position are required.');
    }
    setSubmitting(true);
    try {
      await candidateAPI.create({
        election: electionId,
        position: form.position,
        fullName: form.fullName,
        department: form.department || 'Computer Science',
        level: form.level,
        slogan: form.slogan,
        manifesto: form.manifesto,
      });
      toast.success('Candidate added.');
      setForm({ position: form.position, fullName: '', department: 'Computer Science', level: '', slogan: '', manifesto: '' });
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add candidate.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCandidate = async (id, name) => {
    if (!confirm(`Delete ${name}?`)) return;
    try {
      await candidateAPI.delete(id);
      toast.success('Candidate removed.');
      loadData();
    } catch {
      toast.error('Failed to delete candidate.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-nacos-500 border-t-transparent" />
      </div>
    );
  }

  const grouped = {};
  candidates.forEach((c) => {
    if (!grouped[c.position]) grouped[c.position] = [];
    grouped[c.position].push(c);
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center shadow-lg">
          <HiUserGroup className="text-white text-2xl" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Manage Candidates</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{election?.title || 'Election'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <HiPlus className="text-nacos-500" /> Add Candidate
          </h2>
          <form onSubmit={handleAddCandidate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Position</label>
              <input type="text" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className="input-field" placeholder="e.g. President, Vice President, Secretary" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <input type="text" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="input-field" placeholder="Candidate name" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Department</label>
              <input type="text" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Level</label>
              <input type="text" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className="input-field" placeholder="e.g. 300Level" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Slogan</label>
              <input type="text" value={form.slogan} onChange={(e) => setForm({ ...form, slogan: e.target.value })} className="input-field" placeholder="Campaign slogan" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Manifesto</label>
              <textarea value={form.manifesto} onChange={(e) => setForm({ ...form, manifesto: e.target.value })} className="input-field" rows={3} placeholder="Candidate manifesto" />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2">
              {submitting ? 'Adding...' : <><HiSave /> Add Candidate</>}
            </button>
          </form>
        </div>

        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <HiUserGroup className="text-nacos-500" /> Candidates ({candidates.length})
          </h2>
          {candidates.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No candidates added yet.</p>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {Object.entries(grouped).map(([position, posCandidates]) => (
                <div key={position}>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 text-sm uppercase tracking-wide">{position}</h3>
                  <div className="space-y-2">
                    {posCandidates.map((c) => (
                      <div key={c._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{c.fullName}</p>
                          <p className="text-xs text-gray-500">{c.department}{c.level ? ` · ${c.level}` : ''}</p>
                          {c.slogan && <p className="text-xs italic text-nacos-500 mt-0.5">&ldquo;{c.slogan}&rdquo;</p>}
                        </div>
                        <button onClick={() => handleDeleteCandidate(c._id, c.fullName)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all">
                          <HiTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 text-center">
        <button onClick={() => navigate('/admin/dashboard')} className="btn-secondary">Back to Dashboard</button>
      </div>
    </div>
  );
}
