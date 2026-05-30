import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { FaEye, FaPlus, FaUserFriends } from 'react-icons/fa';
import FormField from '../components/forms/FormField.jsx';
import api from '../lib/api.js';
import { useApiQuery } from '../hooks/useApiQuery.js';

const fallback = { items: [{ _id: '1', name: 'Aarav', email: 'aarav@example.com', relationship: 'Son', status: 'Invited' }] };

export default function FamilyAccess() {
  const { register, handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();
  const { data = fallback } = useApiQuery(['family'], '/profile/family', fallback);
  const mutation = useMutation({ mutationFn: (payload) => api.post('/profile/family', payload), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['family'] }); reset(); } });

  return (
    <div className="space-y-6">
      <div><h1 className="page-title">Family Access</h1><p className="mt-2 text-lg text-slate-600">Invite trusted family members with view-only access to records, documents, and reports.</p></div>
      <form className="card grid gap-4 p-5 md:grid-cols-4" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
        <FormField label="Name"><input className="input" {...register('name', { required: true })} /></FormField>
        <FormField label="Email"><input className="input" type="email" {...register('email', { required: true })} /></FormField>
        <FormField label="Mobile"><input className="input" {...register('mobile')} /></FormField>
        <FormField label="Relationship"><input className="input" {...register('relationship')} /></FormField>
        <div className="md:col-span-4"><button className="btn-primary"><FaPlus /> Invite Family Member</button></div>
      </form>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.items?.map((member) => (
          <article className="card p-5" key={member._id}>
            <FaUserFriends className="text-2xl text-kubera-blue" />
            <h2 className="mt-3 text-xl font-bold">{member.name}</h2>
            <p className="text-slate-600">{member.relationship} | {member.email}</p>
            <p className="mt-3 status-pill bg-blue-50 text-kubera-blue"><FaEye className="mr-2" /> View Only</p>
          </article>
        ))}
      </div>
    </div>
  );
}
