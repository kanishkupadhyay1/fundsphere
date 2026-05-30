import FinancialRecord from '../models/FinancialRecord.js';
import { createCrudController } from '../controllers/factoryController.js';
import { financialRecordRules } from '../validators/commonValidators.js';
import { crudRouter } from './crudRoutes.js';

export default crudRouter(createCrudController(FinancialRecord, ['recordName', 'referenceNumber', 'institution', 'nominee']), financialRecordRules);
