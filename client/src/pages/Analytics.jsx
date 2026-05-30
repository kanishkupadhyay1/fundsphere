import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useApiQuery } from '../hooks/useApiQuery.js';
import { formatCurrency } from '../lib/format.js';

const colors = ['#1E3A8A', '#16A34A', '#DC2626', '#F59E0B', '#475569', '#0F766E'];
const fallback = {
  assetDistribution: [{ name: 'Fixed Deposit', value: 500000 }, { name: 'Insurance Policy', value: 1200000 }],
  institutionDistribution: [{ name: 'SBI', value: 500000 }, { name: 'LIC', value: 1200000 }],
  monthlyExpenseTrend: [{ name: 'May 2026', value: 2050 }],
  loanStatusOverview: [{ name: 'Active', value: 100000 }]
};

export default function Analytics() {
  const { data = fallback } = useApiQuery(['analytics'], '/dashboard/analytics', fallback);
  const chartBlock = (title, children) => <section className="card p-5"><h2 className="section-title">{title}</h2><div className="mt-4 h-80">{children}</div></section>;

  return (
    <div className="space-y-6">
      <div><h1 className="page-title">Analytics Dashboard</h1><p className="mt-2 text-lg text-slate-600">Simple charts for asset distribution, institutions, expenses, maturities, and loan status.</p></div>
      <div className="grid gap-5 xl:grid-cols-2">
        {chartBlock('Asset Distribution', <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data.assetDistribution} dataKey="value" nameKey="name" outerRadius={105} label>{data.assetDistribution?.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}</Pie><Tooltip formatter={(value) => formatCurrency(value)} /><Legend /></PieChart></ResponsiveContainer>)}
        {chartBlock('Institution Distribution', <ResponsiveContainer width="100%" height="100%"><BarChart data={data.institutionDistribution}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip formatter={(value) => formatCurrency(value)} /><Bar dataKey="value" fill="#16A34A" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>)}
        {chartBlock('Monthly Expense Trend', <ResponsiveContainer width="100%" height="100%"><BarChart data={data.monthlyExpenseTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip formatter={(value) => formatCurrency(value)} /><Bar dataKey="value" fill="#1E3A8A" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>)}
        {chartBlock('Loan Status Overview', <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data.loanStatusOverview} dataKey="value" nameKey="name" outerRadius={105} label>{data.loanStatusOverview?.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}</Pie><Tooltip formatter={(value) => formatCurrency(value)} /><Legend /></PieChart></ResponsiveContainer>)}
      </div>
    </div>
  );
}
