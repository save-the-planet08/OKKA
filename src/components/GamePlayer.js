import React, { useEffect, useRef } from 'react';
import { getGameImplementation } from '../games/index.js';

const GamePlayer = ({ gameId, gameData, onBackClick }) => {
  const canvasRef = useRef(null);
  const gameInstanceRef = useRef(null);
  const touchStartRef = useRef(null);

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
    <canvas 
      ref={canvasRef}
      id="gameCanvas" 
      width="800" 
      height="600"
    />
  );
};

export default GamePlayer;