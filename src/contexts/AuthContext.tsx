// Import React hooks dan Firebase authentication
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

// Interface untuk tipe data Auth Context
interface AuthContextType {
  currentUser: User | null; // User yang sedang login, null jika belum login
  loading: boolean; // Status loading saat cek autentikasi
  signInWithGoogle: () => Promise<void>; // Fungsi untuk login dengan Google
  signInWithEmail: (email: string, password: string) => Promise<void>; // Fungsi untuk login dengan Email
  signUpWithEmail: (email: string, password: string) => Promise<void>; // Fungsi untuk register dengan Email
  signOut: () => Promise<void>; // Fungsi untuk logout
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
