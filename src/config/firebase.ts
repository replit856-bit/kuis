// Import Firebase SDK modules yang diperlukan
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Konfigurasi Firebase dari environment variables
// Pastikan semua nilai ini sudah diisi di file .env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Inisialisasi Firebase app dengan konfigurasi di atas
const app = initializeApp(firebaseConfig);

// Inisialisasi Firebase Authentication
// auth digunakan untuk mengelola state autentikasi user
export const auth = getAuth(app);

// Provider untuk Google Sign-In
// Digunakan untuk menampilkan popup login Google
export const googleProvider = new GoogleAuthProvider();
