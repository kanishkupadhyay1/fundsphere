import { FaShieldAlt } from 'react-icons/fa';

export default function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-3" aria-label="Kubera">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-kubera-blue text-xl text-white">
        <FaShieldAlt aria-hidden="true" />
      </div>
      {!compact && (
        <div>
          <p className="text-2xl font-bold tracking-normal text-slate-950">KUBERA</p>
          <p className="text-sm font-medium text-slate-600">One Place for Every Financial Record</p>
        </div>
      )}
    </div>
  );
}
