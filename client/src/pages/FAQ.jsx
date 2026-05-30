import { useState } from 'react';
import { HiQuestionMarkCircle, HiChevronDown } from 'react-icons/hi';

const faqs = [
  { q: 'How do I register to vote?', a: 'Click on "Register" in the navigation bar, fill in your details (full name, matric number, department, level, and email), and create a password. Once registered, an admin must approve your account before you can vote.' },
  { q: 'When can I vote?', a: 'You can vote when there is an active election. Check the home page for the countdown timer indicating when the election starts or ends.' },
  { q: 'Can I vote for multiple candidates?', a: 'You may vote for one candidate per position. You must select a candidate for every position before submitting your ballot.' },
  { q: 'Can I change my vote after submitting?', a: 'No. Once your vote is submitted, it is final and cannot be changed. Please review your selections carefully on the confirmation screen before submitting.' },
  { q: 'What if I forget my password?', a: 'Click "Forgot password?" on the login page and enter your registered email address. You will receive a password reset link.' },
  { q: 'Who can see my vote?', a: 'Your vote is confidential. Only you can see your voting history in your profile. Election results are displayed anonymously with vote counts and percentages.' },
  { q: 'How are election results calculated?', a: 'Results are counted in real-time. Each vote increments the candidate\'s vote count. Percentages are calculated based on the total votes for each position.' },
  { q: 'Why is my account pending approval?', a: 'New registrations require admin approval to verify your student identity. This ensures only eligible NACOS members can vote.' },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <HiQuestionMarkCircle className="text-white text-3xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Frequently Asked Questions</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Everything you need to know about NACOS elections</p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="card overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between text-left"
            >
              <span className="font-semibold text-gray-900 dark:text-gray-100 pr-4">{faq.q}</span>
              <HiChevronDown className={`text-gray-400 transition-transform duration-200 flex-shrink-0 ${openIndex === i ? 'rotate-180' : ''}`} />
            </button>
            {openIndex === i && (
              <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm leading-relaxed animate-fade-in">{faq.a}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
