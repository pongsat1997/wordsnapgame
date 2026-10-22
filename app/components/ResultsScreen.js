'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ResultsScreen({ results, config, onPlayAgain, onHome, onLeaderboard }) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(true);

  const {
    score, correctCount, totalQuestions, maxStreak, wrongAnswers, timeSpent,
    playerName, mode, category, difficulty,
  } = results;

  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // Save to leaderboard
  useEffect(() => {
    async function saveScore() {
      try {
        const { error } = await supabase.from('leaderboard').insert({
          player_name: playerName || 'Player',
          score,
          mode,
          category,
          difficulty,
          total_questions: totalQuestions,
          correct_answers: correctCount,
          max_streak: maxStreak,
          time_spent: timeSpent,
        });
        if (error) throw error;
        setSaved(true);
      } catch (err) {
        console.error('Error saving score:', err);
      } finally {
        setSaving(false);
      }
    }
    saveScore();
  }, []);

  function getResultEmoji() {
    if (accuracy >= 90) return '🏆';
    if (accuracy >= 70) return '🎉';
    if (accuracy >= 50) return '👍';
    if (accuracy >= 30) return '💪';
    return '📚';
  }

  function getResultTitle() {
    if (accuracy >= 90) return 'Outstanding!';
    if (accuracy >= 70) return 'Great Job!';
    if (accuracy >= 50) return 'Good Effort!';
    if (accuracy >= 30) return 'Keep Trying!';
    return 'Keep Learning!';
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  return (
    <div className="results-screen">
      {/* Header */}
      <div className="results-header">
        <span className="results-emoji">{getResultEmoji()}</span>
        <h2 className="results-title">{getResultTitle()}</h2>
      </div>

      {/* Score */}
      <div>
        <div className="results-score-big">{score}</div>
        <div className="results-score-label">คะแนนรวม</div>
      </div>

      {/* Stats */}
      <div className="results-stats">
        <div className="glass-card stat-card">
          <div className="stat-value">{correctCount}/{totalQuestions}</div>
          <div className="stat-label">ตอบถูก</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-value" style={{ color: accuracy >= 70 ? 'var(--emerald)' : accuracy >= 40 ? 'var(--amber)' : 'var(--rose)' }}>
            {accuracy}%
          </div>
          <div className="stat-label">ความแม่นยำ</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-value" style={{ color: 'var(--amber)' }}>
            🔥 {maxStreak}
          </div>
          <div className="stat-label">Streak สูงสุด</div>
        </div>
      </div>

      {/* Time */}
      <div className="glass-card stat-card" style={{ width: '100%' }}>
        <div className="stat-value">{formatTime(timeSpent)}</div>
        <div className="stat-label">เวลาที่ใช้</div>
      </div>

      {/* Wrong Answers Review */}
      {wrongAnswers.length > 0 && (
        <div className="wrong-answers-section">
          <div className="wrong-answers-title">📖 คำที่ตอบผิด — ลองจำไว้นะ!</div>
          {wrongAnswers.slice(0, 10).map((item, i) => (
            <div key={i} className="glass-card wrong-answer-item">
              <span className="wrong-answer-abbr">{item.abbreviation}</span>
              <span className="wrong-answer-full">{item.full_form}</span>
            </div>
          ))}
        </div>
      )}

      {/* Saving indicator */}
      {saving && (
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
          ⏳ กำลังบันทึกคะแนน...
        </p>
      )}
      {saved && (
        <p style={{ color: 'var(--emerald)', fontSize: 13 }}>
          ✅ บันทึกคะแนนแล้ว!
        </p>
      )}

      {/* Actions */}
      <div className="results-actions">
        <button id="play-again-btn" className="btn-primary" onClick={onPlayAgain}>
          🔄 เล่นอีกครั้ง
        </button>
        <button id="home-btn" className="btn-secondary" onClick={onHome}>
          🏠 หน้าหลัก
        </button>
      </div>

      <button className="nav-btn" onClick={onLeaderboard} style={{ marginTop: 4 }}>
        🏆 ดู Leaderboard
      </button>
    </div>
  );
}
