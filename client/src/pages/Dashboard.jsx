import { FaBell, FaFileAlt, FaLandmark, FaPiggyBank, FaUniversity, FaWallet } from 'react-icons/fa';
import StatCard from '../components/common/StatCard.jsx';
import { ErrorState, LoadingGrid } from '../components/common/StateViews.jsx';
import { useApiQuery } from '../hooks/useApiQuery.js';
import { formatCurrency, formatDate, dueTone } from '../lib/format.js';

const fallback = {
  totals: {},
  quickStats: {},
  actionRequired: [
    { category: 'Maturity', name: 'Sample FD #123456', amount: 500000, dueDate: '2026-06-15', daysRemaining: 16 },
    { category: 'Missing Nominee', name: 'PPF Account', institution: 'Post Office' }
  ]
};

export default function Dashboard() {
  const { data = fallback, isLoading, isError } = useApiQuery(['dashboard'], '/dashboard', fallback);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="mt-2 text-lg text-slate-600">Your total financial position, urgent dues, and important missing details.</p>
      </div>
      {isError && <ErrorState message="Showing starter dashboard until the API is connected." />}
      {isLoading ? <LoadingGrid count={8} /> : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={FaWallet} label="Total Financial Records Value" value={formatCurrency(data.totals.totalFinancialRecordsValue)} />
          <StatCard icon={FaUniversity} label="Total Bank Balance" value={formatCurrency(data.totals.totalBankBalance)} />
          <StatCard icon={FaLandmark} label="Total FD Value" value={formatCurrency(data.totals.totalFDValue)} tone="green" />
          <StatCard icon={FaFileAlt} label="Total Insurance Value" value={formatCurrency(data.totals.totalInsuranceValue)} />
          <StatCard icon={FaPiggyBank} label="Total PPF/NPS Value" value={formatCurrency(data.totals.totalPPFNPSValue)} />
          <StatCard icon={FaWallet} label="Total Mutual Fund Value" value={formatCurrency(data.totals.totalMutualFundValue)} tone="green" />
          <StatCard icon={FaWallet} label="Total Gold Value" value={formatCurrency(data.totals.totalGoldValue)} tone="yellow" />
          <StatCard icon={FaLandmark} label="Total Property Value" value={formatCurrency(data.totals.totalPropertyValue)} />
        </div>
      )}

      <section className="card p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-50 text-kubera-red"><FaBell aria-hidden="true" /></div>
          <div>
            <h2 className="section-title">Action Required</h2>
            <p className="text-slate-600">Maturities, premiums, loans, nominees, documents, and missing information needing attention.</p>
          </div>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {data.actionRequired?.map((item, index) => (
            <article key={`${item.name}-${index}`} className={`rounded-lg border p-4 ${dueTone(item.daysRemaining ?? 30)}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold">{item.category}</p>
                  <h3 className="mt-1 text-xl font-bold text-slate-950">{item.name}</h3>
                  <p className="mt-1 text-slate-700">{item.institution || formatCurrency(item.amount)}</p>
                </div>
                {item.daysRemaining !== undefined && <span className="status-pill bg-white text-slate-900">{item.daysRemaining} days</span>}
              </div>
              {item.dueDate && <p className="mt-3 font-semibold">Date: {formatDate(item.dueDate)}</p>}
            </article>
          ))}
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {Object.entries(data.quickStats || {}).map(([key, value]) => (
          <StatCard key={key} label={key.replace(/([A-Z])/g, ' $1')} value={value ?? 0} />
        ))}
      </div>
    </div>
  );
}
