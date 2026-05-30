import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { FaLock, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import Logo from '../components/common/Logo.jsx';
import FormField from '../components/forms/FormField.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthPage({ mode }) {
  const isRegister = mode === 'register';
  const { register: registerUser, login, isAuthenticated, loading } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  if (isAuthenticated) return <Navigate to="/" replace />;

  const onSubmit = async (values) => {
    setError('');
    try {
      if (isRegister) await registerUser(values);
      else await login({ email: values.email, password: values.password, rememberMe: values.rememberMe });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to continue. Please check the details.');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-kubera-gray px-4 py-8">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-soft md:grid-cols-[0.9fr_1.1fr]">
        <div className="bg-kubera-blue p-8 text-white">
          <Logo />
          <h1 className="mt-10 text-4xl font-bold tracking-normal">Secure financial records for the whole family.</h1>
          <p className="mt-5 text-lg leading-8 text-blue-50">Maintain investments, dues, nominees, documents, loans, expenses, and family access in one trusted place.</p>
        </div>
        <div className="p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-kubera-blue">
              {isRegister ? <FaUserPlus aria-hidden="true" /> : <FaLock aria-hidden="true" />}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-950">{isRegister ? 'Create Owner Account' : 'Secure Login'}</h2>
              <p className="text-slate-600">{isRegister ? 'Start your digital financial locker.' : 'Welcome back to Kubera.'}</p>
            </div>
          </div>
          {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 font-semibold text-kubera-red">{error}</div>}
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            {isRegister && (
              <>
                <FormField label="Full Name" error={errors.fullName}><input className="input" {...register('fullName', { required: 'Full name is required' })} /></FormField>
                <FormField label="Mobile Number" error={errors.mobile}><input className="input" {...register('mobile', { required: 'Mobile number is required' })} /></FormField>
              </>
            )}
            <FormField label="Email" error={errors.email}><input className="input" type="email" {...register('email', { required: 'Email is required' })} /></FormField>
            <FormField label="Password" error={errors.password}><input className="input" type="password" {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Use at least 8 characters' } })} /></FormField>
            {isRegister ? (
              <FormField label="Confirm Password" error={errors.confirmPassword}>
                <input className="input" type="password" {...register('confirmPassword', { validate: (value) => value === watch('password') || 'Passwords must match' })} />
              </FormField>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <label className="flex items-center gap-3 font-semibold text-slate-700"><input type="checkbox" className="h-5 w-5" {...register('rememberMe')} /> Remember Me</label>
                <button type="button" className="font-semibold text-kubera-blue">Forgot Password</button>
              </div>
            )}
            <button className="btn-primary w-full" disabled={loading}>
              <FaSignInAlt aria-hidden="true" />
              {isRegister ? 'Create Account' : 'Login'}
            </button>
          </form>
          <p className="mt-6 text-center text-base text-slate-600">
            {isRegister ? 'Already have an account?' : 'New to Kubera?'}{' '}
            <Link className="font-bold text-kubera-blue" to={isRegister ? '/login' : '/register'}>{isRegister ? 'Login' : 'Register'}</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
