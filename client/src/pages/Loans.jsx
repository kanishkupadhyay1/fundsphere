import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { FaHandHoldingUsd, FaPlus } from 'react-icons/fa';
import FormField from '../components/forms/FormField.jsx';
import StatCard from '../components/common/StatCard.jsx';
import api from '../lib/api.js';
import { formatCurrency, formatDate } from '../lib/format.js';
import { useApiQuery } from '../hooks/useApiQuery.js';

const fallback = { items: [{ _id: '1', direction: 'Money Given', personName: 'Ramesh', principalAmount: 100000, interestRate: 8, interestType: 'Simple Interest', loanDate: '2026-01-10', dueDate: '2026-08-10', status: 'Active', repayments: [{ amount: 20000 }] }] };
const summaryFallback = { totalGiven: 100000, totalTaken: 0, outstandingAmount: 80000, overdueLoans: 0 };

export default function Loans() {
  const { register, handleSubmit, reset } = useForm({ defaultValues: { direction: 'Money Given', interestType: 'Simple Interest', status: 'Active' } });
  const queryClient = useQueryClient();
  const { data = fallback } = useApiQuery(['loans'], '/loans?limit=50', fallback);
  const { data: summary = summaryFallback } = useApiQuery(['loan-summary'], '/loans/summary', summaryFallback);
  const mutation = useMutation({ mutationFn: (payload) => api.post('/loans', payload), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['loans'] }); reset(); } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Given & Taken Money</h1>
        <p className="mt-2 text-lg text-slate-600">Track money lent to others, money borrowed, repayments, interest, and overdue loans.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total Given" value={formatCurrency(summary.totalGiven)} icon={FaHandHoldingUsd} />
        <StatCard label="Total Taken" value={formatCurrency(summary.totalTaken)} icon={FaHandHoldingUsd} tone="yellow" />
        <StatCard label="Outstanding Amount" value={formatCurrency(summary.outstandingAmount)} icon={FaHandHoldingUsd} tone="green" />
        <StatCard label="Overdue Loans" value={summary.overdueLoans} icon={FaHandHoldingUsd} tone="red" />
      </div>
      <form className="card grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-4" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
        <FormField label="Loan Type"><select className="input" {...register('direction')}><option>Money Given</option><option>Money Taken</option></select></FormField>
        <FormField label="Person Name"><input className="input" {...register('personName', { required: true })} /></FormField>
        <FormField label="Mobile Number"><input className="input" {...register('mobile')} /></FormField>
        <FormField label="Principal Amount"><input className="input" type="number" {...register('principalAmount', { valueAsNumber: true })} /></FormField>
        <FormField label="Interest Rate"><input className="input" type="number" step="0.01" {...register('interestRate', { valueAsNumber: true })} /></FormField>
        <FormField label="Interest Type"><select className="input" {...register('interestType')}><option>Simple Interest</option><option>Compound Interest</option></select></FormField>
        <FormField label="Loan Date"><input className="input" type="date" {...register('loanDate')} /></FormField>
        <FormField label="Due Date"><input className="input" type="date" {...register('dueDate')} /></FormField>
        <div className="md:col-span-2 xl:col-span-4"><button className="btn-primary"><FaPlus /> Add Loan</button></div>
      </form>
      <div className="grid gap-4 xl:grid-cols-2">
        {data.items?.map((loan) => (
          <article className="card p-5" key={loan._id}>
            <div className="flex justify-between gap-3">
              <div><p className="font-bold text-fundsphere-blue">{loan.direction}</p><h2 className="text-2xl font-bold">{loan.personName}</h2></div>
              <span className="status-pill bg-green-50 text-fundsphere-green">{loan.status}</span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <p>Principal <strong className="block">{formatCurrency(loan.principalAmount)}</strong></p>
              <p>Interest <strong className="block">{loan.interestRate}%</strong></p>
              <p>Due <strong className="block">{formatDate(loan.dueDate)}</strong></p>
            </div>
            <p className="mt-4 text-slate-600">Repayments: {(loan.repayments || []).map((item) => formatCurrency(item.amount)).join(', ') || 'None yet'}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
