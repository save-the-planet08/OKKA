import React, { useEffect, useRef, useState } from 'react';
import { getGameImplementation } from '../games/index.js';

// Virtual D-pad Component
const VirtualDPad = ({ pressedButtons, setPressedButtons }) => {
  const handleDirectionPress = (direction, type = 'keydown') => {
    const keyMap = {
      'up': 'ArrowUp',
      'down': 'ArrowDown', 
      'left': 'ArrowLeft',
      'right': 'ArrowRight'
    };
    
    window.dispatchEvent(new KeyboardEvent(type, { key: keyMap[direction] }));
  };
  
  const buttonStyle = {
    width: '50px',
    height: '50px',
    background: 'rgba(246, 128, 29, 0.8)',
    border: '3px solid #3D2A1A',
    borderRadius: '12px',
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
    touchAction: 'manipulation',
    boxShadow: '3px 3px 0px #3D2A1A',
    transition: 'all 0.1s ease'
  };
  
  const getActiveStyle = () => ({
    transform: 'translate(2px, 2px)',
    boxShadow: '1px 1px 0px #3D2A1A',
    background: 'rgba(255, 154, 71, 0.9)'
  });
  
  return (
    <div style={{
      display: 'grid',
      gridTemplate: '50px 50px 50px / 50px 50px 50px',
      gap: '5px',
      width: '165px',
      height: '165px'
    }}>
      <div></div>
      <button 
        style={{
          ...buttonStyle,
          ...(pressedButtons.has('up') ? getActiveStyle() : {})
        }}
        onTouchStart={() => {
          setPressedButtons(prev => new Set(prev).add('up'));
          handleDirectionPress('up');
          navigator.vibrate && navigator.vibrate(50);
        }}
        onTouchEnd={() => {
          setPressedButtons(prev => {
            const newSet = new Set(prev);
            newSet.delete('up');
            return newSet;
          });
          handleDirectionPress('up', 'keyup');
        }}
        onMouseDown={() => {
          setPressedButtons(prev => new Set(prev).add('up'));
          handleDirectionPress('up');
        }}
        onMouseUp={() => {
          setPressedButtons(prev => {
            const newSet = new Set(prev);
            newSet.delete('up');
            return newSet;
          });
          handleDirectionPress('up', 'keyup');
        }}
      >
        ↑
      </button>
      <div></div>
      
      <button 
        style={{
          ...buttonStyle,
          ...(pressedButtons.has('left') ? getActiveStyle() : {})
        }}
        onTouchStart={() => {
          setPressedButtons(prev => new Set(prev).add('left'));
          handleDirectionPress('left');
          navigator.vibrate && navigator.vibrate(50);
        }}
        onTouchEnd={() => {
          setPressedButtons(prev => {
            const newSet = new Set(prev);
            newSet.delete('left');
            return newSet;
          });
          handleDirectionPress('left', 'keyup');
        }}
        onMouseDown={() => {
          setPressedButtons(prev => new Set(prev).add('left'));
          handleDirectionPress('left');
        }}
        onMouseUp={() => {
          setPressedButtons(prev => {
            const newSet = new Set(prev);
            newSet.delete('left');
            return newSet;
          });
          handleDirectionPress('left', 'keyup');
        }}
      >
        ←
      </button>
      <div style={{
        ...buttonStyle,
        background: 'rgba(61, 42, 26, 0.5)',
        cursor: 'default'
      }}></div>
      <button 
        style={{
          ...buttonStyle,
          ...(pressedButtons.has('right') ? getActiveStyle() : {})
        }}
        onTouchStart={() => {
          setPressedButtons(prev => new Set(prev).add('right'));
          handleDirectionPress('right');
          navigator.vibrate && navigator.vibrate(50);
        }}
        onTouchEnd={() => {
          setPressedButtons(prev => {
            const newSet = new Set(prev);
            newSet.delete('right');
            return newSet;
          });
          handleDirectionPress('right', 'keyup');
        }}
        onMouseDown={() => {
          setPressedButtons(prev => new Set(prev).add('right'));
          handleDirectionPress('right');
        }}
        onMouseUp={() => {
          setPressedButtons(prev => {
            const newSet = new Set(prev);
            newSet.delete('right');
            return newSet;
          });
          handleDirectionPress('right', 'keyup');
        }}
      >
        →
      </button>
      
      <div></div>
      <button 
        style={{
          ...buttonStyle,
          ...(pressedButtons.has('down') ? getActiveStyle() : {})
        }}
        onTouchStart={() => {
          setPressedButtons(prev => new Set(prev).add('down'));
          handleDirectionPress('down');
          navigator.vibrate && navigator.vibrate(50);
        }}
        onTouchEnd={() => {
          setPressedButtons(prev => {
            const newSet = new Set(prev);
            newSet.delete('down');
            return newSet;
          });
          handleDirectionPress('down', 'keyup');
        }}
        onMouseDown={() => {
          setPressedButtons(prev => new Set(prev).add('down'));
          handleDirectionPress('down');
        }}
        onMouseUp={() => {
          setPressedButtons(prev => {
            const newSet = new Set(prev);
            newSet.delete('down');
            return newSet;
          });
          handleDirectionPress('down', 'keyup');
        }}
      >
        ↓
      </button>
      <div></div>
    </div>
  );
};

