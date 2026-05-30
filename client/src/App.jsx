import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout.jsx';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';
import Analytics from './pages/Analytics.jsx';
import AuthPage from './pages/AuthPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Documents from './pages/Documents.jsx';
import DueCenter from './pages/DueCenter.jsx';
import Expenses from './pages/Expenses.jsx';
import FamilyAccess from './pages/FamilyAccess.jsx';
import Institutions from './pages/Institutions.jsx';
import Loans from './pages/Loans.jsx';
import Nominees from './pages/Nominees.jsx';
import Profile from './pages/Profile.jsx';
import Records from './pages/Records.jsx';
import Reports from './pages/Reports.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="records" element={<Records />} />
          <Route path="due-center" element={<DueCenter />} />
          <Route path="loans" element={<Loans />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="documents" element={<Documents />} />
          <Route path="nominees" element={<Nominees />} />
          <Route path="reports" element={<Reports />} />
          <Route path="institutions" element={<Institutions />} />
          <Route path="family-access" element={<FamilyAccess />} />
          <Route path="profile" element={<Profile />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
