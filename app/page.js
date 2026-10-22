'use client';

import { useState, useEffect } from 'react';
import HomeScreen from './components/HomeScreen';
import GameScreen from './components/GameScreen';
import ResultsScreen from './components/ResultsScreen';
import LeaderboardScreen from './components/LeaderboardScreen';
import LoadingScreen from './components/LoadingScreen';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [screen, setScreen] = useState('home');
  const [vocabulary, setVocabulary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gameConfig, setGameConfig] = useState({
    playerName: '',
    mode: 'abbreviation',
    category: 'all',
    difficulty: 'medium',
  });
  const [gameResults, setGameResults] = useState(null);

  useEffect(() => {
    fetchVocabulary();
  }, []);

  async function fetchVocabulary() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('vocabulary')
        .select('*')
        .order('id');

      if (error) throw error;
      setVocabulary(data || []);
    } catch (err) {
      console.error('Error fetching vocabulary:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleStartGame(config) {
    setGameConfig(config);
    setScreen('game');
  }

  function handleGameEnd(results) {
    setGameResults(results);
    setScreen('results');
  }

  function handleGoHome() {
    setScreen('home');
    setGameResults(null);
  }

  function handlePlayAgain() {
    setScreen('game');
  }

  if (loading) {
    return (
      <div className="app-container">
        <LoadingScreen />
      </div>
    );
  }

  return (
    <div className="app-container">
      {screen === 'home' && (
        <HomeScreen
          onStart={handleStartGame}
          onLeaderboard={() => setScreen('leaderboard')}
          gameConfig={gameConfig}
          setGameConfig={setGameConfig}
        />
      )}
      {screen === 'game' && (
        <GameScreen
          config={gameConfig}
          vocabulary={vocabulary}
          onGameEnd={handleGameEnd}
          onQuit={handleGoHome}
        />
      )}
      {screen === 'results' && (
        <ResultsScreen
          results={gameResults}
          config={gameConfig}
          onPlayAgain={handlePlayAgain}
          onHome={handleGoHome}
          onLeaderboard={() => setScreen('leaderboard')}
        />
      )}
      {screen === 'leaderboard' && (
        <LeaderboardScreen
          onBack={handleGoHome}
        />
      )}
    </div>
  );
}
