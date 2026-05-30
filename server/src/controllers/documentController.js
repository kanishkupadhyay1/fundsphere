import { Readable } from 'stream';
import cloudinary from '../config/cloudinary.js';
import Document from '../models/Document.js';
import { createCrudController } from './factoryController.js';

export const documentCrud = createCrudController(Document, ['name', 'type']);

const uploadBuffer = (file) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'kubera/documents', resource_type: 'auto' },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    Readable.from(file.buffer).pipe(stream);
  });

export const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error('Document file is required');
      error.statusCode = 400;
      throw error;
    }

    const result = await uploadBuffer(req.file);
    const document = await Document.create({
      ...req.body,
      owner: req.user.owner || req.user._id,
      fileUrl: result.secure_url,
      publicId: result.public_id,
      mimeType: req.file.mimetype,
      size: req.file.size
    });

    res.status(201).json(document);
  } catch (error) {
    next(error);
  }
};
