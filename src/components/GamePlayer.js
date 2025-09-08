import React, { useEffect, useRef, useState } from 'react';
import { getGameImplementation } from '../games/index.js';

// Universal Key Button Component
const KeyButton = ({ keyValue, label, pressedButtons, setPressedButtons }) => {
  const handleKeyPress = (type = 'keydown') => {
    const getKeyProperties = (key) => {
      switch(key) {
        case ' ': return { code: 'Space', keyCode: 32, which: 32 };
        case 'Enter': return { code: 'Enter', keyCode: 13, which: 13 };
        case 'Escape': return { code: 'Escape', keyCode: 27, which: 27 };
        case 'ArrowUp': return { code: 'ArrowUp', keyCode: 38, which: 38 };
        case 'ArrowDown': return { code: 'ArrowDown', keyCode: 40, which: 40 };
        case 'ArrowLeft': return { code: 'ArrowLeft', keyCode: 37, which: 37 };
        case 'ArrowRight': return { code: 'ArrowRight', keyCode: 39, which: 39 };
        case 'w': return { code: 'KeyW', keyCode: 87, which: 87 };
        case 'a': return { code: 'KeyA', keyCode: 65, which: 65 };
        case 's': return { code: 'KeyS', keyCode: 83, which: 83 };
        case 'd': return { code: 'KeyD', keyCode: 68, which: 68 };
        case 'q': return { code: 'KeyQ', keyCode: 81, which: 81 };
        case 'e': return { code: 'KeyE', keyCode: 69, which: 69 };
        case 'r': return { code: 'KeyR', keyCode: 82, which: 82 };
        case 't': return { code: 'KeyT', keyCode: 84, which: 84 };
        case 'x': return { code: 'KeyX', keyCode: 88, which: 88 };
        case 'z': return { code: 'KeyZ', keyCode: 90, which: 90 };
        case 'c': return { code: 'KeyC', keyCode: 67, which: 67 };
        case '1': return { code: 'Digit1', keyCode: 49, which: 49 };
        case '2': return { code: 'Digit2', keyCode: 50, which: 50 };
        case '3': return { code: 'Digit3', keyCode: 51, which: 51 };
        default: return { code: `Key${key.toUpperCase()}`, keyCode: key.charCodeAt(0), which: key.charCodeAt(0) };
      }
    };
    
    const keyProps = getKeyProperties(keyValue);
    const keyboardEvent = new KeyboardEvent(type, { 
      key: keyValue,
      code: keyProps.code,
      keyCode: keyProps.keyCode,
      which: keyProps.which,
      bubbles: true,
      cancelable: true
    });
    
    console.log(`Dispatching ${type} for key: ${keyValue} (${label})`);
    
    // Special handling for Enter key in PvP Combat - simulate click for game start
    if (keyValue === 'Enter' && type === 'keydown' && !document._pvpClickProcessed) {
      const canvas = document.querySelector('#gameCanvas');
      if (canvas && window.location.hash.includes('pvpcombat')) {
        document._pvpClickProcessed = true;
        setTimeout(() => {
          const rect = canvas.getBoundingClientRect();
          const clickEvent = new MouseEvent('click', {
            clientX: rect.left + 400,
            clientY: rect.top + 380,
            bubbles: true,
            cancelable: true
          });
          canvas.dispatchEvent(clickEvent);
          setTimeout(() => { document._pvpClickProcessed = false; }, 100);
        }, 10);
      }
    }
    
    // Dispatch to multiple targets to ensure games receive the event
    document.dispatchEvent(keyboardEvent);
    document.body.dispatchEvent(keyboardEvent);
    const canvas = document.querySelector('#gameCanvas');
    if (canvas) {
      canvas.dispatchEvent(keyboardEvent);
    }
    window.dispatchEvent(keyboardEvent);
  };
  
  const buttonStyle = {
    width: '35px',
    height: '35px',
    background: 'rgba(246, 128, 29, 0.7)',
    border: '1px solid rgba(61, 42, 26, 0.9)',
    borderRadius: '6px',
    color: 'white',
    fontSize: '11px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
    touchAction: 'manipulation',
    boxShadow: '1px 1px 0px rgba(61, 42, 26, 0.7)',
    transition: 'all 0.1s ease',
    margin: '1px'
  };
  
  return (
    <button 
      style={{
        ...buttonStyle,
        ...(pressedButtons && pressedButtons.has(keyValue) ? {
          transform: 'translate(1px, 1px)',
          boxShadow: '0px 0px 0px rgba(61, 42, 26, 0.7)',
          background: 'rgba(255, 154, 71, 0.9)'
        } : {})
      }}
      onTouchStart={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (setPressedButtons) setPressedButtons(prev => new Set(prev).add(keyValue));
        handleKeyPress();
        navigator.vibrate && navigator.vibrate(25);
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        if (setPressedButtons) setPressedButtons(prev => {
          const newSet = new Set(prev);
          newSet.delete(keyValue);
          return newSet;
        });
        handleKeyPress('keyup');
      }}
      onMouseDown={() => {
        if (setPressedButtons) setPressedButtons(prev => new Set(prev).add(keyValue));
        handleKeyPress();
      }}
      onMouseUp={() => {
        if (setPressedButtons) setPressedButtons(prev => {
          const newSet = new Set(prev);
          newSet.delete(keyValue);
          return newSet;
        });
        handleKeyPress('keyup');
      }}
    >
      {label}
    </button>
  );
};

