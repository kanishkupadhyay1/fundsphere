import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Logo from '../common/Logo.jsx';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-8 md:px-8">
      <div className="grid gap-8 xl:grid-cols-[1.2fr_1fr_1.2fr]">
        <div>
          <Logo />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Quick Links</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 text-base font-semibold text-slate-700">
            <Link to="/">Dashboard</Link>
            <Link to="/records">Records</Link>
            <Link to="/due-center">Due Center</Link>
            <Link to="/loans">Loans</Link>
            <Link to="/expenses">Expenses</Link>
            <Link to="/reports">Reports</Link>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">About Developer</h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Kanishk Upadhyay enjoys building practical software solutions that solve real-world problems through clean architecture, thoughtful design, and user-focused development.
          </p>
          <div className="mt-4 flex gap-3">
            <a className="btn-secondary" href="mailto:kanishk.upadhyay2006@gmail.com" aria-label="Email Kanishk Upadhyay">
              <FaEnvelope aria-hidden="true" />
            </a>
            <a className="btn-secondary" href="https://www.linkedin.com/in/kanishk-upadhyay-151560335/" target="_blank" rel="noreferrer" aria-label="Open LinkedIn profile in a new tab">
              <FaLinkedin aria-hidden="true" />
            </a>
            <a className="btn-secondary" href="https://github.com/kanishkupadhyay1" target="_blank" rel="noreferrer" aria-label="Open GitHub profile in a new tab">
              <FaGithub aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
