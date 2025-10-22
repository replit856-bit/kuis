/**
 * ==============================================
 * REGISTER PAGE - VERCEL-INSPIRED DESIGN
 * ==============================================
 *
 * FITUR UTAMA:
 * - Registrasi akun baru dengan Email & Password
 * - Registrasi cepat dengan Google OAuth
 * - Form validation lengkap (email format, password strength, password match)
 * - Real-time error feedback untuk user experience yang lebih baik
 * - Security best practices dengan Firebase Authentication
 *
 * UI/UX DESIGN PRINCIPLES:
 * - Minimalist black & white color scheme (Vercel-inspired)
 * - Progressive disclosure: informasi ditampilkan bertahap
 * - Clear visual hierarchy dengan proper spacing
 * - Interactive states (hover, focus, disabled) yang jelas
 * - Micro-interactions untuk feedback yang immediate
 * - Mobile-first responsive design
 *
 * FORM VALIDATION:
 * - Email: format validation
 * - Password: minimum 6 karakter untuk security
 * - Confirm Password: harus match dengan password
 * - All fields required validation
 * - Firebase error codes di-translate ke bahasa user-friendly
 */

import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { UserPlus } from 'lucide-react';

// Komponen halaman register
const RegisterPage = () => {
  // Hook untuk mendapatkan fungsi auth dari Auth Context
  const { signUpWithEmail, signInWithGoogle } = useAuth();

  // Hook untuk navigasi ke halaman lain
  const navigate = useNavigate();

  // State untuk menandakan proses register sedang berlangsung
  const [isLoading, setIsLoading] = useState(false);

  // State untuk menyimpan pesan error jika register gagal
  const [error, setError] = useState<string | null>(null);

  // State untuk form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Fungsi yang dipanggil saat form register disubmit
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi input
    if (!email || !password || !confirmPassword) {
      setError('Semua field harus diisi');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak sama');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await signUpWithEmail(email, password);
      navigate('/quiz');
    } catch (err: any) {
      console.error('Register error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email sudah terdaftar');
      } else if (err.code === 'auth/invalid-email') {
        setError('Format email tidak valid');
      } else if (err.code === 'auth/weak-password') {
        setError('Password terlalu lemah');
      } else {
        setError('Gagal mendaftar. Silakan coba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk register dengan Google
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signInWithGoogle();
      navigate('/quiz');
    } catch (err) {
      console.error('Register error:', err);
      setError('Gagal mendaftar dengan Google. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      {/* Main Container - Centered dengan consistent spacing */}
      <div className="w-full max-w-md">
        {/* Header - Vercel-style dengan icon branding */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-black rounded-full mb-6">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-black mb-2 tracking-tight">Create Account</h1>
          <p className="text-gray-500 text-sm">Start your quiz journey today</p>
        </div>

        {/* Error Message - Non-intrusive notification */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Form Register - Clean dan straightforward */}
        <form onSubmit={handleEmailSignUp} className="space-y-4 mb-6">
          {/* Email Field dengan helper text */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:border-gray-400 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all duration-200 text-sm"
              placeholder="you@example.com"
              disabled={isLoading}
            />
          </div>

          {/* Password Field dengan requirements hint */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-black mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:border-gray-400 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all duration-200 text-sm"
              placeholder="At least 6 characters"
              disabled={isLoading}
            />
          </div>

          {/* Confirm Password untuk prevent typos */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-black mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:border-gray-400 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all duration-200 text-sm"
              placeholder="Re-enter your password"
              disabled={isLoading}
            />
          </div>

          {/* Primary CTA - Prominent black button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white font-medium py-3 px-6 rounded-lg hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black text-sm shadow-sm mt-6"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Divider - Visual separator */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="px-3 bg-white text-gray-400 font-medium">Or continue with</span>
          </div>
        </div>

        {/* Google OAuth - Alternative sign up method */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full bg-white border border-gray-300 text-black font-medium py-3 px-6 rounded-lg hover:border-black hover:shadow-sm transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed mb-8 text-sm"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Login Link - untuk existing users */}
        <div className="text-center pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/" className="text-black hover:underline font-medium transition-all">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
