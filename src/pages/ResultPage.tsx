/**
 * ==============================================
 * RESULT PAGE - VERCEL-INSPIRED DESIGN
 * ==============================================
 *
 * FITUR UTAMA:
 * - Comprehensive quiz results dengan statistics
 * - Score calculation dengan percentage display
 * - Detailed answer review untuk learning opportunity
 * - Quick actions: restart quiz atau logout
 * - Motivational messaging berdasarkan performance
 *
 * UI/UX DESIGN PRINCIPLES:
 * - Celebration-focused design untuk positive reinforcement
 * - Clear data visualization dengan proper hierarchy
 * - Color-coded results (green untuk benar, red untuk salah)
 * - Scrollable review section untuk detailed feedback
 * - Responsive grid layout untuk statistics cards
 * - Vercel-inspired monochrome dengan accent colors minimal
 *
 * STATISTICS DISPLAYED:
 * - Overall percentage score
 * - Total correct answers
 * - Total wrong answers
 * - Questions answered vs total
 * - Question-by-question breakdown
 *
 * USER ACTIONS:
 * - Start new quiz: reset state dan fetch new questions
 * - Logout: clear auth dan kembali ke login
 */

import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../contexts/QuizContext';
import { useAuth } from '../contexts/AuthContext';
import { Trophy, RotateCcw, LogOut, CheckCircle2, XCircle } from 'lucide-react';

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

  // FUNGSI: Performance-based messaging untuk motivation
  const getMessage = () => {
    if (percentage >= 80) {
      return {
        title: 'Outstanding Performance!',
        subtitle: 'You have excellent knowledge',
        color: 'text-black',
        bgColor: 'bg-gray-50',
      };
    } else if (percentage >= 60) {
      return {
        title: 'Great Job!',
        subtitle: 'You did well on this quiz',
        color: 'text-black',
        bgColor: 'bg-gray-50',
      };
    } else if (percentage >= 40) {
      return {
        title: 'Good Effort!',
        subtitle: 'Keep practicing to improve',
        color: 'text-black',
        bgColor: 'bg-gray-50',
      };
    } else {
      return {
        title: 'Keep Learning!',
        subtitle: 'Every attempt makes you better',
        color: 'text-black',
        bgColor: 'bg-gray-50',
      };
    }
  };

  const message = getMessage();

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-8">
      {/* Top Navigation */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center shadow-sm">
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
          <Trophy className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Main Results Card */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          {/* Results Header - Vercel minimalist style */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-6">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h1 className={`text-3xl font-bold ${message.color} mb-2 tracking-tight`}>
              {message.title}
            </h1>
            <p className="text-gray-500 text-sm">{message.subtitle}</p>
          </div>

          {/* Score Display - Large prominent number */}
          <div className="text-center mb-10">
            <div className="inline-block bg-black rounded-2xl px-12 py-8 shadow-lg">
              <div className="text-white">
                <div className="text-6xl font-bold mb-2">{percentage}%</div>
                <div className="text-sm text-gray-300 uppercase tracking-wider">Your Score</div>
              </div>
            </div>
          </div>

          {/* Statistics Grid - Clean card layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {/* Correct Answers */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center hover:border-gray-300 transition-colors">
              <div className="flex justify-center mb-3">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-black mb-2">
                {correctAnswers}
              </div>
              <div className="text-gray-600 text-sm font-medium">Correct Answers</div>
            </div>

            {/* Wrong Answers */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center hover:border-gray-300 transition-colors">
              <div className="flex justify-center mb-3">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <div className="text-3xl font-bold text-black mb-2">
                {wrongAnswers}
              </div>
              <div className="text-gray-600 text-sm font-medium">Wrong Answers</div>
            </div>

            {/* Total Progress */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center hover:border-gray-300 transition-colors">
              <div className="flex justify-center mb-3">
                <Trophy className="w-8 h-8 text-gray-600" />
              </div>
              <div className="text-3xl font-bold text-black mb-2">
                {totalAnswered}/{totalQuestions}
              </div>
              <div className="text-gray-600 text-sm font-medium">Completed</div>
            </div>
          </div>

          {/* Answer Review Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-black mb-4">
              Review Answers
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {userAnswers.map((answer, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    answer.isCorrect
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  {/* Question */}
                  <div className="font-medium text-black text-sm mb-3">
                    {index + 1}. {decodeHtml(answer.question)}
                  </div>

                  {/* User Answer */}
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-xs font-medium text-gray-500 mt-0.5 min-w-[80px]">
                      Your answer:
                    </span>
                    <div className="flex items-center gap-2 flex-1">
                      <span className={`text-sm ${
                        answer.isCorrect ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {decodeHtml(answer.userAnswer)}
                      </span>
                      {answer.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                  </div>

                  {/* Correct Answer (shown if user was wrong) */}
                  {!answer.isCorrect && (
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-medium text-gray-500 mt-0.5 min-w-[80px]">
                        Correct:
                      </span>
                      <span className="text-sm text-green-700">
                        {decodeHtml(answer.correctAnswer)}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons - Clear CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
            <button
              onClick={handleStartNewQuiz}
              className="flex-1 bg-black text-white font-medium py-3 px-6 rounded-lg hover:bg-gray-800 transition-all duration-200 shadow-sm flex items-center justify-center gap-2 text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Start New Quiz
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 bg-white border border-gray-300 text-black font-medium py-3 px-6 rounded-lg hover:border-black hover:shadow-sm transition-all duration-200 flex items-center justify-center gap-2 text-sm"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
