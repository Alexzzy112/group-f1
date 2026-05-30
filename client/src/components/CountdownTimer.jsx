import { useState, useEffect } from 'react';

export default function CountdownTimer({ targetDate, label = 'Election ends in' }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = new Date(targetDate) - new Date();
    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const pad = (num) => String(num).padStart(2, '0');

  const boxes = [
    { value: pad(timeLeft.days), label: 'Days' },
    { value: pad(timeLeft.hours), label: 'Hrs' },
    { value: pad(timeLeft.minutes), label: 'Min' },
    { value: pad(timeLeft.seconds), label: 'Sec' },
  ];

  return (
    <div className="text-center">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">{label}</p>
      <div className="flex items-center justify-center gap-3">
        {boxes.map((box, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 gradient-bg rounded-2xl flex items-center justify-center shadow-lg shadow-nacos-600/25">
              <span className="text-2xl sm:text-3xl font-bold text-white">{box.value}</span>
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1.5">{box.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
