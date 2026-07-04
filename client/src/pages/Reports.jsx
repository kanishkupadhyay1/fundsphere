import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { FaFileExcel, FaFilePdf, FaPlus } from 'react-icons/fa';
import api from '../lib/api.js';
import { reportTypes } from '../lib/constants.js';
import { formatDate } from '../lib/format.js';
import { useApiQuery } from '../hooks/useApiQuery.js';

const fallback = { items: [{ _id: '1', title: 'Asset Summary', type: 'Asset Summary', createdAt: new Date().toISOString() }] };

export default function Reports() {
  const [type, setType] = useState('Asset Summary');
  const queryClient = useQueryClient();
  const { data = fallback } = useApiQuery(['reports'], '/reports', fallback);
  const mutation = useMutation({ mutationFn: () => api.post('/reports/generate', { type, title: type }), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reports'] }) });

  return (
    <div className="space-y-6">
      <div><h1 className="page-title">Reports</h1><p className="mt-2 text-lg text-slate-600">Generate asset, due, maturity, loan, expense, nominee, and institution reports.</p></div>
      <section className="card flex flex-wrap items-end gap-4 p-5">
        <label className="min-w-72 flex-1"><span className="label">Report Type</span><select className="input" value={type} onChange={(event) => setType(event.target.value)}>{reportTypes.map((item) => <option key={item}>{item}</option>)}</select></label>
        <button className="btn-primary" onClick={() => mutation.mutate()}><FaPlus /> Generate</button>
        <button className="btn-secondary"><FaFilePdf /> PDF</button>
        <button className="btn-secondary"><FaFileExcel /> Excel</button>
      </section>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.items?.map((report) => (
          <article className="card p-5" key={report._id}>
            <p className="text-sm font-bold text-fundsphere-blue">{report.type}</p>
            <h2 className="mt-2 text-xl font-bold">{report.title}</h2>
            <p className="mt-2 text-slate-600">Generated: {formatDate(report.createdAt)}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
