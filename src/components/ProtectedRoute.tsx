// Import hooks dan components
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ReactNode } from 'react';

// Interface untuk props ProtectedRoute
interface ProtectedRouteProps {
  children: ReactNode; // Component yang akan di-protect
}

// Komponen untuk melindungi route yang memerlukan autentikasi
// Jika user belum login, akan di-redirect ke halaman login
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Ambil currentUser dari Auth Context
  const { currentUser } = useAuth();

  // Jika user belum login, redirect ke halaman login
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  // Jika user sudah login, tampilkan children (component yang di-protect)
  return <>{children}</>;
};

export default ProtectedRoute;
