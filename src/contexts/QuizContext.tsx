// Import React hooks
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Interface untuk tipe data pertanyaan dari API
export interface Question {
  category: string;
  type: string; // "multiple" atau "boolean" (true/false)
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

// Interface untuk jawaban user
export interface UserAnswer {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

// Interface untuk tipe data Quiz Context
interface QuizContextType {
  questions: Question[]; // Array pertanyaan dari API
  currentQuestionIndex: number; // Index pertanyaan yang sedang ditampilkan
  userAnswers: UserAnswer[]; // Array jawaban user
  timeRemaining: number; // Sisa waktu dalam detik
  isQuizActive: boolean; // Status apakah quiz sedang berlangsung
  isQuizFinished: boolean; // Status apakah quiz sudah selesai
  startQuiz: () => Promise<void>; // Fungsi untuk memulai quiz dan fetch API
  answerQuestion: (answer: string) => void; // Fungsi untuk menjawab pertanyaan
  decrementTime: () => void; // Fungsi untuk mengurangi waktu setiap detik
  finishQuiz: () => void; // Fungsi untuk mengakhiri quiz
  resetQuiz: () => void; // Fungsi untuk reset quiz ke awal
}

// Buat context untuk Quiz
const QuizContext = createContext<QuizContextType | undefined>(undefined);

// Hook custom untuk mengakses Quiz Context
export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz harus digunakan di dalam QuizProvider');
  }
  return context;
};

// Key untuk localStorage
const STORAGE_KEY = 'quizAppState';

// Waktu total quiz dalam detik (2 menit = 120 detik)
const TOTAL_QUIZ_TIME = 120;

// Provider component untuk Quiz
export const QuizProvider = ({ children }: { children: ReactNode }) => {
  // State untuk menyimpan array pertanyaan
  const [questions, setQuestions] = useState<Question[]>([]);

  // State untuk index pertanyaan saat ini (dimulai dari 0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // State untuk menyimpan semua jawaban user
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);

  // State untuk sisa waktu quiz (dalam detik)
  const [timeRemaining, setTimeRemaining] = useState(TOTAL_QUIZ_TIME);

  // State untuk menandakan apakah quiz sedang aktif
  const [isQuizActive, setIsQuizActive] = useState(false);

  // State untuk menandakan apakah quiz sudah selesai
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  // FUNGSI: Menyimpan state ke localStorage
  // Digunakan untuk resume quiz jika browser ditutup
  const saveToLocalStorage = () => {
    const state = {
      questions,
      currentQuestionIndex,
      userAnswers,
      timeRemaining,
      isQuizActive,
      isQuizFinished,
      timestamp: Date.now(), // Simpan timestamp untuk validasi
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  };

  // FUNGSI: Memuat state dari localStorage
  // Dipanggil saat aplikasi pertama kali dibuka
  const loadFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const state = JSON.parse(saved);

        // Hanya load jika quiz masih aktif dan belum selesai
        if (state.isQuizActive && !state.isQuizFinished) {
          setQuestions(state.questions || []);
          setCurrentQuestionIndex(state.currentQuestionIndex || 0);
          setUserAnswers(state.userAnswers || []);
          setTimeRemaining(state.timeRemaining || TOTAL_QUIZ_TIME);
          setIsQuizActive(true);
          setIsQuizFinished(false);
          return true;
        }
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
    return false;
  };

  // useEffect: Load data dari localStorage saat component pertama kali dimount
  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  // useEffect: Simpan state ke localStorage setiap kali ada perubahan
  // Hanya simpan jika quiz sedang aktif
  useEffect(() => {
    if (isQuizActive) {
      saveToLocalStorage();
    }
  }, [questions, currentQuestionIndex, userAnswers, timeRemaining, isQuizActive, isQuizFinished]);

  // FUNGSI: Fetch pertanyaan dari API dan mulai quiz
  const startQuiz = async () => {
    try {
      // Fetch data dari Open Trivia Database API
      // Parameter: amount=10 untuk mendapatkan 10 pertanyaan
      const response = await fetch('https://opentdb.com/api.php?amount=10');

      // Cek apakah response berhasil
      if (!response.ok) {
        throw new Error('Gagal mengambil data dari API');
      }

      // Parse response menjadi JSON
      const data = await response.json();

      // Cek apakah response code sukses (0 = sukses)
      if (data.response_code !== 0) {
        throw new Error('API mengembalikan error');
      }

      // Set questions dari hasil API
      setQuestions(data.results);

      // Reset state ke awal
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
      setTimeRemaining(TOTAL_QUIZ_TIME);
      setIsQuizActive(true);
      setIsQuizFinished(false);
    } catch (error) {
      console.error('Error fetching questions:', error);
      alert('Gagal memuat pertanyaan. Silakan coba lagi.');
    }
  };

  // FUNGSI: Menjawab pertanyaan
  const answerQuestion = (answer: string) => {
    // Ambil pertanyaan saat ini
    const currentQuestion = questions[currentQuestionIndex];

    // Cek apakah jawaban benar
    const isCorrect = answer === currentQuestion.correct_answer;

    // Buat object untuk jawaban user
    const userAnswer: UserAnswer = {
      question: currentQuestion.question,
      userAnswer: answer,
      correctAnswer: currentQuestion.correct_answer,
      isCorrect,
    };

    // Tambahkan jawaban ke array userAnswers
    setUserAnswers([...userAnswers, userAnswer]);

    // Cek apakah ini pertanyaan terakhir
    if (currentQuestionIndex === questions.length - 1) {
      // Jika ya, selesaikan quiz
      finishQuiz();
    } else {
      // Jika tidak, pindah ke pertanyaan berikutnya
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // FUNGSI: Mengurangi waktu setiap detik
  // Dipanggil oleh Timer component setiap 1 detik
  const decrementTime = () => {
    setTimeRemaining((prev) => {
      // Jika waktu sudah habis, selesaikan quiz
      if (prev <= 1) {
        finishQuiz();
        return 0;
      }
      return prev - 1;
    });
  };

  // FUNGSI: Selesaikan quiz
  const finishQuiz = () => {
    setIsQuizActive(false);
    setIsQuizFinished(true);
  };

  // FUNGSI: Reset quiz ke awal
  // Menghapus data dari localStorage
  const resetQuiz = () => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setTimeRemaining(TOTAL_QUIZ_TIME);
    setIsQuizActive(false);
    setIsQuizFinished(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Value yang akan disediakan ke semua child components
  const value = {
    questions,
    currentQuestionIndex,
    userAnswers,
    timeRemaining,
    isQuizActive,
    isQuizFinished,
    startQuiz,
    answerQuestion,
    decrementTime,
    finishQuiz,
    resetQuiz,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};
