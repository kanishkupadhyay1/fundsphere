export const LoadingGrid = ({ count = 4 }) => (
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Loading">
    {Array.from({ length: count }).map((_, index) => (
      <div className="card p-5" key={index}>
        <div className="skeleton h-5 w-28" />
        <div className="skeleton mt-5 h-9 w-40" />
      </div>
    ))}
  </div>
);

export const EmptyState = ({ title = 'No records yet', message = 'Add your first item to begin.' }) => (
  <div className="card flex min-h-48 flex-col items-center justify-center p-8 text-center">
    <h3 className="text-xl font-bold text-slate-900">{title}</h3>
    <p className="mt-2 max-w-xl text-base text-slate-600">{message}</p>
  </div>
);

export const ErrorState = ({ message = 'Unable to load this section.' }) => (
  <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-base font-semibold text-fundsphere-red" role="alert">
    {message}
  </div>
);
