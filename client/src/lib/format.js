export const formatCurrency = (value = 0) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Number(value) || 0);

export const formatDate = (value) => {
  if (!value) return 'Not set';
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
};

export const dueTone = (days) => {
  if (days < 0) return 'bg-red-50 text-fundsphere-red border-red-200';
  if (days <= 7) return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-green-50 text-fundsphere-green border-green-200';
};
