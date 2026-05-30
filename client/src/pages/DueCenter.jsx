import { FaClock } from 'react-icons/fa';
import { useApiQuery } from '../hooks/useApiQuery.js';
import { formatCurrency, formatDate, dueTone } from '../lib/format.js';

const fallback = {
  dueIn7Days: [{ kind: 'Premium Due', name: 'LIC Jeevan Policy', amount: 18000, dueDate: '2026-06-05', daysRemaining: 6 }],
  dueIn30Days: [{ kind: 'Maturity', name: 'SBI FD #123456', amount: 500000, dueDate: '2026-06-15', daysRemaining: 16 }],
  dueIn90Days: [],
  overdue: [],
  matured: []
};

const sections = [
  ['dueIn7Days', 'Due in 7 Days'],
  ['dueIn30Days', 'Due in 30 Days'],
  ['dueIn90Days', 'Due in 90 Days'],
  ['overdue', 'Overdue'],
  ['matured', 'Matured']
];

export default function DueCenter() {
  const { data = fallback } = useApiQuery(['due-center'], '/due-center', fallback);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Due Center</h1>
        <p className="mt-2 text-lg text-slate-600">Track premiums, maturities, loan dues, document expiry, overdue, and matured items.</p>
      </div>
      <div className="grid gap-5">
        {sections.map(([key, title]) => (
          <section className="card p-5" key={key}>
            <div className="flex items-center gap-3">
              <FaClock className="text-kubera-blue" />
              <h2 className="section-title">{title}</h2>
            </div>
            <div className="mt-4 grid gap-3">
              {(data[key] || []).length ? data[key].map((item, index) => (
                <article className={`rounded-lg border p-4 ${dueTone(item.daysRemaining)}`} key={`${item.name}-${index}`}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-bold">{item.kind}</p>
                      <h3 className="text-xl font-bold text-slate-950">{item.name}</h3>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{item.amount ? formatCurrency(item.amount) : 'No amount'}</p>
                      <p>{formatDate(item.dueDate)} | {item.daysRemaining} days</p>
                    </div>
                  </div>
                </article>
              )) : <p className="rounded-lg bg-slate-50 p-4 text-slate-600">No items in this category.</p>}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
