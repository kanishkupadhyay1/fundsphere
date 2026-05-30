export default function FormField({ label, error, children }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
      {error && <span className="mt-2 block text-sm font-semibold text-kubera-red">{error.message}</span>}
    </label>
  );
}
