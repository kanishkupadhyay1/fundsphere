import { buildQuery, formatPaginated } from '../utils/apiFeatures.js';

export const createCrudController = (Model, searchFields = []) => ({
  list: async (req, res, next) => {
    try {
      const { filter, page, limit, skip, sort } = buildQuery(req.query, searchFields);
      filter.owner = req.user.owner || req.user._id;
      const [items, total] = await Promise.all([
        Model.find(filter).sort(sort).skip(skip).limit(limit),
        Model.countDocuments(filter)
      ]);
      res.json(formatPaginated(items, total, page, limit));
    } catch (error) {
      next(error);
    }
  },

  get: async (req, res, next) => {
    try {
      const item = await Model.findOne({ _id: req.params.id, owner: req.user.owner || req.user._id });
      if (!item) {
        const error = new Error('Record not found');
        error.statusCode = 404;
        throw error;
      }
      res.json(item);
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const item = await Model.create({ ...req.body, owner: req.user.owner || req.user._id });
      res.status(201).json(item);
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const item = await Model.findOneAndUpdate(
        { _id: req.params.id, owner: req.user.owner || req.user._id },
        req.body,
        { new: true, runValidators: true }
      );
      if (!item) {
        const error = new Error('Record not found');
        error.statusCode = 404;
        throw error;
      }
      res.json(item);
    } catch (error) {
      next(error);
    }
  },

  remove: async (req, res, next) => {
    try {
      const item = await Model.findOneAndDelete({ _id: req.params.id, owner: req.user.owner || req.user._id });
      if (!item) {
        const error = new Error('Record not found');
        error.statusCode = 404;
        throw error;
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
});
