import jwt from 'jsonwebtoken';

const jwtSecret = () => {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be configured in production');
  }
  return 'fundsphere-local-development-secret';
};

export const signToken = (user) =>
  jwt.sign(
    {
      id: user._id || user.id,
      role: user.role,
      fullName: user.fullName,
      email: user.email,
      mobile: user.mobile
    },
    jwtSecret(),
    {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
