import { FaEdit, FaIdBadge } from 'react-icons/fa';
import { useApiQuery } from '../hooks/useApiQuery.js';

const fallback = { items: [
  { _id: '1', recordName: 'Retirement FD', institution: 'SBI', nominee: 'Anita' },
  { _id: '2', recordName: 'PPF Account', institution: 'Post Office', nominee: '' }
] };

export default function Nominees() {
  const { data = fallback } = useApiQuery(['nominees'], '/records?limit=100', fallback);
  const withNominee = data.items?.filter((item) => item.nominee) || [];
  const withoutNominee = data.items?.filter((item) => !item.nominee) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Nominee Tracker</h1>
        <p className="mt-2 text-lg text-slate-600">Quickly identify records that need nominee information.</p>
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        {[
          ['Records With Nominee', withNominee, 'green'],
          ['Records Without Nominee', withoutNominee, 'red']
        ].map(([title, rows, tone]) => (
          <section className="card p-5" key={title}>
            <div className="flex items-center gap-3">
              <FaIdBadge className={tone === 'green' ? 'text-fundsphere-green' : 'text-fundsphere-red'} />
              <h2 className="section-title">{title}</h2>
            </div>
            <div className="mt-4 space-y-3">
              {rows.map((record) => (
                <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-4" key={record._id}>
                  <div>
                    <p className="font-bold text-slate-950">{record.recordName}</p>
                    <p className="text-slate-600">{record.institution} | {record.nominee || 'Missing nominee'}</p>
                  </div>
                  <button className="btn-secondary" aria-label={`Edit nominee for ${record.recordName}`}><FaEdit /></button>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