// Action Button Component
const ActionButton = ({ action }) => {
  const handleActionPress = (type = 'keydown') => {
    const keyMap = {
      'jump': ' ',
      'fire': ' ',
      'rotate': ' ',
      'accelerate': 'ArrowUp',
      'brake': 'ArrowDown',
      'left-punch': 'a',
      'right-punch': 'd',
      'block': 's'
    };
    
    const key = keyMap[action] || ' ';
    window.dispatchEvent(new KeyboardEvent(type, { key }));
  };
  
  const actionLabels = {
    'jump': '🦘',
    'fire': '🔫',
    'rotate': '🔄',
    'accelerate': '⚡',
    'brake': '🛑',
    'left-punch': '👊L',
    'right-punch': '👊R',
    'block': '🛡️'
  };
  
  const buttonStyle = {
    width: '60px',
    height: '60px',
    background: 'rgba(246, 128, 29, 0.8)',
    border: '3px solid #3D2A1A',
    borderRadius: '50%',
    color: 'white',
    fontSize: action.includes('punch') ? '12px' : '24px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
    touchAction: 'manipulation',
    boxShadow: '4px 4px 0px #3D2A1A',
    transition: 'all 0.1s ease'
  };
  
  return (
    <button 
      style={buttonStyle}
      onTouchStart={() => handleActionPress()}
      onTouchEnd={() => handleActionPress('keyup')}
      onMouseDown={() => handleActionPress()}
      onMouseUp={() => handleActionPress('keyup')}
    >
      {actionLabels[action] || action}
    </button>
  );
};

