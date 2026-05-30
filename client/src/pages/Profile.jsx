import { useForm } from 'react-hook-form';
import { FaKey, FaPhoneAlt, FaSave, FaUserShield } from 'react-icons/fa';
import FormField from '../components/forms/FormField.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Profile() {
  const { user } = useAuth();
  const { register, handleSubmit } = useForm({ defaultValues: user || {} });

  return (
    <div className="space-y-6">
      <div><h1 className="page-title">Profile</h1><p className="mt-2 text-lg text-slate-600">Manage personal details, password, family members, and emergency access.</p></div>
      <div className="grid gap-5 xl:grid-cols-2">
        <form className="card grid gap-4 p-5" onSubmit={handleSubmit(() => {})}>
          <div className="flex items-center gap-3"><FaUserShield className="text-kubera-blue" /><h2 className="section-title">User Details</h2></div>
          <FormField label="Name"><input className="input" {...register('fullName')} /></FormField>
          <FormField label="Email"><input className="input" type="email" {...register('email')} disabled /></FormField>
          <FormField label="Mobile"><input className="input" {...register('mobile')} /></FormField>
          <button className="btn-primary"><FaSave /> Save Profile</button>
        </form>
        <section className="card grid gap-4 p-5">
          <div className="flex items-center gap-3"><FaKey className="text-kubera-blue" /><h2 className="section-title">Security</h2></div>
          <FormField label="Current Password"><input className="input" type="password" /></FormField>
          <FormField label="New Password"><input className="input" type="password" /></FormField>
          <button className="btn-primary"><FaKey /> Change Password</button>
          <button className="btn-secondary">Logout From All Devices</button>
        </section>
      </div>
      <section className="card p-5">
        <div className="flex items-center gap-3"><FaPhoneAlt className="text-kubera-red" /><h2 className="section-title">Emergency Access</h2></div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <FormField label="Emergency Contact"><input className="input" placeholder="Name" /></FormField>
          <FormField label="Relationship"><input className="input" placeholder="Relationship" /></FormField>
          <FormField label="Phone Number"><input className="input" placeholder="Phone" /></FormField>
        </div>
      </section>
    </div>
  );
}
