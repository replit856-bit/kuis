// Import hooks dan components
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../contexts/QuizContext';
import { useAuth } from '../contexts/AuthContext';
import Timer from '../components/Timer';

// Komponen halaman quiz
const QuizPage = () => {
  // Hook untuk navigasi
  const navigate = useNavigate();

  // Ambil user dari Auth Context
  const { currentUser, signOut } = useAuth();

  // Ambil state dan fungsi dari Quiz Context
  const {
    questions,
    currentQuestionIndex,
    userAnswers,
    isQuizActive,
    isQuizFinished,
    startQuiz,
    answerQuestion,
  } = useQuiz();

  // State lokal untuk loading saat fetch API
  const [isLoading, setIsLoading] = useState(false);

  // State untuk menyimpan pilihan jawaban yang sudah diacak
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);

  // useEffect: Redirect ke result jika quiz sudah selesai
  useEffect(() => {
    if (isQuizFinished) {
      navigate('/result');
    }
  }, [isQuizFinished, navigate]);

  // useEffect: Mulai quiz otomatis jika belum dimulai
  useEffect(() => {
    const initQuiz = async () => {
      // Jika quiz belum aktif dan tidak ada pertanyaan, mulai quiz baru
      if (!isQuizActive && questions.length === 0) {
        setIsLoading(true);
        await startQuiz();
        setIsLoading(false);
      }
    };

    initQuiz();
  }, []);

  // useEffect: Acak jawaban setiap kali pertanyaan berubah
  // Ini penting agar jawaban tidak selalu dalam urutan yang sama
  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      const currentQuestion = questions[currentQuestionIndex];

      // Gabungkan jawaban benar dan salah
      const allAnswers = [
        currentQuestion.correct_answer,
        ...currentQuestion.incorrect_answers,
      ];

      // Acak urutan jawaban menggunakan algoritma Fisher-Yates shuffle
      const shuffled = [...allAnswers].sort(() => Math.random() - 0.5);

      setShuffledAnswers(shuffled);
    }
  }, [questions, currentQuestionIndex]);

  // FUNGSI: Handle saat user memilih jawaban
  const handleAnswer = (answer: string) => {
    // Panggil fungsi answerQuestion dari context
    answerQuestion(answer);
  };

  // FUNGSI: Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error logout:', error);
    }
  };

  // FUNGSI: Decode HTML entities dari API
  // API mengembalikan text dengan HTML entities seperti &quot; &amp; dll
  const decodeHtml = (html: string): string => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  // Tampilkan loading saat fetch API
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">Memuat pertanyaan...</p>
        </div>
      </div>
    );
  }

  // Tampilkan pesan jika tidak ada pertanyaan
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <p className="text-gray-700 text-lg">Tidak ada pertanyaan tersedia</p>
        </div>
      </div>
    );
  }

  // Ambil pertanyaan saat ini
  const currentQuestion = questions[currentQuestionIndex];

  // Hitung total soal dan yang sudah dikerjakan
  const totalQuestions = questions.length;
  const answeredQuestions = userAnswers.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 p-4">
      {/* Header dengan info user dan timer */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="bg-white rounded-xl shadow-lg p-4 flex justify-between items-center flex-wrap gap-4">
          {/* Info user */}
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

          {/* Timer */}
          <Timer />
        </div>
      </div>

      {/* Card pertanyaan */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-600">
                Pertanyaan {currentQuestionIndex + 1} dari {totalQuestions}
              </span>
              <span className="text-sm font-semibold text-gray-600">
                Terjawab: {answeredQuestions}
              </span>
            </div>
            {/* Progress bar visual */}
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Badge kategori dan kesulitan */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
              {decodeHtml(currentQuestion.category)}
            </span>
            <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
              {currentQuestion.difficulty}
            </span>
            <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full">
              {currentQuestion.type === 'multiple' ? 'Multiple Choice' : 'True/False'}
            </span>
          </div>

          {/* Pertanyaan */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {decodeHtml(currentQuestion.question)}
            </h2>
          </div>

          {/* Pilihan jawaban */}
          <div className="space-y-3">
            {shuffledAnswers.map((answer, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(answer)}
                className="w-full text-left p-4 rounded-xl border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 font-medium text-gray-800 hover:shadow-md"
              >
                <span className="inline-block w-8 h-8 bg-blue-600 text-white rounded-full text-center leading-8 mr-3">
                  {String.fromCharCode(65 + index)}
                </span>
                {decodeHtml(answer)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
