import { createCrudController } from '../controllers/factoryController.js';
import Institution from '../models/Institution.js';
import { institutionRules } from '../validators/commonValidators.js';
import { crudRouter } from './crudRoutes.js';

export default crudRouter(createCrudController(Institution, ['name', 'type', 'branch']), institutionRules);
