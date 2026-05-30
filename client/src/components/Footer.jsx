import { Link } from 'react-router-dom';
import { HiAcademicCap, HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
                <HiAcademicCap className="text-white text-xl" />
              </div>
              <span className="font-bold text-lg text-white">NACOS Voting</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              Nigeria Association of Computing Students — empowering students through 
              transparent and secure digital elections. Your voice, your vote, your future.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-nacos-400 transition-colors">Home</Link></li>
              <li><Link to="/vote" className="hover:text-nacos-400 transition-colors">Vote Now</Link></li>
              <li><Link to="/results" className="hover:text-nacos-400 transition-colors">Results</Link></li>
              <li><Link to="/faq" className="hover:text-nacos-400 transition-colors">FAQ</Link></li>
              <li><Link to="/readme" className="hover:text-nacos-400 transition-colors">About</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2"><HiMail className="text-nacos-400" /> info@nacos.edu.ng</li>
              <li className="flex items-center gap-2"><HiPhone className="text-nacos-400" /> +234 800 NACOS</li>
              <li className="flex items-center gap-2"><HiLocationMarker className="text-nacos-400" /> Federal Polytechnic, Nasarawa</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} NACOS Election System. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-gray-500">
            <span className="hover:text-gray-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-300 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
