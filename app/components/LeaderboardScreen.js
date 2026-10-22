'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const MODE_LABELS = {
  all: 'ทั้งหมด',
  abbreviation: '⚡ Abbreviation',
  definition: '🎯 Definition',
  speed: '⏱️ Speed',
};

export default function LeaderboardScreen({ onBack }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState('all');

  useEffect(() => {
    fetchLeaderboard();
  }, [filterMode]);

  async function fetchLeaderboard() {
    setLoading(true);
    try {
      let query = supabase
        .from('leaderboard')
        .select('*')
        .order('score', { ascending: false })
        .limit(50);

      if (filterMode !== 'all') {
        query = query.eq('mode', filterMode);
      }

      const { data, error } = await query;
      if (error) throw error;
      setEntries(data || []);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
  }

  function getRankDisplay(index) {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}`;
  }

  const modeEmoji = { abbreviation: '⚡', definition: '🎯', speed: '⏱️' };
  const diffEmoji = { easy: '🟢', medium: '🟡', hard: '🔴' };

  return (
    <div className="leaderboard-screen">
      {/* Header */}
      <div className="leaderboard-header">
        <h2 className="leaderboard-title">
          <span>🏆</span> Leaderboard
        </h2>
        <button className="nav-btn" onClick={onBack}>
          ← กลับ
        </button>
      </div>

      {/* Filters */}
      <div className="leaderboard-filters">
        {Object.entries(MODE_LABELS).map(([key, label]) => (
          <button
            key={key}
            className={`filter-btn ${filterMode === key ? 'active' : ''}`}
            onClick={() => setFilterMode(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="lb-empty">
          <div className="loader" style={{ margin: '0 auto 16px' }} />
          กำลังโหลด...
        </div>
      ) : entries.length === 0 ? (
        <div className="glass-card lb-empty">
          ยังไม่มีคะแนนในหมวดนี้<br />เล่นเกมเพื่อบันทึกคะแนนแรก! 🎮
        </div>
      ) : (
        <div className="leaderboard-list">
          {entries.map((entry, i) => (
            <div key={entry.id} className="glass-card lb-entry">
              <div className="lb-rank">{getRankDisplay(i)}</div>
              <div>
                <div className="lb-name">{entry.player_name}</div>
                <div className="lb-meta">
                  {modeEmoji[entry.mode] || ''} {entry.mode} • {diffEmoji[entry.difficulty] || ''} {entry.difficulty} • {entry.correct_answers}/{entry.total_questions} ถูก • 🔥{entry.max_streak} streak • {formatDate(entry.created_at)}
                </div>
              </div>
              <div className="lb-score">{entry.score}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
