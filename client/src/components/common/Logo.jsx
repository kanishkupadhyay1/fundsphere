import { FaShieldAlt } from 'react-icons/fa';

export default function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-3" aria-label="FundSphere">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-fundsphere-blue text-xl text-white">
        <FaShieldAlt aria-hidden="true" />
      </div>
      {!compact && (
        <div>
          <p className="text-2xl font-bold tracking-normal text-slate-950">FundSphere</p>
          <p className="text-sm font-medium text-slate-600">AI-Powered Wealth and Liability Management Platform</p>
        </div>
      )}
    </div>
  );
}
