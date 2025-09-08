// Performance optimization wrapper (temporarily disabled for testing)
// import { optimizeAllGames } from '../utils/GamePerformanceWrapper.js';

// Puzzle Games
import { initTetris } from './puzzle/tetris.js';

// Arcade Games  
import { initSnake } from './arcade/snake.js';
import { initPong } from './arcade/pong.js';
import { initBreakout } from './arcade/breakout.js';
import { initPacman } from './arcade/pacman.js';

// Space Games
import { initSpaceInvaders } from './space/spaceinvaders.js';
import { initAsteroids } from './space/asteroids.js';

// Mobile/Casual Games
import { initFlappyBird } from './mobile/flappybird.js';
import { initDoodleJump } from './mobile/doodlejump.js';
import { initSubwaySurfers } from './mobile/subway.js';

// Racing Games
import { initHillClimbRacing } from './racing/hillclimb.js';
import { initRider } from './racing/rider.js';

// Action Games
import { initDuckHunt } from './action/duckhunt.js';

// IO Games
import { initSlither } from './io/slither.js';

// Classic Games
import { initFrogger } from './classic/frogger.js';

// Platform Games
import { initMarioBros } from './platform/mario.js';

// Additional Action Games
import { initPvPCombat } from './action/pvpcombat.js';
import { initBoxing } from './action/boxing.js';

// Additional Puzzle Games  
import { initCasino } from './puzzle/casino.js';
import { initClickSpeed } from './puzzle/clickspeed.js';
import { initBlackjack } from './puzzle/blackjack.js';

// Additional Arcade Games
import { initStack } from './arcade/stack.js';
import { initJumpAndRun } from './arcade/jumpandrun.js';

// Base game implementations map
const baseGameImplementations = {
    'tetris': initTetris,
    'snake': initSnake,
    'pong': initPong,
    'breakout': initBreakout,
    'pacman': initPacman,
    'spaceinvaders': initSpaceInvaders,
    'asteroids': initAsteroids,
    'flappybird': initFlappyBird,
    'doodle': initDoodleJump,
    'subway': initSubwaySurfers,
    'rider': initRider,
    'hillclimb': initHillClimbRacing,
    'mario': initMarioBros,
    'duckhunt': initDuckHunt,
    'slither': initSlither,
    'frogger': initFrogger,
    'pvpcombat': initPvPCombat,
    'boxing': initBoxing,
    'casino': initCasino,
    'clickspeed': initClickSpeed,
    'blackjack': initBlackjack,
    'stack': initStack,
    'jumpandrun': initJumpAndRun
};

// Apply performance optimization to all games (temporarily disabled for testing)
export const gameImplementations = baseGameImplementations;

// Stub implementations for games not yet converted
function createStubGame(gameData) {
    return function(canvas, ctx) {
        let animationId = null;
        
        function draw() {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(gameData.emoji, canvas.width/2, canvas.height/2 - 50);
            ctx.font = '24px Arial';
            ctx.fillText(gameData.title, canvas.width/2, canvas.height/2 + 20);
            ctx.font = '16px Arial';
            ctx.fillText('Coming Soon - Enhanced Edition!', canvas.width/2, canvas.height/2 + 60);
            ctx.textAlign = 'left';
        }
        
        function animate() {
            draw();
            animationId = requestAnimationFrame(animate);
        }
        
        animate();
        
        window.currentGameCleanup = () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        };
    };
}

// Add stub implementations for remaining games
export function getGameImplementation(gameId, gameData) {
    const implementation = gameImplementations[gameId];
    
    if (implementation) {
        return implementation;
    }
    
    // Return stub for unimplemented games
    return createStubGame(gameData);
}