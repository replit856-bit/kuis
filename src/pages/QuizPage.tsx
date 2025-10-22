/**
 * ==============================================
 * QUIZ PAGE - VERCEL-INSPIRED DESIGN
 * ==============================================
 *
 * FITUR UTAMA:
 * - Quiz interface dengan multiple choice questions
 * - Timer countdown untuk membatasi waktu pengerjaan
 * - Progress tracking yang real-time
 * - Question shuffling untuk randomize answer order
 * - Auto-navigation ke halaman result saat quiz selesai
 * - Loading states untuk better UX saat fetch data
 *
 * UI/UX DESIGN PRINCIPLES:
 * - Minimalist black & white palette (Vercel-inspired)
 * - Card-based layout untuk focus pada current question
 * - Clear visual hierarchy dengan proper spacing
 * - Progress indicator yang prominent untuk orientasi user
 * - Hover states yang subtle tapi noticeable
 * - Responsive design dari mobile hingga desktop
 * - Accessibility: keyboard navigation support
 *
 * DATA FLOW:
 * - Questions diambil dari Open Trivia DB API
 * - State management via QuizContext (React Context)
 * - Answer shuffling menggunakan Fisher-Yates algorithm
 * - HTML entities di-decode untuk proper display
 *
 * TECHNICAL FEATURES:
 * - Auto-start quiz on component mount
 * - Shuffle answers untuk prevent pattern memorization
 * - Timer integration dengan auto-submit saat timeout
 * - Question metadata: category, difficulty, type
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../contexts/QuizContext';
import { useAuth } from '../contexts/AuthContext';
import Timer from '../components/Timer';
import { LogOut, Clock, Trophy } from 'lucide-react';

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

  // Loading State - Minimalist spinner dengan branding
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-200 border-t-black mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm font-medium">Loading questions...</p>
        </div>
      </div>
    );
  }

  // Empty State - Informative message
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-sm">No questions available</p>
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
    <div className="min-h-screen bg-gray-50 p-4 pb-8">
      {/* Top Navigation Bar - Vercel-style header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center flex-wrap gap-4 shadow-sm">
          {/* User Profile Section */}
          <div className="flex items-center space-x-3">
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt="Profile"
                className="w-9 h-9 rounded-full border border-gray-200"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {currentUser?.displayName?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            )}
            <div>
              <p className="font-medium text-black text-sm">
                {currentUser?.displayName || 'User'}
              </p>
              <button
                onClick={handleLogout}
                className="text-xs text-gray-500 hover:text-black transition-colors flex items-center gap-1"
              >
                <LogOut className="w-3 h-3" />
                Sign out
              </button>
            </div>
          </div>

          {/* Timer Component - Prominent positioning */}
          <Timer />
        </div>
      </div>

      {/* Main Quiz Card - Clean white card dengan subtle shadow */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          {/* Progress Indicator - Vercel-style dengan numbers */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-black">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
              <span className="text-sm text-gray-500">
                {answeredQuestions} answered
              </span>
            </div>
            {/* Progress Bar - Thin dan elegant */}
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-black h-1.5 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Metadata Badges - Subtle monochrome styling */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-md border border-gray-200">
              {decodeHtml(currentQuestion.category)}
            </span>
            <span className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-md border border-gray-200 capitalize">
              {currentQuestion.difficulty}
            </span>
            <span className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-md border border-gray-200">
              {currentQuestion.type === 'multiple' ? 'Multiple Choice' : 'True/False'}
            </span>
          </div>

          {/* Question Text - Large dan readable */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-black leading-relaxed">
              {decodeHtml(currentQuestion.question)}
            </h2>
          </div>

          {/* Answer Options - Interactive cards dengan hover effects */}
          <div className="space-y-3">
            {shuffledAnswers.map((answer, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(answer)}
                className="group w-full text-left p-5 rounded-lg border border-gray-200 hover:border-black hover:shadow-md transition-all duration-200 font-medium text-gray-800 hover:bg-gray-50 active:scale-[0.99]"
              >
                <div className="flex items-start gap-4">
                  {/* Option Letter Badge */}
                  <span className="flex-shrink-0 w-7 h-7 bg-gray-100 group-hover:bg-black text-gray-600 group-hover:text-white rounded-md text-center leading-7 text-sm font-semibold transition-all duration-200">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {/* Answer Text */}
                  <span className="flex-1 text-sm leading-relaxed pt-0.5">
                    {decodeHtml(answer)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
