import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { FaDownload, FaEye, FaFileUpload, FaSearch } from 'react-icons/fa';
import FormField from '../components/forms/FormField.jsx';
import api from '../lib/api.js';
import { formatDate } from '../lib/format.js';
import { useApiQuery } from '../hooks/useApiQuery.js';

const documentTypes = ['FD Receipt', 'Insurance Policy', 'Property Paper', 'Bank Statement', 'Pension Record', 'Aadhaar', 'PAN', 'Passport', 'Other'];
const fallback = { items: [{ _id: '1', name: 'SBI FD Receipt', type: 'FD Receipt', fileUrl: '#', expiryDate: '2028-01-01' }] };

export default function Documents() {
  const { register, handleSubmit, reset } = useForm({ defaultValues: { type: 'Other' } });
  const queryClient = useQueryClient();
  const { data = fallback } = useApiQuery(['documents'], '/documents?limit=50', fallback);
  const mutation = useMutation({
    mutationFn: (values) => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === 'file') formData.append('file', value?.[0]);
        else formData.append(key, value || '');
      });
      return api.post('/documents', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['documents'] }); reset(); }
  });

  return (
    <div className="space-y-6">
      <div><h1 className="page-title">Document Vault</h1><p className="mt-2 text-lg text-slate-600">Upload, preview, download, search, and categorize important PDF, JPG, and PNG documents.</p></div>
      <form className="card grid gap-4 p-5 md:grid-cols-4" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
        <FormField label="Document Name"><input className="input" {...register('name', { required: true })} /></FormField>
        <FormField label="Document Type"><select className="input" {...register('type')}>{documentTypes.map((item) => <option key={item}>{item}</option>)}</select></FormField>
        <FormField label="Expiry Date"><input className="input" type="date" {...register('expiryDate')} /></FormField>
        <FormField label="Upload File"><input className="input" type="file" accept=".pdf,.jpg,.jpeg,.png" {...register('file')} /></FormField>
        <div className="md:col-span-4"><button className="btn-primary"><FaFileUpload /> Upload Document</button></div>
      </form>
      <div className="card flex items-center gap-3 p-4"><FaSearch className="text-slate-500" /><input className="w-full border-0 bg-transparent outline-none" placeholder="Search documents by name or category" /></div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.items?.map((document) => (
          <article className="card p-5" key={document._id}>
            <p className="text-sm font-bold text-kubera-blue">{document.type}</p>
            <h2 className="mt-2 text-xl font-bold">{document.name}</h2>
            <p className="mt-2 text-slate-600">Expiry: {formatDate(document.expiryDate)}</p>
            <div className="mt-5 flex gap-3">
              <a className="btn-secondary" href={document.fileUrl} target="_blank" rel="noreferrer"><FaEye /> Preview</a>
              <a className="btn-secondary" href={document.fileUrl} download><FaDownload /> Download</a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
