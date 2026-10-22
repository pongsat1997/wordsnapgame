'use client';

import { useState } from 'react';

const MODES = [
  { id: 'abbreviation', icon: '⚡', title: 'Abbreviation Snap', desc: 'พิมพ์ชื่อเต็มจากคำย่อ' },
  { id: 'definition', icon: '🎯', title: 'Definition Match', desc: 'เลือกคำตอบจาก 4 ตัวเลือก' },
  { id: 'speed', icon: '⏱️', title: 'Speed Round', desc: 'ตอบให้ได้มากที่สุดใน 60 วินาที' },
];

const CATEGORIES = [
  { id: 'all', label: '🌟 ทั้งหมด', cls: 'cat-all' },
  { id: 'hardware', label: '🔧 Hardware', cls: 'cat-hardware' },
  { id: 'software', label: '💻 Software', cls: 'cat-software' },
  { id: 'networking', label: '🌐 Network', cls: 'cat-networking' },
  { id: 'programming', label: '💾 Program', cls: 'cat-programming' },
];

const DIFFICULTIES = [
  { id: 'easy', label: '🟢 Easy', cls: 'diff-easy' },
  { id: 'medium', label: '🟡 Medium', cls: 'diff-medium' },
  { id: 'hard', label: '🔴 Hard', cls: 'diff-hard' },
];

export default function HomeScreen({ onStart, onLeaderboard, gameConfig, setGameConfig }) {
  const [playerName, setPlayerName] = useState(gameConfig.playerName || '');

  function handleStart() {
    const name = playerName.trim() || 'Player';
    const config = { ...gameConfig, playerName: name };
    setGameConfig(config);
    onStart(config);
  }

  function updateConfig(key, value) {
    setGameConfig(prev => ({ ...prev, [key]: value }));
  }

  const canStart = true;

  return (
    <div className="home-screen">
      {/* Logo */}
      <div className="logo-section">
        <span className="logo-icon">⚡</span>
        <h1 className="logo-title">WordSnap</h1>
        <p className="logo-subtitle">Computer Vocabulary Quiz</p>
      </div>

      {/* Player Name */}
      <div className="player-section">
        <div className="player-input-wrapper">
          <span className="player-input-icon">👤</span>
          <input
            id="player-name-input"
            type="text"
            className="player-input"
            placeholder="ใส่ชื่อผู้เล่น..."
            value={playerName}
            onChange={e => setPlayerName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleStart()}
            maxLength={20}
          />
        </div>
      </div>

      {/* Game Modes */}
      <div className="modes-grid">
        {MODES.map(mode => (
          <div
            key={mode.id}
            id={`mode-${mode.id}`}
            className={`glass-card mode-card ${gameConfig.mode === mode.id ? 'selected' : ''}`}
            onClick={() => updateConfig('mode', mode.id)}
          >
            <span className="mode-icon">{mode.icon}</span>
            <div className="mode-title">{mode.title}</div>
            <div className="mode-desc">{mode.desc}</div>
          </div>
        ))}
      </div>

      {/* Settings */}
      <div className="settings-row">
        <div className="setting-group">
          <div className="setting-label">หมวดหมู่</div>
          <div className="setting-options">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                id={`cat-${cat.id}`}
                className={`setting-btn ${cat.cls} ${gameConfig.category === cat.id ? 'active' : ''}`}
                onClick={() => updateConfig('category', cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
        <div className="setting-group">
          <div className="setting-label">ระดับความยาก</div>
          <div className="setting-options">
            {DIFFICULTIES.map(diff => (
              <button
                key={diff.id}
                id={`diff-${diff.id}`}
                className={`setting-btn ${diff.cls} ${gameConfig.difficulty === diff.id ? 'active' : ''}`}
                onClick={() => updateConfig('difficulty', diff.id)}
              >
                {diff.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Start Button */}
      <button
        id="start-game-btn"
        className="start-btn"
        onClick={handleStart}
        disabled={!canStart}
      >
        <span>🚀 เริ่มเกม</span>
      </button>

      {/* Leaderboard */}
      <button
        id="leaderboard-btn"
        className="nav-btn leaderboard-link"
        onClick={onLeaderboard}
      >
        🏆 Leaderboard
      </button>
    </div>
  );
}
