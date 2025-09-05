import gameStateManager from './GameStateManager.js';
import canvasOptimizer from './CanvasOptimizer.js';

export function withPerformanceOptimization(gameInitFunction) {
    return function(canvas, ctx) {
        // Enable performance monitoring
        gameStateManager.enablePerformanceMonitoring();
        
        // Store original context methods for optimization
        const originalFillRect = ctx.fillRect;
        const originalStrokeRect = ctx.strokeRect;
        const originalArc = ctx.arc;
        const originalClearRect = ctx.clearRect;
        
        // Enhanced context with optimization methods
        const optimizedCtx = {
            ...ctx,
            
            // Optimized clear with dirty region tracking
            smartClear: (dirtyRegions) => {
                canvasOptimizer.smartClear(ctx, dirtyRegions);
            },
            
            // Optimized circle drawing
            fillCircle: (x, y, radius, fillStyle, useCache = true) => {
                canvasOptimizer.drawOptimizedCircle(ctx, x, y, radius, fillStyle, useCache);
            },
            
            // Optimized rounded rectangle
            fillRoundedRect: (x, y, width, height, radius, fillStyle, useCache = true) => {
                canvasOptimizer.drawOptimizedRoundedRect(ctx, x, y, width, height, radius, fillStyle, useCache);
            },
            
            // Batch rendering helper
            batchRender: (renderFunction, objects, maxBatchSize) => {
                canvasOptimizer.batchRender(ctx, renderFunction, objects, maxBatchSize);
            },
            
            // Frame rate limiting
            shouldRender: (targetFPS) => {
                return canvasOptimizer.shouldRender(targetFPS);
            }
        };
        
        // Viewport culling utilities
        const viewport = {
            x: 0,
            y: 0,
            width: canvas.width,
            height: canvas.height,
            
            isVisible: (object) => {
                return canvasOptimizer.isInViewport(object, this.x, this.y, this.width, this.height);
            },
            
            update: (x, y, width = canvas.width, height = canvas.height) => {
                this.x = x;
                this.y = y;
                this.width = width;
                this.height = height;
            }
        };
        
        // Game state management helpers
        const gameState = {
            save: (gameId, state) => {
                const stateWithTimestamp = {
                    ...state,
                    timestamp: Date.now(),
                    gameId
                };
                gameStateManager.saveGameState(gameId, stateWithTimestamp);
            },
            
            load: (gameId) => {
                return gameStateManager.loadGameState(gameId);
            },
            
            clear: (gameId) => {
                gameStateManager.clearGameState(gameId);
            },
            
            pause: (gameId) => {
                gameStateManager.pauseGame(gameId);
            },
            
            resume: (gameId) => {
                gameStateManager.resumeGame(gameId);
            },
            
            saveHighScore: (gameId, score, playerName) => {
                return gameStateManager.saveHighScore(gameId, score, playerName);
            },
            
            getHighScores: (gameId) => {
                return gameStateManager.getHighScores(gameId);
            }
        };
        
        // Performance monitoring wrapper
        const performance = {
            getMetrics: () => {
                return gameStateManager.getPerformanceMetrics();
            },
            
            startFrame: () => {
                gameStateManager.updatePerformanceMetrics();
            },
            
            isLowPerformance: () => {
                const metrics = gameStateManager.getPerformanceMetrics();
                return metrics.fps < 30;
            }
        };
        
        // Object pooling helper
        const createPool = (createFn, resetFn, initialSize) => {
            return canvasOptimizer.createObjectPool(createFn, resetFn, initialSize);
        };
        
        // Enhanced cleanup function
        const originalCleanup = window.currentGameCleanup;
        
        window.currentGameCleanup = () => {
            // Call original cleanup first
            if (originalCleanup) {
                originalCleanup();
            }
            
            // Performance and optimization cleanup
            gameStateManager.disablePerformanceMonitoring();
            gameStateManager.cleanupUnusedStates();
            canvasOptimizer.cleanup();
            
            // Restore original context methods
            ctx.fillRect = originalFillRect;
            ctx.strokeRect = originalStrokeRect;
            ctx.arc = originalArc;
            ctx.clearRect = originalClearRect;
        };
        
        // Initialize game with enhanced context and utilities
        try {
            gameInitFunction(canvas, optimizedCtx, {
                viewport,
                gameState,
                performance,
                createPool
            });
        } catch (error) {
            console.error('Game initialization failed:', error);
            
            // Fallback to regular context if optimization fails
            gameInitFunction(canvas, ctx);
        }
    };
}

// Utility to wrap all games with performance optimization
export function optimizeAllGames(gameImplementations) {
    const optimizedGames = {};
    
    Object.entries(gameImplementations).forEach(([gameId, gameInit]) => {
        optimizedGames[gameId] = withPerformanceOptimization(gameInit);
    });
    
    return optimizedGames;
}

// Performance testing helper
export function runPerformanceTest(gameId, testDuration = 10000) {
    return new Promise((resolve) => {
        gameStateManager.enablePerformanceMonitoring();
        
        setTimeout(() => {
            const metrics = gameStateManager.getPerformanceMetrics();
            gameStateManager.disablePerformanceMonitoring();
            
            resolve({
                gameId,
                testDuration,
                averageFPS: metrics.averageFps,
                finalFPS: metrics.fps,
                totalFrames: metrics.frameCount,
                performanceGrade: metrics.averageFps >= 55 ? 'Excellent' :
                                 metrics.averageFps >= 45 ? 'Good' :
                                 metrics.averageFps >= 30 ? 'Fair' : 'Poor'
            });
        }, testDuration);
    });
}

export default {
    withPerformanceOptimization,
    optimizeAllGames,
    runPerformanceTest
};