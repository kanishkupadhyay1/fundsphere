import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { FaPlus } from 'react-icons/fa';
import FormField from '../components/forms/FormField.jsx';
import StatCard from '../components/common/StatCard.jsx';
import { expenseCategories } from '../lib/constants.js';
import api from '../lib/api.js';
import { formatCurrency, formatDate } from '../lib/format.js';
import { useApiQuery } from '../hooks/useApiQuery.js';

const fallback = { items: [
  { _id: '1', date: new Date().toISOString(), amount: 1200, category: 'Medicine', description: 'Monthly medicines' },
  { _id: '2', date: new Date().toISOString(), amount: 850, category: 'Grocery', description: 'Vegetables and essentials' }
] };

export default function Expenses() {
  const { register, handleSubmit, reset } = useForm({ defaultValues: { date: new Date().toISOString().slice(0, 10), category: 'Grocery' } });
  const queryClient = useQueryClient();
  const { data = fallback } = useApiQuery(['expenses'], '/expenses?limit=100', fallback);
  const mutation = useMutation({ mutationFn: (payload) => api.post('/expenses', payload), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['expenses'] }); reset(); } });
  const total = data.items?.reduce((sum, item) => sum + item.amount, 0) || 0;
  const byCategory = Object.values((data.items || []).reduce((acc, item) => {
    acc[item.category] = acc[item.category] || { name: item.category, value: 0 };
    acc[item.category].value += item.amount;
    return acc;
  }, {}));

  return (
    <div className="space-y-6">
      <div><h1 className="page-title">Daily Expense Tracker</h1><p className="mt-2 text-lg text-slate-600">Track everyday spending independently from investments.</p></div>
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Today's Expense" value={formatCurrency(total)} />
        <StatCard label="Weekly Expense" value={formatCurrency(total)} />
        <StatCard label="Monthly Expense" value={formatCurrency(total)} />
        <StatCard label="Yearly Expense" value={formatCurrency(total)} />
      </div>
      <form className="card grid gap-4 p-5 md:grid-cols-4" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
        <FormField label="Date"><input className="input" type="date" {...register('date')} /></FormField>
        <FormField label="Amount"><input className="input" type="number" {...register('amount', { valueAsNumber: true })} /></FormField>
        <FormField label="Category"><select className="input" {...register('category')}>{expenseCategories.map((item) => <option key={item}>{item}</option>)}</select></FormField>
        <FormField label="Description"><input className="input" {...register('description')} /></FormField>
        <div className="md:col-span-4"><button className="btn-primary"><FaPlus /> Add Expense</button></div>
      </form>
      <section className="card p-5">
        <h2 className="section-title">Category Wise Spending</h2>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%"><BarChart data={byCategory}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip formatter={(value) => formatCurrency(value)} /><Bar dataKey="value" fill="#1E3A8A" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>
        </div>
      </section>
      <section className="card overflow-x-auto">
        <table className="w-full min-w-[700px] text-left">
          <thead className="bg-slate-50"><tr>{['Date', 'Category', 'Description', 'Amount'].map((item) => <th className="px-5 py-4" key={item}>{item}</th>)}</tr></thead>
          <tbody>{data.items?.map((expense) => <tr className="border-t" key={expense._id}><td className="px-5 py-4">{formatDate(expense.date)}</td><td className="px-5 py-4">{expense.category}</td><td className="px-5 py-4">{expense.description}</td><td className="px-5 py-4 font-bold">{formatCurrency(expense.amount)}</td></tr>)}</tbody>
        </table>
      </section>
    </div>
  );
}
