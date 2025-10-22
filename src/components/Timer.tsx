/**
 * ==============================================
 * TIMER COMPONENT - VERCEL-INSPIRED DESIGN
 * ==============================================
 *
 * FITUR UTAMA:
 * - Countdown timer yang real-time untuk quiz
 * - Auto-decrement setiap detik menggunakan setInterval
 * - Format display: MM:SS untuk readability
 * - Visual feedback berdasarkan waktu tersisa (color coding)
 * - Automatic cleanup untuk prevent memory leaks
 *
 * UI/UX DESIGN:
 * - Minimalist monochrome design (Vercel-style)
 * - Color transitions dari hijau -> kuning -> merah
 * - Smooth animations untuk state changes
 * - Icon clock untuk visual clarity
 * - Compact size tapi highly visible
 *
 * TECHNICAL IMPLEMENTATION:
 * - useEffect hook untuk interval management
 * - Proper cleanup dengan clearInterval
 * - Dependencies array untuk re-render optimization
 * - Context integration untuk global state
 *
 * COLOR LOGIC:
 * - Time > 60s: Green (safe zone)
 * - Time 30-60s: Orange/Yellow (warning)
 * - Time < 30s: Red (critical)
 */

import { useEffect } from 'react';
import { useQuiz } from '../contexts/QuizContext';
import { Clock } from 'lucide-react';

// Komponen Timer untuk menampilkan dan mengelola countdown
const Timer = () => {
  // Ambil state dan fungsi dari Quiz Context
  const { timeRemaining, decrementTime, isQuizActive } = useQuiz();

  // useEffect untuk menjalankan countdown timer
  // Akan berjalan setiap detik selama quiz aktif
  useEffect(() => {
    // Hanya jalankan timer jika quiz sedang aktif dan waktu masih ada
    if (!isQuizActive || timeRemaining <= 0) {
      return;
    }

    // Set interval untuk mengurangi waktu setiap 1000ms (1 detik)
    const timerId = setInterval(() => {
      decrementTime(); // Panggil fungsi untuk mengurangi waktu
    }, 1000);

    // Cleanup function: hapus interval saat component unmount
    // atau saat dependency berubah
    // Ini penting untuk mencegah memory leak
    return () => {
      clearInterval(timerId);
    };
  }, [isQuizActive, timeRemaining, decrementTime]);

  // FUNGSI: Konversi detik menjadi format MM:SS
  // Contoh: 125 detik -> "02:05"
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60); // Hitung menit
    const remainingSeconds = seconds % 60; // Hitung sisa detik

    // Tambahkan leading zero jika perlu (contoh: 5 -> "05")
    const minutesStr = minutes.toString().padStart(2, '0');
    const secondsStr = remainingSeconds.toString().padStart(2, '0');

    return `${minutesStr}:${secondsStr}`;
  };

  // Dynamic styling based on remaining time - Vercel minimalist approach
  const getTimerStyle = () => {
    if (timeRemaining < 30) {
      // Critical: Red dengan urgency
      return {
        text: 'text-red-600',
        bg: 'bg-red-50',
        border: 'border-red-200',
      };
    } else if (timeRemaining < 60) {
      // Warning: Orange untuk attention
      return {
        text: 'text-orange-600',
        bg: 'bg-orange-50',
        border: 'border-orange-200',
      };
    }
    // Safe: Black untuk normal state (Vercel style)
    return {
      text: 'text-black',
      bg: 'bg-gray-50',
      border: 'border-gray-200',
    };
  };

  const timerStyle = getTimerStyle();

  return (
    // Timer Container - Vercel minimalist dengan subtle border
    <div
      className={`${timerStyle.bg} ${timerStyle.border} border px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-all duration-300 shadow-sm`}
    >
      {/* Clock Icon - Lucide React */}
      <Clock className={`w-4 h-4 ${timerStyle.text}`} />

      {/* Time Display - Large dan readable */}
      <span className={`${timerStyle.text} font-semibold text-sm tabular-nums`}>
        {formatTime(timeRemaining)}
      </span>
    </div>
  );
};

export default Timer;
