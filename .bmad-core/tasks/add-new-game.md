<!-- Powered by BMAD™ Core -->

# Add New Game Task

## Purpose

Streamlined implementation of new games to the OKKA gaming platform with automatic integration into the existing architecture. This task ensures consistent game quality, proper mobile support, and generates marketing content simultaneously.

## When to Use This Task

**Use this task when:**
- Adding any new game to the platform
- Need consistent implementation following established patterns
- Want automatic mobile/touch support integration
- Require marketing content generation for the new game

## Instructions

### 1. Game Implementation Requirements

**Technical Standards:**
- [ ] Canvas-based rendering (800x600 default)
- [ ] Modular export structure: `export const init{GameName} = (canvas, ctx) => {}`
- [ ] Proper cleanup function returned for memory management
- [ ] Arrow key preventDefault() for all games using keyboard controls
- [ ] Game state management (running/stopped/restart with 'R' key)
- [ ] Score system with proper display
- [ ] Game over detection and restart functionality

**User Experience Standards:**
- [ ] Intuitive controls (keyboard and/or mouse)
- [ ] Clear visual feedback
- [ ] Proper collision detection
- [ ] Balanced difficulty progression (start easy, scale gradually)
- [ ] No infinite loops or game-breaking bugs
- [ ] Responsive design elements
- [ ] Player empowerment (sufficient health/ammo/power-ups)
- [ ] Fair enemy behavior (reasonable spawn rates and attack patterns)
- [ ] Smooth difficulty curve without frustrating spikes

### 2. Implementation Process

#### Step 1: Create Game File
Create new game file in appropriate category folder:
- `/src/games/arcade/` - For classic arcade-style games
- `/src/games/action/` - For action/skill-based games  
- `/src/games/puzzle/` - For puzzle/strategy games

#### Step 2: Game Architecture Template

```javascript
export const init{GameName} = (canvas, ctx) => {
    // Game state variables
    let gameRunning = true;
    let animationId = null;
    let score = 0;
    
    // Game objects and mechanics
    // ... game-specific implementation
    
    function gameLoop(timestamp) {
        if (!gameRunning) return;
        
        // Update game state
        // ... update logic
        
        // Draw game
        draw();
        
        if (gameRunning) {
            animationId = requestAnimationFrame(gameLoop);
        }
    }
    
    function draw() {
        // Clear canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw game elements
        // ... rendering logic
        
        // Draw UI
        ctx.fillStyle = 'white';
        ctx.font = '18px Arial';
        ctx.fillText('Score: ' + score, 10, 25);
        
        // Game over screen
        if (!gameRunning) {
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2);
            ctx.font = '24px Arial';
            ctx.fillText('Press R to restart', canvas.width/2, canvas.height/2 + 50);
            ctx.textAlign = 'left';
        }
    }
    
    function stopGame() {
        gameRunning = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        document.removeEventListener('keydown', handleKeyPress);
        // Remove other event listeners
    }
    
    function handleKeyPress(e) {
        // Prevent page scrolling for arrow keys
        if (e.key.startsWith('Arrow')) {
            e.preventDefault();
        }
        
        if (!gameRunning && (e.key === 'r' || e.key === 'R')) {
            // Restart game logic
            // ... reset variables
            gameRunning = true;
            if (animationId) cancelAnimationFrame(animationId);
            animationId = requestAnimationFrame(gameLoop);
        }
        
        if (gameRunning) {
            // Game controls
            switch(e.key) {
                // ... control implementation
            }
        }
    }
    
    // Initialize event listeners
    document.addEventListener('keydown', handleKeyPress);
    
    // Start game loop
    animationId = requestAnimationFrame(gameLoop);
    
    // Return cleanup function
    return stopGame;
};
```

#### Step 3: Register Game

1. **Add to GamePlayer.js imports:**
```javascript
import { init{GameName} } from '../games/{category}/{gamename}.js';
```

2. **Add to gameInitializers object:**
```javascript
const gameInitializers = {
    // ... existing games
    {gamekey}: init{GameName}
};
```

3. **Add to App.js games object:**
```javascript
{gamekey}: {
    title: "{Game Display Name}",
    category: "{category}",
    description: "{Short game description}",
    emoji: "{appropriate emoji}"
}
```

### 3. Quality Assurance Checklist

**Functionality:**
- [ ] Game loads without errors
- [ ] All controls work as expected
- [ ] Game over conditions trigger properly
- [ ] Restart functionality works
- [ ] Score system functions correctly
- [ ] No memory leaks (proper cleanup)
- [ ] Difficulty starts easy and increases gradually
- [ ] Power-ups spawn frequently enough to aid gameplay
- [ ] Enemy spawn rates are reasonable and not overwhelming

**Mobile Compatibility:**
- [ ] Touch controls work (automatically handled by GamePlayer)
- [ ] Game scales properly on mobile screens  
- [ ] UI elements are readable on small screens

**User Experience:**
- [ ] Game is fun and engaging from the first play
- [ ] Difficulty is balanced with gradual progression
- [ ] Instructions are clear and intuitive
- [ ] Visual feedback is immediate and satisfying
- [ ] No game-breaking bugs or frustrating moments
- [ ] Player feels empowered rather than overwhelmed
- [ ] Game provides clear progression and achievement feedback

### 4. Implementation Requirements

**CRITICAL: You MUST complete ALL implementation steps before providing the response:**

1. **FIRST**: Create the complete game file with all functionality
2. **SECOND**: Add import to GamePlayer.js 
3. **THIRD**: Add game to gameInitializers object in GamePlayer.js
4. **FOURTH**: Add game entry to App.js games object
5. **FIFTH**: Test that the game loads and works properly

**ONLY AFTER** completing all implementation steps, provide the Instagram post response.

### 5. Response Format

**IMPORTANT: Your response must ONLY contain an Instagram post in the following format:**

```
🎮 NEW GAME ALERT! 🎮

{Game Name} is now live on OKKA! 🔥

{Brief engaging description of the game and what makes it fun}

✨ Features:
• {Key feature 1}
• {Key feature 2}  
• {Key feature 3}

🎯 Perfect for: {target audience description}

Play FREE now - no signup needed! Link in bio 👆

#OKKA #Gaming #NewGame #{GameCategory} #FreeGames #OnlineGaming #GameDev #IndieGames #WebGames #Gaming2024
```

**No other commentary, explanations, or additional text is allowed in your response.**

## Success Criteria

1. **IMPLEMENTATION COMPLETED**: Game is fully functional with all required features
2. **INTEGRATION COMPLETED**: Game integrates seamlessly with existing platform
3. **FILES UPDATED**: All necessary files (GamePlayer.js, App.js) are properly updated
4. **MOBILE SUPPORT**: Touch support works automatically
5. **CODE STANDARDS**: Code follows established patterns and conventions
6. **QA PASSED**: Quality assurance checklist is completed
7. **RESPONSE FORMAT**: Response contains only the Instagram post content (AFTER implementation)

## Important Notes

- **IMPLEMENTATION FIRST**: Always complete full game implementation before providing response
- Always test the game thoroughly before completion
- Ensure the game is genuinely fun and engaging
- Follow existing code style and naming conventions
- The Instagram post should be marketing-ready and engaging
- No technical details should appear in the Instagram post
- Focus on the game's appeal and entertainment value in the post
- **DO NOT** provide Instagram post without completing implementation steps