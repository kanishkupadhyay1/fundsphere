import express from 'express';
import { canModify, protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';

export const crudRouter = (controller, rules = []) => {
  const router = express.Router();
  router.use(protect);
  router.route('/').get(controller.list).post(canModify, rules, validate, controller.create);
  router.route('/:id').get(controller.get).patch(canModify, rules, validate, controller.update).delete(canModify, controller.remove);
  return router;
};
