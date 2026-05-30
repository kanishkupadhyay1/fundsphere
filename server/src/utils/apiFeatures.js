export const buildQuery = (query, searchFields = []) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;
  const sort = query.sort || '-createdAt';
  const filter = {};

  ['type', 'status', 'institution', 'nominee', 'category', 'direction'].forEach((field) => {
    if (query[field]) filter[field] = query[field];
  });

  if (query.startDate || query.endDate) {
    filter.date = {};
    if (query.startDate) filter.date.$gte = new Date(query.startDate);
    if (query.endDate) filter.date.$lte = new Date(query.endDate);
  }

  if (query.search && searchFields.length) {
    filter.$or = searchFields.map((field) => ({
      [field]: { $regex: query.search, $options: 'i' }
    }));
  }

  return { filter, page, limit, skip, sort };
};

export const formatPaginated = (items, total, page, limit) => ({
  items,
  pagination: {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit) || 1
  }
});

export const daysUntil = (date) => {
  if (!date) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
};