const GamePlayer = ({ gameId, gameData }) => {
  const canvasRef = useRef(null);
  const touchStartRef = useRef(null);
  const [showControls, setShowControls] = useState(false);
  const [pressedButtons, setPressedButtons] = useState(new Set());
  
  // Game-to-control-type mapping
  const gameControlTypes = {
    'snake': 'directional',
    'pacman': 'directional',
    'frogger': 'directional', 
    'tetris': 'puzzle',
    'spaceinvaders': 'shooter',
    'asteroids': 'shooter',
    'duckhunt': 'shooter',
    'mario': 'platform',
    'flappybird': 'tap',
    'doodle': 'platform',
    'subway': 'runner',
    'hillclimb': 'racing',
    'rider': 'racing',
    'pong': 'paddle',
    'breakout': 'paddle',
    'slither': 'continuous',
    'pvpcombat': 'combat',
    'boxing': 'combat',
    'casino': 'tap',
    'clickspeed': 'tap',
    'blackjack': 'tap',
    'stack': 'tap'
  };
  
  const controlType = gameControlTypes[gameId] || 'tap';

  // Detect mobile device and show controls
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                    ('ontouchstart' in window) || 
                    (window.innerWidth <= 768);
      setShowControls(mobile);
      
      // Adjust canvas size for mobile
      if (canvasRef.current && mobile) {
        const canvas = canvasRef.current;
        const maxWidth = Math.min(window.innerWidth - 40, 800);
        const maxHeight = Math.min(window.innerHeight - 200, 600);
        
        // Maintain aspect ratio (4:3)
        let width = maxWidth;
        let height = (width * 3) / 4;
        
        if (height > maxHeight) {
          height = maxHeight;
          width = (height * 4) / 3;
        }
        
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Clean up previous game
      if (window.currentGameCleanup) {
        window.currentGameCleanup();
        window.currentGameCleanup = null;
      }
      
      // Add touch support
      const handleTouchStart = (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        touchStartRef.current = {
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
          time: Date.now()
        };
      };
      
      const handleTouchMove = (e) => {
        e.preventDefault();
      };
      
      const handleTouchEnd = (e) => {
        e.preventDefault();
        if (!touchStartRef.current) return;
        
        const touch = e.changedTouches[0];
        const rect = canvas.getBoundingClientRect();
        const endX = touch.clientX - rect.left;
        const endY = touch.clientY - rect.top;
        const deltaX = endX - touchStartRef.current.x;
        const deltaY = endY - touchStartRef.current.y;
        const deltaTime = Date.now() - touchStartRef.current.time;
        
        // Enhanced touch controls for all games
        const handleTouchControls = () => {
          // Swipe detection for movement games
          if (['snake', 'tetris', 'pacman', 'frogger'].includes(gameId)) {
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30) {
              if (deltaX > 0) {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
              } else {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
              }
            } else if (Math.abs(deltaY) > 30) {
              if (deltaY > 0) {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
              } else {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
              }
            } else if (deltaTime < 200) {
              // Quick tap actions
              if (gameId === 'tetris') {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' })); // Rotate
              }
            }
          }
          // Vertical paddle games
          else if (gameId === 'pong' || gameId === 'breakout') {
            if (gameId === 'pong') {
              const canvasHeight = canvas.height;
              if (endY < canvasHeight / 2) {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
                setTimeout(() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowUp' })), 100);
              } else {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
                setTimeout(() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowDown' })), 100);
              }
            } else { // breakout
              if (deltaX > 10) {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
                setTimeout(() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight' })), 100);
              } else if (deltaX < -10) {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
                setTimeout(() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' })), 100);
              }
            }
          }
          // Jump/tap games
          else if (['flappybird', 'doodle', 'mario', 'subway'].includes(gameId)) {
            if (gameId === 'subway') {
              // Lane switching for Subway Surfers
              if (Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
                } else {
                  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
                }
              } else if (deltaY < -50) {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' })); // Jump
              } else if (deltaY > 50) {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' })); // Duck
              } else {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' })); // Jump
              }
            } else if (gameId === 'mario') {
              // Mario movement
              if (Math.abs(deltaX) > 30) {
                if (deltaX > 0) {
                  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
                  setTimeout(() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight' })), 200);
                } else {
                  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
                  setTimeout(() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' })), 200);
                }
              }
              if (deltaY < -30 || deltaTime < 200) {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' })); // Jump
              }
            } else if (gameId === 'doodle') {
              // Doodle Jump - horizontal movement
              if (Math.abs(deltaX) > 30) {
                if (deltaX > 0) {
                  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
                  setTimeout(() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight' })), 150);
                } else {
                  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
                  setTimeout(() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' })), 150);
                }
              }
            } else {
              // Flappy Bird - any tap jumps
              window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
            }
          }
          // Shooter games
          else if (['spaceinvaders', 'asteroids', 'duckhunt'].includes(gameId)) {
            if (gameId === 'spaceinvaders') {
              if (Math.abs(deltaX) > 30) {
                if (deltaX > 0) {
                  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
                  setTimeout(() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight' })), 100);
                } else {
                  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
                  setTimeout(() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' })), 100);
                }
              } else {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' })); // Shoot
              }
            } else if (gameId === 'asteroids') {
              if (deltaTime < 200) {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' })); // Shoot
              } else if (Math.abs(deltaX) > 30) {
                if (deltaX > 0) {
                  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
                  setTimeout(() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight' })), 100);
                } else {
                  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
                  setTimeout(() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' })), 100);
                }
              } else if (deltaY < -30) {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' })); // Thrust
                setTimeout(() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowUp' })), 100);
              }
            }
            // Duck Hunt uses mouse events, handled separately
          }
          // Racing games
          else if (['hillclimb', 'rider'].includes(gameId)) {
            if (Math.abs(deltaX) > 30) {
              if (deltaX > 0) {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
                setTimeout(() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight' })), 200);
              } else {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
                setTimeout(() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' })), 200);
              }
            }
          }
          // Boxing game controls
          else if (gameId === 'boxing') {
            if (Math.abs(deltaX) > 30) {
              if (deltaX > 0) {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'd' })); // Right punch
              } else {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' })); // Left punch
              }
            } else if (deltaTime < 200) {
              // Quick tap for block
              window.dispatchEvent(new KeyboardEvent('keydown', { key: 's' })); // Block
              setTimeout(() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 's' })), 300);
            }
          }
          // IO games like Slither use mouse movement, handled separately
        };
        
        handleTouchControls();
        
        touchStartRef.current = null;
      };
      
      canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
      canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
      canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
      
      // Initialize game using new modular architecture
      try {
        const gameInitializer = getGameImplementation(gameId, gameData);
        gameInitializer(canvas, ctx);
        
        // Enhanced cleanup wrapper
        const originalCleanup = window.currentGameCleanup;
        window.currentGameCleanup = () => {
          // Call game-specific cleanup first
          if (originalCleanup) originalCleanup();
          
          // Clean up touch events
          canvas.removeEventListener('touchstart', handleTouchStart);
          canvas.removeEventListener('touchmove', handleTouchMove);
          canvas.removeEventListener('touchend', handleTouchEnd);
        };
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
        
        window.currentGameCleanup = () => {
          canvas.removeEventListener('touchstart', handleTouchStart);
          canvas.removeEventListener('touchmove', handleTouchMove);
          canvas.removeEventListener('touchend', handleTouchEnd);
        };
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
        width="800" 
        height="600"
      />
      
      {/* Mobile Control Overlay */}
      {showControls && (
        <div className="mobile-controls" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 1000
        }}>
          
          {/* Directional Controls */}
          {controlType === 'directional' && (
            <div className="d-pad" style={{
              position: 'absolute',
              left: '20px',
              bottom: '20px',
              pointerEvents: 'auto'
            }}>
              <VirtualDPad pressedButtons={pressedButtons} setPressedButtons={setPressedButtons} />
            </div>
          )}
          
          {/* Platform Game Controls */}
          {controlType === 'platform' && (
            <>
              <div className="d-pad" style={{
                position: 'absolute',
                left: '20px',
                bottom: '20px',
                pointerEvents: 'auto'
              }}>
                <VirtualDPad pressedButtons={pressedButtons} setPressedButtons={setPressedButtons} />
              </div>
              <div className="action-buttons" style={{
                position: 'absolute',
                right: '20px',
                bottom: '20px',
                pointerEvents: 'auto'
              }}>
                <ActionButton action="jump" pressedButtons={pressedButtons} setPressedButtons={setPressedButtons} />
              </div>
            </>
          )}
          
          {/* Shooter Game Controls */}
          {controlType === 'shooter' && (
            <>
              <div className="d-pad" style={{
                position: 'absolute',
                left: '20px',
                bottom: '20px',
                pointerEvents: 'auto'
              }}>
                <VirtualDPad pressedButtons={pressedButtons} setPressedButtons={setPressedButtons} />
              </div>
              <div className="action-buttons" style={{
                position: 'absolute',
                right: '20px',
                bottom: '20px',
                pointerEvents: 'auto'
              }}>
                <ActionButton action="fire" pressedButtons={pressedButtons} setPressedButtons={setPressedButtons} />
              </div>
            </>
          )}
          
          {/* Puzzle Game Controls */}
          {controlType === 'puzzle' && (
            <>
              <div className="d-pad" style={{
                position: 'absolute',
                left: '20px',
                bottom: '20px',
                pointerEvents: 'auto'
              }}>
                <VirtualDPad pressedButtons={pressedButtons} setPressedButtons={setPressedButtons} />
              </div>
              <div className="action-buttons" style={{
                position: 'absolute',
                right: '20px',
                bottom: '20px',
                pointerEvents: 'auto'
              }}>
                <ActionButton action="rotate" pressedButtons={pressedButtons} setPressedButtons={setPressedButtons} />
              </div>
            </>
          )}
          
          {/* Racing Game Controls */}
          {controlType === 'racing' && (
            <div className="racing-controls" style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              pointerEvents: 'auto',
              display: 'flex',
              gap: '20px'
            }}>
              <ActionButton action="brake" pressedButtons={pressedButtons} setPressedButtons={setPressedButtons} />
              <ActionButton action="accelerate" pressedButtons={pressedButtons} setPressedButtons={setPressedButtons} />
            </div>
          )}
          
          {/* Paddle Game Controls */}
          {controlType === 'paddle' && (
            <div className="paddle-hint" style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'white',
              background: 'rgba(0,0,0,0.7)',
              padding: '10px',
              borderRadius: '5px',
              fontSize: '14px'
            }}>
              {gameId === 'pong' ? 'Tap top/bottom half to move paddle' : 'Swipe left/right to move paddle'}
            </div>
          )}
          
          {/* Tap Game Controls */}
          {controlType === 'tap' && (
            <div className="tap-hint" style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'white',
              background: 'rgba(0,0,0,0.7)',
              padding: '10px',
              borderRadius: '5px',
              fontSize: '14px'
            }}>
              Tap anywhere to play
            </div>
          )}
          
          {/* Runner Game Controls */}
          {controlType === 'runner' && (
            <div className="runner-hint" style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'white',
              background: 'rgba(0,0,0,0.7)',
              padding: '10px',
              borderRadius: '5px',
              fontSize: '14px'
            }}>
              Swipe left/right/up/down to dodge
            </div>
          )}
          
          {/* Combat Game Controls */}
          {controlType === 'combat' && (
            <>
              <div className="combat-left" style={{
                position: 'absolute',
                left: '20px',
                bottom: '20px',
                pointerEvents: 'auto'
              }}>
                <ActionButton action="left-punch" pressedButtons={pressedButtons} setPressedButtons={setPressedButtons} />
              </div>
              <div className="combat-center" style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                pointerEvents: 'auto'
              }}>
                <ActionButton action="block" pressedButtons={pressedButtons} setPressedButtons={setPressedButtons} />
              </div>
              <div className="combat-right" style={{
                position: 'absolute',
                right: '20px',
                bottom: '20px',
                pointerEvents: 'auto'
              }}>
                <ActionButton action="right-punch" pressedButtons={pressedButtons} setPressedButtons={setPressedButtons} />
              </div>
            </>
          )}
          
          {/* Continuous Movement (like Slither) */}
          {controlType === 'continuous' && (
            <div className="continuous-hint" style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'white',
              background: 'rgba(0,0,0,0.7)',
              padding: '10px',
              borderRadius: '5px',
              fontSize: '14px'
            }}>
              Touch and drag to steer
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GamePlayer;