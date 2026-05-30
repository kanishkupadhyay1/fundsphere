import multer from 'multer';

const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) return cb(null, true);
    cb(new Error('Only PDF, JPG, and PNG files are allowed'));
  }
});
