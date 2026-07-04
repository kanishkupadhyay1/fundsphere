import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { FaDownload, FaPlus, FaSearch, FaTable, FaThLarge } from 'react-icons/fa';
import RecordForm from '../components/records/RecordForm.jsx';
import { EmptyState, ErrorState } from '../components/common/StateViews.jsx';
import api from '../lib/api.js';
import { formatCurrency, formatDate } from '../lib/format.js';
import { useApiQuery } from '../hooks/useApiQuery.js';

const sampleRecords = { items: [
  { _id: 'sample-1', type: 'Fixed Deposit', institution: 'SBI', recordName: 'Retirement FD', referenceNumber: 'FD123456', amount: 500000, nominee: 'Anita', maturityDate: '2026-06-15', status: 'Active' },
  { _id: 'sample-2', type: 'Insurance Policy', institution: 'LIC', recordName: 'Life Policy', referenceNumber: 'POL9988', amount: 1200000, nominee: '', dynamicFields: { nextDueDate: '2026-07-01' }, status: 'Active' }
] };

export default function Records() {
  const [view, setView] = useState('table');
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();
  const { data = sampleRecords, isError } = useApiQuery(['records'], '/records?limit=50', sampleRecords);
  const createRecord = useMutation({
    mutationFn: (payload) => api.post('/records', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
      setShowForm(false);
    }
  });
  const missingInfo = data.items?.filter((record) => !record.nominee || !record.referenceNumber || !record.maturityDate || !record.institution) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Financial Records</h1>
          <p className="mt-2 text-lg text-slate-600">Maintain every investment, account, policy, asset, nominee, and maturity date.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="btn-secondary" onClick={() => setView(view === 'table' ? 'card' : 'table')}>{view === 'table' ? <FaThLarge /> : <FaTable />} {view === 'table' ? 'Card View' : 'Table View'}</button>
          <button className="btn-secondary"><FaDownload /> Export</button>
          <button className="btn-primary" onClick={() => setShowForm((value) => !value)}><FaPlus /> Add Record</button>
        </div>
      </div>
      {isError && <ErrorState message="Showing sample records until the backend is connected." />}
      {showForm && <RecordForm onSubmit={(values) => createRecord.mutate(values)} isSaving={createRecord.isPending} />}
      <div className="card flex flex-wrap gap-3 p-4">
        <div className="flex min-w-72 flex-1 items-center gap-3 rounded-lg border border-slate-300 px-4 py-3">
          <FaSearch className="text-slate-500" />
          <input className="w-full border-0 outline-none" placeholder="Search by name, number, nominee, institution" />
        </div>
        <select className="input max-w-56"><option>All Types</option></select>
        <select className="input max-w-56"><option>All Status</option><option>Active</option><option>Matured</option></select>
      </div>
      <section className="card p-5">
        <h2 className="section-title">Missing Information Center</h2>
        <p className="mt-1 text-slate-600">Records missing nominee, reference number, maturity date, institution, or other important data.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {missingInfo.length ? missingInfo.map((record) => (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4" key={`missing-${record._id}`}>
              <p className="font-bold text-slate-950">{record.recordName}</p>
              <p className="mt-1 text-slate-700">
                Missing: {[
                  !record.nominee && 'Nominee',
                  !record.referenceNumber && 'Reference Number',
                  !record.maturityDate && 'Maturity Date',
                  !record.institution && 'Institution'
                ].filter(Boolean).join(', ')}
              </p>
              <button className="btn-secondary mt-3">Correct Details</button>
            </div>
          )) : <p className="rounded-lg bg-slate-50 p-4 text-slate-600">No missing information found.</p>}
        </div>
      </section>
      {!data.items?.length ? <EmptyState /> : view === 'table' ? (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-slate-50 text-base text-slate-700">
              <tr>{['Record', 'Type', 'Institution', 'Amount', 'Nominee', 'Maturity', 'Status'].map((head) => <th className="px-5 py-4" key={head}>{head}</th>)}</tr>
            </thead>
            <tbody>
              {data.items.map((record) => (
                <tr className="border-t border-slate-200" key={record._id}>
                  <td className="px-5 py-4"><p className="font-bold text-slate-950">{record.recordName}</p><p className="text-slate-600">{record.referenceNumber || 'No reference'}</p></td>
                  <td className="px-5 py-4">{record.type}</td>
                  <td className="px-5 py-4">{record.institution}</td>
                  <td className="px-5 py-4 font-bold">{formatCurrency(record.amount)}</td>
                  <td className="px-5 py-4">{record.nominee || <span className="text-fundsphere-red">Missing</span>}</td>
                  <td className="px-5 py-4">{formatDate(record.maturityDate || record.dynamicFields?.nextDueDate)}</td>
                  <td className="px-5 py-4"><span className="status-pill bg-green-50 text-fundsphere-green">{record.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.items.map((record) => (
            <article className="card p-5" key={record._id}>
              <p className="text-sm font-bold text-fundsphere-blue">{record.type}</p>
              <h2 className="mt-2 text-xl font-bold text-slate-950">{record.recordName}</h2>
              <p className="mt-1 text-slate-600">{record.institution}</p>
              <p className="mt-4 text-2xl font-bold">{formatCurrency(record.amount)}</p>
              <div className="mt-4 grid gap-2 text-base text-slate-700">
                <p>Nominee: <strong>{record.nominee || 'Missing'}</strong></p>
                <p>Maturity: <strong>{formatDate(record.maturityDate)}</strong></p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
