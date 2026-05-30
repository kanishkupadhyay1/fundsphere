import { createCrudController } from '../controllers/factoryController.js';
import Expense from '../models/Expense.js';
import { expenseRules } from '../validators/commonValidators.js';
import { crudRouter } from './crudRoutes.js';

export default crudRouter(createCrudController(Expense, ['category', 'description']), expenseRules);
