import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiAcademicCap, HiShieldCheck, HiChartBar, HiUserGroup, HiArrowRight } from 'react-icons/hi';
import { electionAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import CountdownTimer from '../components/CountdownTimer';

export default function Home() {
  const { user } = useAuth();
  const [election, setElection] = useState(null);
  const [upcoming, setUpcoming] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    electionAPI.getActive()
      .then((res) => {
        setElection(res.data.election);
        setUpcoming(res.data.upcoming);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const features = [
    { icon: HiShieldCheck, title: 'Secure Voting', desc: 'Blockchain-inspired security with JWT authentication and encrypted data.' },
    { icon: HiChartBar, title: 'Real-time Results', desc: 'Live vote counting with interactive charts and graphical statistics.' },
    { icon: HiUserGroup, title: 'Easy Management', desc: 'Comprehensive admin dashboard for managing elections and voters.' },
    { icon: HiAcademicCap, title: 'NACOS Branded', desc: 'Built specifically for Nigeria Association of Computing Students.' },
  ];

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-5 dark:opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-nacos-50 dark:bg-nacos-900/30 rounded-full text-nacos-600 dark:text-nacos-400 text-sm font-medium mb-6">
              <HiAcademicCap className="text-lg" />
              NACOS Online Election Voting System
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight mb-6">
              Your Voice,{' '}
              <span className="gradient-text">Your Vote</span>,{' '}
              Your Future
            </h1>
            <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Participate in the NACOS election securely from anywhere. 
              Transparent, fair, and accessible — every vote counts.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={user ? "/vote" : "/login"}
                className="btn-primary text-lg px-8 py-4 flex items-center gap-2"
              >
                {user ? 'Vote Now' : 'Login to Vote'} <HiArrowRight />
              </Link>
              {!user && (
                <Link to="/register" className="btn-secondary text-lg px-8 py-4">
                  Register to Vote
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {election && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-16">
          <div className="card border-nacos-200 dark:border-nacos-800 text-center py-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{election.title}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">{election.description}</p>
            <CountdownTimer targetDate={election.endDate} />
            <div className="mt-6">
              <Link to={user ? "/vote" : "/login"} className="btn-primary">
                {user ? 'Cast Your Vote' : 'Login to Vote'}
              </Link>
            </div>
          </div>
        </section>
      )}

      {upcoming && !election && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-16">
          <div className="card border-yellow-200 dark:border-yellow-800 text-center py-10">
            <div className="badge-warning mb-4 inline-flex">Upcoming</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{upcoming.title}</h2>
            <CountdownTimer targetDate={upcoming.startDate} label="Election starts in" />
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Why Choose <span className="gradient-text">NACOS Voting</span>?
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Our platform ensures a seamless, transparent, and secure voting experience for all NACOS members.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, i) => (
            <div key={i} className="card-hover text-center">
              <div className="w-14 h-14 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-nacos-600/20">
                <feat.icon className="text-white text-2xl" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">{feat.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="gradient-bg py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Make Your Choice?</h2>
          <p className="text-purple-200 text-lg mb-8 max-w-xl mx-auto">
            Register now and be part of shaping the future of NACOS leadership.
          </p>
          <Link
            to={user ? "/vote" : "/register"}
            className="inline-flex items-center gap-2 bg-white text-nacos-600 font-bold py-4 px-10 rounded-xl hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            {user ? 'Vote Now' : 'Get Started'} <HiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}
