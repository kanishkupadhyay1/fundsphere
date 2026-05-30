import User from '../models/User.js';
import { isDatabaseReady } from '../utils/dbState.js';
import { signToken } from '../utils/token.js';

const demoUsers = new Map();

const authResponse = (user, token) => ({
  token,
  user: {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    mobile: user.mobile,
    role: user.role
  }
});

export const register = async (req, res, next) => {
  try {
    const { fullName, email, mobile, password } = req.body;

    if (!isDatabaseReady()) {
      if (demoUsers.has(email)) {
        const error = new Error('Email is already registered in this local demo session');
        error.statusCode = 409;
        throw error;
      }

      const user = {
        _id: `demo-${Date.now()}`,
        fullName,
        email,
        mobile,
        password,
        role: 'owner'
      };
      const token = signToken(user);
      demoUsers.set(email, user);
      return res.status(201).json(authResponse(user, token));
    }

    const exists = await User.findOne({ email });
    if (exists) {
      const error = new Error('Email is already registered');
      error.statusCode = 409;
      throw error;
    }

    const user = await User.create({ fullName, email, mobile, password, role: 'owner' });
    const token = signToken(user);
    res.status(201).json(authResponse(user, token));
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!isDatabaseReady()) {
      const user = demoUsers.get(email);
      if (!user || user.password !== password) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
      }

      const token = signToken(user);
      return res.json(authResponse(user, token));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const token = signToken(user);
    res.json(authResponse(user, token));
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res) => {
  res.json(req.user);
};

export const updateProfile = async (req, res, next) => {
  try {
    const updates = {
      fullName: req.body.fullName,
      mobile: req.body.mobile,
      emergencyContacts: req.body.emergencyContacts
    };
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true }).select('-password');
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(req.body.currentPassword))) {
      const error = new Error('Current password is incorrect');
      error.statusCode = 400;
      throw error;
    }
    user.password = req.body.newPassword;
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};
