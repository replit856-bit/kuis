// Import hooks dari React dan Quiz Context
import { useEffect } from 'react';
import { useQuiz } from '../contexts/QuizContext';

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

  // Tentukan warna berdasarkan sisa waktu
  // Merah jika waktu < 30 detik, kuning jika < 60 detik, hijau jika lebih
  const getTimerColor = () => {
    if (timeRemaining < 30) {
      return 'text-red-600 bg-red-100'; // Merah untuk waktu kritis
    } else if (timeRemaining < 60) {
      return 'text-orange-600 bg-orange-100'; // Oranye untuk waktu menipis
    }
    return 'text-green-600 bg-green-100'; // Hijau untuk waktu aman
  };

  return (
    // Container timer dengan styling yang berubah sesuai sisa waktu
    <div
      className={`${getTimerColor()} px-6 py-3 rounded-full font-bold text-xl inline-flex items-center space-x-2 shadow-lg transition-all duration-300`}
    >
      {/* Icon jam */}
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>

      {/* Tampilkan waktu dalam format MM:SS */}
      <span>{formatTime(timeRemaining)}</span>
    </div>
  );
};

export default Timer;
