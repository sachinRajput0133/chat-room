'use client';
import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../../store/api/authApi';
import { setCredentials } from '../../store/slices/authSlice';

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const result = await login(formData).unwrap();
      dispatch(setCredentials(result));
      router.push('/chats');
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setError(error?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {error && <div className="auth-error">{error}</div>}

      {/* Email */}
      <div className="form-group">
        <label className="form-label" htmlFor="email">Email</label>
        <div className="form-input-wrap">
          <span className="form-input-icon">mail</span>
          <input
            id="email"
            className="form-input form-input--icon-left"
            type="email"
            placeholder="jane.doe@company.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            autoComplete="email"
          />
        </div>
      </div>

      {/* Password */}
      <div className="form-group">
        <label className="form-label" htmlFor="password">Password</label>
        <div className="form-input-wrap">
          <span className="form-input-icon">lock</span>
          <input
            id="password"
            className="form-input form-input--icon-left form-input--icon-right"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            autoComplete="current-password"
          />
          <button
            type="button"
            className="form-input-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? 'visibility_off' : 'visibility'}
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="auth-actions">
        <button className="auth-btn" type="submit" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
        <p className="auth-switch">
          Don&apos;t have an account?
          <Link href="/signup" className="auth-link">Create Account</Link>
        </p>
      </div>
    </form>
  );
}
