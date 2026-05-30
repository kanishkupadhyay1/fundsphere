import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { FaBuilding, FaPlus } from 'react-icons/fa';
import FormField from '../components/forms/FormField.jsx';
import api from '../lib/api.js';
import { useApiQuery } from '../hooks/useApiQuery.js';

const fallback = { items: [{ _id: '1', name: 'SBI', type: 'Bank', branch: 'Main Branch', contactDetails: { phone: '1800-000-000' } }, { _id: '2', name: 'LIC', type: 'Insurance', branch: 'City Office' }] };

export default function Institutions() {
  const { register, handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();
  const { data = fallback } = useApiQuery(['institutions'], '/institutions?limit=50', fallback);
  const mutation = useMutation({ mutationFn: (payload) => api.post('/institutions', payload), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['institutions'] }); reset(); } });

  return (
    <div className="space-y-6">
      <div><h1 className="page-title">Institution Management</h1><p className="mt-2 text-lg text-slate-600">Manage banks, insurers, post office accounts, branches, and contact details.</p></div>
      <form className="card grid gap-4 p-5 md:grid-cols-4" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
        <FormField label="Name"><input className="input" {...register('name', { required: true })} placeholder="SBI, HDFC, LIC" /></FormField>
        <FormField label="Type"><input className="input" {...register('type', { required: true })} placeholder="Bank, Insurance, Post Office" /></FormField>
        <FormField label="Branch"><input className="input" {...register('branch')} /></FormField>
        <FormField label="Phone"><input className="input" {...register('contactDetails.phone')} /></FormField>
        <div className="md:col-span-4"><button className="btn-primary"><FaPlus /> Add Institution</button></div>
      </form>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.items?.map((institution) => (
          <article className="card p-5" key={institution._id}>
            <FaBuilding className="text-2xl text-kubera-blue" />
            <h2 className="mt-3 text-xl font-bold">{institution.name}</h2>
            <p className="mt-1 text-slate-600">{institution.type} | {institution.branch || 'No branch'}</p>
            <p className="mt-3 font-semibold">{institution.contactDetails?.phone || 'No contact number'}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
