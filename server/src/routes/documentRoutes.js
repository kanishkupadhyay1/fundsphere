import express from 'express';
import { documentCrud, uploadDocument } from '../controllers/documentController.js';
import { canModify, protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);
router.route('/').get(documentCrud.list).post(canModify, upload.single('file'), uploadDocument);
router.route('/:id').get(documentCrud.get).patch(canModify, documentCrud.update).delete(canModify, documentCrud.remove);

export default router;
