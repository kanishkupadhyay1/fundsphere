import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isDatabaseReady } from '../utils/dbState.js';

const jwtSecret = () => {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be configured in production');
  }
  return 'fundsphere-local-development-secret';
};

export const protect = async (req, _res, next) => {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.split(' ')[1] : req.cookies.token;

    if (!token) {
      const error = new Error('Authentication required');
      error.statusCode = 401;
      throw error;
    }

    const decoded = jwt.verify(token, jwtSecret());

    if (!isDatabaseReady()) {
      if (process.env.NODE_ENV === 'production') {
        const error = new Error('Database is not connected. Please check MONGODB_URI and MongoDB Atlas network access.');
        error.statusCode = 503;
        throw error;
      }

      req.user = {
        _id: decoded.id,
        id: decoded.id,
        role: decoded.role,
        fullName: decoded.fullName,
        email: decoded.email,
        mobile: decoded.mobile
      };
      return next();
    }

    const user = await User.findById(decoded.id).select('-password');

    if (!user || !user.isActive) {
      const error = new Error('User is no longer active');
      error.statusCode = 401;
      throw error;
    }

    req.user = user;
    next();
  } catch (error) {
    error.statusCode = error.statusCode || 401;
    next(error);
  }
};

export const ownerOnly = (req, _res, next) => {
  if (req.user?.role === 'owner') return next();
  const error = new Error('Owner access required');
  error.statusCode = 403;
  next(error);
};

export const canModify = (req, _res, next) => {
  if (req.user?.role === 'owner') return next();
  const error = new Error('Family members have view-only access');
  error.statusCode = 403;
  next(error);
};
