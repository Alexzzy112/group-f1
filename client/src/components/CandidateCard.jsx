import { HiUser } from 'react-icons/hi';

export default function CandidateCard({ candidate, selected, onSelect, disabled, showVoteCount = false }) {
  return (
    <div
      onClick={() => !disabled && onSelect?.(candidate)}
      className={`relative card-hover cursor-pointer transition-all duration-200 ${
        selected
          ? 'ring-2 ring-nacos-500 shadow-lg shadow-nacos-500/20 border-nacos-500'
          : 'hover:border-gray-200 dark:hover:border-gray-600'
      } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
    >
      {selected && (
        <div className="absolute -top-2 -right-2 w-7 h-7 gradient-bg rounded-full flex items-center justify-center shadow-lg z-10">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}

      <div className="flex flex-col items-center text-center gap-3">
        <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center shadow-md">
          {candidate.photoUrl && candidate.photoUrl !== '/images/default-avatar.png' ? (
            <img src={candidate.photoUrl} alt={candidate.fullName} className="w-full h-full rounded-full object-cover" />
          ) : (
            <HiUser className="text-white text-3xl" />
          )}
        </div>

        <div>
          <h3 className="font-bold text-gray-900 dark:text-gray-100">{candidate.fullName}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{candidate.department}</p>
          {candidate.level && (
            <p className="text-xs text-gray-400 dark:text-gray-500">Level: {candidate.level}</p>
          )}
        </div>

        {candidate.slogan && (
          <p className="text-sm italic text-nacos-600 dark:text-nacos-400 px-2 py-1 bg-nacos-50 dark:bg-nacos-900/20 rounded-lg">
            &ldquo;{candidate.slogan}&rdquo;
          </p>
        )}

        {candidate.manifesto && (
          <details className="w-full text-left">
            <summary className="text-xs text-nacos-500 cursor-pointer hover:text-nacos-600 font-medium">Read Manifesto</summary>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">{candidate.manifesto}</p>
          </details>
        )}

        {showVoteCount && (
          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 mt-2">
            <div
              className="gradient-bg h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(candidate.percentage || 0, 100)}%` }}
            />
          </div>
        )}

        {showVoteCount && (
          <div className="flex justify-between w-full text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>{candidate.voteCount} votes</span>
            <span>{candidate.percentage}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
