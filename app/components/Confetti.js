'use client';

import { useEffect, useState } from 'react';

const COLORS = ['#00d4ff', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#f43f5e', '#ffd700'];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

export default function Confetti() {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    const newPieces = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: randomBetween(0, 100),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: randomBetween(6, 12),
      duration: randomBetween(1, 2.5),
      delay: randomBetween(0, 0.5),
      rotation: randomBetween(0, 360),
      shape: Math.random() > 0.5 ? 'square' : 'circle',
    }));
    setPieces(newPieces);
  }, []);

  return (
    <div className="confetti-container">
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.shape === 'circle' ? p.size : p.size * 1.5,
            backgroundColor: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : '2px',
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}
