// Import hooks dan components
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../contexts/QuizContext';
import { useAuth } from '../contexts/AuthContext';

// Komponen halaman hasil quiz
const ResultPage = () => {
  // Hook untuk navigasi
  const navigate = useNavigate();

  // Ambil user dari Auth Context
  const { currentUser, signOut } = useAuth();

  // Ambil state dari Quiz Context
  const { userAnswers, questions, resetQuiz } = useQuiz();

  // Hitung statistik hasil quiz
  // Jumlah jawaban benar
  const correctAnswers = userAnswers.filter((answer) => answer.isCorrect).length;

  // Jumlah jawaban salah
  const wrongAnswers = userAnswers.filter((answer) => !answer.isCorrect).length;

  // Total pertanyaan yang dijawab
  const totalAnswered = userAnswers.length;

  // Total pertanyaan keseluruhan
  const totalQuestions = questions.length;

  // Hitung persentase (skor)
  const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  // FUNGSI: Handle mulai quiz baru
  const handleStartNewQuiz = async () => {
    // Reset semua state quiz
    resetQuiz();

    // Navigasi kembali ke halaman quiz
    navigate('/quiz');
  };

  // FUNGSI: Handle logout
  const handleLogout = async () => {
    try {
      // Reset quiz sebelum logout
      resetQuiz();

      // Logout dari Firebase
      await signOut();

      // Navigasi ke halaman login
      navigate('/');
    } catch (error) {
      console.error('Error logout:', error);
    }
  };

  // FUNGSI: Decode HTML entities
  const decodeHtml = (html: string): string => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  // FUNGSI: Tentukan pesan berdasarkan skor
  const getMessage = () => {
    if (percentage >= 80) {
      return {
        text: 'Luar Biasa!',
        emoji: '🎉',
        color: 'text-green-600',
      };
    } else if (percentage >= 60) {
      return {
        text: 'Bagus!',
        emoji: '👍',
        color: 'text-blue-600',
      };
    } else if (percentage >= 40) {
      return {
        text: 'Cukup Baik',
        emoji: '😊',
        color: 'text-yellow-600',
      };
    } else {
      return {
        text: 'Tetap Semangat!',
        emoji: '💪',
        color: 'text-orange-600',
      };
    }
  };

  const message = getMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 p-4">
      {/* Header dengan info user */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="bg-white rounded-xl shadow-lg p-4 flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center space-x-3">
            <img
              src={currentUser?.photoURL || 'https://via.placeholder.com/40'}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold text-gray-800">
                {currentUser?.displayName}
              </p>
              <button
                onClick={handleLogout}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Card hasil */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header hasil */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{message.emoji}</div>
            <h1 className={`text-4xl font-bold ${message.color} mb-2`}>
              {message.text}
            </h1>
            <p className="text-gray-600">Quiz telah selesai</p>
          </div>

          {/* Skor besar */}
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-br from-blue-500 to-blue-700 rounded-full w-40 h-40 flex items-center justify-center shadow-xl">
              <div className="text-white">
                <div className="text-5xl font-bold">{percentage}%</div>
                <div className="text-sm">Skor Anda</div>
              </div>
            </div>
          </div>

          {/* Statistik */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Jumlah benar */}
            <div className="bg-green-100 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {correctAnswers}
              </div>
              <div className="text-gray-700 font-medium">Jawaban Benar</div>
            </div>

            {/* Jumlah salah */}
            <div className="bg-red-100 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">
                {wrongAnswers}
              </div>
              <div className="text-gray-700 font-medium">Jawaban Salah</div>
            </div>

            {/* Jumlah dijawab */}
            <div className="bg-blue-100 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {totalAnswered}/{totalQuestions}
              </div>
              <div className="text-gray-700 font-medium">Terjawab</div>
            </div>
          </div>

          {/* Detail jawaban */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Review Jawaban
            </h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {userAnswers.map((answer, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border-2 ${
                    answer.isCorrect
                      ? 'border-green-300 bg-green-50'
                      : 'border-red-300 bg-red-50'
                  }`}
                >
                  {/* Pertanyaan */}
                  <div className="font-semibold text-gray-800 mb-2">
                    {index + 1}. {decodeHtml(answer.question)}
                  </div>

                  {/* Jawaban user */}
                  <div className="flex items-center space-x-2 mb-1">
                    <span
                      className={`font-medium ${
                        answer.isCorrect ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      Jawaban Anda:
                    </span>
                    <span className="text-gray-700">
                      {decodeHtml(answer.userAnswer)}
                    </span>
                    <span>
                      {answer.isCorrect ? '✅' : '❌'}
                    </span>
                  </div>

                  {/* Jawaban benar jika salah */}
                  {!answer.isCorrect && (
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-green-600">
                        Jawaban Benar:
                      </span>
                      <span className="text-gray-700">
                        {decodeHtml(answer.correctAnswer)}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tombol aksi */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleStartNewQuiz}
              className="flex-1 bg-blue-600 text-white font-semibold py-4 px-6 rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Mulai Quiz Baru
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 bg-gray-600 text-white font-semibold py-4 px-6 rounded-xl hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
