import Document from '../models/Document.js';
import FinancialRecord from '../models/FinancialRecord.js';
import Loan from '../models/Loan.js';
import Notification from '../models/Notification.js';
import { daysUntil } from '../utils/apiFeatures.js';
import { isDatabaseReady } from '../utils/dbState.js';

const notificationLink = (type) => {
  const links = {
    Maturity: '/due-center',
    'Premium Due': '/due-center',
    'Loan Due': '/loans',
    'Overdue Loan': '/loans',
    'Missing Nominee': '/nominees',
    'Missing Information': '/records',
    'Document Expiry': '/documents',
    'System Alert': '/profile'
  };
  return links[type] || '/';
};

const severityForDays = (days) => {
  if (days < 0 || days <= 7) return 'urgent';
  if (days <= 90) return 'warning';
  return 'info';
};

const makeNotification = ({ id, type, title, message, date, severity, source = 'generated' }) => ({
  _id: id,
  title,
  message,
  type,
  severity,
  dueDate: date,
  createdAt: date || new Date(),
  isRead: false,
  link: notificationLink(type),
  source
});

const generatedNotifications = async (owner) => {
  const [records, loans, documents] = await Promise.all([
    FinancialRecord.find({ owner }).lean(),
    Loan.find({ owner }).lean(),
    Document.find({ owner }).lean()
  ]);

  const notifications = [];

  records.forEach((record) => {
    if (record.maturityDate) {
      const days = daysUntil(record.maturityDate);
      if (days <= 90) {
        notifications.push(makeNotification({
          id: `maturity-${record._id}`,
          type: 'Maturity',
          title: `${record.recordName} maturity ${days < 0 ? 'has passed' : 'is upcoming'}`,
          message: `${record.institution} matures on ${new Date(record.maturityDate).toLocaleDateString('en-IN')}.`,
          date: record.maturityDate,
          severity: severityForDays(days)
        }));
      }
    }

    if (record.dynamicFields?.nextDueDate) {
      const days = daysUntil(record.dynamicFields.nextDueDate);
      if (days <= 90) {
        notifications.push(makeNotification({
          id: `premium-${record._id}`,
          type: 'Premium Due',
          title: `${record.recordName} premium due`,
          message: `Premium of Rs ${record.dynamicFields.premiumAmount || 0} is due on ${new Date(record.dynamicFields.nextDueDate).toLocaleDateString('en-IN')}.`,
          date: record.dynamicFields.nextDueDate,
          severity: severityForDays(days)
        }));
      }
    }

    if (!record.nominee) {
      notifications.push(makeNotification({
        id: `nominee-${record._id}`,
        type: 'Missing Nominee',
        title: `${record.recordName} has no nominee`,
        message: `Add nominee details for ${record.institution}.`,
        date: record.updatedAt,
        severity: 'warning'
      }));
    }

    if (!record.referenceNumber || !record.institution || !record.maturityDate) {
      notifications.push(makeNotification({
        id: `missing-${record._id}`,
        type: 'Missing Information',
        title: `${record.recordName} has missing information`,
        message: 'Complete reference number, institution, maturity date, or other important details.',
        date: record.updatedAt,
        severity: 'warning'
      }));
    }
  });

  loans
    .filter((loan) => loan.status !== 'Fully Paid' && loan.dueDate)
    .forEach((loan) => {
      const days = daysUntil(loan.dueDate);
      if (days <= 90) {
        notifications.push(makeNotification({
          id: `loan-${loan._id}`,
          type: days < 0 ? 'Overdue Loan' : 'Loan Due',
          title: `${loan.personName} loan ${days < 0 ? 'is overdue' : 'is due soon'}`,
          message: `${loan.direction} of Rs ${loan.principalAmount || 0} is due on ${new Date(loan.dueDate).toLocaleDateString('en-IN')}.`,
          date: loan.dueDate,
          severity: severityForDays(days)
        }));
      }
    });

  documents
    .filter((document) => document.expiryDate)
    .forEach((document) => {
      const days = daysUntil(document.expiryDate);
      if (days <= 90) {
        notifications.push(makeNotification({
          id: `document-${document._id}`,
          type: 'Document Expiry',
          title: `${document.name} is expiring`,
          message: `${document.type} expires on ${new Date(document.expiryDate).toLocaleDateString('en-IN')}.`,
          date: document.expiryDate,
          severity: severityForDays(days)
        }));
      }
    });

  return notifications;
};

export const listNotifications = async (req, res, next) => {
  try {
    if (!isDatabaseReady()) {
      const items = [
        makeNotification({
          id: 'system-local-demo',
          type: 'System Alert',
          title: 'Local demo mode is active',
          message: 'Connect MongoDB Atlas to use persistent notifications.',
          date: new Date(),
          severity: 'info'
        })
      ];
      return res.json({ items, unreadCount: items.length });
    }

    const owner = req.user.owner || req.user._id;
    const [stored, generated] = await Promise.all([
      Notification.find({ owner }).sort('-createdAt').limit(50).lean(),
      generatedNotifications(owner)
    ]);

    const items = [...stored.map((item) => ({ ...item, source: 'stored' })), ...generated]
      .sort((a, b) => new Date(b.createdAt || b.dueDate) - new Date(a.createdAt || a.dueDate))
      .slice(0, 50);

    res.json({ items, unreadCount: items.filter((item) => !item.isRead).length });
  } catch (error) {
    next(error);
  }
};

export const markNotificationRead = async (req, res, next) => {
  try {
    if (!isDatabaseReady() || req.params.id.startsWith('maturity-') || req.params.id.startsWith('premium-') || req.params.id.startsWith('loan-') || req.params.id.startsWith('nominee-') || req.params.id.startsWith('missing-') || req.params.id.startsWith('document-') || req.params.id.startsWith('system-')) {
      return res.json({ message: 'Notification marked as read' });
    }

    const owner = req.user.owner || req.user._id;
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, owner },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      const error = new Error('Notification not found');
      error.statusCode = 404;
      throw error;
    }

    res.json(notification);
  } catch (error) {
    next(error);
  }
};

export const markAllNotificationsRead = async (req, res, next) => {
  try {
    if (isDatabaseReady()) {
      const owner = req.user.owner || req.user._id;
      await Notification.updateMany({ owner, isRead: false }, { isRead: true });
    }
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};
