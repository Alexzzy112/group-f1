import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiSave } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { electionAPI, candidateAPI } from '../../utils/api';

const defaultPositions = ['President', 'Vice President', 'Secretary', 'Treasurer', 'PRO'];

export default function ElectionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({
    title: '', description: '', startDate: '', endDate: '', positions: [...defaultPositions],
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit) {
      electionAPI.getAll().then((res) => {
        const el = res.data.elections.find((e) => e._id === id);
        if (el) {
          setForm({
            title: el.title,
            description: el.description || '',
            startDate: el.startDate ? new Date(el.startDate).toISOString().slice(0, 16) : '',
            endDate: el.endDate ? new Date(el.endDate).toISOString().slice(0, 16) : '',
            positions: el.positions || [],
          });
        }
      });
    }
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePositionChange = (index, value) => {
    const updated = [...form.positions];
    updated[index] = value;
    setForm({ ...form, positions: updated });
  };

  const addPosition = () => setForm({ ...form, positions: [...form.positions, ''] });
  const removePosition = (index) => {
    if (form.positions.length <= 1) return;
    setForm({ ...form, positions: form.positions.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.startDate || !form.endDate) {
      return toast.error('Title, start date, and end date are required.');
    }
    const filteredPositions = form.positions.filter((p) => p.trim());
    if (filteredPositions.length === 0) {
      return toast.error('Add at least one position.');
    }

    setSubmitting(true);
    try {
      const data = {
        ...form,
        positions: filteredPositions,
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
      };

      if (isEdit) {
        await electionAPI.update(id, data);
        toast.success('Election updated.');
      } else {
        await electionAPI.create(data);
        toast.success('Election created.');
      }
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save election.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        {isEdit ? 'Edit Election' : 'Create New Election'}
      </h1>

      <form onSubmit={handleSubmit} className="card space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Election Title</label>
          <input type="text" name="title" value={form.title} onChange={handleChange} className="input-field" placeholder="e.g., NACOS 2026 Election" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description (optional)</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="input-field" rows={3} placeholder="Brief description of the election" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Start Date & Time</label>
            <input type="datetime-local" name="startDate" value={form.startDate} onChange={handleChange} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">End Date & Time</label>
            <input type="datetime-local" name="endDate" value={form.endDate} onChange={handleChange} className="input-field" required />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Positions</label>
            <button type="button" onClick={addPosition} className="text-sm text-nacos-600 dark:text-nacos-400 font-semibold hover:underline">+ Add Position</button>
          </div>
          <div className="space-y-2">
            {form.positions.map((pos, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={pos}
                  onChange={(e) => handlePositionChange(i, e.target.value)}
                  className="input-field flex-1"
                  placeholder="Position name"
                />
                <button type="button" onClick={() => removePosition(i)} className="btn-danger text-sm py-2 px-3">X</button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2">
            {submitting ? 'Saving...' : <><HiSave /> {isEdit ? 'Update' : 'Create'} Election</>}
          </button>
          <button type="button" onClick={() => navigate('/admin/dashboard')} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}
