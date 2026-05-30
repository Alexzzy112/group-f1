export default function StatCard({ icon: Icon, label, value, color = 'nacos' }) {
  const colorMap = {
    nacos: 'from-nacos-500 to-purple-600',
    green: 'from-green-500 to-emerald-600',
    blue: 'from-blue-500 to-cyan-600',
    yellow: 'from-yellow-500 to-orange-600',
    red: 'from-red-500 to-pink-600',
  };

  return (
    <div className="card-hover">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[color] || colorMap.nacos} flex items-center justify-center shadow-lg`}>
          <Icon className="text-white text-xl" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        </div>
      </div>
    </div>
  );
}
