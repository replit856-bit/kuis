// Import React Router components untuk navigasi
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { QuizProvider } from './contexts/QuizContext';

// Import Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';

// Import Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';

// Komponen utama aplikasi
function App() {
  return (
    // AuthProvider: Menyediakan state autentikasi ke seluruh aplikasi
    <AuthProvider>
      {/* QuizProvider: Menyediakan state quiz ke seluruh aplikasi */}
      <QuizProvider>
        {/* Router: Mengelola navigasi antar halaman */}
        <Router>
          {/* Routes: Mendefinisikan semua route dalam aplikasi */}
          <Routes>
            {/* Route untuk halaman login (/) */}
            <Route path="/" element={<LoginPage />} />

            {/* Route untuk halaman register (/register) */}
            <Route path="/register" element={<RegisterPage />} />

            {/* Route untuk halaman quiz (/quiz) - Protected */}
            {/* Hanya bisa diakses jika user sudah login */}
            <Route
              path="/quiz"
              element={
                <ProtectedRoute>
                  <QuizPage />
                </ProtectedRoute>
              }
            />

            {/* Route untuk halaman hasil (/result) - Protected */}
            {/* Hanya bisa diakses jika user sudah login */}
            <Route
              path="/result"
              element={
                <ProtectedRoute>
                  <ResultPage />
                </ProtectedRoute>
              }
            />

            {/* Redirect semua route yang tidak terdaftar ke halaman login */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </QuizProvider>
    </AuthProvider>
  );
}

export default App;
