'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { useSignupMutation } from '../../store/api/authApi';
import { setCredentials } from '../../store/slices/authSlice';

export default function SignupForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [signup, { isLoading }] = useSignupMutation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const result = await signup(formData).unwrap();
      dispatch(setCredentials(result));
      router.push('/chats');
    } catch (err: unknown) {
      const error = err as { data?: { message?: string | string[] } };
      const msg = error?.data?.message;
      setError(Array.isArray(msg) ? msg[0] : msg || 'Signup failed. Please try again.');
    }
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [field]: e.target.value });

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {error && <div className="auth-error">{error}</div>}

      {/* First Name / Last Name */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            className="form-input"
            type="text"
            placeholder="Jane"
            value={formData.firstName}
            onChange={update('firstName')}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            className="form-input"
            type="text"
            placeholder="Doe"
            value={formData.lastName}
            onChange={update('lastName')}
            required
          />
        </div>
      </div>

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
            onChange={update('email')}
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
            onChange={update('password')}
            required
            minLength={6}
            autoComplete="new-password"
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
          {isLoading ? 'Creating account...' : 'Create Account'}
        </button>
        <p className="auth-switch">
          Already have an account?
          <Link href="/login" className="auth-link">Sign In</Link>
        </p>
      </div>
    </form>
  );
}
