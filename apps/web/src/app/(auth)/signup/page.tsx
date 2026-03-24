import SignupForm from '../../../components/auth/SignupForm';
import '../../../styles/auth.css';

export default function SignupPage() {
  return (
    <main className="auth-split">
      {/* Left — editorial image panel */}
      <section className="auth-split__hero">
        <img
          src="/images/auth-bg.jpg"
          alt="Professional networking"
          className="auth-split__hero-img"
        />
        <div className="auth-split__hero-overlay" />
        <div className="auth-split__hero-content">
          <span className="auth-hero__badge">Real-Time Connection</span>
          <h1 className="auth-hero__headline">
            Redefining the way{' '}
            <span className="auth-hero__accent">professionals</span>{' '}
            communicate.
          </h1>
          <p className="auth-hero__sub">
            Connect instantly with experts across the globe on a platform built
            for deep collaboration.
          </p>
        </div>
      </section>

      {/* Right — signup form */}
      <section className="auth-split__form">
        <div className="auth-split__form-inner">
          <header className="auth-form-header">
            <div className="auth-brand">RealTimeChat</div>
            <h2 className="auth-form-title">
              Real-time connectivity for the modern professional.
            </h2>
            <p className="auth-form-sub">Sign in to access your chat dashboard.</p>
          </header>

          <SignupForm />

          <footer className="auth-footer">
            <nav className="auth-footer__links">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Help</a>
            </nav>
            <p className="auth-footer__copy">
              © 2025 RealTimeChat. Modern Professional Connectivity.
            </p>
          </footer>
        </div>
      </section>
    </main>
  );
}
