export default function StatCard({ icon: Icon, label, value, tone = 'blue' }) {
  const tones = {
    blue: 'bg-blue-50 text-fundsphere-blue',
    green: 'bg-green-50 text-fundsphere-green',
    red: 'bg-red-50 text-fundsphere-red',
    yellow: 'bg-amber-50 text-amber-700'
  };

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-base font-semibold text-slate-600">{label}</p>
          <p className="mt-3 text-2xl font-bold text-slate-950">{value}</p>
        </div>
        {Icon && (
          <div className={`flex h-12 w-12 items-center justify-center rounded-lg text-xl ${tones[tone]}`}>
            <Icon aria-hidden="true" />
          </div>
        )}
      </div>
    </div>
  );
}
