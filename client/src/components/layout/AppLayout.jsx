import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FaBell, FaBuilding, FaChartPie, FaClipboardList, FaFileAlt, FaHandHoldingUsd, FaHome, FaIdBadge, FaMoneyBillWave, FaSearch, FaSignOutAlt, FaUserFriends, FaUserShield, FaWallet } from 'react-icons/fa';
import Footer from './Footer.jsx';
import Logo from '../common/Logo.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import NotificationBell from '../notifications/NotificationBell.jsx';

const desktopLinks = [
  { to: '/', label: 'Dashboard', icon: FaHome },
  { to: '/records', label: 'Financial Records', icon: FaWallet },
  { to: '/due-center', label: 'Due Center', icon: FaBell },
  { to: '/loans', label: 'Loans', icon: FaHandHoldingUsd },
  { to: '/expenses', label: 'Expenses', icon: FaMoneyBillWave },
  { to: '/documents', label: 'Documents', icon: FaFileAlt },
  { to: '/nominees', label: 'Nominees', icon: FaIdBadge },
  { to: '/reports', label: 'Reports', icon: FaClipboardList },
  { to: '/institutions', label: 'Institutions', icon: FaBuilding },
  { to: '/family-access', label: 'Family Access', icon: FaUserFriends },
  { to: '/profile', label: 'Profile', icon: FaUserShield },
  { to: '/analytics', label: 'Analytics', icon: FaChartPie }
];

const mobileLinks = [
  { to: '/', label: 'Home', icon: FaHome },
  { to: '/records', label: 'Records', icon: FaWallet },
  { to: '/due-center', label: 'Due', icon: FaBell },
  { to: '/loans', label: 'Loans', icon: FaHandHoldingUsd },
  { to: '/expenses', label: 'Expenses', icon: FaMoneyBillWave },
  { to: '/profile', label: 'Profile', icon: FaUserShield }
];

const linkClass = ({ isActive }) =>
  `flex min-h-12 items-center gap-3 rounded-lg px-4 py-3 text-base font-semibold transition ${
    isActive ? 'bg-fundsphere-blue text-white' : 'text-slate-700 hover:bg-blue-50 hover:text-fundsphere-blue'
  }`;

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-fundsphere-gray">
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-72 border-r border-slate-200 bg-white p-5 lg:block">
        <Logo />
        <nav className="mt-8 space-y-1" aria-label="Main navigation">
          {desktopLinks.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkClass}>
              <item.icon aria-hidden="true" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="lg:hidden">
              <Logo compact />
            </div>
            <div className="hidden min-w-80 flex-1 items-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-3 md:flex">
              <FaSearch className="text-slate-500" aria-hidden="true" />
              <input className="w-full border-0 text-base outline-none" placeholder="Search records, nominees, institutions, loans, documents" aria-label="Global search" />
            </div>
            <div className="flex items-center gap-3">
              <NotificationBell />
              <div className="hidden text-right sm:block">
                <p className="font-bold text-slate-950">{user?.fullName || 'FundSphere User'}</p>
                <p className="text-sm capitalize text-slate-600">{user?.role || 'owner'}</p>
              </div>
              <button onClick={handleLogout} className="btn-secondary" aria-label="Logout">
                <FaSignOutAlt aria-hidden="true" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 pb-28 md:px-8 lg:pb-8">
          <Outlet />
        </main>
        <Footer />
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-6 border-t border-slate-200 bg-white lg:hidden" aria-label="Mobile navigation">
        {mobileLinks.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => `flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-bold ${isActive ? 'text-fundsphere-blue' : 'text-slate-600'}`}>
            <item.icon className="text-lg" aria-hidden="true" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
