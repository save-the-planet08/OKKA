import React, { useState, useEffect } from 'react';
import GamePlayer from './components/GamePlayer';
import logoImage from '../logo/logo.png';

const App = () => {
  const [currentView, setCurrentView] = useState('home');
  const [currentGame, setCurrentGame] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Hash routing for direct game access
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash && games[hash]) {
        handleGameClick(hash);
      } else if (!hash) {
        setCurrentView('home');
        setCurrentGame(null);
      }
    };
    
    handleHashChange(); // Check initial hash
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const games = {
    tetris: {
      title: "Tetris",
      category: "puzzle",
      description: "Klassisches Puzzle-Spiel",
      emoji: "🎮"
    },
    snake: {
      title: "Snake",
      category: "arcade",
      description: "Steuere die Schlange",
      emoji: "🐍"
    },
    pong: {
      title: "Pong",
      category: "arcade",
      description: "Retro Ping-Pong",
      emoji: "🏓"
    },
    breakout: {
      title: "Breakout",
      category: "action",
      description: "Zerstöre alle Blöcke",
      emoji: "🧱"
    },
    pacman: {
      title: "Pac-Man",
      category: "arcade",
      description: "Sammle alle Punkte",
      emoji: "🟡"
    },
    spaceinvaders: {
      title: "Space Invaders",
      category: "action",
      description: "Verteidige die Erde",
      emoji: "👾"
    },
    asteroids: {
      title: "Asteroids",
      category: "action",
      description: "Zerstöre die Asteroiden",
      emoji: "🚀"
    },
    frogger: {
      title: "Frogger",
      category: "arcade",
      description: "Überquere die Straße",
      emoji: "🐸"
    },
    doodle: {
      title: "Doodle Jump",
      category: "arcade",
      description: "Springe so hoch wie möglich",
      emoji: "🦘"
    },
    flappybird: {
      title: "Flying Bird",
      category: "arcade",
      description: "Fliege durch die Rohre",
      emoji: "🐦"
    },
    slither: {
      title: "Snake Battle",
      category: "action",
      description: "Multiplayer Snake mit Waffen",
      emoji: "🐍"
    },
    subway: {
      title: "Train Runner",
      category: "action",
      description: "Endlos-Läufer durch die U-Bahn",
      emoji: "🚇"
    },
    rider: {
      title: "Stunt Driver",
      category: "action",
      description: "Auto-Stunts mit Loopings",
      emoji: "🏎️"
    },
    hillclimb: {
      title: "Mountain Racer",
      category: "action",
      description: "Bergauf-Rennen mit Physik",
      emoji: "🏔️"
    },
    mario: {
      title: "Super Jumper",
      category: "arcade",
      description: "Klassisches Jump'n'Run",
      emoji: "🍄"
    },
    duckhunt: {
      title: "Bird Hunter",
      category: "action",
      description: "Enten jagen mit der Maus",
      emoji: "🦆"
    },
    casino: {
      title: "Casino Slot Machine",
      category: "puzzle",
      description: "Klassischer Spielautomat",
      emoji: "🎰"
    },
    blackjack: {
      title: "Blackjack",
      category: "puzzle",
      description: "Kartenspiel gegen den Dealer",
      emoji: "🃏"
    },
    stack: {
      title: "Stack",
      category: "arcade",
      description: "Baue den höchsten Turm",
      emoji: "🏗️"
    },
    tripwire: {
      title: "Tripwire Hook",
      category: "action",
      description: "Schwinge durch die Wolkenkratzer",
      emoji: "🪝"
    },
    basejump: {
      title: "Base Jump",
      category: "action",
      description: "Springe vom Turm und überlebe",
      emoji: "🪂"
    },
    clickspeed: {
      title: "Click Speed Test",
      category: "puzzle",
      description: "Teste deine Klickgeschwindigkeit",
      emoji: "⚡"
    },
    longjump: {
      title: "Long Jump",
      category: "action",
      description: "Springe so weit wie möglich",
      emoji: "🏃"
    },
    pvpcombat: {
      title: "PvP Combat",
      category: "action",
      description: "Zwei-Spieler Kampf Arena",
      emoji: "⚔️"
    },
    boxing: {
      title: "Boxing Champion",
      category: "action",
      description: "Kämpfe dich zum Box-Champion",
      emoji: "🥊"
    },
    redbirds: {
      title: "Red Birds",
      category: "action",
      description: "Zerstöre Türme und eliminiere Schweine",
      emoji: "🐦"
    },
    headdriver: {
      title: "Head Driver Battle",
      category: "action",
      description: "Zwei-Spieler Auto-Kampf Arena",
      emoji: "🏎️"
    },
    battlesnake: {
      title: "Battle Snake IO",
      category: "action",
      description: "Zwei-Spieler Snake Schlacht Arena",
      emoji: "🐍"
    },
    bikerunner: {
      title: "Bike City Runner",
      category: "action",
      description: "Fahrrad-Endlos-Läufer durch die Stadt",
      emoji: "🚴"
    },
    boatcombat: {
      title: "Boat Combat",
      category: "action",
      description: "Epische Seeschlacht mit Power-ups",
      emoji: "⛵"
    },
    tabletennis: {
      title: "Table Tennis",
      category: "action",
      description: "Tischtennis mit speziellen Fähigkeiten",
      emoji: "🏓"
    }
  };

  const categories = [
    { id: 'all', name: 'Alle Spiele' },
    { id: 'action', name: 'Action' },
    { id: 'puzzle', name: 'Puzzle' },
    { id: 'arcade', name: 'Arcade' }
  ];

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleGameClick = (gameId) => {
    setCurrentGame(gameId);
    setCurrentView('game');
  };

  const handleBackToGames = () => {
    setCurrentView('home');
    setCurrentGame(null);
  };

  const getFilteredGames = () => {
    if (selectedCategory === 'all') {
      return games;
    }
    return Object.keys(games)
      .filter(key => games[key].category === selectedCategory)
      .reduce((obj, key) => {
        obj[key] = games[key];
        return obj;
      }, {});
  };

  return (
    <div className="container">
      {/* Werbung oben */}
      <div className="ad-top">
        <div className="ad-placeholder">Werbung (728x90)</div>
      </div>

      {/* Header mit OKKA-Logo */}
      <header className="header">
        <div className="logo" onClick={() => {setCurrentView('home'); setCurrentGame(null);}}>
          <img src={logoImage} alt="OKKA Logo" className="logo-image" />
          <h1>OKKA</h1>
          <p>Online-Spiele. Kostenlos. Keine Anmeldung.</p>
          <span className="logo-claim">Tausend und ein Spiel. Nur hier.</span>
        </div>
        <nav className="nav">
          {categories.map(category => (
            <a
              key={category.id}
              onClick={() => {handleCategoryClick(category.id); setCurrentView('home'); setCurrentGame(null);}}
              className={selectedCategory === category.id ? 'active' : ''}
            >
              {category.name}
            </a>
          ))}
          <button className="theme-toggle" onClick={toggleDarkMode}>
            {darkMode ? '☀️' : '🌙'}
          </button>
        </nav>
      </header>

      {/* Hauptbereich mit Seitenwerbung */}
      <div className="main-content">
        {/* Linke Seitenwerbung */}
        <div className="ad-left">
          <div className="ad-placeholder vertical">Werbung<br/>(160x600)</div>
        </div>

        {/* Spielbereich */}
        <div className="game-area">
          {currentView === 'home' ? (
            <>
              {/* Hero-Bereich */}
              <div className="hero-section">
                <div className="hero-claim">Über 1000 Spiele kostenlos spielen!</div>
                <div className="hero-buttons">
                  <button className="hero-button" onClick={() => handleCategoryClick('all')}>
                    Alle Spiele
                  </button>
                  <button className="hero-button secondary" onClick={() => {
                    const gameIds = Object.keys(games);
                    const randomGame = gameIds[Math.floor(Math.random() * gameIds.length)];
                    handleGameClick(randomGame);
                  }}>
                    Zufallsspiel
                  </button>
                  <button className="hero-button" onClick={() => {
                    const gameIds = Object.keys(games);
                    const randomGame = gameIds[Math.floor(Math.random() * gameIds.length)];
                    handleGameClick(randomGame);
                  }}>
                    Jetzt starten
                  </button>
                </div>
              </div>

              {/* Spieleliste */}
              <div id="game-list" className="game-list">
                <h2>Beliebte Spiele</h2>
                <div className="games-grid">
                  {Object.entries(getFilteredGames()).map(([gameId, game]) => (
                    <div key={gameId} className="game-card" onClick={() => handleGameClick(gameId)}>
                      <div className="game-thumbnail">{game.emoji}</div>
                      <h3>{game.title}</h3>
                      <p>{game.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Spielcontainer */}
              <div id="game-container" className="game-container">
                <div className="game-header">
                  <button onClick={handleBackToGames} className="back-button">
                    ← Zurück zur Spieleliste
                  </button>
                  <h2 id="current-game-title">{games[currentGame]?.title}</h2>
                </div>
                <div id="game-frame" className="game-frame">
                  <GamePlayer 
                    gameId={currentGame}
                    gameData={games[currentGame]}
                    onBackClick={handleBackToGames}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Rechte Seitenwerbung */}
        <div className="ad-right">
          <div className="ad-placeholder vertical">Werbung<br/>(160x600)</div>
        </div>
      </div>

      {/* Werbung unten */}
      <div className="ad-bottom">
        <div className="ad-placeholder">Werbung (728x90)</div>
      </div>

      {/* Footer mit OKKA-Branding */}
      <footer className="footer">
        <img src={logoImage} alt="OKKA Miniatur Logo" className="footer-logo" />
        <div className="footer-text">
          Die beste Gaming-Plattform für kostenlose Online-Spiele
        </div>
        <div className="footer-copyright">
          © 2024 OKKA - Tausend und ein Spiel. Nur hier.
        </div>
      </footer>
    </div>
  );
};

export default App;