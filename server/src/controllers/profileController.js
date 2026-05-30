import FamilyMember from '../models/FamilyMember.js';
import User from '../models/User.js';
import { createCrudController } from './factoryController.js';

export const familyCrud = createCrudController(FamilyMember, ['name', 'email', 'relationship']);

export const addEmergencyContact = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.emergencyContacts.push(req.body);
    await user.save();
    res.status(201).json(user.emergencyContacts);
  } catch (error) {
    next(error);
  }
};
