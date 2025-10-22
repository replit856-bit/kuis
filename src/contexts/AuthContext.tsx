/**
 * ==============================================
 * AUTH CONTEXT - FIREBASE AUTHENTICATION
 * ==============================================
 *
 * FITUR UTAMA:
 * - Centralized authentication state management
 * - Firebase Auth integration (Email/Password & Google OAuth)
 * - Auto-detect auth state changes
 * - Provide auth functions ke semua components via Context API
 *
 * AUTHENTICATION METHODS:
 * 1. Email/Password Sign In - Traditional authentication
 * 2. Email/Password Sign Up - New user registration
 * 3. Google OAuth - One-click social authentication
 * 4. Sign Out - Clear user session
 *
 * STATE MANAGEMENT:
 * - currentUser: User object dari Firebase atau null
 * - loading: Prevent flash of incorrect content saat initial load
 *
 * ARCHITECTURE:
 * - React Context API untuk global state
 * - Custom hook (useAuth) untuk easy access
 * - Firebase onAuthStateChanged listener untuk real-time updates
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

/**
 * TypeScript Interface untuk Auth Context
 * Mendefinisikan shape dari context value yang akan di-share
 */
interface AuthContextType {
  currentUser: User | null; // Firebase User object atau null jika not authenticated
  loading: boolean; // Loading state untuk prevent premature renders
  signInWithGoogle: () => Promise<void>; // Google OAuth sign in method
  signInWithEmail: (email: string, password: string) => Promise<void>; // Email/password sign in
  signUpWithEmail: (email: string, password: string) => Promise<void>; // New user registration
  signOut: () => Promise<void>; // Sign out method untuk clear session
}

// Buat context untuk autentikasi
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook custom untuk mengakses Auth Context dengan mudah
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return context;
};

// Provider component yang membungkus aplikasi
// Menyediakan state dan fungsi autentikasi ke semua child components
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // State untuk menyimpan data user yang sedang login
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // State untuk menandakan proses pengecekan autentikasi
  const [loading, setLoading] = useState(true);

  // Fungsi untuk login menggunakan Google
  // Menampilkan popup Google Sign-In
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error saat login dengan Google:', error);
      throw error;
    }
  };

  // Fungsi untuk login menggunakan Email dan Password
  const signInWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error saat login dengan Email:', error);
      throw error;
    }
  };

  // Fungsi untuk register menggunakan Email dan Password
  const signUpWithEmail = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error saat register:', error);
      throw error;
    }
  };

  // Fungsi untuk logout
  // Menghapus session autentikasi dari Firebase
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error saat logout:', error);
      throw error;
    }
  };

  // useEffect untuk mendengarkan perubahan status autentikasi
  // Dijalankan sekali saat component dimount
  useEffect(() => {
    // onAuthStateChanged adalah listener dari Firebase
    // Akan dipanggil setiap kali status autentikasi berubah
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // Update state dengan user yang login
      setLoading(false); // Set loading false setelah pengecekan selesai
    });

    // Cleanup function: unsubscribe listener saat component unmount
    return unsubscribe;
  }, []);

  // Value yang akan disediakan ke semua child components
  const value = {
    currentUser,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  };

  // Render children hanya jika loading sudah selesai
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