const GamePlayer = ({ gameId, gameData }) => {
  const canvasRef = useRef(null);
  const [showControls, setShowControls] = useState(true);
  const [pressedButtons, setPressedButtons] = useState(new Set());
  
  // Minimalistic game-specific control mapping - only essential buttons
  const getGameControls = (gameId) => {
    switch(gameId) {
      case 'tetris': return ['←', '→', '↓', '↑', 'R']; // Move, rotate, restart
      case 'snake': return ['←', '→', '↑', '↓', 'R']; // Direction, restart
      case 'pacman': return ['←', '→', '↑', '↓', 'R']; // Direction, restart  
      case 'frogger': return ['←', '→', '↑', '↓', 'R']; // Direction, restart
      case 'pong': return ['↑', '↓', 'R']; // Paddle up/down, restart
      case 'breakout': return ['←', '→', 'R']; // Paddle left/right, restart
      case 'flappybird': return ['SPC', 'R']; // Jump, restart
      case 'doodle': return ['←', '→', 'R']; // Move left/right, restart
      case 'spaceinvaders': return ['←', '→', 'SPC', 'R']; // Move, shoot, restart
      case 'asteroids': return ['←', '→', '↑', 'SPC', 'R']; // Turn, thrust, shoot, restart
      case 'mario': return ['←', '→', 'SPC', 'R']; // Move, jump, restart
      case 'subway': return ['←', '→', '↑', '↓', 'R']; // Lane switch, jump/duck, restart
      case 'hillclimb': return ['←', '→', 'R']; // Accelerate/brake, restart
      case 'rider': return ['←', '→', 'R']; // Lean, restart
      case 'duckhunt': return ['R']; // Mouse game, only restart
      case 'pvpcombat': return ['W', 'A', 'S', 'D', '←', '→', '↑', '↓', 'SPC', 'ENT', 'R']; // Full combat controls
      case 'boxing': return ['←', '→', 'SPC', 'R']; // Move, punch, restart
      case 'casino': return ['SPC', 'R']; // Spin, restart
      case 'blackjack': return ['SPC', 'ENT', 'R']; // Hit, stand, restart
      case 'clickspeed': return ['SPC', 'R']; // Click, restart
      case 'stack': return ['SPC', 'R']; // Drop, restart
      case 'jumpandrun': return ['←', '→', 'SPC', 'R']; // Move, jump, restart
      case 'basejump': return ['←', '→', 'SPC', 'R']; // Steer, deploy chute, restart
      case 'longjump': return ['SPC', 'R']; // Jump, restart
      case 'tripwire': return ['←', '→', 'SPC', 'R']; // Swing, hook, restart
      case 'slither': return ['R']; // Mouse controlled, only restart
      case 'redbirds': return ['SPC', 'R']; // Launch, restart
      case 'headdriver': return ['←', '→', 'SPC', 'R']; // Drive, shoot, restart
      case 'battlesnake': return ['←', '→', '↑', '↓', 'SPC', 'R']; // Snake movement, action, restart
      case 'bikerunner': return ['←', '→', '↑', '↓', 'R']; // Movement, restart
      case 'boatcombat': return ['←', '→', '↑', '↓', 'SPC', 'R']; // Navigate, shoot, restart
      case 'tabletennis': return ['←', '→', '↑', '↓', 'R']; // Paddle control, restart
      default: return ['←', '→', '↑', '↓', 'SPC', 'R']; // Basic controls
    }
  };
  
  // Simple canvas setup
  useEffect(() => {
    const setupCanvas = () => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      canvas.width = 800;
      canvas.height = 450;
      canvas.style.width = '100%';
      canvas.style.height = 'auto';
      canvas.style.maxWidth = '800px';
      canvas.style.maxHeight = '450px';
      canvas.style.border = '2px solid #3D2A1A';
      canvas.style.borderRadius = '8px';
      canvas.style.backgroundColor = '#000';
    };
    
    setupCanvas();
    window.addEventListener('resize', setupCanvas);
    
    return () => window.removeEventListener('resize', setupCanvas);
  }, []);
  
  // Prevent arrow key scrolling in game view
  useEffect(() => {
    const preventArrowScroll = (e) => {
      if (e.key.startsWith('Arrow') || e.key === ' ') {
        e.preventDefault();
        // DON'T stopPropagation - let the game receive the events
      }
    };

    document.addEventListener('keydown', preventArrowScroll);
    
    return () => {
      document.removeEventListener('keydown', preventArrowScroll);
    };
  }, []);

  // Game initialization
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Clean up previous game
      if (window.currentGameCleanup) {
        window.currentGameCleanup();
        window.currentGameCleanup = null;
      }
      
      try {
        // Load and initialize the game
        const gameImplementation = getGameImplementation(gameId);
        if (gameImplementation) {
          gameImplementation(canvas, ctx);
        } else {
          console.error(`No implementation found for game: ${gameId}`);
          ctx.fillStyle = '#000';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#FF0000';
          ctx.font = '24px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('Game Not Found', canvas.width/2, canvas.height/2);
        }
      } catch (error) {
        console.error(`Error initializing game ${gameId}:`, error);
        
        // Fallback error display
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#FF0000';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Loading Error', canvas.width/2, canvas.height/2 - 20);
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.fillText('Please try reloading', canvas.width/2, canvas.height/2 + 20);
      }
    }
    
    return () => {
      // Cleanup on unmount
      if (window.currentGameCleanup) {
        window.currentGameCleanup();
        window.currentGameCleanup = null;
      }
    };
  }, [gameId]);

  return (
    <div className="game-container" style={{ position: 'relative' }}>
      <canvas 
        ref={canvasRef}
        id="gameCanvas" 
        width={800}
        height={450}
      />
      
      {/* Minimal Game-Specific Controls */}
      {showControls && (() => {
        const controls = getGameControls(gameId);
        const keyMap = {
          '←': { key: 'ArrowLeft', label: '←' },
          '→': { key: 'ArrowRight', label: '→' }, 
          '↑': { key: 'ArrowUp', label: '↑' },
          '↓': { key: 'ArrowDown', label: '↓' },
          'SPC': { key: ' ', label: 'SPC' },
          'ENT': { key: 'Enter', label: 'ENT' },
          'R': { key: 'r', label: 'R' },
          'W': { key: 'w', label: 'W' },
          'A': { key: 'a', label: 'A' },
          'S': { key: 's', label: 'S' },
          'D': { key: 'd', label: 'D' }
        };
        
        // Check if we have directional controls
        const hasArrows = controls.includes('←') || controls.includes('→') || controls.includes('↑') || controls.includes('↓');
        const hasWASD = controls.includes('W') || controls.includes('A') || controls.includes('S') || controls.includes('D');
        
        if (hasArrows && hasWASD) {
          // PvP Combat with both WASD and arrows - special layout
          return (
            <div className="mobile-controls" style={{
              position: 'absolute',
              bottom: '15px',
              left: '50%',
              transform: 'translateX(-50%)',
              pointerEvents: 'auto',
              display: 'flex',
              gap: '16px',
              padding: '12px 16px',
              background: 'rgba(0,0,0,0.25)',
              borderRadius: '16px',
              zIndex: 1000,
              touchAction: 'none'
            }}>
              {/* WASD Grid */}
              <div style={{ display: 'grid', gridTemplate: '30px 30px / 30px 30px 30px', gap: '3px' }}>
                <div></div>
                <KeyButton keyValue="w" label="W" pressedButtons={pressedButtons} setPressedButtons={setPressedButtons} />
                <div></div>
                <KeyButton keyValue="a" label="A" pressedButtons={pressedButtons} setPressedButtons={setPressedButtons} />
                <KeyButton keyValue="s" label="S" pressedButtons={pressedButtons} setPressedButtons={setPressedButtons} />
                <KeyButton keyValue="d" label="D" pressedButtons={pressedButtons} setPressedButtons={setPressedButtons} />
              </div>
              
              {/* Arrow Grid */}
              <div style={{ display: 'grid', gridTemplate: '30px 30px / 30px 30px 30px', gap: '3px' }}>
                <div></div>
                <KeyButton keyValue="ArrowUp" label="↑" pressedButtons={pressedButtons} setPressedButtons={setPressedButtons} />
                <div></div>
                <KeyButton keyValue="ArrowLeft" label="←" pressedButtons={pressedButtons} setPressedButtons={setPressedButtons} />
                <KeyButton keyValue="ArrowDown" label="↓" pressedButtons={pressedButtons} setPressedButtons={setPressedButtons} />
                <KeyButton keyValue="ArrowRight" label="→" pressedButtons={pressedButtons} setPressedButtons={setPressedButtons} />
              </div>
              
              {/* Other buttons */}
              {controls.filter(c => !['W','A','S','D','←','→','↑','↓'].includes(c)).map(control => {
                const mapped = keyMap[control];
                return mapped ? (
                  <KeyButton 
                    key={control}
                    keyValue={mapped.key}
                    label={mapped.label}
                    pressedButtons={pressedButtons}
                    setPressedButtons={setPressedButtons}
                  />
                ) : null;
              })}
            </div>
          );
        } else if (hasArrows || hasWASD) {
          // Single directional control set
          const directions = hasArrows ? ['↑','←','↓','→'] : ['W','A','S','D'];
          const directionsInGame = directions.filter(d => controls.includes(d));
          const otherControls = controls.filter(c => !directions.includes(c));
          
          return (
            <div className="mobile-controls" style={{
              position: 'absolute',
              bottom: '15px',
              left: '50%',
              transform: 'translateX(-50%)',
              pointerEvents: 'auto',
              display: 'flex',
              gap: '16px',
              padding: '12px 16px',
              background: 'rgba(0,0,0,0.25)',
              borderRadius: '16px',
              zIndex: 1000,
              touchAction: 'none'
            }}>
              {/* Directional Grid */}
              <div style={{ display: 'grid', gridTemplate: '30px 30px / 30px 30px 30px', gap: '3px' }}>
                <div></div>
                {directionsInGame.includes(hasArrows ? '↑' : 'W') ? (
                  <KeyButton 
                    keyValue={keyMap[hasArrows ? '↑' : 'W'].key} 
                    label={keyMap[hasArrows ? '↑' : 'W'].label}
                    pressedButtons={pressedButtons} 
                    setPressedButtons={setPressedButtons} 
                  />
                ) : <div></div>}
                <div></div>
                {directionsInGame.includes(hasArrows ? '←' : 'A') ? (
                  <KeyButton 
                    keyValue={keyMap[hasArrows ? '←' : 'A'].key} 
                    label={keyMap[hasArrows ? '←' : 'A'].label}
                    pressedButtons={pressedButtons} 
                    setPressedButtons={setPressedButtons} 
                  />
                ) : <div></div>}
                {directionsInGame.includes(hasArrows ? '↓' : 'S') ? (
                  <KeyButton 
                    keyValue={keyMap[hasArrows ? '↓' : 'S'].key} 
                    label={keyMap[hasArrows ? '↓' : 'S'].label}
                    pressedButtons={pressedButtons} 
                    setPressedButtons={setPressedButtons} 
                  />
                ) : <div></div>}
                {directionsInGame.includes(hasArrows ? '→' : 'D') ? (
                  <KeyButton 
                    keyValue={keyMap[hasArrows ? '→' : 'D'].key} 
                    label={keyMap[hasArrows ? '→' : 'D'].label}
                    pressedButtons={pressedButtons} 
                    setPressedButtons={setPressedButtons} 
                  />
                ) : <div></div>}
              </div>
              
              {/* Other buttons */}
              {otherControls.map(control => {
                const mapped = keyMap[control];
                return mapped ? (
                  <KeyButton 
                    key={control}
                    keyValue={mapped.key}
                    label={mapped.label}
                    pressedButtons={pressedButtons}
                    setPressedButtons={setPressedButtons}
                  />
                ) : null;
              })}
            </div>
          );
        } else {
          // No directional controls - simple horizontal layout
          return (
            <div className="mobile-controls" style={{
              position: 'absolute',
              bottom: '15px',
              left: '50%',
              transform: 'translateX(-50%)',
              pointerEvents: 'auto',
              display: 'flex',
              gap: '12px',
              padding: '12px 16px',
              background: 'rgba(0,0,0,0.25)',
              borderRadius: '16px',
              zIndex: 1000,
              touchAction: 'none'
            }}>
              {controls.map(control => {
                const mapped = keyMap[control];
                return mapped ? (
                  <KeyButton 
                    key={control}
                    keyValue={mapped.key}
                    label={mapped.label}
                    pressedButtons={pressedButtons}
                    setPressedButtons={setPressedButtons}
                  />
                ) : null;
              })}
            </div>
          );
        }
      })()}
    </div>
  );
};

export default GamePlayer;