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
    
    const key = keyMap[direction];
    
    // Create proper keyboard event with all necessary properties
    const keyboardEvent = new KeyboardEvent(type, { 
      key: key,
      code: key,
      keyCode: key === 'ArrowUp' ? 38 : key === 'ArrowDown' ? 40 : key === 'ArrowLeft' ? 37 : 39,
      which: key === 'ArrowUp' ? 38 : key === 'ArrowDown' ? 40 : key === 'ArrowLeft' ? 37 : 39,
      bubbles: true,
      cancelable: true
    });
    
    console.log(`Dispatching ${type} for direction: ${direction} (key: ${key})`);
    
    // Dispatch to both document and canvas
    document.dispatchEvent(keyboardEvent);
    const canvas = document.querySelector('#gameCanvas');
    if (canvas) {
      canvas.dispatchEvent(keyboardEvent);
    }
    
    // Also try the legacy way
    window.dispatchEvent(keyboardEvent);
  };
  
  const buttonStyle = {
    width: '35px',
    height: '35px',
    background: 'rgba(246, 128, 29, 0.65)',
    border: '1px solid rgba(61, 42, 26, 0.8)',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
    touchAction: 'manipulation',
    boxShadow: '1px 1px 0px rgba(61, 42, 26, 0.6)',
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
      gridTemplate: '35px 35px 35px / 35px 35px 35px',
      gap: '3px',
      width: '111px',
      height: '111px'
    }}>
      <div></div>
      <button 
        style={{
          ...buttonStyle,
          ...(pressedButtons.has('up') ? getActiveStyle() : {})
        }}
        onTouchStart={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('D-pad up touched');
          setPressedButtons(prev => new Set(prev).add('up'));
          handleDirectionPress('up');
          navigator.vibrate && navigator.vibrate(30);
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
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
        onTouchStart={(e) => {
          e.preventDefault();
          setPressedButtons(prev => new Set(prev).add('left'));
          handleDirectionPress('left');
          navigator.vibrate && navigator.vibrate(30);
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
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
        onTouchStart={(e) => {
          e.preventDefault();
          setPressedButtons(prev => new Set(prev).add('right'));
          handleDirectionPress('right');
          navigator.vibrate && navigator.vibrate(30);
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
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
        onTouchStart={(e) => {
          e.preventDefault();
          setPressedButtons(prev => new Set(prev).add('down'));
          handleDirectionPress('down');
          navigator.vibrate && navigator.vibrate(30);
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
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
const ActionButton = ({ action, pressedButtons, setPressedButtons }) => {
  const handleActionPress = (type = 'keydown') => {
    const keyMap = {
      'jump': ' ',
      'fire': ' ',
      'rotate': ' ',
      'restart': 'r',
      'start': ' ',
      'accelerate': 'ArrowUp',
      'brake': 'ArrowDown',
      'left-punch': 'a',
      'right-punch': 'd',
      'block': 's'
    };
    
    const key = keyMap[action] || ' ';
    
    // Create proper keyboard event with all necessary properties
    const keyboardEvent = new KeyboardEvent(type, { 
      key: key,
      code: key === ' ' ? 'Space' : key === 'r' ? 'KeyR' : key,
      keyCode: key === ' ' ? 32 : key === 'r' ? 82 : key.charCodeAt(0),
      which: key === ' ' ? 32 : key === 'r' ? 82 : key.charCodeAt(0),
      bubbles: true,
      cancelable: true
    });
    
    console.log(`Dispatching ${type} for key: ${key} (action: ${action})`);
    
    // Dispatch to both document and canvas
    document.dispatchEvent(keyboardEvent);
    const canvas = document.querySelector('#gameCanvas');
    if (canvas) {
      canvas.dispatchEvent(keyboardEvent);
    }
    
    // Also try the legacy way
    window.dispatchEvent(keyboardEvent);
  };
  
  const actionLabels = {
    'jump': '🦘',
    'fire': '🔫',
    'rotate': '🔄',
    'restart': 'R',
    'start': '▶️',
    'accelerate': '⚡',
    'brake': '🛑',
    'left-punch': '👊L',
    'right-punch': '👊R',
    'block': '🛡️'
  };
  
  const buttonStyle = {
    width: '40px',
    height: '40px',
    background: 'rgba(246, 128, 29, 0.65)',
    border: '1px solid rgba(61, 42, 26, 0.8)',
    borderRadius: '50%',
    color: 'white',
    fontSize: action.includes('punch') ? '8px' : '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
    touchAction: 'manipulation',
    boxShadow: '2px 2px 0px rgba(61, 42, 26, 0.6)',
    transition: 'all 0.1s ease'
  };
  
  return (
    <button 
      style={{
        ...buttonStyle,
        ...(pressedButtons && pressedButtons.has(action) ? {
          transform: 'translate(1px, 1px)',
          boxShadow: '1px 1px 0px rgba(61, 42, 26, 0.6)',
          background: 'rgba(255, 154, 71, 0.8)'
        } : {})
      }}
      onTouchStart={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Action button touched:', action);
        if (setPressedButtons) setPressedButtons(prev => new Set(prev).add(action));
        handleActionPress();
        navigator.vibrate && navigator.vibrate(30);
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        if (setPressedButtons) setPressedButtons(prev => {
          const newSet = new Set(prev);
          newSet.delete(action);
          return newSet;
        });
        handleActionPress('keyup');
      }}
      onMouseDown={() => {
        if (setPressedButtons) setPressedButtons(prev => new Set(prev).add(action));
        handleActionPress();
      }}
      onMouseUp={() => {
        if (setPressedButtons) setPressedButtons(prev => {
          const newSet = new Set(prev);
          newSet.delete(action);
          return newSet;
        });
        handleActionPress('keyup');
      }}
    >
      {actionLabels[action] || action}
    </button>
  );
};

const GamePlayer = ({ gameId, gameData }) => {
  const canvasRef = useRef(null);
  const touchStartRef = useRef(null);
  const [showControls, setShowControls] = useState(true); // Force show for debugging
  const [pressedButtons, setPressedButtons] = useState(new Set());
  const [controlPositions, setControlPositions] = useState({
    leftMargin: '15px',
    rightMargin: '15px', 
    bottomMargin: '15px'
  });
  
  // Game-to-control-type mapping - Universal coverage for all 35 games
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
    'stack': 'tap',
    'tripwire': 'platform',
    'basejump': 'tap',
    'longjump': 'tap',
    'redbirds': 'shooter',
    'headdriver': 'racing',
    'battlesnake': 'combat',
    'bikerunner': 'runner',
    'boatcombat': 'shooter',
    'tabletennis': 'paddle'
  };
  
  const controlType = gameControlTypes[gameId] || 'tap';

  // Unified canvas sizing for all devices with enhanced control positioning
  useEffect(() => {
    const setupCanvas = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                    ('ontouchstart' in window) || 
                    (window.innerWidth <= 768) ||
                    ('maxTouchPoints' in navigator && navigator.maxTouchPoints > 0);
      
      console.log('Mobile detection:', {
        userAgent: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        ontouchstart: ('ontouchstart' in window),
        screenWidth: window.innerWidth,
        widthCheck: window.innerWidth <= 768,
        touchPoints: navigator.maxTouchPoints,
        finalMobile: mobile
      });
      
      // Force show controls for debugging mobile issues
      setShowControls(true); // Always show for debugging
      
      // Calculate optimal control positioning to avoid core gameplay area
      const calculateControlPositions = () => {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const viewportRatio = screenWidth / screenHeight;
        
        // Enhanced positioning based on screen dimensions and game type
        let leftMargin, rightMargin, bottomMargin;
        
        if (screenWidth <= 480) { // Small phones
          leftMargin = rightMargin = '10px';
          bottomMargin = '12px';
        } else if (screenWidth <= 768) { // Large phones/small tablets
          leftMargin = rightMargin = '15px';
          bottomMargin = '15px';
        } else { // Tablets and larger
          leftMargin = rightMargin = '25px';
          bottomMargin = '20px';
        }
        
        // Game-specific positioning adjustments for minimal obstruction
        if (['pong', 'breakout'].includes(gameId)) {
          // Paddle games need clear horizontal movement
          bottomMargin = '10px';
        } else if (['flappybird', 'doodle'].includes(gameId)) {
          // Vertical games need minimal side obstruction
          leftMargin = rightMargin = '8px';
        }
        
        setControlPositions({ leftMargin, rightMargin, bottomMargin });
      };
      
      calculateControlPositions();
      setShowControls(mobile);
      
      // UNIFIED ASPECT-RATIO PRESERVING DISPLAY
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        
        // Always maintain 16:9 aspect ratio
        canvas.width = 800; // Original game resolution width
        canvas.height = 450; // 16:9 aspect ratio (800 * 9/16)
        
        // Unified styling for all devices
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.aspectRatio = '16/9';
        canvas.style.objectFit = 'contain';
        canvas.style.background = '#000';
        canvas.style.touchAction = 'none';
        canvas.style.pointerEvents = 'auto';
      }
    };
    
    setupCanvas();
    window.addEventListener('resize', setupCanvas);
    
    return () => window.removeEventListener('resize', setupCanvas);
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
        e.stopPropagation();
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
      // Vollbild-Modus beenden
      document.body.classList.remove('game-active');
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
      
      {/* Mobile Control Overlay */}
      {showControls && (
        <div className="mobile-controls" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 1000,
          touchAction: 'none'
        }}>
          
          {/* Directional Controls */}
          {controlType === 'directional' && (
            <div className="d-pad" style={{
              position: 'absolute',
              left: controlPositions.leftMargin,
              bottom: controlPositions.bottomMargin,
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
                left: controlPositions.leftMargin,
                bottom: controlPositions.bottomMargin,
                pointerEvents: 'auto'
              }}>
                <VirtualDPad pressedButtons={pressedButtons} setPressedButtons={setPressedButtons} />
              </div>
              <div className="action-buttons" style={{
                position: 'absolute',
                right: controlPositions.rightMargin,
                bottom: controlPositions.bottomMargin,
                pointerEvents: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px'
              }}>
                <ActionButton action="jump" pressedButtons={pressedButtons} setPressedButtons={setPressedButtons} />
                <ActionButton action="start" pressedButtons={pressedButtons} setPressedButtons={setPressedButtons} />
              </div>
            </>
          )}
          
          {/* Shooter Game Controls */}
          {controlType === 'shooter' && (
            <>
              <div className="d-pad" style={{
                position: 'absolute',
                left: controlPositions.leftMargin,
                bottom: controlPositions.bottomMargin,
                pointerEvents: 'auto'
              }}>
                <VirtualDPad pressedButtons={pressedButtons} setPressedButtons={setPressedButtons} />
              </div>
              <div className="action-buttons" style={{
                position: 'absolute',
                right: controlPositions.rightMargin,
                bottom: controlPositions.bottomMargin,
                pointerEvents: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px'
              }}>
                <ActionButton action="fire" pressedButtons={pressedButtons} setPressedButtons={setPressedButtons} />
                <ActionButton action="start" pressedButtons={pressedButtons} setPressedButtons={setPressedButtons} />
              </div>
            </>
          )}
          
          {/* Puzzle Game Controls */}
          {controlType === 'puzzle' && (
            <>
              <div className="d-pad" style={{
                position: 'absolute',
                left: controlPositions.leftMargin,
                bottom: controlPositions.bottomMargin,
                pointerEvents: 'auto'
              }}>
                <VirtualDPad pressedButtons={pressedButtons} setPressedButtons={setPressedButtons} />
              </div>
              <div className="action-buttons" style={{
                position: 'absolute',
                right: controlPositions.rightMargin,
                bottom: controlPositions.bottomMargin,
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
              bottom: controlPositions.bottomMargin,
              left: '50%',
              transform: 'translateX(-50%)',
              pointerEvents: 'auto',
              display: 'flex',
              gap: '15px'
            }}>
              <ActionButton action="brake" pressedButtons={pressedButtons} setPressedButtons={setPressedButtons} />
              <ActionButton action="accelerate" pressedButtons={pressedButtons} setPressedButtons={setPressedButtons} />
            </div>
          )}
          
          {/* Paddle Game Controls */}
          {controlType === 'paddle' && (
            <>
              {gameId === 'pong' ? (
                // Pong needs up/down controls
                <div className="pong-controls" style={{
                  position: 'absolute',
                  right: controlPositions.rightMargin,
                  bottom: controlPositions.bottomMargin,
                  pointerEvents: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px'
                }}>
                  <ActionButton action="accelerate" pressedButtons={pressedButtons} setPressedButtons={setPressedButtons} />
                  <ActionButton action="brake" pressedButtons={pressedButtons} setPressedButtons={setPressedButtons} />
                </div>
              ) : (
                // Breakout needs left/right controls
                <div className="breakout-controls" style={{
                  position: 'absolute',
                  bottom: controlPositions.bottomMargin,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  pointerEvents: 'auto',
                  display: 'flex',
                  gap: '10px'
                }}>
                  <button 
                    style={{
                      width: '50px',
                      height: '40px',
                      background: 'rgba(246, 128, 29, 0.65)',
                      border: '1px solid rgba(61, 42, 26, 0.8)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '16px',
                      cursor: 'pointer',
                      touchAction: 'manipulation'
                    }}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', keyCode: 37, which: 37, bubbles: true });
                      document.dispatchEvent(event);
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      const event = new KeyboardEvent('keyup', { key: 'ArrowLeft', keyCode: 37, which: 37, bubbles: true });
                      document.dispatchEvent(event);
                    }}
                  >←</button>
                  <button 
                    style={{
                      width: '50px',
                      height: '40px',
                      background: 'rgba(246, 128, 29, 0.65)',
                      border: '1px solid rgba(61, 42, 26, 0.8)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '16px',
                      cursor: 'pointer',
                      touchAction: 'manipulation'
                    }}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      const event = new KeyboardEvent('keydown', { key: 'ArrowRight', keyCode: 39, which: 39, bubbles: true });
                      document.dispatchEvent(event);
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      const event = new KeyboardEvent('keyup', { key: 'ArrowRight', keyCode: 39, which: 39, bubbles: true });
                      document.dispatchEvent(event);
                    }}
                  >→</button>
                </div>
              )}
              <div className="paddle-hint" style={{
                position: 'absolute',
                bottom: controlPositions.bottomMargin,
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'white',
                background: 'rgba(0,0,0,0.6)',
                padding: '6px 10px',
                borderRadius: '5px',
                fontSize: '10px'
              }}>
                {gameId === 'pong' ? 'Use ⚡🛑 to move paddle up/down' : 'Use ←→ to move paddle'}
              </div>
            </>
          )}
          
          {/* Tap Game Controls */}
          {controlType === 'tap' && (
            <>
              <div className="tap-actions" style={{
                position: 'absolute',
                right: controlPositions.rightMargin,
                bottom: controlPositions.bottomMargin,
                pointerEvents: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px'
              }}>
                <ActionButton action="start" pressedButtons={pressedButtons} setPressedButtons={setPressedButtons} />
                <ActionButton action="restart" pressedButtons={pressedButtons} setPressedButtons={setPressedButtons} />
              </div>
              <div className="tap-hint" style={{
                position: 'absolute',
                bottom: controlPositions.bottomMargin,
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'white',
                background: 'rgba(0,0,0,0.6)',
                padding: '6px 10px',
                borderRadius: '5px',
                fontSize: '10px'
              }}>
                Tap ▶️ to start, R to restart
              </div>
            </>
          )}
          
          {/* Runner Game Controls */}
          {controlType === 'runner' && (
            <>
              <div className="runner-dpad" style={{
                position: 'absolute',
                left: controlPositions.leftMargin,
                bottom: controlPositions.bottomMargin,
                pointerEvents: 'auto'
              }}>
                <VirtualDPad pressedButtons={pressedButtons} setPressedButtons={setPressedButtons} />
              </div>
              <div className="runner-actions" style={{
                position: 'absolute',
                right: controlPositions.rightMargin,
                bottom: controlPositions.bottomMargin,
                pointerEvents: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px'
              }}>
                <ActionButton action="jump" pressedButtons={pressedButtons} setPressedButtons={setPressedButtons} />
                <ActionButton action="start" pressedButtons={pressedButtons} setPressedButtons={setPressedButtons} />
              </div>
              <div className="runner-hint" style={{
                position: 'absolute',
                bottom: controlPositions.bottomMargin,
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'white',
                background: 'rgba(0,0,0,0.6)',
                padding: '6px 10px',
                borderRadius: '5px',
                fontSize: '10px'
              }}>
                Use D-pad to move, 🦘 to jump
              </div>
            </>
          )}
          
          {/* Combat Game Controls */}
          {controlType === 'combat' && (
            <>
              <div className="combat-left" style={{
                position: 'absolute',
                left: controlPositions.leftMargin,
                bottom: controlPositions.bottomMargin,
                pointerEvents: 'auto'
              }}>
                <ActionButton action="left-punch" pressedButtons={pressedButtons} setPressedButtons={setPressedButtons} />
              </div>
              <div className="combat-center" style={{
                position: 'absolute',
                bottom: controlPositions.bottomMargin,
                left: '50%',
                transform: 'translateX(-50%)',
                pointerEvents: 'auto'
              }}>
                <ActionButton action="block" pressedButtons={pressedButtons} setPressedButtons={setPressedButtons} />
              </div>
              <div className="combat-right" style={{
                position: 'absolute',
                right: controlPositions.rightMargin,
                bottom: controlPositions.bottomMargin,
                pointerEvents: 'auto'
              }}>
                <ActionButton action="right-punch" pressedButtons={pressedButtons} setPressedButtons={setPressedButtons} />
              </div>
            </>
          )}
          
          {/* Continuous Movement (like Slither) */}
          {controlType === 'continuous' && (
            <>
              <div className="continuous-dpad" style={{
                position: 'absolute',
                left: controlPositions.leftMargin,
                bottom: controlPositions.bottomMargin,
                pointerEvents: 'auto'
              }}>
                <VirtualDPad pressedButtons={pressedButtons} setPressedButtons={setPressedButtons} />
              </div>
              <div className="continuous-hint" style={{
                position: 'absolute',
                bottom: controlPositions.bottomMargin,
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'white',
                background: 'rgba(0,0,0,0.6)',
                padding: '6px 10px',
                borderRadius: '5px',
                fontSize: '10px'
              }}>
                Use D-pad or touch screen to steer
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default GamePlayer;