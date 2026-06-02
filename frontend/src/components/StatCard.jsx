export default function StatCard({ label, value, unit, icon: Icon, color, iconColor }) {
  return (
    <div className={`rounded-2xl p-5 shadow-md text-white ${color}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium opacity-80">{label}</span>
        <div className="bg-white/20 p-2 rounded-xl">
          <Icon size={18} className={iconColor ?? "text-white"} />
        </div>
      </div>
      <div className="text-3xl font-bold">
        {value ?? "-"}
        <span className="text-lg font-normal ml-1">{unit}</span>
      </div>
    </div>
  );
}
