import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiAcademicCap, HiMail } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { authAPI } from '../utils/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Enter your email address.');
    setSubmitting(true);
    try {
      const res = await authAPI.forgotPassword({ email });
      toast.success(res.data.message);
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset email.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <HiAcademicCap className="text-white text-3xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Reset Password</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Enter your email to receive reset link</p>
        </div>

        {sent ? (
          <div className="card text-center py-8">
            <HiMail className="text-5xl text-green-500 mx-auto mb-4" />
            <p className="text-gray-700 dark:text-gray-300 font-medium">Reset link sent!</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Check your email for the password reset link.</p>
            <Link to="/login" className="btn-primary inline-block mt-6">Back to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="you@example.com" required />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Sending...' : 'Send Reset Link'}
            </button>
            <p className="text-center text-sm text-gray-500">
              Remember your password? <Link to="/login" className="text-nacos-600 dark:text-nacos-400 font-semibold hover:underline">Sign in</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
