import { useForm } from 'react-hook-form';
import { FaSave } from 'react-icons/fa';
import { recordTypes } from '../../lib/constants.js';
import FormField from '../forms/FormField.jsx';

export default function RecordForm({ onSubmit, defaultValues = {}, isSaving = false }) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({ defaultValues });
  const type = watch('type', defaultValues.type || 'Fixed Deposit');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card grid gap-4 p-5 md:grid-cols-2">
      <FormField label="Record Type" error={errors.type}>
        <select className="input" {...register('type', { required: 'Record type is required' })}>
          {recordTypes.map((item) => <option key={item}>{item}</option>)}
        </select>
      </FormField>
      <FormField label="Institution" error={errors.institution}>
        <input className="input" {...register('institution', { required: 'Institution is required' })} placeholder="SBI, LIC, HDFC" />
      </FormField>
      <FormField label="Record Name" error={errors.recordName}>
        <input className="input" {...register('recordName', { required: 'Record name is required' })} placeholder="FD for retirement fund" />
      </FormField>
      <FormField label="Reference Number">
        <input className="input" {...register('referenceNumber')} placeholder="Policy, account, FD, folio number" />
      </FormField>
      <FormField label="Amount">
        <input className="input" type="number" {...register('amount', { valueAsNumber: true })} />
      </FormField>
      <FormField label="Nominee">
        <input className="input" {...register('nominee')} placeholder="Nominee name" />
      </FormField>
      <FormField label="Start Date">
        <input className="input" type="date" {...register('startDate')} />
      </FormField>
      <FormField label="Maturity Date">
        <input className="input" type="date" {...register('maturityDate')} />
      </FormField>
      <FormField label="Status">
        <select className="input" {...register('status')}>
          {['Active', 'Matured', 'Closed', 'Inactive'].map((item) => <option key={item}>{item}</option>)}
        </select>
      </FormField>
      {type === 'Fixed Deposit' && (
        <>
          <FormField label="FD Number"><input className="input" {...register('dynamicFields.fdNumber')} /></FormField>
          <FormField label="Interest Rate"><input className="input" type="number" step="0.01" {...register('dynamicFields.interestRate', { valueAsNumber: true })} /></FormField>
          <FormField label="Branch"><input className="input" {...register('dynamicFields.branch')} /></FormField>
          <label className="flex min-h-12 items-center gap-3 text-base font-semibold text-slate-800">
            <input type="checkbox" className="h-5 w-5" {...register('dynamicFields.autoRenewal')} />
            Auto Renewal
          </label>
        </>
      )}
      {type === 'Insurance Policy' && (
        <>
          <FormField label="Policy Number"><input className="input" {...register('dynamicFields.policyNumber')} /></FormField>
          <FormField label="Premium Amount"><input className="input" type="number" {...register('dynamicFields.premiumAmount', { valueAsNumber: true })} /></FormField>
          <FormField label="Premium Frequency"><select className="input" {...register('dynamicFields.premiumFrequency')}><option>Monthly</option><option>Quarterly</option><option>Half Yearly</option><option>Yearly</option></select></FormField>
          <FormField label="Next Due Date"><input className="input" type="date" {...register('dynamicFields.nextDueDate')} /></FormField>
        </>
      )}
      {type === 'Bank Account' && (
        <>
          <FormField label="Account Number"><input className="input" {...register('dynamicFields.accountNumber')} /></FormField>
          <FormField label="IFSC"><input className="input" {...register('dynamicFields.ifsc')} /></FormField>
          <FormField label="Branch"><input className="input" {...register('dynamicFields.branch')} /></FormField>
          <FormField label="Account Type"><select className="input" {...register('dynamicFields.accountType')}><option>Savings</option><option>Current</option><option>Pension</option></select></FormField>
        </>
      )}
      {type === 'Mutual Fund' && (
        <>
          <FormField label="Folio Number"><input className="input" {...register('dynamicFields.folioNumber')} /></FormField>
          <FormField label="Fund Name"><input className="input" {...register('dynamicFields.fundName')} /></FormField>
          <FormField label="SIP Amount"><input className="input" type="number" {...register('dynamicFields.sipAmount', { valueAsNumber: true })} /></FormField>
        </>
      )}
      {type === 'Property' && (
        <>
          <FormField label="Property Type"><input className="input" {...register('dynamicFields.propertyType')} /></FormField>
          <FormField label="Address"><input className="input" {...register('dynamicFields.address')} /></FormField>
          <FormField label="Purchase Date"><input className="input" type="date" {...register('dynamicFields.purchaseDate')} /></FormField>
          <FormField label="Current Value"><input className="input" type="number" {...register('dynamicFields.currentValue', { valueAsNumber: true })} /></FormField>
        </>
      )}
      <div className="md:col-span-2">
        <FormField label="Notes">
          <textarea className="input min-h-28" {...register('notes')} />
        </FormField>
      </div>
      <div className="md:col-span-2">
        <button className="btn-primary" disabled={isSaving}>
          <FaSave aria-hidden="true" />
          Save Financial Record
        </button>
      </div>
    </form>
  );
}
