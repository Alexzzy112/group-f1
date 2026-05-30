import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiAcademicCap } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const departments = ['Computer Science'];
const levels = ['100Level', '200Level', '300Level', '400Level'];
const MATRIC_PATTERN = /^FT\d{2}CMP\d{4}$/i;

export default function Register() {
  const [form, setForm] = useState({
    fullName: '', matricNumber: '', department: '', level: '', email: '', password: '', confirmPassword: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(form).some((v) => !v)) {
      return toast.error('Please fill in all fields.');
    }
    if (!MATRIC_PATTERN.test(form.matricNumber.trim())) {
      return toast.error('Invalid matric number. Must be like FT23CMP0363.');
    }
    if (form.password.length < 6) {
      return toast.error('Password must be at least 6 characters.');
    }
    if (form.password !== form.confirmPassword) {
      return toast.error('Passwords do not match.');
    }
    setSubmitting(true);
    try {
      const data = await register({
        fullName: form.fullName,
        matricNumber: form.matricNumber,
        department: form.department,
        level: form.level,
        email: form.email,
        password: form.password,
      });
      toast.success(data.message);
      navigate('/vote');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-nacos-600/30">
            <HiAcademicCap className="text-white text-3xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Create Account</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Register for NACOS election</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <input type="text" name="fullName" value={form.fullName} onChange={handleChange} className="input-field" placeholder="John Doe" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Matric Number</label>
              <input type="text" name="matricNumber" value={form.matricNumber} onChange={handleChange} className="input-field" placeholder="FT24CMP0001" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="input-field" placeholder="you@example.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Department</label>
              <input type="text" value="Computer Science" className="input-field bg-gray-100 dark:bg-gray-600 cursor-not-allowed" disabled />
              <input type="hidden" name="department" value="Computer Science" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Level</label>
              <select name="level" value={form.level} onChange={handleChange} className="input-field" required>
                <option value="">Select Level</option>
                {levels.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} className="input-field" placeholder="Min 6 characters" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password</label>
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className="input-field" placeholder="Confirm password" required />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
          >
            {submitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              'Create Account'
            )}
          </button>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-nacos-600 dark:text-nacos-400 font-semibold hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
