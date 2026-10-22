'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Confetti from './Confetti';

const QUESTION_COUNT = 15;
const SPEED_ROUND_TIME = 60;

const TIME_LIMITS = { easy: 30, medium: 20, hard: 15 };
const HINTS_ALLOWED = { easy: 99, medium: 3, hard: 0 };

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function normalizeAnswer(str) {
  return str.trim().toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ');
}

function getHintText(fullForm) {
  return fullForm.split(' ').map(w => w[0] + '_ '.repeat(w.length - 1)).join(' ');
}

export default function GameScreen({ config, vocabulary, onGameEnd, onQuit }) {
  const { mode, category, difficulty, playerName } = config;

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null); // 'correct' | 'incorrect' | null
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTimeLeft, setTotalTimeLeft] = useState(SPEED_ROUND_TIME);
  const [choicesDisabled, setChoicesDisabled] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameStartTime] = useState(Date.now());

  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const speedTimerRef = useRef(null);
  const feedbackTimeoutRef = useRef(null);

  // Filter vocabulary based on config
  const getFilteredVocab = useCallback(() => {
    let filtered = vocabulary;
    if (category !== 'all') {
      filtered = filtered.filter(v => v.category === category);
    }
    if (difficulty !== 'easy') {
      // easy: only easy, medium: easy+medium, hard: all
      if (difficulty === 'medium') {
        filtered = filtered.filter(v => v.difficulty === 'easy' || v.difficulty === 'medium');
      }
      // hard: include all
    } else {
      filtered = filtered.filter(v => v.difficulty === 'easy');
    }
    return filtered;
  }, [vocabulary, category, difficulty]);

  // Generate questions
  useEffect(() => {
    const filtered = getFilteredVocab();
    if (filtered.length === 0) return;

    let shuffled = shuffleArray(filtered);
    
    if (mode === 'speed') {
      // Speed round: keep recycling, large pool
      setQuestions(shuffled);
    } else {
      setQuestions(shuffled.slice(0, Math.min(QUESTION_COUNT, shuffled.length)));
    }

    setTimeLeft(TIME_LIMITS[difficulty]);
  }, [getFilteredVocab, mode, difficulty]);

  // Per-question timer (not speed mode)
  useEffect(() => {
    if (mode === 'speed' || questions.length === 0 || feedback) return;

    setTimeLeft(TIME_LIMITS[difficulty]);
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [currentIndex, questions.length, mode, difficulty, feedback]);

  // Speed round global timer
  useEffect(() => {
    if (mode !== 'speed' || questions.length === 0) return;

    setTotalTimeLeft(SPEED_ROUND_TIME);
    speedTimerRef.current = setInterval(() => {
      setTotalTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(speedTimerRef.current);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(speedTimerRef.current);
  }, [questions.length, mode]);

  // Focus input
  useEffect(() => {
    if (inputRef.current && !feedback) {
      inputRef.current.focus();
    }
  }, [currentIndex, feedback]);

  function handleTimeUp() {
    if (mode === 'speed') return;
    processAnswer(false);
  }

  function getCurrentQuestion() {
    if (questions.length === 0) return null;
    const idx = mode === 'speed' ? currentIndex % questions.length : currentIndex;
    return questions[idx];
  }

  function getChoices(current) {
    if (!current) return [];
    const others = vocabulary
      .filter(v => v.id !== current.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    const choices = shuffleArray([current, ...others]);
    return choices;
  }

  const [choices, setChoices] = useState([]);

  useEffect(() => {
    if (mode === 'definition' && questions.length > 0) {
      const q = getCurrentQuestion();
      if (q) setChoices(getChoices(q));
    }
  }, [currentIndex, questions, mode]);

  function processAnswer(isCorrect, forceQuestion = null) {
    const question = forceQuestion || getCurrentQuestion();
    if (!question) return;

    clearInterval(timerRef.current);

    if (isCorrect) {
      const speedBonus = timeLeft > (TIME_LIMITS[difficulty] - 5) ? 20 : 0;
      const streakBonus = streak * 50;
      const hintPenalty = showHint ? 30 : 0;
      const points = 100 + streakBonus + speedBonus - hintPenalty;
      
      setScore(prev => prev + Math.max(points, 10));
      setStreak(prev => prev + 1);
      setMaxStreak(prev => Math.max(prev, streak + 1));
      setCorrectCount(prev => prev + 1);
      setFeedback('correct');
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500);
    } else {
      setStreak(0);
      setFeedback('incorrect');
      setShowCorrectAnswer(true);
      setWrongAnswers(prev => [...prev, question]);
      
      if (mode !== 'speed') {
        setLives(prev => prev - 1);
      }
    }

    feedbackTimeoutRef.current = setTimeout(() => {
      setFeedback(null);
      setShowCorrectAnswer(false);
      setAnswer('');
      setShowHint(false);
      setSelectedChoice(null);
      setChoicesDisabled(false);

      // Check game over conditions
      if (mode !== 'speed' && !isCorrect && lives <= 1) {
        endGame();
        return;
      }

      const nextIndex = currentIndex + 1;
      if (mode !== 'speed' && nextIndex >= questions.length) {
        endGame();
        return;
      }

      setCurrentIndex(nextIndex);
      
      if (mode === 'speed' && nextIndex >= questions.length) {
        setQuestions(prev => shuffleArray(prev));
        setCurrentIndex(0);
      }
    }, isCorrect ? 800 : 1800);
  }

  function handleSubmitAnswer(e) {
    e?.preventDefault();
    if (feedback || !answer.trim()) return;

    const question = getCurrentQuestion();
    if (!question) return;

    const isCorrect = normalizeAnswer(answer) === normalizeAnswer(question.full_form);
    processAnswer(isCorrect);
  }

  function handleChoiceClick(choice) {
    if (choicesDisabled || feedback) return;
    setChoicesDisabled(true);
    setSelectedChoice(choice.id);

    const question = getCurrentQuestion();
    const isCorrect = choice.id === question.id;
    processAnswer(isCorrect, question);
  }

  function handleHint() {
    if (hintsUsed >= HINTS_ALLOWED[difficulty]) return;
    setHintsUsed(prev => prev + 1);
    setShowHint(true);
  }

  function handleSkip() {
    if (feedback) return;
    processAnswer(false);
  }

  function endGame() {
    clearInterval(timerRef.current);
    clearInterval(speedTimerRef.current);
    clearTimeout(feedbackTimeoutRef.current);

    const totalQuestions = mode === 'speed' ? correctCount + wrongAnswers.length : questions.length;
    const timeSpent = Math.floor((Date.now() - gameStartTime) / 1000);

    onGameEnd({
      score,
      correctCount,
      totalQuestions,
      maxStreak: Math.max(maxStreak, streak),
      wrongAnswers,
      timeSpent,
      playerName,
      mode,
      category,
      difficulty,
    });
  }

  const question = getCurrentQuestion();
  if (!question) {
    return (
      <div className="game-screen">
        <div className="loading-screen">
          <div className="loader" />
          <p className="loading-text">ไม่มีคำศัพท์ในหมวดนี้</p>
          <button className="nav-btn" onClick={onQuit} style={{marginTop: 20}}>กลับหน้าหลัก</button>
        </div>
      </div>
    );
  }

  const progressPercent = mode === 'speed'
    ? 0
    : ((currentIndex) / questions.length) * 100;

  const timerPercent = mode === 'speed'
    ? (totalTimeLeft / SPEED_ROUND_TIME) * 100
    : (timeLeft / TIME_LIMITS[difficulty]) * 100;

  const categoryEmoji = {
    hardware: '🔧', software: '💻', networking: '🌐', programming: '💾'
  };

  return (
    <div className="game-screen">
      {showConfetti && <Confetti />}
      
      {feedback && (
        <div className="feedback-overlay">
          <div className={`feedback-text ${feedback}`}>
            {feedback === 'correct' ? '✓' : '✗'}
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="game-top-bar">
        <button className="nav-btn" onClick={onQuit}>✕</button>
        <div className="game-score">
          <span>⭐</span>
          <span>{score}</span>
        </div>
        <div className={`game-streak ${streak >= 2 ? 'visible' : ''}`}>
          🔥 {streak}x Streak
        </div>
        {mode !== 'speed' && (
          <div className="game-lives">
            {[1, 2, 3].map(i => (
              <span key={i} className={`heart ${i > lives ? 'lost' : ''} ${i === lives + 1 && feedback === 'incorrect' ? 'heart-lose-anim' : ''}`}>
                ❤️
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Speed Timer */}
      {mode === 'speed' && (
        <>
          <div className={`speed-timer-display ${totalTimeLeft <= 10 ? 'danger' : totalTimeLeft <= 20 ? 'warning' : ''}`}>
            {totalTimeLeft}s
          </div>
          <div className="speed-score-display">
            ตอบถูก <span>{correctCount}</span> ข้อ
          </div>
        </>
      )}

      {/* Progress */}
      {mode !== 'speed' && (
        <div className="game-progress-section">
          <div className="game-progress-info">
            <span>ข้อ {currentIndex + 1} / {questions.length}</span>
            <span>{timeLeft}s</span>
          </div>
          <div className="game-progress-bar">
            <div className="game-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      )}

      {/* Timer Bar */}
      <div className="game-timer-bar">
        <div
          className={`game-timer-fill ${timerPercent < 30 ? 'danger' : timerPercent < 50 ? 'warning' : ''}`}
          style={{ width: `${timerPercent}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="glass-card question-card" key={currentIndex}>
        <div className="question-category-badge">
          <span>{categoryEmoji[question.category] || '📦'}</span>
          <span>{question.category}</span>
        </div>

        {mode === 'definition' ? (
          <>
            <div className="question-label">คำนี้คืออะไร?</div>
            <div className="question-text">{question.abbreviation}</div>
            <div className="question-description-th">{question.description_th}</div>
          </>
        ) : (
          <>
            <div className="question-label">พิมพ์ชื่อเต็ม</div>
            <div className="question-text">{question.abbreviation}</div>
            <div className="question-description-th">{question.description_th}</div>
          </>
        )}

        {showHint && mode !== 'definition' && (
          <div className="question-hint">
            💡 {getHintText(question.full_form)}
          </div>
        )}
      </div>

      {/* Answer Section */}
      {mode === 'definition' ? (
        <div className="choices-grid">
          {choices.map(choice => (
            <button
              key={choice.id}
              className={`choice-btn ${
                selectedChoice === choice.id
                  ? choice.id === question.id ? 'correct' : 'incorrect'
                  : feedback && choice.id === question.id ? 'correct' : ''
              }`}
              onClick={() => handleChoiceClick(choice)}
              disabled={choicesDisabled}
            >
              {choice.full_form}
            </button>
          ))}
        </div>
      ) : (
        <form className="answer-section" onSubmit={handleSubmitAnswer}>
          <div className="answer-input-wrapper">
            <input
              ref={inputRef}
              id="answer-input"
              type="text"
              className={`answer-input ${feedback || ''}`}
              placeholder="พิมพ์คำตอบที่นี่..."
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              disabled={!!feedback}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        </form>
      )}

      {/* Show correct answer on wrong */}
      {showCorrectAnswer && (
        <div className="correct-answer-reveal">
          <p>คำตอบที่ถูกต้อง</p>
          <p>{question.full_form}</p>
        </div>
      )}

      {/* Actions */}
      {mode !== 'definition' && !feedback && (
        <div className="game-actions">
          {HINTS_ALLOWED[difficulty] > 0 && (
            <button
              className="hint-btn"
              onClick={handleHint}
              disabled={showHint || hintsUsed >= HINTS_ALLOWED[difficulty]}
            >
              💡 Hint ({HINTS_ALLOWED[difficulty] - hintsUsed})
            </button>
          )}
          <button className="skip-btn" onClick={handleSkip}>
            ข้าม →
          </button>
        </div>
      )}
    </div>
  );
}
