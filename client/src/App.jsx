import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdBanner from './components/AdBanner';
import { ProtectedRoute } from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Voting from './pages/Voting';
import Results from './pages/Results';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import FAQ from './pages/FAQ';
import Readme from './pages/Readme';

import AdminDashboard from './pages/admin/AdminDashboard';
import VotersManagement from './pages/admin/VotersManagement';
import ElectionForm from './pages/admin/ElectionForm';
import CandidatesManager from './pages/admin/CandidatesManager';
import AuditLogs from './pages/admin/AuditLogs';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/readme" element={<Readme />} />
          <Route path="/results" element={<Results />} />
          <Route path="/vote" element={<ProtectedRoute><Voting /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/voters" element={<ProtectedRoute adminOnly><VotersManagement /></ProtectedRoute>} />
          <Route path="/admin/elections/new" element={<ProtectedRoute adminOnly><ElectionForm /></ProtectedRoute>} />
          <Route path="/admin/elections/:id" element={<ProtectedRoute adminOnly><ElectionForm /></ProtectedRoute>} />
          <Route path="/admin/elections/:id/candidates" element={<ProtectedRoute adminOnly><CandidatesManager /></ProtectedRoute>} />
          <Route path="/admin/audit" element={<ProtectedRoute adminOnly><AuditLogs /></ProtectedRoute>} />
        </Routes>
      </main>
      <AdBanner />
      <Footer />
    </div>
  );
}
