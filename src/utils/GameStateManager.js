class GameStateManager {
    constructor() {
        this.gameStates = new Map();
        this.performanceMetrics = {
            fps: 0,
            frameCount: 0,
            lastFrameTime: 0,
            averageFps: 0
        };
        this.isPerformanceMonitoringEnabled = false;
    }
    
    // Game state management
    saveGameState(gameId, state) {
        try {
            const serializedState = JSON.stringify(state);
            localStorage.setItem(`gameState_${gameId}`, serializedState);
            this.gameStates.set(gameId, state);
        } catch (error) {
            console.warn(`Failed to save state for ${gameId}:`, error);
        }
    }
    
    loadGameState(gameId) {
        try {
            const saved = localStorage.getItem(`gameState_${gameId}`);
            if (saved) {
                const state = JSON.parse(saved);
                this.gameStates.set(gameId, state);
                return state;
            }
        } catch (error) {
            console.warn(`Failed to load state for ${gameId}:`, error);
        }
        return null;
    }
    
    clearGameState(gameId) {
        localStorage.removeItem(`gameState_${gameId}`);
        this.gameStates.delete(gameId);
    }
    
    getCurrentState(gameId) {
        return this.gameStates.get(gameId) || null;
    }
    
    // Performance monitoring
    enablePerformanceMonitoring() {
        this.isPerformanceMonitoringEnabled = true;
        this.performanceMetrics.lastFrameTime = performance.now();
    }
    
    disablePerformanceMonitoring() {
        this.isPerformanceMonitoringEnabled = false;
    }
    
    updatePerformanceMetrics() {
        if (!this.isPerformanceMonitoringEnabled) return;
        
        const currentTime = performance.now();
        const deltaTime = currentTime - this.performanceMetrics.lastFrameTime;
        
        if (deltaTime > 0) {
            this.performanceMetrics.fps = 1000 / deltaTime;
            this.performanceMetrics.frameCount++;
            
            // Calculate average FPS over last 60 frames
            if (this.performanceMetrics.frameCount % 60 === 0) {
                this.performanceMetrics.averageFps = this.performanceMetrics.fps;
            }
        }
        
        this.performanceMetrics.lastFrameTime = currentTime;
        
        // Warn if performance is poor
        if (this.performanceMetrics.fps < 30 && this.performanceMetrics.frameCount % 60 === 0) {
            console.warn(`Low FPS detected: ${this.performanceMetrics.fps.toFixed(1)} fps`);
        }
    }
    
    getPerformanceMetrics() {
        return {
            ...this.performanceMetrics,
            fps: Math.round(this.performanceMetrics.fps * 100) / 100
        };
    }
    
    // Memory management
    cleanupUnusedStates() {
        // Remove states older than 1 hour
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        
        for (const [gameId] of this.gameStates) {
            try {
                const saved = localStorage.getItem(`gameState_${gameId}`);
                if (saved) {
                    const state = JSON.parse(saved);
                    if (state.timestamp && state.timestamp < oneHourAgo) {
                        this.clearGameState(gameId);
                    }
                }
            } catch (error) {
                // Remove corrupted states
                this.clearGameState(gameId);
            }
        }
    }
    
    // Game pause/resume functionality
    pauseGame(gameId) {
        const state = this.getCurrentState(gameId);
        if (state) {
            state.paused = true;
            state.pauseTime = Date.now();
            this.saveGameState(gameId, state);
        }
    }
    
    resumeGame(gameId) {
        const state = this.getCurrentState(gameId);
        if (state && state.paused) {
            const pauseDuration = Date.now() - (state.pauseTime || 0);
            state.paused = false;
            state.totalPauseTime = (state.totalPauseTime || 0) + pauseDuration;
            delete state.pauseTime;
            this.saveGameState(gameId, state);
        }
    }
    
    // High scores management
    saveHighScore(gameId, score, playerName = 'Anonymous') {
        const key = `highScores_${gameId}`;
        let highScores = [];
        
        try {
            const saved = localStorage.getItem(key);
            if (saved) {
                highScores = JSON.parse(saved);
            }
        } catch (error) {
            console.warn(`Failed to load high scores for ${gameId}`);
        }
        
        highScores.push({
            score,
            playerName,
            timestamp: Date.now(),
            date: new Date().toLocaleDateString()
        });
        
        // Keep only top 10 scores
        highScores.sort((a, b) => b.score - a.score);
        highScores = highScores.slice(0, 10);
        
        try {
            localStorage.setItem(key, JSON.stringify(highScores));
        } catch (error) {
            console.warn(`Failed to save high scores for ${gameId}`);
        }
        
        return highScores;
    }
    
    getHighScores(gameId) {
        try {
            const saved = localStorage.getItem(`highScores_${gameId}`);
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.warn(`Failed to load high scores for ${gameId}`);
            return [];
        }
    }
    
    // Resource preloading for better performance
    preloadAssets(assets) {
        return Promise.all(assets.map(asset => {
            return new Promise((resolve, reject) => {
                if (asset.type === 'image') {
                    const img = new Image();
                    img.onload = () => resolve(img);
                    img.onerror = reject;
                    img.src = asset.src;
                } else if (asset.type === 'audio') {
                    const audio = new Audio();
                    audio.addEventListener('canplaythrough', () => resolve(audio));
                    audio.addEventListener('error', reject);
                    audio.src = asset.src;
                } else {
                    resolve(asset);
                }
            });
        }));
    }
}

// Singleton instance
const gameStateManager = new GameStateManager();

export default gameStateManager;