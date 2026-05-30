import { HiBookOpen, HiAcademicCap, HiShieldCheck, HiChartBar, HiUserGroup, HiLockClosed } from 'react-icons/hi';

const sections = [
  {
    icon: HiAcademicCap,
    title: 'About NACOS',
    content: 'The Nigeria Association of Computing Students (NACOS) is the umbrella body for all Computing students in tertiary institutions across Nigeria. This digital voting platform provides a secure, transparent, and efficient way to conduct NACOS elections.'
  },
  {
    icon: HiShieldCheck,
    title: 'Security & Integrity',
    content: 'Each vote is securely recorded and cannot be altered after submission. Only verified Computer Science students can participate, ensuring the integrity of the electoral process. All voting activities are logged for audit purposes.'
  },
  {
    icon: HiUserGroup,
    title: 'Voter Eligibility',
    content: 'Only registered Computer Science students with valid matriculation numbers (format: FT + 2 digits + CMP + 4 digits, e.g., FT23CMP0363) can vote. New accounts require admin approval before participation.'
  },
  {
    icon: HiChartBar,
    title: 'Real-time Results',
    content: 'Election results are calculated in real-time as votes are cast. Results display vote counts and percentages for each candidate per position, ensuring complete transparency throughout the election.'
  },
  {
    icon: HiLockClosed,
    title: 'Privacy & Confidentiality',
    content: 'Your vote is private and confidential. Only you can see your voting history in your profile. Results are displayed anonymously without revealing individual voter choices.'
  },
  {
    icon: HiBookOpen,
    title: 'How It Works',
    content: '1. Register an account with your student details.\n2. Wait for admin approval of your registration.\n3. When an election is active, log in and cast your vote.\n4. Select one candidate per position on the ballot.\n5. Review your selections and confirm before submission.'
  }
];

const techStack = [
  { category: 'Frontend', items: 'React, Vite, Tailwind CSS, React Router' },
  { category: 'Backend', items: 'Node.js, Express.js' },
  { category: 'Database', items: 'MongoDB, Mongoose ODM' },
  { category: 'Authentication', items: 'JWT (JSON Web Tokens), bcrypt' },
  { category: 'Tools', items: 'React Icons, Axios, date-fns' }
];

export default function Readme() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <HiBookOpen className="text-white text-3xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">NACOS Voting System</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Nigeria Association of Computing Students — Online Election Platform</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-10">
        {sections.map((section, i) => {
          const Icon = section.icon;
          return (
            <div key={i} className="card p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Icon className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{section.title}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed whitespace-pre-line">{section.content}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card p-6 mb-10">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 text-center">Tech Stack</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {techStack.map((t, i) => (
            <div key={i} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
              <h3 className="font-semibold text-nacos-600 dark:text-nacos-400 text-sm mb-1">{t.category}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t.items}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Roles & Permissions</h2>
        <div className="grid gap-4 sm:grid-cols-2 max-w-2xl mx-auto">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
            <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Voter</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 text-left">
              <li>• Register and manage profile</li>
              <li>• Vote in active elections</li>
              <li>• View election results</li>
              <li>• View personal voting history</li>
            </ul>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
            <h3 className="font-semibold text-purple-700 dark:text-purple-400 mb-2">Admin</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 text-left">
              <li>• Create and manage elections</li>
              <li>• Add and remove candidates</li>
              <li>• Approve voter registrations</li>
              <li>• View audit logs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
