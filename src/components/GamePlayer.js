import React, { useEffect, useRef } from 'react';

const GamePlayer = ({ gameId, gameData, onBackClick }) => {
  const canvasRef = useRef(null);
  const gameInstanceRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Clean up previous game
      if (window.currentGameCleanup) {
        window.currentGameCleanup();
        window.currentGameCleanup = null;
      }
      
      // Initialize new game - exactly like the original script.js
      switch (gameId) {
        case 'tetris':
          initTetris(canvas, ctx);
          break;
        case 'snake':
          initSnake(canvas, ctx);
          break;
        case 'pong':
          initPong(canvas, ctx);
          break;
        case 'breakout':
          initBreakout(canvas, ctx);
          break;
        case 'pacman':
          initPacman(canvas, ctx);
          break;
        case 'spaceinvaders':
          initSpaceInvaders(canvas, ctx);
          break;
        case 'slither':
          initSlither(canvas, ctx);
          break;
        case 'asteroids':
          initAsteroids(canvas, ctx);
          break;
        case 'frogger':
          initFrogger(canvas, ctx);
          break;
        case 'doodle':
          initDoodleJump(canvas, ctx);
          break;
        case 'flappybird':
          initFlappyBird(canvas, ctx);
          break;
        case 'subway':
          initSubwaySurfers(canvas, ctx);
          break;
        case 'rider':
          initRider(canvas, ctx);
          break;
        case 'hillclimb':
          initHillClimbRacing(canvas, ctx);
          break;
        case 'mario':
          initMarioBros(canvas, ctx);
          break;
        case 'duckhunt':
          initDuckHunt(canvas, ctx);
          break;
        case 'casino':
          initCasinoSlots(canvas, ctx);
          break;
        case 'blackjack':
          initBlackjack(canvas, ctx);
          break;
        case 'stack':
          initStack(canvas, ctx);
          break;
        case 'tripwire':
          initTripwireHook(canvas, ctx);
          break;
        case 'basejump':
          initBaseJump(canvas, ctx);
          break;
        case 'clickspeed':
          initClickSpeed(canvas, ctx);
          break;
        case 'longjump':
          initLongJump(canvas, ctx);
          break;
        case 'pvpcombat':
          initPvPCombat(canvas, ctx);
          break;
        default:
          // Simple placeholder for other games
          ctx.fillStyle = '#000';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = 'white';
          ctx.font = '48px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(gameData.emoji, canvas.width/2, canvas.height/2 - 50);
          ctx.font = '24px Arial';
          ctx.fillText(gameData.title, canvas.width/2, canvas.height/2 + 20);
          ctx.font = '16px Arial';
          ctx.fillText('Vollständige Implementierung folgt bald!', canvas.width/2, canvas.height/2 + 60);
          window.currentGameCleanup = () => {};
          break;
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

// EXACT COPY FROM ORIGINAL SCRIPT.JS - ALL GAME IMPLEMENTATIONS

// TETRIS IMPLEMENTATION
function initTetris(canvas, ctx) {
    const BOARD_WIDTH = 10;
    const BOARD_HEIGHT = 20;
    const BLOCK_SIZE = 30;
    
    let board = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0));
    let currentPiece = null;
    let nextPiece = null;
    let currentX = 0;
    let currentY = 0;
    let score = 0;
    let level = 1;
    let lines = 0;
    let dropTime = 0;
    let dropSpeed = 800;
    let gameRunning = true;
    let fastDrop = false;
    let animationId = null;
    
    const colors = ['#000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500'];
    
    const pieces = [
        // I-Piece
        [[[1,1,1,1]]],
        // O-Piece
        [[[1,1],[1,1]]],
        // T-Piece
        [[[0,1,0],[1,1,1]], [[1,0],[1,1],[1,0]], [[1,1,1],[0,1,0]], [[0,1],[1,1],[0,1]]],
        // S-Piece
        [[[0,1,1],[1,1,0]], [[1,0],[1,1],[0,1]]],
        // Z-Piece
        [[[1,1,0],[0,1,1]], [[0,1],[1,1],[1,0]]],
        // J-Piece
        [[[1,0,0],[1,1,1]], [[1,1],[1,0],[1,0]], [[1,1,1],[0,0,1]], [[0,1],[0,1],[1,1]]],
        // L-Piece
        [[[0,0,1],[1,1,1]], [[1,0],[1,0],[1,1]], [[1,1,1],[1,0,0]], [[1,1],[0,1],[0,1]]]
    ];
    
    function getRandomPiece() {
        const pieceIndex = Math.floor(Math.random() * pieces.length);
        const rotationIndex = Math.floor(Math.random() * pieces[pieceIndex].length);
        return {
            shape: pieces[pieceIndex][rotationIndex],
            color: pieceIndex + 1,
            rotations: pieces[pieceIndex],
            rotationIndex: rotationIndex
        };
    }
    
    function spawnPiece() {
        if (!nextPiece) nextPiece = getRandomPiece();
        currentPiece = nextPiece;
        nextPiece = getRandomPiece();
        currentX = Math.floor(BOARD_WIDTH / 2) - 1;
        currentY = 0;
        
        if (!isValidPosition(currentX, currentY, currentPiece.shape)) {
            gameRunning = false;
        }
    }
    
    function isValidPosition(x, y, shape) {
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const newX = x + col;
                    const newY = y + row;
                    
                    if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
                        return false;
                    }
                    
                    if (newY >= 0 && board[newY][newX]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    
    function placePiece() {
        for (let row = 0; row < currentPiece.shape.length; row++) {
            for (let col = 0; col < currentPiece.shape[row].length; col++) {
                if (currentPiece.shape[row][col]) {
                    const x = currentX + col;
                    const y = currentY + row;
                    if (y >= 0) {
                        board[y][x] = currentPiece.color;
                    }
                }
            }
        }
        
        clearLines();
        spawnPiece();
    }
    
    function clearLines() {
        let linesCleared = 0;
        for (let row = BOARD_HEIGHT - 1; row >= 0; row--) {
            if (board[row].every(cell => cell !== 0)) {
                board.splice(row, 1);
                board.unshift(Array(BOARD_WIDTH).fill(0));
                linesCleared++;
                row++; // Check the same row again
            }
        }
        
        if (linesCleared > 0) {
            lines += linesCleared;
            score += linesCleared * 100 * level;
            
            // Level up every 10 lines
            const newLevel = Math.floor(lines / 10) + 1;
            if (newLevel > level) {
                level = newLevel;
                dropSpeed = Math.max(50, 800 - (level - 1) * 50);
            }
        }
    }
    
    function dropPiece() {
        if (isValidPosition(currentX, currentY + 1, currentPiece.shape)) {
            currentY++;
        } else {
            placePiece();
        }
    }
    
    function movePiece(dx) {
        if (isValidPosition(currentX + dx, currentY, currentPiece.shape)) {
            currentX += dx;
        }
    }
    
    function rotatePiece() {
        const nextRotation = (currentPiece.rotationIndex + 1) % currentPiece.rotations.length;
        const newShape = currentPiece.rotations[nextRotation];
        
        if (isValidPosition(currentX, currentY, newShape)) {
            currentPiece.shape = newShape;
            currentPiece.rotationIndex = nextRotation;
        }
    }
    
    function draw() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw board
        for (let row = 0; row < BOARD_HEIGHT; row++) {
            for (let col = 0; col < BOARD_WIDTH; col++) {
                if (board[row][col]) {
                    ctx.fillStyle = colors[board[row][col]];
                    ctx.fillRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
                }
            }
        }
        
        // Draw current piece
        if (currentPiece && gameRunning) {
            ctx.fillStyle = colors[currentPiece.color];
            for (let row = 0; row < currentPiece.shape.length; row++) {
                for (let col = 0; col < currentPiece.shape[row].length; col++) {
                    if (currentPiece.shape[row][col]) {
                        ctx.fillRect(
                            (currentX + col) * BLOCK_SIZE,
                            (currentY + row) * BLOCK_SIZE,
                            BLOCK_SIZE - 1,
                            BLOCK_SIZE - 1
                        );
                    }
                }
            }
        }
        
        // Draw next piece
        if (nextPiece) {
            ctx.fillStyle = colors[nextPiece.color];
            for (let row = 0; row < nextPiece.shape.length; row++) {
                for (let col = 0; col < nextPiece.shape[row].length; col++) {
                    if (nextPiece.shape[row][col]) {
                        ctx.fillRect(
                            (BOARD_WIDTH + 2 + col) * BLOCK_SIZE,
                            (2 + row) * BLOCK_SIZE,
                            BLOCK_SIZE - 1,
                            BLOCK_SIZE - 1
                        );
                    }
                }
            }
        }
        
        // Draw UI
        ctx.fillStyle = 'white';
        ctx.font = '18px Arial';
        ctx.fillText('Score: ' + score, (BOARD_WIDTH + 1) * BLOCK_SIZE, 50);
        ctx.fillText('Level: ' + level, (BOARD_WIDTH + 1) * BLOCK_SIZE, 80);
        ctx.fillText('Lines: ' + lines, (BOARD_WIDTH + 1) * BLOCK_SIZE, 110);
        ctx.fillText('Next:', (BOARD_WIDTH + 1) * BLOCK_SIZE, 140);
        
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
    
    function gameLoop(timestamp) {
        if (gameRunning) {
            const currentDropSpeed = fastDrop ? 50 : dropSpeed;
            if (timestamp - dropTime > currentDropSpeed) {
                dropPiece();
                dropTime = timestamp;
            }
        }
        
        draw();
        if (gameRunning) {
            animationId = requestAnimationFrame(gameLoop);
        }
    }
    
    function stopGame() {
        gameRunning = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        document.removeEventListener('keydown', handleKeyPress);
        document.removeEventListener('keyup', handleKeyUp);
    }
    
    function handleKeyPress(e) {
        if (!gameRunning) {
            if (e.key === 'r' || e.key === 'R') {
                // Restart game
                board = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0));
                score = 0;
                level = 1;
                lines = 0;
                dropTime = 0;
                dropSpeed = 800;
                gameRunning = true;
                fastDrop = false;
                nextPiece = null;
                if (animationId) cancelAnimationFrame(animationId);
                spawnPiece();
                animationId = requestAnimationFrame(gameLoop);
            }
            return;
        }
        
        switch(e.key) {
            case 'ArrowLeft':
                movePiece(-1);
                break;
            case 'ArrowRight':
                movePiece(1);
                break;
            case 'ArrowDown':
                fastDrop = true;
                break;
            case 'ArrowUp':
            case ' ':
                rotatePiece();
                break;
        }
    }
    
    function handleKeyUp(e) {
        if (e.key === 'ArrowDown') {
            fastDrop = false;
        }
    }
    
    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('keyup', handleKeyUp);
    
    spawnPiece();
    animationId = requestAnimationFrame(gameLoop);
    
    // Expose stop function globally for cleanup
    window.currentGameCleanup = stopGame;
}

// SNAKE IMPLEMENTATION
function initSnake(canvas, ctx) {
    const GRID_SIZE = 20;
    const GRID_WIDTH = canvas.width / GRID_SIZE;
    const GRID_HEIGHT = canvas.height / GRID_SIZE;
    
    let snake = [{x: 10, y: 10}];
    let food = {x: 15, y: 15};
    let specialFood = null;
    let obstacles = [];
    let dx = 0;
    let dy = 0;
    let score = 0;
    let level = 1;
    let speed = 150;
    let gameRunning = true;
    let specialFoodTimer = 0;
    let animationId = null;
    let lastMoveTime = 0;
    
    function generateFood() {
        let attempts = 0;
        do {
            food = {
                x: Math.floor(Math.random() * GRID_WIDTH),
                y: Math.floor(Math.random() * GRID_HEIGHT)
            };
            attempts++;
            if (attempts > 100) break; // Prevent infinite loop
        } while (isOccupied(food.x, food.y) && attempts < 100);
    }
    
    function generateSpecialFood() {
        if (Math.random() < 0.3) {
            let attempts = 0;
            do {
                specialFood = {
                    x: Math.floor(Math.random() * GRID_WIDTH),
                    y: Math.floor(Math.random() * GRID_HEIGHT),
                    timer: 150 // disappears after time
                };
                attempts++;
                if (attempts > 100) break; // Prevent infinite loop
            } while (isOccupied(specialFood.x, specialFood.y) && attempts < 100);
        }
    }
    
    function generateObstacles() {
        obstacles = [];
        const numObstacles = Math.min(level * 2, 15);
        
        for (let i = 0; i < numObstacles; i++) {
            let obstacle;
            let attempts = 0;
            do {
                obstacle = {
                    x: Math.floor(Math.random() * GRID_WIDTH),
                    y: Math.floor(Math.random() * GRID_HEIGHT)
                };
                attempts++;
                if (attempts > 100) break; // Prevent infinite loop
            } while ((isOccupied(obstacle.x, obstacle.y) || 
                    (obstacle.x >= 8 && obstacle.x <= 12 && obstacle.y >= 8 && obstacle.y <= 12)) && attempts < 100);
            
            obstacles.push(obstacle);
        }
    }
    
    function isOccupied(x, y) {
        // Check snake
        for (let segment of snake) {
            if (segment.x === x && segment.y === y) return true;
        }
        // Check obstacles
        for (let obstacle of obstacles) {
            if (obstacle.x === x && obstacle.y === y) return true;
        }
        // Check foods
        if (food && food.x === x && food.y === y) return true;
        if (specialFood && specialFood.x === x && specialFood.y === y) return true;
        
        return false;
    }
    
    function moveSnake() {
        if (!gameRunning) return;
        
        const head = {x: snake[0].x + dx, y: snake[0].y + dy};
        
        // Check wall collision
        if (head.x < 0 || head.x >= GRID_WIDTH || head.y < 0 || head.y >= GRID_HEIGHT) {
            gameRunning = false;
            return;
        }
        
        // Check self collision
        for (let segment of snake) {
            if (head.x === segment.x && head.y === segment.y) {
                gameRunning = false;
                return;
            }
        }
        
        // Check obstacle collision
        for (let obstacle of obstacles) {
            if (head.x === obstacle.x && head.y === obstacle.y) {
                gameRunning = false;
                return;
            }
        }
        
        snake.unshift(head);
        
        // Check food collision
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            
            // Level up every 50 points
            const newLevel = Math.floor(score / 50) + 1;
            if (newLevel > level) {
                level = newLevel;
                speed = Math.max(50, speed - 10);
                generateObstacles();
            }
            
            generateFood();
            if (Math.random() < 0.3) generateSpecialFood();
        } else if (specialFood && head.x === specialFood.x && head.y === specialFood.y) {
            score += 50;
            specialFood = null;
        } else {
            snake.pop();
        }
        
        // Update special food timer
        if (specialFood) {
            specialFood.timer--;
            if (specialFood.timer <= 0) {
                specialFood = null;
            }
        }
    }
    
    function draw() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw snake
        ctx.fillStyle = '#0F0';
        for (let segment of snake) {
            ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
        }
        
        // Draw food
        ctx.fillStyle = '#F00';
        ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
        
        // Draw special food
        if (specialFood) {
            const alpha = Math.sin(specialFood.timer * 0.1) * 0.3 + 0.7;
            ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
            ctx.fillRect(specialFood.x * GRID_SIZE, specialFood.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
        }
        
        // Draw obstacles
        ctx.fillStyle = '#666';
        for (let obstacle of obstacles) {
            ctx.fillRect(obstacle.x * GRID_SIZE, obstacle.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
        }
        
        // Draw UI
        ctx.fillStyle = 'white';
        ctx.font = '18px Arial';
        ctx.fillText('Score: ' + score, 10, 25);
        ctx.fillText('Level: ' + level, 150, 25);
        ctx.fillText('Speed: ' + Math.round(1000/speed), 250, 25);
        
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
    
    function gameLoop(timestamp) {
        if (!gameRunning) return;
        
        // Only move snake at specified speed intervals
        if (timestamp - lastMoveTime > speed) {
            moveSnake();
            lastMoveTime = timestamp;
        }
        
        draw();
        if (gameRunning) {
            animationId = requestAnimationFrame(gameLoop);
        }
    }
    
    function stopGame() {
        gameRunning = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        document.removeEventListener('keydown', handleKeyPress);
    }
    
    function handleKeyPress(e) {
        if (!gameRunning) {
            if (e.key === 'r' || e.key === 'R') {
                // Restart game
                snake = [{x: 10, y: 10}];
                dx = 0;
                dy = 0;
                score = 0;
                level = 1;
                speed = 150;
                obstacles = [];
                specialFood = null;
                gameRunning = true;
                lastMoveTime = 0;
                if (animationId) cancelAnimationFrame(animationId);
                generateFood();
                generateObstacles();
                animationId = requestAnimationFrame(gameLoop);
            }
            return;
        }
        
        switch(e.key) {
            case 'ArrowUp':
                if (dy !== 1) { dx = 0; dy = -1; }
                break;
            case 'ArrowDown':
                if (dy !== -1) { dx = 0; dy = 1; }
                break;
            case 'ArrowLeft':
                if (dx !== 1) { dx = -1; dy = 0; }
                break;
            case 'ArrowRight':
                if (dx !== -1) { dx = 1; dy = 0; }
                break;
        }
    }
    
    document.addEventListener('keydown', handleKeyPress);
    
    generateFood();
    generateObstacles();
    animationId = requestAnimationFrame(gameLoop);
    
    // Expose stop function globally for cleanup
    window.currentGameCleanup = stopGame;
}

// PONG IMPLEMENTATION
function initPong(canvas, ctx) {
    const PADDLE_HEIGHT = 100;
    const PADDLE_WIDTH = 10;
    const BALL_SIZE = 10;
    
    let leftPaddle = {x: 10, y: canvas.height/2 - PADDLE_HEIGHT/2, dy: 0};
    let rightPaddle = {x: canvas.width - 20, y: canvas.height/2 - PADDLE_HEIGHT/2, dy: 0};
    let ball = {
        x: canvas.width/2,
        y: canvas.height/2,
        dx: 5,
        dy: 3
    };
    
    let leftScore = 0;
    let rightScore = 0;
    let gameRunning = true;
    let difficulty = 1;
    let aiSpeed = 4;
    let ballSpeedMultiplier = 1;
    let powerUps = [];
    let gameStarted = false;
    let animationId = null;
    
    const keys = {};
    
    function updatePaddles() {
        // Player controls (left paddle)
        if (keys['ArrowUp'] && leftPaddle.y > 0) {
            leftPaddle.y -= 8;
        }
        if (keys['ArrowDown'] && leftPaddle.y < canvas.height - PADDLE_HEIGHT) {
            leftPaddle.y += 8;
        }
        
        // Enhanced AI controls (right paddle)
        const paddleCenter = rightPaddle.y + PADDLE_HEIGHT/2;
        const ballCenter = ball.y + BALL_SIZE/2;
        const deadZone = 20 / difficulty; // Smaller dead zone = harder AI
        
        // Predict where ball will be
        let predictedY = ballCenter;
        if (ball.dx > 0) { // Ball moving towards AI
            const timeToReach = (rightPaddle.x - ball.x) / ball.dx;
            predictedY = ball.y + ball.dy * timeToReach;
        }
        
        if (paddleCenter < predictedY - deadZone) {
            rightPaddle.y += aiSpeed;
        } else if (paddleCenter > predictedY + deadZone) {
            rightPaddle.y -= aiSpeed;
        }
        
        // Add slight randomness to make AI less perfect
        if (Math.random() < 0.05) {
            rightPaddle.y += (Math.random() - 0.5) * 10;
        }
        
        // Keep paddles in bounds
        rightPaddle.y = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, rightPaddle.y));
    }
    
    function spawnPowerUp() {
        if (Math.random() < 0.1 && powerUps.length < 2) {
            powerUps.push({
                x: canvas.width/2 + (Math.random() - 0.5) * 200,
                y: Math.random() * (canvas.height - 40) + 20,
                type: Math.random() < 0.5 ? 'speed' : 'size',
                timer: 300
            });
        }
    }
    
    function updateBall() {
        ball.x += ball.dx * ballSpeedMultiplier;
        ball.y += ball.dy * ballSpeedMultiplier;
        
        // Top and bottom wall bounces
        if (ball.y <= 0 || ball.y >= canvas.height - BALL_SIZE) {
            ball.dy = -ball.dy;
        }
        
        // Left paddle collision
        if (ball.x <= leftPaddle.x + PADDLE_WIDTH && 
            ball.y >= leftPaddle.y && 
            ball.y <= leftPaddle.y + PADDLE_HEIGHT) {
            ball.dx = Math.abs(ball.dx);
            const relativeIntersectY = (leftPaddle.y + PADDLE_HEIGHT/2) - ball.y;
            const normalizedRelativeIntersection = relativeIntersectY / (PADDLE_HEIGHT/2);
            ball.dy = normalizedRelativeIntersection * -5;
        }
        
        // Right paddle collision
        if (ball.x >= rightPaddle.x - BALL_SIZE && 
            ball.y >= rightPaddle.y && 
            ball.y <= rightPaddle.y + PADDLE_HEIGHT) {
            ball.dx = -Math.abs(ball.dx);
            const relativeIntersectY = (rightPaddle.y + PADDLE_HEIGHT/2) - ball.y;
            const normalizedRelativeIntersection = relativeIntersectY / (PADDLE_HEIGHT/2);
            ball.dy = normalizedRelativeIntersection * -5;
        }
        
        // Power-up collision
        for (let i = powerUps.length - 1; i >= 0; i--) {
            const powerUp = powerUps[i];
            if (ball.x < powerUp.x + 20 && ball.x + BALL_SIZE > powerUp.x &&
                ball.y < powerUp.y + 20 && ball.y + BALL_SIZE > powerUp.y) {
                
                if (powerUp.type === 'speed') {
                    ballSpeedMultiplier = Math.min(ballSpeedMultiplier + 0.3, 2);
                } else if (powerUp.type === 'size') {
                    leftPaddle.height = Math.min(leftPaddle.height + 20, 150);
                }
                
                powerUps.splice(i, 1);
            }
        }
        
        // Update power-ups
        for (let i = powerUps.length - 1; i >= 0; i--) {
            powerUps[i].timer--;
            if (powerUps[i].timer <= 0) {
                powerUps.splice(i, 1);
            }
        }
        
        // Score goals
        if (ball.x < 0) {
            rightScore++;
            if (rightScore % 2 === 0) {
                difficulty = Math.min(difficulty + 0.5, 3);
                aiSpeed = Math.min(aiSpeed + 1, 8);
            }
            resetBall();
            spawnPowerUp();
        } else if (ball.x > canvas.width) {
            leftScore++;
            resetBall();
            spawnPowerUp();
        }
        
        // Check win condition
        if (leftScore >= 10 || rightScore >= 10) {
            gameRunning = false;
        }
    }
    
    function resetBall() {
        ball.x = canvas.width/2;
        ball.y = canvas.height/2;
        ball.dx = (Math.random() > 0.5 ? 1 : -1) * 5;
        ball.dy = (Math.random() - 0.5) * 6;
    }
    
    function draw() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw center line
        ctx.setLineDash([5, 15]);
        ctx.beginPath();
        ctx.moveTo(canvas.width/2, 0);
        ctx.lineTo(canvas.width/2, canvas.height);
        ctx.strokeStyle = 'white';
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw paddles
        ctx.fillStyle = 'white';
        ctx.fillRect(leftPaddle.x, leftPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);
        ctx.fillRect(rightPaddle.x, rightPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);
        
        // Draw ball with trail effect
        ctx.fillStyle = `rgba(255, 255, 255, 0.8)`;
        ctx.fillRect(ball.x, ball.y, BALL_SIZE, BALL_SIZE);
        
        // Draw power-ups
        for (let powerUp of powerUps) {
            const alpha = Math.sin(powerUp.timer * 0.1) * 0.3 + 0.7;
            ctx.fillStyle = powerUp.type === 'speed' ? 
                `rgba(255, 100, 100, ${alpha})` : 
                `rgba(100, 255, 100, ${alpha})`;
            ctx.fillRect(powerUp.x, powerUp.y, 20, 20);
            
            // Draw power-up symbol
            ctx.fillStyle = 'white';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(powerUp.type === 'speed' ? 'S' : '+', powerUp.x + 10, powerUp.y + 13);
        }
        
        // Draw scores
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(leftScore.toString(), canvas.width/4, 60);
        ctx.fillText(rightScore.toString(), 3*canvas.width/4, 60);
        
        // Draw game info
        ctx.font = '16px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Use ↑↓ arrows to move', 10, canvas.height - 40);
        ctx.fillText(`AI Difficulty: ${difficulty.toFixed(1)}`, 10, canvas.height - 20);
        ctx.textAlign = 'right';
        ctx.fillText('Red=Speed Blue=Bigger Paddle', canvas.width - 10, canvas.height - 20);
        
        if (!gameRunning) {
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            const winner = leftScore >= 10 ? 'PLAYER WINS!' : 'AI WINS!';
            ctx.fillText(winner, canvas.width/2, canvas.height/2);
            ctx.font = '24px Arial';
            ctx.fillText('Press R to restart', canvas.width/2, canvas.height/2 + 50);
            ctx.textAlign = 'left';
        }
    }
    
    function gameLoop() {
        if (gameRunning) {
            updatePaddles();
            updateBall();
        }
        draw();
        if (gameRunning || leftScore < 10 && rightScore < 10) {
            animationId = requestAnimationFrame(gameLoop);
        }
    }
    
    function stopGame() {
        gameRunning = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
    }
    
    function handleKeyDown(e) {
        keys[e.key] = true;
        
        if (!gameRunning && (e.key === 'r' || e.key === 'R')) {
            // Restart game
            leftScore = 0;
            rightScore = 0;
            difficulty = 1;
            aiSpeed = 4;
            ballSpeedMultiplier = 1;
            powerUps = [];
            leftPaddle.y = canvas.height/2 - PADDLE_HEIGHT/2;
            rightPaddle.y = canvas.height/2 - PADDLE_HEIGHT/2;
            gameRunning = true;
            if (animationId) cancelAnimationFrame(animationId);
            resetBall();
            animationId = requestAnimationFrame(gameLoop);
        }
    }
    
    function handleKeyUp(e) {
        keys[e.key] = false;
    }
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    animationId = requestAnimationFrame(gameLoop);
    
    // Expose stop function globally for cleanup
    window.currentGameCleanup = stopGame;
}

// BREAKOUT IMPLEMENTATION
function initBreakout(canvas, ctx) {
    const PADDLE_WIDTH = 75;
    const PADDLE_HEIGHT = 10;
    const BALL_SIZE = 10;
    const BRICK_ROWS = 6;
    const BRICK_COLS = 10;
    const BRICK_WIDTH = canvas.width / BRICK_COLS;
    const BRICK_HEIGHT = 20;
    
    let paddle = { x: canvas.width/2 - PADDLE_WIDTH/2, y: canvas.height - 30, width: PADDLE_WIDTH };
    let ball = { x: canvas.width/2, y: canvas.height - 60, dx: 4, dy: -4, size: BALL_SIZE };
    let bricks = [];
    let powerUps = [];
    let particles = [];
    let score = 0;
    let level = 1;
    let lives = 3;
    let gameRunning = true;
    let gameWon = false;
    let multiball = false;
    let extraBalls = [];
    let animationId = null;
    
    const keys = {};
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
    
    function initLevel() {
        bricks = [];
        powerUps = [];
        particles = [];
        
        // Different brick patterns per level
        const patterns = [
            // Level 1: Standard rows
            () => {
                for (let row = 0; row < BRICK_ROWS; row++) {
                    bricks[row] = [];
                    for (let col = 0; col < BRICK_COLS; col++) {
                        bricks[row][col] = { 
                            x: col * BRICK_WIDTH, 
                            y: row * BRICK_HEIGHT + 50, 
                            status: 1,
                            hits: 1,
                            powerUp: Math.random() < 0.1 ? getRandomPowerUpType() : null
                        };
                    }
                }
            },
            // Level 2: Diamond pattern with stronger bricks
            () => {
                for (let row = 0; row < BRICK_ROWS; row++) {
                    bricks[row] = [];
                    for (let col = 0; col < BRICK_COLS; col++) {
                        const distance = Math.abs(col - BRICK_COLS/2) + Math.abs(row - BRICK_ROWS/2);
                        const hits = distance < 3 ? 2 : 1;
                        bricks[row][col] = { 
                            x: col * BRICK_WIDTH, 
                            y: row * BRICK_HEIGHT + 50, 
                            status: distance < 5 ? 1 : 0,
                            hits: hits,
                            maxHits: hits,
                            powerUp: Math.random() < 0.15 ? getRandomPowerUpType() : null
                        };
                    }
                }
            },
            // Level 3: Fortress pattern
            () => {
                for (let row = 0; row < BRICK_ROWS; row++) {
                    bricks[row] = [];
                    for (let col = 0; col < BRICK_COLS; col++) {
                        let hits = 1;
                        if (col === 0 || col === BRICK_COLS-1 || row === 0) hits = 3;
                        else if (col < 3 || col > BRICK_COLS-4) hits = 2;
                        
                        bricks[row][col] = { 
                            x: col * BRICK_WIDTH, 
                            y: row * BRICK_HEIGHT + 50, 
                            status: 1,
                            hits: hits,
                            maxHits: hits,
                            powerUp: Math.random() < 0.2 ? getRandomPowerUpType() : null
                        };
                    }
                }
            }
        ];
        
        const patternIndex = Math.min(level - 1, patterns.length - 1);
        patterns[patternIndex]();
    }
    
    function getRandomPowerUpType() {
        const types = ['expand', 'multiball', 'laser', 'life', 'sticky'];
        return types[Math.floor(Math.random() * types.length)];
    }
    
    function updatePaddle() {
        if (keys['ArrowLeft'] && paddle.x > 0) {
            paddle.x -= 7;
        }
        if (keys['ArrowRight'] && paddle.x < canvas.width - paddle.width) {
            paddle.x += 7;
        }
    }
    
    function updateBall() {
        ball.x += ball.dx;
        ball.y += ball.dy;
        
        // Wall collisions
        if (ball.x <= 0 || ball.x >= canvas.width - BALL_SIZE) {
            ball.dx = -ball.dx;
        }
        if (ball.y <= 0) {
            ball.dy = -ball.dy;
        }
        
        // Paddle collision
        if (ball.y >= paddle.y - ball.size && 
            ball.x >= paddle.x && 
            ball.x <= paddle.x + paddle.width) {
            const hitPos = (ball.x - paddle.x) / paddle.width;
            ball.dy = -Math.abs(ball.dy);
            ball.dx = (hitPos - 0.5) * 8;
        }
        
        // Brick collisions
        for (let row = 0; row < BRICK_ROWS; row++) {
            for (let col = 0; col < BRICK_COLS; col++) {
                const brick = bricks[row][col];
                if (brick.status === 1) {
                    if (ball.x >= brick.x && ball.x <= brick.x + BRICK_WIDTH &&
                        ball.y >= brick.y && ball.y <= brick.y + BRICK_HEIGHT) {
                        ball.dy = -ball.dy;
                        brick.hits--;
                        
                        if (brick.hits <= 0) {
                            brick.status = 0;
                            score += 10 * level;
                            
                            // Drop power-up
                            if (brick.powerUp) {
                                powerUps.push({
                                    x: brick.x + BRICK_WIDTH/2,
                                    y: brick.y + BRICK_HEIGHT,
                                    type: brick.powerUp,
                                    dy: 2
                                });
                            }
                            
                            // Create particles
                            for (let i = 0; i < 5; i++) {
                                particles.push({
                                    x: brick.x + BRICK_WIDTH/2,
                                    y: brick.y + BRICK_HEIGHT/2,
                                    dx: (Math.random() - 0.5) * 4,
                                    dy: (Math.random() - 0.5) * 4,
                                    life: 30,
                                    color: colors[row]
                                });
                            }
                        }
                    }
                }
            }
        }
        
        // Power-up collisions
        for (let i = powerUps.length - 1; i >= 0; i--) {
            const powerUp = powerUps[i];
            powerUp.y += powerUp.dy;
            
            if (powerUp.y >= paddle.y && powerUp.x >= paddle.x && 
                powerUp.x <= paddle.x + paddle.width) {
                
                switch(powerUp.type) {
                    case 'expand':
                        paddle.width = Math.min(paddle.width + 20, 120);
                        break;
                    case 'multiball':
                        for (let i = 0; i < 2; i++) {
                            extraBalls.push({
                                x: ball.x, y: ball.y,
                                dx: ball.dx + (Math.random() - 0.5) * 4,
                                dy: ball.dy, size: ball.size
                            });
                        }
                        break;
                    case 'life':
                        lives++;
                        break;
                }
                powerUps.splice(i, 1);
            } else if (powerUp.y > canvas.height) {
                powerUps.splice(i, 1);
            }
        }
        
        // Update particles
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.dx;
            p.y += p.dy;
            p.life--;
            if (p.life <= 0) particles.splice(i, 1);
        }
        
        // Check win condition
        if (bricks.every(row => row.every(brick => brick.status === 0))) {
            level++;
            if (level <= 3) {
                initLevel();
                ball = { x: canvas.width/2, y: canvas.height - 60, dx: 4 + level, dy: -4 - level, size: BALL_SIZE };
            } else {
                gameRunning = false;
                gameWon = true;
            }
        }
        
        // Check lose condition
        if (ball.y > canvas.height) {
            lives--;
            if (lives <= 0) {
                gameRunning = false;
            } else {
                ball = { x: canvas.width/2, y: canvas.height - 60, dx: 4, dy: -4, size: BALL_SIZE };
            }
        }
    }
    
    function draw() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw bricks with hit indicators
        for (let row = 0; row < BRICK_ROWS; row++) {
            for (let col = 0; col < BRICK_COLS; col++) {
                if (bricks[row][col].status === 1) {
                    const brick = bricks[row][col];
                    const alpha = brick.maxHits ? brick.hits / brick.maxHits : 1;
                    ctx.fillStyle = colors[row];
                    ctx.globalAlpha = alpha;
                    ctx.fillRect(brick.x, brick.y, BRICK_WIDTH - 2, BRICK_HEIGHT - 2);
                    ctx.globalAlpha = 1;
                }
            }
        }
        
        // Draw power-ups
        for (let powerUp of powerUps) {
            ctx.fillStyle = powerUp.type === 'expand' ? '#00FF00' : 
                           powerUp.type === 'multiball' ? '#FF0000' : '#0000FF';
            ctx.fillRect(powerUp.x - 10, powerUp.y - 5, 20, 10);
        }
        
        // Draw particles
        for (let p of particles) {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life / 30;
            ctx.fillRect(p.x, p.y, 3, 3);
            ctx.globalAlpha = 1;
        }
        
        // Draw paddle
        ctx.fillStyle = 'white';
        ctx.fillRect(paddle.x, paddle.y, paddle.width, PADDLE_HEIGHT);
        
        // Draw ball
        ctx.fillRect(ball.x, ball.y, ball.size, ball.size);
        
        // Draw UI
        ctx.font = '18px Arial';
        ctx.fillText(`Score: ${score}`, 10, 25);
        ctx.fillText(`Level: ${level}`, 150, 25);
        ctx.fillText(`Lives: ${lives}`, 250, 25);
        
        if (!gameRunning) {
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(gameWon ? 'YOU WIN!' : 'GAME OVER', canvas.width/2, canvas.height/2);
            ctx.font = '24px Arial';
            ctx.fillText('Press R to restart', canvas.width/2, canvas.height/2 + 50);
            ctx.textAlign = 'left';
        }
    }
    
    function gameLoop() {
        if (gameRunning) {
            updatePaddle();
            updateBall();
        }
        draw();
        if (gameRunning && !gameWon && lives > 0) {
            animationId = requestAnimationFrame(gameLoop);
        }
    }
    
    function stopGame() {
        gameRunning = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
    }
    
    function handleKeyDown(e) {
        keys[e.key] = true;
        if (!gameRunning && (e.key === 'r' || e.key === 'R')) {
            // Restart
            level = 1;
            lives = 3;
            score = 0;
            gameRunning = true;
            gameWon = false;
            paddle = { x: canvas.width/2 - PADDLE_WIDTH/2, y: canvas.height - 30, width: PADDLE_WIDTH };
            ball = { x: canvas.width/2, y: canvas.height - 60, dx: 4, dy: -4, size: BALL_SIZE };
            multiball = false;
            extraBalls = [];
            powerUps = [];
            particles = [];
            if (animationId) cancelAnimationFrame(animationId);
            initLevel();
            animationId = requestAnimationFrame(gameLoop);
        }
    }
    
    function handleKeyUp(e) {
        keys[e.key] = false;
    }
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    initLevel();
    animationId = requestAnimationFrame(gameLoop);
    
    // Expose stop function globally for cleanup
    window.currentGameCleanup = stopGame;
}

// PAC-MAN IMPLEMENTATION
function initPacman(canvas, ctx) {
    const CELL_SIZE = 25;
    const ROWS = Math.floor(canvas.height / CELL_SIZE);
    const COLS = Math.floor(canvas.width / CELL_SIZE);
    
    let maze = Array(ROWS).fill().map(() => Array(COLS).fill(0));
    let pacman = { x: 1, y: 1, direction: 'right' };
    let ghosts = [
        { x: COLS-2, y: 1, direction: 'left', color: '#FF0000' },
        { x: COLS-2, y: ROWS-2, direction: 'up', color: '#FFB8FF' },
        { x: 1, y: ROWS-2, direction: 'right', color: '#00FFFF' }
    ];
    let dots = [];
    let score = 0;
    let gameRunning = true;
    let animationId = null;
    let lastMoveTime = 0;
    const moveSpeed = 200;
    
    // Generate simple maze
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (row === 0 || row === ROWS-1 || col === 0 || col === COLS-1) {
                maze[row][col] = 1; // wall
            } else if (row % 4 === 0 && col % 4 === 0) {
                maze[row][col] = 1; // internal walls
            } else {
                maze[row][col] = 0; // path
                if (!(row === 1 && col === 1)) { // not pacman start
                    dots.push({ x: col, y: row });
                }
            }
        }
    }
    
    function isValidMove(x, y) {
        return x >= 0 && x < COLS && y >= 0 && y < ROWS && maze[y][x] !== 1;
    }
    
    function movePacman() {
        let newX = pacman.x, newY = pacman.y;
        
        switch (pacman.direction) {
            case 'up': newY--; break;
            case 'down': newY++; break;
            case 'left': newX--; break;
            case 'right': newX++; break;
        }
        
        if (isValidMove(newX, newY)) {
            pacman.x = newX;
            pacman.y = newY;
            
            // Check dot collision
            dots = dots.filter(dot => {
                if (dot.x === pacman.x && dot.y === pacman.y) {
                    score += 10;
                    return false;
                }
                return true;
            });
            
            // Check win condition
            if (dots.length === 0) {
                gameRunning = false;
            }
        }
    }
    
    function moveGhosts() {
        ghosts.forEach(ghost => {
            const directions = ['up', 'down', 'left', 'right'];
            let newX = ghost.x, newY = ghost.y;
            
            // Simple AI: try to move toward pacman
            const dx = pacman.x - ghost.x;
            const dy = pacman.y - ghost.y;
            
            let preferredDirection;
            if (Math.abs(dx) > Math.abs(dy)) {
                preferredDirection = dx > 0 ? 'right' : 'left';
            } else {
                preferredDirection = dy > 0 ? 'down' : 'up';
            }
            
            // Try preferred direction first, then random
            let attempts = [preferredDirection, ...directions.filter(d => d !== preferredDirection)];
            
            for (let dir of attempts) {
                newX = ghost.x;
                newY = ghost.y;
                
                switch (dir) {
                    case 'up': newY--; break;
                    case 'down': newY++; break;
                    case 'left': newX--; break;
                    case 'right': newX++; break;
                }
                
                if (isValidMove(newX, newY)) {
                    ghost.x = newX;
                    ghost.y = newY;
                    ghost.direction = dir;
                    break;
                }
            }
            
            // Check collision with pacman
            if (ghost.x === pacman.x && ghost.y === pacman.y) {
                gameRunning = false;
            }
        });
    }
    
    function draw() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw maze
        ctx.fillStyle = '#0000FF';
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                if (maze[row][col] === 1) {
                    ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                }
            }
        }
        
        // Draw dots
        ctx.fillStyle = '#FFFF00';
        dots.forEach(dot => {
            ctx.beginPath();
            ctx.arc(dot.x * CELL_SIZE + CELL_SIZE/2, dot.y * CELL_SIZE + CELL_SIZE/2, 3, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Draw pacman
        ctx.fillStyle = '#FFFF00';
        ctx.beginPath();
        ctx.arc(pacman.x * CELL_SIZE + CELL_SIZE/2, pacman.y * CELL_SIZE + CELL_SIZE/2, CELL_SIZE/2 - 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw ghosts
        ghosts.forEach(ghost => {
            ctx.fillStyle = ghost.color;
            ctx.fillRect(ghost.x * CELL_SIZE + 2, ghost.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);
        });
        
        // Draw UI
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Score: ' + score, 10, 25);
        ctx.fillText('Dots: ' + dots.length, 150, 25);
        
        if (!gameRunning) {
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            if (dots.length === 0) {
                ctx.fillText('YOU WIN!', canvas.width/2, canvas.height/2);
            } else {
                ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2);
            }
            ctx.font = '24px Arial';
            ctx.fillText('Press R to restart', canvas.width/2, canvas.height/2 + 50);
            ctx.textAlign = 'left';
        }
    }
    
    function gameLoop(timestamp) {
        if (!gameRunning) return;
        
        if (timestamp - lastMoveTime > moveSpeed) {
            movePacman();
            moveGhosts();
            lastMoveTime = timestamp;
        }
        
        draw();
        if (gameRunning) {
            animationId = requestAnimationFrame(gameLoop);
        }
    }
    
    function stopGame() {
        gameRunning = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        document.removeEventListener('keydown', handleKeyPress);
    }
    
    function handleKeyPress(e) {
        if (!gameRunning) {
            if (e.key === 'r' || e.key === 'R') {
                // Restart game
                pacman = { x: 1, y: 1, direction: 'right' };
                ghosts = [
                    { x: COLS-2, y: 1, direction: 'left', color: '#FF0000' },
                    { x: COLS-2, y: ROWS-2, direction: 'up', color: '#FFB8FF' },
                    { x: 1, y: ROWS-2, direction: 'right', color: '#00FFFF' }
                ];
                dots = [];
                for (let row = 0; row < ROWS; row++) {
                    for (let col = 0; col < COLS; col++) {
                        if (maze[row][col] === 0 && !(row === 1 && col === 1)) {
                            dots.push({ x: col, y: row });
                        }
                    }
                }
                score = 0;
                gameRunning = true;
                lastMoveTime = 0;
                if (animationId) cancelAnimationFrame(animationId);
                animationId = requestAnimationFrame(gameLoop);
            }
            return;
        }
        
        switch (e.key) {
            case 'ArrowUp':
                pacman.direction = 'up';
                break;
            case 'ArrowDown':
                pacman.direction = 'down';
                break;
            case 'ArrowLeft':
                pacman.direction = 'left';
                break;
            case 'ArrowRight':
                pacman.direction = 'right';
                break;
        }
    }
    
    document.addEventListener('keydown', handleKeyPress);
    
    animationId = requestAnimationFrame(gameLoop);
    
    // Expose stop function globally for cleanup
    window.currentGameCleanup = stopGame;
}

// SPACE INVADERS IMPLEMENTATION
function initSpaceInvaders(canvas, ctx) {
    let player = { x: canvas.width/2, y: canvas.height - 50, width: 30, height: 20 };
    let bullets = [];
    let enemies = [];
    let enemyBullets = [];
    let score = 0;
    let lives = 3;
    let level = 1;
    let gameRunning = true;
    let animationId = null;
    let lastShotTime = 0;
    const shotCooldown = 200;
    
    const keys = {};
    
    function createEnemies() {
        enemies = [];
        const rows = 5;
        const cols = 10;
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                enemies.push({
                    x: col * 60 + 100,
                    y: row * 40 + 50,
                    width: 30,
                    height: 20,
                    alive: true,
                    type: row // different types for different rows
                });
            }
        }
    }
    
    function updatePlayer() {
        if (keys['ArrowLeft'] && player.x > 0) {
            player.x -= 5;
        }
        if (keys['ArrowRight'] && player.x < canvas.width - player.width) {
            player.x += 5;
        }
    }
    
    function updateBullets() {
        // Update player bullets
        bullets = bullets.filter(bullet => {
            bullet.y -= 8;
            return bullet.y > 0;
        });
        
        // Update enemy bullets
        enemyBullets = enemyBullets.filter(bullet => {
            bullet.y += 4;
            return bullet.y < canvas.height;
        });
    }
    
    function updateEnemies() {
        let moveDown = false;
        let direction = 1;
        
        // Check if any enemy hit the edge
        enemies.forEach(enemy => {
            if (enemy.alive && (enemy.x <= 0 || enemy.x >= canvas.width - 30)) {
                moveDown = true;
            }
        });
        
        // Move enemies
        enemies.forEach(enemy => {
            if (enemy.alive) {
                if (moveDown) {
                    enemy.y += 20;
                    enemy.x += direction * 2;
                } else {
                    enemy.x += level * 0.5; // Speed increases with level
                }
                
                // Random enemy shooting
                if (Math.random() < 0.002 * level) {
                    enemyBullets.push({
                        x: enemy.x + enemy.width/2,
                        y: enemy.y + enemy.height,
                        width: 3,
                        height: 8
                    });
                }
            }
        });
    }
    
    function checkCollisions() {
        // Player bullets vs enemies
        bullets.forEach((bullet, bulletIndex) => {
            enemies.forEach((enemy, enemyIndex) => {
                if (enemy.alive &&
                    bullet.x < enemy.x + enemy.width &&
                    bullet.x + bullet.width > enemy.x &&
                    bullet.y < enemy.y + enemy.height &&
                    bullet.y + bullet.height > enemy.y) {
                    
                    bullets.splice(bulletIndex, 1);
                    enemy.alive = false;
                    score += (5 - enemy.type) * 10; // Higher rows worth more points
                }
            });
        });
        
        // Enemy bullets vs player
        enemyBullets.forEach((bullet, bulletIndex) => {
            if (bullet.x < player.x + player.width &&
                bullet.x + bullet.width > player.x &&
                bullet.y < player.y + player.height &&
                bullet.y + bullet.height > player.y) {
                
                enemyBullets.splice(bulletIndex, 1);
                lives--;
                if (lives <= 0) {
                    gameRunning = false;
                }
            }
        });
        
        // Check if all enemies are dead
        if (enemies.every(enemy => !enemy.alive)) {
            level++;
            createEnemies();
        }
        
        // Check if enemies reached player
        enemies.forEach(enemy => {
            if (enemy.alive && enemy.y + enemy.height >= player.y) {
                gameRunning = false;
            }
        });
    }
    
    function draw() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw player
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(player.x, player.y, player.width, player.height);
        
        // Draw enemies
        enemies.forEach(enemy => {
            if (enemy.alive) {
                const colors = ['#FF0000', '#FF8800', '#FFFF00', '#00FF88', '#0088FF'];
                ctx.fillStyle = colors[enemy.type];
                ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            }
        });
        
        // Draw bullets
        ctx.fillStyle = '#FFFFFF';
        bullets.forEach(bullet => {
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });
        
        ctx.fillStyle = '#FF0000';
        enemyBullets.forEach(bullet => {
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });
        
        // Draw UI
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Score: ' + score, 10, 25);
        ctx.fillText('Lives: ' + lives, 150, 25);
        ctx.fillText('Level: ' + level, 250, 25);
        
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
    
    function gameLoop(timestamp) {
        if (!gameRunning) return;
        
        updatePlayer();
        updateBullets();
        updateEnemies();
        checkCollisions();
        draw();
        
        if (gameRunning) {
            animationId = requestAnimationFrame(gameLoop);
        }
    }
    
    function stopGame() {
        gameRunning = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
    }
    
    function handleKeyDown(e) {
        keys[e.key] = true;
        
        if (!gameRunning && (e.key === 'r' || e.key === 'R')) {
            // Restart game
            player = { x: canvas.width/2, y: canvas.height - 50, width: 30, height: 20 };
            bullets = [];
            enemyBullets = [];
            score = 0;
            lives = 3;
            level = 1;
            gameRunning = true;
            lastShotTime = 0;
            if (animationId) cancelAnimationFrame(animationId);
            createEnemies();
            animationId = requestAnimationFrame(gameLoop);
        }
        
        if (e.key === ' ' && gameRunning) {
            const currentTime = Date.now();
            if (currentTime - lastShotTime > shotCooldown) {
                bullets.push({
                    x: player.x + player.width/2 - 2,
                    y: player.y,
                    width: 4,
                    height: 10
                });
                lastShotTime = currentTime;
            }
        }
    }
    
    function handleKeyUp(e) {
        keys[e.key] = false;
    }
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    createEnemies();
    animationId = requestAnimationFrame(gameLoop);
    
    // Expose stop function globally for cleanup
    window.currentGameCleanup = stopGame;
}

// SLITHER.IO IMPLEMENTATION
function initSlither(canvas, ctx) {
    // Game constants
    const WORLD_WIDTH = 2000;
    const WORLD_HEIGHT = 2000;
    
    // Game state
    let camera = { x: 0, y: 0 };
    let mouse = { x: canvas.width/2, y: canvas.height/2 };
    let gameRunning = true;
    let score = 0;
    let animationId = null;
    
    const BOT_NAMES = [
        'SnakeKiller99', 'ProGamer2024', 'DeathViper', 'NinjaSnake', 'VenomStrike',
        'AlphaSlither', 'ShadowHunter', 'BlitzKrieg', 'StealthMode', 'RapidFire'
    ];
    
    // Game objects
    let player, bots = [], food = [], projectiles = [];
    
    // Snake class
    class Snake {
        constructor(x, y, isPlayer = false, name = '') {
            this.segments = [{ x, y }];
            this.direction = { x: Math.random() - 0.5, y: Math.random() - 0.5 };
            this.normalizeDirection();
            this.speed = isPlayer ? 2.5 : 2 + Math.random();
            this.isPlayer = isPlayer;
            this.name = name;
            this.color = isPlayer ? '#4CAF50' : this.randomColor();
            this.growing = false;
        }
        
        randomColor() {
            const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
            return colors[Math.floor(Math.random() * colors.length)];
        }
        
        normalizeDirection() {
            const length = Math.hypot(this.direction.x, this.direction.y);
            if (length > 0) {
                this.direction.x /= length;
                this.direction.y /= length;
            }
        }
        
        update() {
            if (!this.isPlayer && Math.random() < 0.02) {
                this.direction.x += (Math.random() - 0.5) * 0.5;
                this.direction.y += (Math.random() - 0.5) * 0.5;
                this.normalizeDirection();
            }
            
            const head = this.segments[0];
            const newHead = {
                x: head.x + this.direction.x * this.speed,
                y: head.y + this.direction.y * this.speed
            };
            
            newHead.x = Math.max(20, Math.min(WORLD_WIDTH - 20, newHead.x));
            newHead.y = Math.max(20, Math.min(WORLD_HEIGHT - 20, newHead.y));
            
            this.segments.unshift(newHead);
            if (!this.growing) this.segments.pop();
            this.growing = false;
        }
        
        grow() {
            this.growing = true;
        }
        
        checkCollision(others) {
            const head = this.segments[0];
            for (let other of others) {
                if (other === this) continue;
                for (let i = 1; i < other.segments.length; i++) {
                    const segment = other.segments[i];
                    if (Math.hypot(head.x - segment.x, head.y - segment.y) < 15) {
                        return true;
                    }
                }
            }
            return false;
        }
        
        draw() {
            this.segments.forEach((segment, index) => {
                const screenX = segment.x - camera.x;
                const screenY = segment.y - camera.y;
                
                if (screenX < -20 || screenX > canvas.width + 20 || 
                    screenY < -20 || screenY > canvas.height + 20) return;
                
                ctx.fillStyle = index === 0 ? this.color : this.darkenColor(this.color);
                ctx.beginPath();
                ctx.arc(screenX, screenY, index === 0 ? 12 : 8, 0, Math.PI * 2);
                ctx.fill();
                
                if (index === 0) {
                    ctx.fillStyle = 'white';
                    ctx.beginPath();
                    ctx.arc(screenX - 4, screenY - 4, 2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(screenX + 4, screenY - 4, 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
            
            if (this.name) {
                const head = this.segments[0];
                const screenX = head.x - camera.x;
                const screenY = head.y - camera.y;
                
                ctx.fillStyle = 'white';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(this.name, screenX, screenY - 25);
            }
        }
        
        darkenColor(color) {
            const r = parseInt(color.substr(1, 2), 16);
            const g = parseInt(color.substr(3, 2), 16);
            const b = parseInt(color.substr(5, 2), 16);
            return `rgb(${Math.floor(r * 0.7)}, ${Math.floor(g * 0.7)}, ${Math.floor(b * 0.7)})`;
        }
    }
    
    // Initialize game
    function initGame() {
        player = new Snake(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, true, 'You');
        bots = [];
        food = [];
        projectiles = [];
        
        // Create bots
        for (let i = 0; i < 10; i++) {
            const name = BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];
            const bot = new Snake(Math.random() * WORLD_WIDTH, Math.random() * WORLD_HEIGHT, false, name);
            // Give some bots initial length
            if (Math.random() < 0.3) {
                for (let j = 0; j < 5; j++) bot.grow();
            }
            bots.push(bot);
        }
        
        // Create food
        for (let i = 0; i < 300; i++) {
            food.push({
                x: Math.random() * WORLD_WIDTH,
                y: Math.random() * WORLD_HEIGHT,
                size: 3 + Math.random() * 2,
                color: `hsl(${Math.random() * 360}, 60%, 50%)`
            });
        }
    }
    
    function updateCamera() {
        const head = player.segments[0];
        camera.x = head.x - canvas.width / 2;
        camera.y = head.y - canvas.height / 2;
        camera.x = Math.max(0, Math.min(WORLD_WIDTH - canvas.width, camera.x));
        camera.y = Math.max(0, Math.min(WORLD_HEIGHT - canvas.height, camera.y));
    }
    
    function update() {
        if (!gameRunning) return;
        
        // Update player direction
        const worldMouseX = mouse.x + camera.x;
        const worldMouseY = mouse.y + camera.y;
        const head = player.segments[0];
        const angle = Math.atan2(worldMouseY - head.y, worldMouseX - head.x);
        player.direction.x = Math.cos(angle);
        player.direction.y = Math.sin(angle);
        
        // Update snakes
        player.update();
        bots.forEach(bot => bot.update());
        
        // Check collisions
        const allSnakes = [player, ...bots];
        if (player.checkCollision(allSnakes)) {
            gameRunning = false;
            return;
        }
        
        // Food collisions
        food = food.filter(f => {
            const head = player.segments[0];
            if (Math.hypot(f.x - head.x, f.y - head.y) < 15) {
                player.grow();
                score += 5;
                
                // Add new food
                food.push({
                    x: Math.random() * WORLD_WIDTH,
                    y: Math.random() * WORLD_HEIGHT,
                    size: 3 + Math.random() * 2,
                    color: `hsl(${Math.random() * 360}, 60%, 50%)`
                });
                return false;
            }
            return true;
        });
        
        // Bot food collection
        bots.forEach(bot => {
            food = food.filter(f => {
                const head = bot.segments[0];
                if (Math.hypot(f.x - head.x, f.y - head.y) < 15) {
                    bot.grow();
                    return false;
                }
                return true;
            });
        });
        
        updateCamera();
    }
    
    function draw() {
        if (!gameRunning) return;
        
        // Clear canvas
        ctx.fillStyle = '#0f3460';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        const startX = Math.floor(camera.x / 50) * 50;
        const startY = Math.floor(camera.y / 50) * 50;
        
        for (let x = startX; x < camera.x + canvas.width + 50; x += 50) {
            ctx.beginPath();
            ctx.moveTo(x - camera.x, 0);
            ctx.lineTo(x - camera.x, canvas.height);
            ctx.stroke();
        }
        
        for (let y = startY; y < camera.y + canvas.height + 50; y += 50) {
            ctx.beginPath();
            ctx.moveTo(0, y - camera.y);
            ctx.lineTo(canvas.width, y - camera.y);
            ctx.stroke();
        }
        
        // Draw world border
        ctx.strokeStyle = '#ff6b6b';
        ctx.lineWidth = 3;
        ctx.strokeRect(-camera.x, -camera.y, WORLD_WIDTH, WORLD_HEIGHT);
        
        // Draw food
        food.forEach(f => {
            const screenX = f.x - camera.x;
            const screenY = f.y - camera.y;
            if (screenX > -10 && screenX < canvas.width + 10 && 
                screenY > -10 && screenY < canvas.height + 10) {
                ctx.fillStyle = f.color;
                ctx.beginPath();
                ctx.arc(screenX, screenY, f.size, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        
        // Draw snakes
        bots.forEach(bot => bot.draw());
        player.draw();
        
        // Draw UI
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Length: ' + player.segments.length, 10, 25);
        ctx.fillText('Score: ' + score, 10, 45);
        ctx.fillText('Move: Mouse | Boost: Space', 10, canvas.height - 20);
        
        if (!gameRunning) {
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2);
            ctx.font = '24px Arial';
            ctx.fillText('Score: ' + score, canvas.width/2, canvas.height/2 + 40);
            ctx.fillText('Press R to restart', canvas.width/2, canvas.height/2 + 70);
            ctx.textAlign = 'left';
        }
    }
    
    function gameLoop() {
        if (!gameRunning) return;
        update();
        draw();
        if (gameRunning) {
            animationId = requestAnimationFrame(gameLoop);
        }
    }
    
    function stopGame() {
        gameRunning = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        
        // Remove event listeners
        document.removeEventListener('keydown', handleKeyPress);
        canvas.removeEventListener('mousemove', handleMouseMove);
    }
    
    // Event handlers
    function handleKeyPress(e) {
        if (e.key === ' ') {
            e.preventDefault();
            if (gameRunning && player.speed < 4) {
                player.speed = 4;
                setTimeout(() => { if (gameRunning) player.speed = 2.5; }, 200);
            }
        }
        if (e.key === 'r' || e.key === 'R') {
            if (!gameRunning) {
                if (animationId) cancelAnimationFrame(animationId);
                score = 0;
                initGame();
                gameRunning = true;
                animationId = requestAnimationFrame(gameLoop);
            }
        }
    }
    
    function handleMouseMove(e) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    }
    
    // Add event listeners
    document.addEventListener('keydown', handleKeyPress);
    canvas.addEventListener('mousemove', handleMouseMove);
    
    // Start game
    initGame();
    animationId = requestAnimationFrame(gameLoop);
    
    // Expose stop function globally for cleanup
    window.currentGameCleanup = stopGame;
}

// ASTEROIDS IMPLEMENTATION
function initAsteroids(canvas, ctx) {
    let player = { x: canvas.width/2, y: canvas.height/2, angle: 0, dx: 0, dy: 0, size: 10 };
    let bullets = [];
    let asteroids = [];
    let score = 0;
    let lives = 3;
    let gameRunning = true;
    let animationId = null;
    let thrust = false;
    let rotating = 0;
    
    const keys = {};
    
    function createAsteroids() {
        asteroids = [];
        for (let i = 0; i < 5; i++) {
            asteroids.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                dx: (Math.random() - 0.5) * 4,
                dy: (Math.random() - 0.5) * 4,
                size: 40 + Math.random() * 20,
                angle: Math.random() * Math.PI * 2
            });
        }
    }
    
    function updatePlayer() {
        if (keys['ArrowLeft']) rotating = -0.2;
        else if (keys['ArrowRight']) rotating = 0.2;
        else rotating = 0;
        
        player.angle += rotating;
        
        if (keys['ArrowUp']) {
            thrust = true;
            player.dx += Math.cos(player.angle) * 0.5;
            player.dy += Math.sin(player.angle) * 0.5;
        } else {
            thrust = false;
        }
        
        // Apply friction
        player.dx *= 0.99;
        player.dy *= 0.99;
        
        // Update position
        player.x += player.dx;
        player.y += player.dy;
        
        // Wrap around screen
        if (player.x < 0) player.x = canvas.width;
        if (player.x > canvas.width) player.x = 0;
        if (player.y < 0) player.y = canvas.height;
        if (player.y > canvas.height) player.y = 0;
    }
    
    function updateBullets() {
        bullets = bullets.filter(bullet => {
            bullet.x += bullet.dx;
            bullet.y += bullet.dy;
            bullet.life--;
            
            // Wrap around screen
            if (bullet.x < 0) bullet.x = canvas.width;
            if (bullet.x > canvas.width) bullet.x = 0;
            if (bullet.y < 0) bullet.y = canvas.height;
            if (bullet.y > canvas.height) bullet.y = 0;
            
            return bullet.life > 0;
        });
    }
    
    function updateAsteroids() {
        asteroids.forEach(asteroid => {
            asteroid.x += asteroid.dx;
            asteroid.y += asteroid.dy;
            asteroid.angle += 0.02;
            
            // Wrap around screen
            if (asteroid.x < 0) asteroid.x = canvas.width;
            if (asteroid.x > canvas.width) asteroid.x = 0;
            if (asteroid.y < 0) asteroid.y = canvas.height;
            if (asteroid.y > canvas.height) asteroid.y = 0;
        });
    }
    
    function checkCollisions() {
        // Bullets vs asteroids
        bullets.forEach((bullet, bulletIndex) => {
            asteroids.forEach((asteroid, asteroidIndex) => {
                const dx = bullet.x - asteroid.x;
                const dy = bullet.y - asteroid.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < asteroid.size) {
                    bullets.splice(bulletIndex, 1);
                    asteroids.splice(asteroidIndex, 1);
                    score += 100;
                    
                    // Create smaller asteroids if large enough
                    if (asteroid.size > 20) {
                        for (let i = 0; i < 2; i++) {
                            asteroids.push({
                                x: asteroid.x,
                                y: asteroid.y,
                                dx: (Math.random() - 0.5) * 6,
                                dy: (Math.random() - 0.5) * 6,
                                size: asteroid.size / 2,
                                angle: Math.random() * Math.PI * 2
                            });
                        }
                    }
                }
            });
        });
        
        // Player vs asteroids
        asteroids.forEach(asteroid => {
            const dx = player.x - asteroid.x;
            const dy = player.y - asteroid.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < asteroid.size + player.size) {
                lives--;
                if (lives <= 0) {
                    gameRunning = false;
                } else {
                    // Reset player position
                    player.x = canvas.width/2;
                    player.y = canvas.height/2;
                    player.dx = 0;
                    player.dy = 0;
                }
            }
        });
        
        // Check if all asteroids destroyed
        if (asteroids.length === 0) {
            createAsteroids();
        }
    }
    
    function draw() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw player
        ctx.save();
        ctx.translate(player.x, player.y);
        ctx.rotate(player.angle);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(10, 0);
        ctx.lineTo(-8, -6);
        ctx.lineTo(-8, 6);
        ctx.closePath();
        ctx.stroke();
        
        // Draw thrust
        if (thrust) {
            ctx.strokeStyle = 'red';
            ctx.beginPath();
            ctx.moveTo(-8, 0);
            ctx.lineTo(-15, 0);
            ctx.stroke();
        }
        ctx.restore();
        
        // Draw bullets
        ctx.fillStyle = 'white';
        bullets.forEach(bullet => {
            ctx.beginPath();
            ctx.arc(bullet.x, bullet.y, 2, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Draw asteroids
        asteroids.forEach(asteroid => {
            ctx.save();
            ctx.translate(asteroid.x, asteroid.y);
            ctx.rotate(asteroid.angle);
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            const sides = 8;
            for (let i = 0; i < sides; i++) {
                const angle = (i / sides) * Math.PI * 2;
                const radius = asteroid.size * (0.8 + Math.random() * 0.4);
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
        });
        
        // Draw UI
        ctx.fillStyle = 'white';
        ctx.font = '18px Arial';
        ctx.fillText('Score: ' + score, 10, 25);
        ctx.fillText('Lives: ' + lives, 10, 50);
        
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
    
    function gameLoop() {
        if (gameRunning) {
            updatePlayer();
            updateBullets();
            updateAsteroids();
            checkCollisions();
        }
        draw();
        if (gameRunning || !gameRunning) {
            animationId = requestAnimationFrame(gameLoop);
        }
    }
    
    function stopGame() {
        gameRunning = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
    }
    
    function handleKeyDown(e) {
        keys[e.key] = true;
        
        if (!gameRunning && (e.key === 'r' || e.key === 'R')) {
            // Restart game
            player = { x: canvas.width/2, y: canvas.height/2, angle: 0, dx: 0, dy: 0, size: 10 };
            bullets = [];
            score = 0;
            lives = 3;
            gameRunning = true;
            if (animationId) cancelAnimationFrame(animationId);
            createAsteroids();
            animationId = requestAnimationFrame(gameLoop);
        }
        
        if (e.key === ' ' && gameRunning) {
            bullets.push({
                x: player.x + Math.cos(player.angle) * 15,
                y: player.y + Math.sin(player.angle) * 15,
                dx: Math.cos(player.angle) * 8,
                dy: Math.sin(player.angle) * 8,
                life: 60
            });
        }
    }
    
    function handleKeyUp(e) {
        keys[e.key] = false;
    }
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    createAsteroids();
    animationId = requestAnimationFrame(gameLoop);
    
    // Expose stop function globally for cleanup
    window.currentGameCleanup = stopGame;
}

// FROGGER IMPLEMENTATION
function initFrogger(canvas, ctx) {
    const GRID_SIZE = 40;
    const ROWS = Math.floor(canvas.height / GRID_SIZE);
    const COLS = Math.floor(canvas.width / GRID_SIZE);
    
    let frog = { x: Math.floor(COLS/2), y: ROWS - 1 };
    let cars = [];
    let logs = [];
    let score = 0;
    let lives = 3;
    let gameRunning = true;
    let animationId = null;
    let gameTime = 0;
    
    function initLevel() {
        cars = [];
        logs = [];
        
        // Create cars (rows 1-5 from bottom)
        for (let row = ROWS - 6; row >= ROWS - 10; row--) {
            const direction = (row % 2 === 0) ? 1 : -1;
            const speed = 1 + Math.random() * 2;
            
            for (let i = 0; i < 3; i++) {
                cars.push({
                    x: (i * COLS/3 + Math.random() * COLS/3) % COLS,
                    y: row,
                    direction: direction,
                    speed: speed,
                    width: 2
                });
            }
        }
        
        // Create logs (water area - rows 6-10 from bottom)
        for (let row = ROWS - 11; row >= ROWS - 15; row--) {
            const direction = (row % 2 === 0) ? 1 : -1;
            const speed = 0.5 + Math.random() * 1;
            
            for (let i = 0; i < 2; i++) {
                logs.push({
                    x: (i * COLS/2 + Math.random() * COLS/2) % COLS,
                    y: row,
                    direction: direction,
                    speed: speed,
                    width: 3
                });
            }
        }
    }
    
    function updateGame() {
        gameTime++;
        
        // Update cars
        cars.forEach(car => {
            car.x += car.direction * car.speed * 0.1;
            if (car.direction > 0 && car.x > COLS) car.x = -car.width;
            if (car.direction < 0 && car.x < -car.width) car.x = COLS;
        });
        
        // Update logs
        logs.forEach(log => {
            log.x += log.direction * log.speed * 0.1;
            if (log.direction > 0 && log.x > COLS) log.x = -log.width;
            if (log.direction < 0 && log.x < -log.width) log.x = COLS;
        });
        
        // Check frog on log in water
        const frogRow = frog.y;
        if (frogRow >= ROWS - 15 && frogRow <= ROWS - 11) {
            let onLog = false;
            logs.forEach(log => {
                if (log.y === frogRow && 
                    frog.x >= log.x && frog.x < log.x + log.width) {
                    onLog = true;
                    frog.x += log.direction * log.speed * 0.1;
                    
                    // Keep frog within screen bounds
                    if (frog.x < 0) frog.x = 0;
                    if (frog.x >= COLS) frog.x = COLS - 1;
                }
            });
            
            if (!onLog) {
                // Frog fell in water
                lives--;
                resetFrog();
                if (lives <= 0) gameRunning = false;
            }
        }
        
        // Check car collisions
        cars.forEach(car => {
            if (car.y === frog.y && 
                frog.x >= car.x && frog.x < car.x + car.width) {
                lives--;
                resetFrog();
                if (lives <= 0) gameRunning = false;
            }
        });
        
        // Check win condition
        if (frog.y <= 2) {
            score += 100;
            resetFrog();
        }
    }
    
    function resetFrog() {
        frog.x = Math.floor(COLS/2);
        frog.y = ROWS - 1;
    }
    
    function draw() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw road
        ctx.fillStyle = '#333';
        ctx.fillRect(0, (ROWS - 10) * GRID_SIZE, canvas.width, 5 * GRID_SIZE);
        
        // Draw water
        ctx.fillStyle = '#0066CC';
        ctx.fillRect(0, (ROWS - 15) * GRID_SIZE, canvas.width, 5 * GRID_SIZE);
        
        // Draw safe zones
        ctx.fillStyle = '#00AA00';
        ctx.fillRect(0, 0, canvas.width, 2 * GRID_SIZE); // Top safe zone
        ctx.fillRect(0, (ROWS - 5) * GRID_SIZE, canvas.width, 5 * GRID_SIZE); // Bottom safe zone
        
        // Draw cars
        ctx.fillStyle = '#FF0000';
        cars.forEach(car => {
            ctx.fillRect(
                car.x * GRID_SIZE, 
                car.y * GRID_SIZE + 5, 
                car.width * GRID_SIZE - 5, 
                GRID_SIZE - 10
            );
        });
        
        // Draw logs
        ctx.fillStyle = '#8B4513';
        logs.forEach(log => {
            ctx.fillRect(
                log.x * GRID_SIZE, 
                log.y * GRID_SIZE + 8, 
                log.width * GRID_SIZE - 5, 
                GRID_SIZE - 16
            );
        });
        
        // Draw frog
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(
            frog.x * GRID_SIZE + 8, 
            frog.y * GRID_SIZE + 8, 
            GRID_SIZE - 16, 
            GRID_SIZE - 16
        );
        
        // Draw UI
        ctx.fillStyle = 'white';
        ctx.font = '18px Arial';
        ctx.fillText('Score: ' + score, 10, 25);
        ctx.fillText('Lives: ' + lives, 150, 25);
        
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
    
    function gameLoop() {
        if (gameRunning) {
            updateGame();
        }
        draw();
        if (gameRunning || !gameRunning) {
            animationId = requestAnimationFrame(gameLoop);
        }
    }
    
    function stopGame() {
        gameRunning = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        document.removeEventListener('keydown', handleKeyPress);
    }
    
    function handleKeyPress(e) {
        if (!gameRunning) {
            if (e.key === 'r' || e.key === 'R') {
                // Restart game
                score = 0;
                lives = 3;
                gameRunning = true;
                gameTime = 0;
                resetFrog();
                if (animationId) cancelAnimationFrame(animationId);
                initLevel();
                animationId = requestAnimationFrame(gameLoop);
            }
            return;
        }
        
        switch (e.key) {
            case 'ArrowUp':
                if (frog.y > 0) frog.y--;
                break;
            case 'ArrowDown':
                if (frog.y < ROWS - 1) frog.y++;
                break;
            case 'ArrowLeft':
                if (frog.x > 0) frog.x--;
                break;
            case 'ArrowRight':
                if (frog.x < COLS - 1) frog.x++;
                break;
        }
    }
    
    document.addEventListener('keydown', handleKeyPress);
    
    initLevel();
    animationId = requestAnimationFrame(gameLoop);
    
    // Expose stop function globally for cleanup
    window.currentGameCleanup = stopGame;
}

// DOODLE JUMP IMPLEMENTATION
function initDoodleJump(canvas, ctx) {
    let player = { x: canvas.width/2, y: canvas.height - 100, dy: 0, width: 20, height: 20 };
    let platforms = [];
    let camera = { y: 0 };
    let score = 0;
    let gameRunning = true;
    let animationId = null;
    let highestY = canvas.height - 100;
    
    const GRAVITY = 0.4;
    const JUMP_FORCE = -12;
    const PLATFORM_WIDTH = 80;
    const PLATFORM_HEIGHT = 15;
    
    const keys = {};
    
    function generatePlatforms() {
        platforms = [];
        
        // Starting platform
        platforms.push({
            x: canvas.width/2 - PLATFORM_WIDTH/2,
            y: canvas.height - 50,
            type: 'normal'
        });
        
        // Generate platforms going up
        for (let i = 1; i < 100; i++) {
            platforms.push({
                x: Math.random() * (canvas.width - PLATFORM_WIDTH),
                y: canvas.height - 50 - (i * 120),
                type: Math.random() < 0.1 ? 'spring' : 'normal'
            });
        }
    }
    
    function updatePlayer() {
        // Horizontal movement
        if (keys['ArrowLeft']) {
            player.x -= 5;
        }
        if (keys['ArrowRight']) {
            player.x += 5;
        }
        
        // Screen wrapping
        if (player.x < 0) player.x = canvas.width;
        if (player.x > canvas.width) player.x = 0;
        
        // Apply gravity
        player.dy += GRAVITY;
        player.y += player.dy;
        
        // Platform collisions (only when falling)
        if (player.dy > 0) {
            platforms.forEach(platform => {
                if (player.x + player.width > platform.x && 
                    player.x < platform.x + PLATFORM_WIDTH &&
                    player.y + player.height > platform.y && 
                    player.y + player.height < platform.y + PLATFORM_HEIGHT + 10) {
                    
                    if (platform.type === 'spring') {
                        player.dy = JUMP_FORCE * 1.5;
                    } else {
                        player.dy = JUMP_FORCE;
                    }
                    player.y = platform.y - player.height;
                }
            });
        }
        
        // Update camera and score
        if (player.y < highestY) {
            highestY = player.y;
            score = Math.max(score, Math.floor((canvas.height - 100 - highestY) / 10));
        }
        
        camera.y = player.y - canvas.height/2;
        
        // Game over
        if (player.y > camera.y + canvas.height + 100) {
            gameRunning = false;
        }
    }
    
    function draw() {
        // Sky gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#98FB98');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw platforms
        platforms.forEach(platform => {
            const screenY = platform.y - camera.y;
            if (screenY > -PLATFORM_HEIGHT && screenY < canvas.height + PLATFORM_HEIGHT) {
                if (platform.type === 'spring') {
                    ctx.fillStyle = '#FF6B6B';
                } else {
                    ctx.fillStyle = '#90EE90';
                }
                ctx.fillRect(platform.x, screenY, PLATFORM_WIDTH, PLATFORM_HEIGHT);
                
                // Spring indicator
                if (platform.type === 'spring') {
                    ctx.fillStyle = '#FF0000';
                    ctx.fillRect(platform.x + PLATFORM_WIDTH/2 - 5, screenY - 10, 10, 10);
                }
            }
        });
        
        // Draw player
        const playerScreenY = player.y - camera.y;
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(player.x, playerScreenY, player.width, player.height);
        
        // Draw eyes
        ctx.fillStyle = '#000';
        ctx.fillRect(player.x + 5, playerScreenY + 5, 3, 3);
        ctx.fillRect(player.x + 12, playerScreenY + 5, 3, 3);
        
        // Draw UI
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.font = '24px Arial';
        ctx.strokeText('Score: ' + score, 10, 30);
        ctx.fillText('Score: ' + score, 10, 30);
        
        if (!gameRunning) {
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            ctx.strokeText('GAME OVER', canvas.width/2, canvas.height/2);
            ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2);
            ctx.font = '24px Arial';
            ctx.strokeText('Score: ' + score, canvas.width/2, canvas.height/2 + 40);
            ctx.fillText('Score: ' + score, canvas.width/2, canvas.height/2 + 40);
            ctx.strokeText('Press R to restart', canvas.width/2, canvas.height/2 + 70);
            ctx.fillText('Press R to restart', canvas.width/2, canvas.height/2 + 70);
            ctx.textAlign = 'left';
        }
    }
    
    function gameLoop() {
        if (gameRunning) {
            updatePlayer();
        }
        draw();
        if (gameRunning || !gameRunning) {
            animationId = requestAnimationFrame(gameLoop);
        }
    }
    
    function stopGame() {
        gameRunning = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
    }
    
    function handleKeyDown(e) {
        keys[e.key] = true;
        
        if (!gameRunning && (e.key === 'r' || e.key === 'R')) {
            // Restart game
            player = { x: canvas.width/2, y: canvas.height - 100, dy: 0, width: 20, height: 20 };
            camera = { y: 0 };
            score = 0;
            gameRunning = true;
            highestY = canvas.height - 100;
            if (animationId) cancelAnimationFrame(animationId);
            generatePlatforms();
            animationId = requestAnimationFrame(gameLoop);
        }
    }
    
    function handleKeyUp(e) {
        keys[e.key] = false;
    }
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    generatePlatforms();
    animationId = requestAnimationFrame(gameLoop);
    
    // Expose stop function globally for cleanup
    window.currentGameCleanup = stopGame;
}

// FLAPPY BIRD IMPLEMENTATION
function initFlappyBird(canvas, ctx) {
    let bird = { x: 100, y: canvas.height/2, dy: 0, size: 20 };
    let pipes = [];
    let score = 0;
    let gameRunning = true;
    let gameStarted = false;
    let animationId = null;
    let pipeTimer = 0;
    
    const GRAVITY = 0.5;
    const JUMP_FORCE = -8;
    const PIPE_WIDTH = 50;
    const PIPE_GAP = 150;
    const PIPE_SPEED = 2;
    
    function createPipe() {
        const gapY = Math.random() * (canvas.height - PIPE_GAP - 100) + 50;
        pipes.push({
            x: canvas.width,
            topHeight: gapY,
            bottomY: gapY + PIPE_GAP,
            bottomHeight: canvas.height - (gapY + PIPE_GAP),
            passed: false
        });
    }
    
    function updateBird() {
        if (!gameStarted) return;
        
        // Apply gravity
        bird.dy += GRAVITY;
        bird.y += bird.dy;
        
        // Check bounds
        if (bird.y <= 0 || bird.y >= canvas.height - bird.size) {
            gameRunning = false;
        }
    }
    
    function updatePipes() {
        if (!gameStarted) return;
        
        // Move pipes
        pipes.forEach(pipe => {
            pipe.x -= PIPE_SPEED;
            
            // Check if bird passed pipe
            if (!pipe.passed && pipe.x + PIPE_WIDTH < bird.x) {
                pipe.passed = true;
                score++;
            }
        });
        
        // Remove off-screen pipes
        pipes = pipes.filter(pipe => pipe.x > -PIPE_WIDTH);
        
        // Create new pipes
        pipeTimer++;
        if (pipeTimer > 90) { // Create pipe every 90 frames
            createPipe();
            pipeTimer = 0;
        }
    }
    
    function checkCollisions() {
        if (!gameStarted) return;
        
        pipes.forEach(pipe => {
            // Check collision with bird
            if (bird.x + bird.size > pipe.x && bird.x < pipe.x + PIPE_WIDTH) {
                if (bird.y < pipe.topHeight || bird.y + bird.size > pipe.bottomY) {
                    gameRunning = false;
                }
            }
        });
    }
    
    function draw() {
        // Sky background
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#70C5CE');
        gradient.addColorStop(1, '#DEE4AA');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw pipes
        ctx.fillStyle = '#90EE90';
        ctx.strokeStyle = '#228B22';
        ctx.lineWidth = 3;
        
        pipes.forEach(pipe => {
            // Top pipe
            ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
            ctx.strokeRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
            
            // Bottom pipe
            ctx.fillRect(pipe.x, pipe.bottomY, PIPE_WIDTH, pipe.bottomHeight);
            ctx.strokeRect(pipe.x, pipe.bottomY, PIPE_WIDTH, pipe.bottomHeight);
        });
        
        // Draw bird
        ctx.fillStyle = '#FFD700';
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 2;
        ctx.fillRect(bird.x, bird.y, bird.size, bird.size);
        ctx.strokeRect(bird.x, bird.y, bird.size, bird.size);
        
        // Draw eye
        ctx.fillStyle = '#000';
        ctx.fillRect(bird.x + 12, bird.y + 5, 4, 4);
        
        // Draw beak
        ctx.fillStyle = '#FF4500';
        ctx.fillRect(bird.x + bird.size, bird.y + 8, 6, 4);
        
        // Draw UI
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.font = '36px Arial';
        ctx.textAlign = 'center';
        ctx.strokeText(score.toString(), canvas.width/2, 50);
        ctx.fillText(score.toString(), canvas.width/2, 50);
        
        if (!gameStarted) {
            ctx.font = '24px Arial';
            ctx.strokeText('Click or Press Space to Start', canvas.width/2, canvas.height/2);
            ctx.fillText('Click or Press Space to Start', canvas.width/2, canvas.height/2);
        }
        
        if (!gameRunning && gameStarted) {
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            ctx.strokeText('GAME OVER', canvas.width/2, canvas.height/2);
            ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2);
            ctx.font = '24px Arial';
            ctx.strokeText('Score: ' + score, canvas.width/2, canvas.height/2 + 50);
            ctx.fillText('Score: ' + score, canvas.width/2, canvas.height/2 + 50);
            ctx.strokeText('Press R to restart', canvas.width/2, canvas.height/2 + 80);
            ctx.fillText('Press R to restart', canvas.width/2, canvas.height/2 + 80);
        }
        
        ctx.textAlign = 'left';
    }
    
    function gameLoop() {
        if (gameRunning) {
            updateBird();
            updatePipes();
            checkCollisions();
        }
        draw();
        if (gameRunning || !gameRunning) {
            animationId = requestAnimationFrame(gameLoop);
        }
    }
    
    function stopGame() {
        gameRunning = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        document.removeEventListener('keydown', handleKeyPress);
        canvas.removeEventListener('click', handleClick);
    }
    
    function jump() {
        if (!gameRunning && gameStarted) return;
        
        if (!gameStarted) {
            gameStarted = true;
            createPipe();
        }
        
        bird.dy = JUMP_FORCE;
    }
    
    function handleKeyPress(e) {
        if (!gameRunning && gameStarted && (e.key === 'r' || e.key === 'R')) {
            // Restart game
            bird = { x: 100, y: canvas.height/2, dy: 0, size: 20 };
            pipes = [];
            score = 0;
            gameRunning = true;
            gameStarted = false;
            pipeTimer = 0;
            if (animationId) cancelAnimationFrame(animationId);
            animationId = requestAnimationFrame(gameLoop);
        }
        
        if (e.key === ' ') {
            e.preventDefault();
            jump();
        }
    }
    
    function handleClick() {
        jump();
    }
    
    document.addEventListener('keydown', handleKeyPress);
    canvas.addEventListener('click', handleClick);
    
    animationId = requestAnimationFrame(gameLoop);
    
    // Expose stop function globally for cleanup
    window.currentGameCleanup = stopGame;
}

// Subway Surfers Game
function initSubwaySurfers(canvas, ctx) {
    canvas.width = 800;
    canvas.height = 600;
    
    let gameRunning = true;
    let animationId;
    let score = 0;
    let speed = 3;
    
    const player = {
        x: canvas.width / 2 - 15,
        y: canvas.height - 100,
        width: 30,
        height: 40,
        lane: 1, // 0, 1, 2 (left, center, right)
        jumping: false,
        jumpHeight: 0,
        jumpSpeed: 0,
        ducking: false
    };
    
    const lanes = [
        canvas.width / 2 - 120,
        canvas.width / 2 - 15,
        canvas.width / 2 + 90
    ];
    
    let obstacles = [];
    let coins = [];
    let powerUps = [];
    let trains = [];
    let ramps = [];
    
    function spawnObstacle() {
        if (Math.random() < 0.015) { // Slightly less frequent
            let laneIndex = Math.floor(Math.random() * 3);
            let obstacleType = Math.random();
            
            if (obstacleType < 0.4) {
                // Train wagon
                trains.push({
                    x: lanes[laneIndex],
                    y: -80,
                    width: 60,
                    height: 80,
                    type: 'train',
                    lane: laneIndex
                });
            } else if (obstacleType < 0.7) {
                // Regular barrier
                obstacles.push({
                    x: lanes[laneIndex],
                    y: -50,
                    width: 30,
                    height: 50,
                    type: 'barrier'
                });
            } else {
                // Ramp
                ramps.push({
                    x: lanes[laneIndex],
                    y: -40,
                    width: 50,
                    height: 30,
                    type: 'ramp'
                });
            }
        }
    }
    
    function spawnCoin() {
        if (Math.random() < 0.03) {
            coins.push({
                x: lanes[Math.floor(Math.random() * 3)] + 10,
                y: -20,
                width: 10,
                height: 10
            });
        }
    }
    
    function updateGame() {
        if (!gameRunning) return;
        
        // Update player position
        player.x = lanes[player.lane];
        
        // Handle jumping
        if (player.jumping) {
            player.jumpHeight += player.jumpSpeed;
            player.jumpSpeed += 0.8; // gravity
            
            if (player.jumpHeight >= 0) {
                player.jumpHeight = 0;
                player.jumping = false;
                player.jumpSpeed = 0;
            }
        }
        
        // Update obstacles
        obstacles.forEach((obstacle, index) => {
            obstacle.y += speed;
            if (obstacle.y > canvas.height) {
                obstacles.splice(index, 1);
                score += 10;
                if (score % 100 === 0) speed += 0.5;
            }
        });
        
        // Update trains
        trains.forEach((train, index) => {
            train.y += speed;
            if (train.y > canvas.height) {
                trains.splice(index, 1);
                score += 15;
            }
        });
        
        // Update ramps
        ramps.forEach((ramp, index) => {
            ramp.y += speed;
            if (ramp.y > canvas.height) {
                ramps.splice(index, 1);
                score += 5;
            }
        });
        
        // Update coins
        coins.forEach((coin, index) => {
            coin.y += speed;
            if (coin.y > canvas.height) {
                coins.splice(index, 1);
            }
        });
        
        // Check collisions
        checkCollisions();
        
        // Spawn new objects
        spawnObstacle();
        spawnCoin();
    }
    
    function checkCollisions() {
        // Check obstacle collisions
        obstacles.forEach(obstacle => {
            if (player.x < obstacle.x + obstacle.width &&
                player.x + player.width > obstacle.x &&
                player.y - player.jumpHeight < obstacle.y + obstacle.height &&
                player.y + player.height - player.jumpHeight > obstacle.y &&
                !player.ducking) {
                gameRunning = false;
            }
        });
        
        // Check train collisions (can land on top and run on them)
        trains.forEach(train => {
            if (player.x < train.x + train.width &&
                player.x + player.width > train.x &&
                player.y - player.jumpHeight < train.y + train.height &&
                player.y + player.height - player.jumpHeight > train.y) {
                
                // Check if landing on top of train or already on top
                let playerBottom = player.y + player.height - player.jumpHeight;
                let trainTop = train.y;
                
                if (playerBottom <= trainTop + 15 && player.jumpSpeed >= 0) {
                    // Landing on train or running on train - safe
                    player.jumpHeight = -(trainTop - player.y);
                    player.jumping = false;
                    player.jumpSpeed = 0;
                    
                    // Allow player to run on train surface
                    if (playerBottom > trainTop - 5 && playerBottom < trainTop + 20) {
                        score += 2; // Bonus points for train surfing
                    }
                } else if (!player.ducking && playerBottom > trainTop + 15) {
                    // Side collision below train top - game over
                    gameRunning = false;
                }
            }
        });
        
        // Check ramp collisions (give boost)
        ramps.forEach((ramp, index) => {
            if (player.x < ramp.x + ramp.width &&
                player.x + player.width > ramp.x &&
                player.y - player.jumpHeight < ramp.y + ramp.height &&
                player.y + player.height - player.jumpHeight > ramp.y) {
                
                // Ramp gives jump boost
                if (!player.jumping) {
                    player.jumping = true;
                    player.jumpSpeed = -20; // Higher jump
                }
                ramps.splice(index, 1);
                score += 50;
            }
        });
        
        // Check coin collisions
        coins.forEach((coin, index) => {
            if (player.x < coin.x + coin.width &&
                player.x + player.width > coin.x &&
                player.y - player.jumpHeight < coin.y + coin.height &&
                player.y + player.height - player.jumpHeight > coin.y) {
                coins.splice(index, 1);
                score += 25;
            }
        });
    }
    
    function draw() {
        // Clear canvas
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw subway tracks
        ctx.fillStyle = '#333';
        for (let i = 0; i < 3; i++) {
            ctx.fillRect(lanes[i] - 20, 0, 70, canvas.height);
        }
        
        // Draw lane dividers
        ctx.fillStyle = '#FFF';
        ctx.fillRect(lanes[0] + 50, 0, 2, canvas.height);
        ctx.fillRect(lanes[1] + 50, 0, 2, canvas.height);
        
        // Draw player (runner from above)
        const playerHeight = player.ducking ? player.height / 2 : player.height;
        let playerY = player.y - player.jumpHeight - (player.ducking ? 0 : playerHeight - player.height);
        
        // Player shadow
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(player.x + 2, player.y + 2, player.width, player.height);
        
        // Player body
        ctx.fillStyle = player.ducking ? '#FF6B6B' : '#4ECDC4';
        ctx.fillRect(player.x, playerY, player.width, playerHeight);
        
        // Player head
        ctx.fillStyle = '#FFDBAC';
        ctx.beginPath();
        ctx.arc(player.x + player.width/2, playerY + 8, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Player arms
        ctx.fillStyle = '#FFDBAC';
        ctx.fillRect(player.x - 3, playerY + 10, 6, 15);
        ctx.fillRect(player.x + player.width - 3, playerY + 10, 6, 15);
        
        // Player legs
        ctx.fillStyle = '#000';
        ctx.fillRect(player.x + 5, playerY + playerHeight - 8, 6, 8);
        ctx.fillRect(player.x + 19, playerY + playerHeight - 8, 6, 8);
        
        // Draw trains (detailed wagons)
        trains.forEach(train => {
            // Train shadow
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.fillRect(train.x + 2, train.y + 2, train.width, train.height);
            
            // Train body
            ctx.fillStyle = '#2C3E50';
            ctx.fillRect(train.x, train.y, train.width, train.height);
            
            // Train windows
            ctx.fillStyle = '#3498DB';
            ctx.fillRect(train.x + 5, train.y + 10, 15, 20);
            ctx.fillRect(train.x + 25, train.y + 10, 15, 20);
            ctx.fillRect(train.x + 45, train.y + 10, 10, 20);
            
            // Train roof
            ctx.fillStyle = '#34495E';
            ctx.fillRect(train.x, train.y, train.width, 8);
            
            // Train details
            ctx.fillStyle = '#E74C3C';
            ctx.fillRect(train.x, train.y + train.height - 10, train.width, 4);
            
            // Train wheels
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(train.x + 15, train.y + train.height + 5, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(train.x + 45, train.y + train.height + 5, 6, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Draw ramps
        ramps.forEach(ramp => {
            // Ramp shadow
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.fillRect(ramp.x + 2, ramp.y + 2, ramp.width, ramp.height);
            
            // Ramp (triangle shape)
            ctx.fillStyle = '#F39C12';
            ctx.beginPath();
            ctx.moveTo(ramp.x, ramp.y + ramp.height);
            ctx.lineTo(ramp.x + ramp.width, ramp.y + ramp.height);
            ctx.lineTo(ramp.x + ramp.width, ramp.y);
            ctx.closePath();
            ctx.fill();
            
            // Ramp stripes
            ctx.strokeStyle = '#E67E22';
            ctx.lineWidth = 2;
            for (let i = 0; i < ramp.width; i += 8) {
                ctx.beginPath();
                ctx.moveTo(ramp.x + i, ramp.y + ramp.height);
                ctx.lineTo(ramp.x + i, ramp.y + ramp.height - (i / ramp.width) * ramp.height);
                ctx.stroke();
            }
        });
        
        // Draw regular obstacles
        ctx.fillStyle = '#E74C3C';
        obstacles.forEach(obstacle => {
            // Obstacle shadow
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.fillRect(obstacle.x + 2, obstacle.y + 2, obstacle.width, obstacle.height);
            
            // Barrier
            ctx.fillStyle = '#E74C3C';
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            
            // Warning stripes
            ctx.fillStyle = '#F1C40F';
            for (let i = 0; i < obstacle.height; i += 10) {
                ctx.fillRect(obstacle.x, obstacle.y + i, obstacle.width, 5);
            }
        });
        
        // Draw coins
        ctx.fillStyle = '#F1C40F';
        coins.forEach(coin => {
            ctx.beginPath();
            ctx.arc(coin.x + coin.width/2, coin.y + coin.height/2, coin.width/2, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Draw UI
        ctx.fillStyle = '#FFF';
        ctx.font = '24px Arial';
        ctx.fillText('Score: ' + score, 10, 30);
        ctx.fillText('Speed: ' + speed.toFixed(1), 10, 60);
        
        if (!gameRunning) {
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#FFF';
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Game Over!', canvas.width/2, canvas.height/2);
            ctx.font = '24px Arial';
            ctx.fillText('Final Score: ' + score, canvas.width/2, canvas.height/2 + 50);
            ctx.fillText('Press R to restart', canvas.width/2, canvas.height/2 + 80);
            ctx.textAlign = 'left';
        }
    }
    
    function gameLoop() {
        updateGame();
        draw();
        if (gameRunning || true) {
            animationId = requestAnimationFrame(gameLoop);
        }
    }
    
    function handleKeyPress(e) {
        if (!gameRunning && e.key.toLowerCase() === 'r') {
            // Restart game
            score = 0;
            speed = 3;
            obstacles = [];
            coins = [];
            player.lane = 1;
            player.jumping = false;
            player.jumpHeight = 0;
            player.ducking = false;
            gameRunning = true;
            return;
        }
        
        if (!gameRunning) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                if (player.lane > 0) player.lane--;
                break;
            case 'ArrowRight':
                if (player.lane < 2) player.lane++;
                break;
            case 'ArrowUp':
            case ' ':
                if (!player.jumping) {
                    player.jumping = true;
                    player.jumpSpeed = -15;
                }
                break;
            case 'ArrowDown':
                player.ducking = true;
                setTimeout(() => player.ducking = false, 300);
                break;
        }
    }
    
    function stopGame() {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        document.removeEventListener('keydown', handleKeyPress);
    }
    
    document.addEventListener('keydown', handleKeyPress);
    animationId = requestAnimationFrame(gameLoop);
    
    window.currentGameCleanup = stopGame;
}

function initRider(canvas, ctx) {
    canvas.width = 800;
    canvas.height = 600;
    
    let gameRunning = true;
    let animationId;
    let frameCount = 0;
    
    // Neon colors for visual effects
    const neonColors = {
        electric: '#00FFFF',
        hot: '#FF0080',
        lime: '#39FF14',
        purple: '#BF00FF',
        orange: '#FF4500',
        blue: '#0080FF',
        yellow: '#FFFF00',
        white: '#FFFFFF'
    };
    
    // Motorcycle object
    const bike = {
        x: 100,
        y: 300,
        width: 50,
        height: 25,
        vx: 0,
        vy: 0,
        rotation: 0,
        angularVel: 0,
        onGround: false,
        airTime: 0,
        rpm: 1000,
        maxRPM: 8000,
        power: 0,
        crashed: false,
        glowIntensity: 0,
        frontWheelX: 0,
        frontWheelY: 0,
        rearWheelX: 0,
        rearWheelY: 0,
        wheelSpin: 0
    };
    
    // Camera
    let camera = { x: 0, y: 0 };
    
    // Game state
    let particles = [];
    let score = 0;
    let combo = 0;
    let comboTimer = 0;
    
    // Generate challenging terrain with loops and jumps
    let terrain = [];
    function generateTerrain() {
        terrain = [];
        let currentY = canvas.height - 150;
        
        for (let x = 0; x < 8000; x += 20) {
            if (x > 800 && x < 1200) {
                // Loop-the-loop section
                let centerX = 1000;
                let centerY = currentY - 120;
                let radius = 100;
                let angle = ((x - 800) / 400) * Math.PI * 2;
                let loopX = centerX + Math.cos(angle - Math.PI/2) * radius;
                let loopY = centerY + Math.sin(angle - Math.PI/2) * radius;
                terrain.push({ x: x, y: loopY, type: 'loop' });
            } else if (x > 2000 && x < 2300) {
                // Big ramp
                let rampProgress = (x - 2000) / 300;
                let rampHeight = Math.sin(rampProgress * Math.PI) * 100;
                terrain.push({ x: x, y: currentY - rampHeight, type: 'ramp' });
            } else if (x > 2300 && x < 2600) {
                // Gap for jump
                terrain.push({ x: x, y: currentY + 200, type: 'gap' });
            } else {
                // Regular terrain with variation
                currentY += (Math.random() - 0.5) * 40;
                currentY = Math.max(100, Math.min(canvas.height - 50, currentY));
                terrain.push({ x: x, y: currentY + Math.sin(x * 0.01) * 20, type: 'regular' });
            }
        }
    }
    
    generateTerrain();
    
    // Input handling
    let keys = {};
    
    function handleKeyDown(e) {
        switch(e.code) {
            case 'ArrowUp':
            case 'Space':
                keys.gas = true;
                e.preventDefault();
                break;
            case 'ArrowDown':
                keys.brake = true;
                e.preventDefault();
                break;
            case 'ArrowLeft':
                keys.lean_back = true;
                e.preventDefault();
                break;
            case 'ArrowRight':
                keys.lean_forward = true;
                e.preventDefault();
                break;
        }
    }
    
    function handleKeyUp(e) {
        switch(e.code) {
            case 'ArrowUp':
            case 'Space':
                keys.gas = false;
                break;
            case 'ArrowDown':
                keys.brake = false;
                break;
            case 'ArrowLeft':
                keys.lean_back = false;
                break;
            case 'ArrowRight':
                keys.lean_forward = false;
                break;
        }
    }
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // Particle system
    function addParticle(config) {
        if (particles.length > 300) {
            particles.shift();
        }
        
        particles.push({
            x: config.x,
            y: config.y,
            vx: config.vx || 0,
            vy: config.vy || 0,
            life: config.life || 1,
            maxLife: config.life || 1,
            color: config.color || '#FFFFFF',
            size: config.size || 3,
            type: config.type || 'default',
            alpha: 1,
            gravity: config.gravity || 0
        });
    }
    
    function updateParticles() {
        particles = particles.filter(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Apply gravity
            if (particle.gravity) {
                particle.vy += particle.gravity * 0.016;
            }
            
            // Update life
            particle.life -= 0.016;
            particle.alpha = particle.life / particle.maxLife;
            
            // Size changes for exhaust
            if (particle.type === 'exhaust') {
                particle.size *= 1.02;
                particle.vx *= 0.98;
                particle.vy *= 0.98;
            }
            
            return particle.life > 0;
        });
    }
    
    function createExhaustParticle() {
        if (frameCount % 3 === 0) {
            const exhaustX = bike.x - Math.cos(bike.rotation) * 30;
            const exhaustY = bike.y - Math.sin(bike.rotation) * 30;
            
            addParticle({
                x: exhaustX,
                y: exhaustY,
                vx: -bike.vx * 0.5 + (Math.random() - 0.5) * 5,
                vy: Math.random() * 3 - 1,
                life: 0.5 + Math.random() * 0.5,
                color: bike.rpm > 6000 ? neonColors.electric : neonColors.orange,
                size: 3 + Math.random() * 4,
                type: 'exhaust'
            });
        }
    }
    
    function createLandingParticles(x, y) {
        for (let i = 0; i < 8; i++) {
            addParticle({
                x: x + (Math.random() - 0.5) * 30,
                y: y,
                vx: (Math.random() - 0.5) * 15,
                vy: -Math.random() * 10,
                life: 0.5 + Math.random() * 0.5,
                color: neonColors.yellow,
                size: 2 + Math.random() * 3,
                type: 'landing',
                gravity: 500
            });
        }
    }
    
    function createCrashParticles() {
        for (let i = 0; i < 20; i++) {
            addParticle({
                x: bike.x + (Math.random() - 0.5) * bike.width,
                y: bike.y + (Math.random() - 0.5) * bike.height,
                vx: (Math.random() - 0.5) * 20,
                vy: -Math.random() * 15,
                life: 1 + Math.random(),
                color: [neonColors.hot, neonColors.orange, neonColors.yellow][Math.floor(Math.random() * 3)],
                size: 3 + Math.random() * 4,
                type: 'explosion',
                gravity: 300
            });
        }
    }
    
    // Physics and game logic
    function updateBike() {
        const deltaTime = 1/60; // 60 FPS
        
        // Input handling
        if (keys.gas && !bike.crashed) {
            bike.rpm = Math.min(bike.rpm + 50, bike.maxRPM);
            const powerMultiplier = Math.min(bike.rpm / 4000, 1);
            bike.vx += 0.8 * powerMultiplier;
            bike.glowIntensity = Math.min(bike.glowIntensity + 0.05, 1);
            createExhaustParticle();
        } else {
            bike.rpm = Math.max(bike.rpm - 30, 1000);
            bike.vx *= 0.99;
            bike.glowIntensity = Math.max(bike.glowIntensity - 0.02, 0);
        }
        
        if (keys.brake && !bike.crashed) {
            bike.vx *= 0.9;
        }
        
        // Air control
        if (!bike.onGround && !bike.crashed) {
            if (keys.lean_back) {
                bike.angularVel += 0.08;
            }
            if (keys.lean_forward) {
                bike.angularVel -= 0.08;
            }
        } else {
            bike.angularVel *= 0.8; // Ground stabilization
        }
        
        // Physics
        bike.vy += 0.5; // Gravity
        bike.vx = Math.max(-25, Math.min(25, bike.vx)); // Speed limits
        bike.vy = Math.max(-30, Math.min(40, bike.vy));
        
        // Update position
        bike.x += bike.vx;
        bike.y += bike.vy;
        
        // Update rotation
        bike.rotation += bike.angularVel;
        bike.angularVel *= 0.95;
        
        // Update wheel positions
        const cos = Math.cos(bike.rotation);
        const sin = Math.sin(bike.rotation);
        bike.frontWheelX = bike.x + cos * 25 - sin * 5;
        bike.frontWheelY = bike.y + sin * 25 + cos * 5;
        bike.rearWheelX = bike.x - cos * 25 - sin * 5;
        bike.rearWheelY = bike.y - sin * 25 + cos * 5;
        bike.wheelSpin += bike.vx * 0.1;
        
        // Track air time
        if (!bike.onGround) {
            bike.airTime += deltaTime;
        } else {
            bike.airTime = 0;
        }
    }
    
    function checkCollisions() {
        bike.onGround = false;
        
        // Get nearby terrain points
        const nearbyTerrain = terrain.filter(point => 
            Math.abs(point.x - bike.x) < 100
        );
        
        if (nearbyTerrain.length === 0) return;
        
        // Check collision for wheels
        const wheels = [
            {x: bike.frontWheelX, y: bike.frontWheelY, radius: 12},
            {x: bike.rearWheelX, y: bike.rearWheelY, radius: 12}
        ];
        
        wheels.forEach((wheel, index) => {
            let closestDistance = Infinity;
            let collisionPoint = null;
            
            nearbyTerrain.forEach(point => {
                const distance = Math.sqrt(
                    Math.pow(point.x - wheel.x, 2) + 
                    Math.pow(point.y - wheel.y, 2)
                );
                
                if (distance < closestDistance && distance < wheel.radius + 5) {
                    closestDistance = distance;
                    collisionPoint = point;
                }
            });
            
            if (collisionPoint) {
                // Position correction
                const dx = wheel.x - collisionPoint.x;
                const dy = wheel.y - collisionPoint.y;
                const length = Math.sqrt(dx * dx + dy * dy);
                
                if (length > 0) {
                    const normalX = dx / length;
                    const normalY = dy / length;
                    const separation = wheel.radius + 2;
                    
                    if (index === 0) { // Front wheel
                        bike.frontWheelX = collisionPoint.x + normalX * separation;
                        bike.frontWheelY = collisionPoint.y + normalY * separation;
                    } else { // Rear wheel
                        bike.rearWheelX = collisionPoint.x + normalX * separation;
                        bike.rearWheelY = collisionPoint.y + normalY * separation;
                        
                        // Update bike position based on rear wheel
                        const wheelDx = bike.frontWheelX - bike.rearWheelX;
                        const wheelDy = bike.frontWheelY - bike.rearWheelY;
                        bike.rotation = Math.atan2(wheelDy, wheelDx);
                        bike.x = bike.rearWheelX + Math.cos(bike.rotation) * 25;
                        bike.y = bike.rearWheelY + Math.sin(bike.rotation) * 25;
                    }
                    
                    bike.onGround = true;
                    
                    // Velocity adjustment for bounce
                    const velocityDotNormal = bike.vx * normalX + bike.vy * normalY;
                    if (velocityDotNormal < 0) {
                        bike.vx -= velocityDotNormal * normalX * 0.8;
                        bike.vy -= velocityDotNormal * normalY * 0.8;
                    }
                    
                    // Landing effects
                    if (bike.airTime > 1 && Math.abs(bike.vy) > 5) {
                        createLandingParticles(wheel.x, wheel.y);
                        
                        // Perfect landing bonus
                        if (Math.abs(bike.rotation) < 0.3) {
                            score += 500;
                            combo++;
                            comboTimer = 180; // 3 seconds at 60fps
                        }
                    }
                }
            }
        });
        
        // Check for crashes (extreme rotation)
        if (bike.onGround && Math.abs(bike.rotation) > Math.PI / 2 && !bike.crashed) {
            bike.crashed = true;
            createCrashParticles();
            
            // Reset after crash
            setTimeout(() => {
                bike.crashed = false;
                bike.rotation = 0;
                bike.angularVel = 0;
                bike.vx *= 0.3;
                bike.vy = 0;
            }, 2000);
        }
    }
    
    function updateCamera() {
        // Smooth camera following
        const targetX = bike.x - canvas.width * 0.3;
        const targetY = bike.y - canvas.height * 0.6;
        
        camera.x += (targetX - camera.x) * 0.1;
        camera.y += (targetY - camera.y) * 0.08;
    }
    
    function updateScore() {
        // Distance score
        score += Math.max(0, bike.vx * 0.1);
        
        // Combo system
        if (comboTimer > 0) {
            comboTimer--;
            if (comboTimer <= 0) {
                combo = 0;
            }
        }
        
        // Air time bonus
        if (bike.airTime > 1) {
            score += bike.airTime * 5;
        }
        
        // Speed bonus
        if (bike.vx > 20) {
            score += (bike.vx - 20) * 10;
        }
    }
    
    // Rendering functions
    function drawBackground() {
        // Cyberpunk gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#0a0a0a');
        gradient.addColorStop(0.3, '#1a0d2e');
        gradient.addColorStop(0.7, '#16213e');
        gradient.addColorStop(1, '#0f3460');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Grid effect
        ctx.save();
        ctx.strokeStyle = neonColors.electric;
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = 0.1;
        
        const gridSize = 50;
        const startX = Math.floor(camera.x / gridSize) * gridSize;
        const startY = Math.floor(camera.y / gridSize) * gridSize;
        
        for (let x = startX; x < camera.x + canvas.width + gridSize; x += gridSize) {
            const screenX = x - camera.x;
            ctx.beginPath();
            ctx.moveTo(screenX, 0);
            ctx.lineTo(screenX, canvas.height);
            ctx.stroke();
        }
        
        for (let y = startY; y < camera.y + canvas.height + gridSize; y += gridSize) {
            const screenY = y - camera.y;
            ctx.beginPath();
            ctx.moveTo(0, screenY);
            ctx.lineTo(canvas.width, screenY);
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    function drawTerrain() {
        if (terrain.length < 2) return;
        
        ctx.save();
        ctx.strokeStyle = neonColors.electric;
        ctx.lineWidth = 4;
        ctx.shadowColor = neonColors.electric;
        ctx.shadowBlur = 12;
        
        ctx.beginPath();
        let firstPoint = true;
        
        terrain.forEach(point => {
            const screenX = point.x - camera.x;
            const screenY = point.y - camera.y;
            
            if (screenX > -100 && screenX < canvas.width + 100) {
                if (firstPoint) {
                    ctx.moveTo(screenX, screenY);
                    firstPoint = false;
                } else {
                    ctx.lineTo(screenX, screenY);
                }
            }
        });
        
        ctx.stroke();
        ctx.restore();
        
        // Draw loops
        ctx.save();
        ctx.strokeStyle = neonColors.purple;
        ctx.lineWidth = 6;
        ctx.shadowColor = neonColors.purple;
        ctx.shadowBlur = 15;
        
        // Loop at x=1000
        const loopScreenX = 1000 - camera.x;
        const loopScreenY = (canvas.height - 150 - 120) - camera.y;
        
        if (loopScreenX > -200 && loopScreenX < canvas.width + 200) {
            ctx.beginPath();
            ctx.arc(loopScreenX, loopScreenY, 100, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    function drawMotorcycle() {
        const screenX = bike.x - camera.x;
        const screenY = bike.y - camera.y;
        
        ctx.save();
        ctx.translate(screenX, screenY);
        ctx.rotate(bike.rotation);
        
        // Glow effect
        if (bike.glowIntensity > 0) {
            ctx.shadowColor = neonColors.electric;
            ctx.shadowBlur = 20 * bike.glowIntensity;
        }
        
        // Motorcycle body
        ctx.fillStyle = bike.crashed ? neonColors.hot : neonColors.hot;
        ctx.fillRect(-bike.width/2, -bike.height/2, bike.width, bike.height);
        
        // Outline
        ctx.strokeStyle = neonColors.white;
        ctx.lineWidth = 2;
        ctx.strokeRect(-bike.width/2, -bike.height/2, bike.width, bike.height);
        
        ctx.restore();
        
        // Draw wheels
        [
            {x: bike.frontWheelX, y: bike.frontWheelY},
            {x: bike.rearWheelX, y: bike.rearWheelY}
        ].forEach(wheel => {
            const wheelScreenX = wheel.x - camera.x;
            const wheelScreenY = wheel.y - camera.y;
            
            ctx.save();
            ctx.translate(wheelScreenX, wheelScreenY);
            ctx.rotate(bike.wheelSpin);
            
            // Wheel rim
            ctx.strokeStyle = neonColors.lime;
            ctx.lineWidth = 3;
            ctx.shadowColor = neonColors.lime;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(0, 0, 12, 0, Math.PI * 2);
            ctx.stroke();
            
            // Spokes
            ctx.strokeStyle = neonColors.electric;
            ctx.lineWidth = 2;
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(Math.cos(angle) * 10, Math.sin(angle) * 10);
                ctx.stroke();
            }
            
            ctx.restore();
        });
    }
    
    function drawParticles() {
        particles.forEach(particle => {
            const screenX = particle.x - camera.x;
            const screenY = particle.y - camera.y;
            
            if (screenX < -50 || screenX > canvas.width + 50 || 
                screenY < -50 || screenY > canvas.height + 50) {
                return;
            }
            
            ctx.save();
            ctx.globalAlpha = particle.alpha;
            
            if (particle.type === 'exhaust') {
                ctx.fillStyle = particle.color;
                ctx.shadowColor = particle.color;
                ctx.shadowBlur = particle.size * 2;
            } else if (particle.type === 'landing') {
                ctx.fillStyle = particle.color;
                ctx.shadowColor = particle.color;
                ctx.shadowBlur = particle.size;
            } else {
                ctx.fillStyle = particle.color;
            }
            
            ctx.beginPath();
            ctx.arc(screenX, screenY, particle.size, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        });
    }
    
    function drawUI() {
        ctx.save();
        
        // Speed gauge
        const speed = Math.abs(bike.vx);
        const maxSpeed = 25;
        const gaugeX = canvas.width - 120;
        const gaugeY = 80;
        const radius = 50;
        
        // Background circle
        ctx.strokeStyle = neonColors.electric;
        ctx.lineWidth = 3;
        ctx.shadowColor = neonColors.electric;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(gaugeX, gaugeY, radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Speed arc
        const speedAngle = (speed / maxSpeed) * Math.PI * 1.5;
        ctx.strokeStyle = neonColors.hot;
        ctx.lineWidth = 8;
        ctx.shadowColor = neonColors.hot;
        ctx.beginPath();
        ctx.arc(gaugeX, gaugeY, radius - 10, -Math.PI / 2, -Math.PI / 2 + speedAngle);
        ctx.stroke();
        
        // Speed text
        ctx.fillStyle = neonColors.white;
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.shadowBlur = 5;
        ctx.fillText(Math.floor(speed), gaugeX, gaugeY + 5);
        ctx.font = '12px Arial';
        ctx.fillText('km/h', gaugeX, gaugeY + 20);
        
        // RPM gauge
        const rpmX = canvas.width - 250;
        const rpmY = 80;
        const rpmRadius = 40;
        
        ctx.strokeStyle = neonColors.lime;
        ctx.lineWidth = 2;
        ctx.shadowColor = neonColors.lime;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(rpmX, rpmY, rpmRadius, 0, Math.PI * 2);
        ctx.stroke();
        
        const rpmAngle = (bike.rpm / bike.maxRPM) * Math.PI * 1.5;
        const rpmColor = bike.rpm > bike.maxRPM * 0.8 ? neonColors.hot : neonColors.lime;
        ctx.strokeStyle = rpmColor;
        ctx.lineWidth = 6;
        ctx.shadowColor = rpmColor;
        ctx.beginPath();
        ctx.arc(rpmX, rpmY, rpmRadius - 8, -Math.PI / 2, -Math.PI / 2 + rpmAngle);
        ctx.stroke();
        
        ctx.fillStyle = neonColors.white;
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.shadowBlur = 3;
        ctx.fillText(Math.floor(bike.rpm), rpmX, rpmY + 3);
        
        // Score
        ctx.fillStyle = neonColors.electric;
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'left';
        ctx.shadowColor = neonColors.electric;
        ctx.shadowBlur = 10;
        ctx.fillText('Score: ' + Math.floor(score), 20, 40);
        
        // Combo
        if (combo > 0) {
            ctx.fillStyle = neonColors.yellow;
            ctx.font = 'bold 20px Arial';
            ctx.shadowColor = neonColors.yellow;
            ctx.shadowBlur = 8;
            ctx.fillText('Combo x' + combo, 20, 70);
        }
        
        // Instructions
        ctx.fillStyle = neonColors.white;
        ctx.font = '14px Arial';
        ctx.shadowBlur = 3;
        ctx.globalAlpha = 0.7;
        
        const instructions = [
            'Arrow Keys: Lean / Gas / Brake',
            'Space: Gas',
            'Perform stunts for bonus points!'
        ];
        
        instructions.forEach((text, index) => {
            ctx.fillText(text, 20, canvas.height - 60 + index * 18);
        });
        
        ctx.restore();
    }
    
    // Main game loop
    function gameLoop() {
        if (!gameRunning) return;
        
        frameCount++;
        
        // Update
        updateBike();
        checkCollisions();
        updateCamera();
        updateScore();
        updateParticles();
        
        // Draw
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground();
        drawTerrain();
        drawParticles();
        drawMotorcycle();
        drawUI();
        
        animationId = requestAnimationFrame(gameLoop);
    }
    
    // Start game
    gameLoop();
    
    // Cleanup function
    function stopGame() {
        gameRunning = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
    }
    
    window.currentGameCleanup = stopGame;
}

// Hill Climb Racing Game
function initHillClimbRacing(canvas, ctx) {
    canvas.width = 800;
    canvas.height = 600;
    
    let gameRunning = true;
    let animationId;
    let score = 0;
    
    // Game variables
    let car = {
        x: 100,
        y: 400,
        vx: 0,
        vy: 0,
        rotation: 0,
        angularVelocity: 0,
        width: 40,
        height: 20,
        onGround: false,
        crashed: false
    };
    
    let terrain = [];
    let camera = { x: 0, y: 0 };
    
    // Generate simple terrain
    function generateTerrain() {
        terrain = [];
        for (let x = 0; x < 2000; x += 20) {
            let y = 500 + Math.sin(x * 0.01) * 50;
            terrain.push({ x, y });
        }
    }
    
    generateTerrain();
    
    // Input handling
    let keys = {};
    
    function handleKeyDown(e) {
        switch(e.code) {
            case 'ArrowUp':
            case 'Space':
                keys.gas = true;
                break;
            case 'ArrowDown':
                keys.brake = true;
                break;
            case 'ArrowLeft':
                keys.lean_back = true;
                break;
            case 'ArrowRight':
                keys.lean_forward = true;
                break;
        }
    }
    
    function handleKeyUp(e) {
        switch(e.code) {
            case 'ArrowUp':
            case 'Space':
                keys.gas = false;
                break;
            case 'ArrowDown':
                keys.brake = false;
                break;
            case 'ArrowLeft':
                keys.lean_back = false;
                break;
            case 'ArrowRight':
                keys.lean_forward = false;
                break;
            case 'KeyR':
                if (car.crashed) {
                    // Restart game
                    car = {
                        x: 100,
                        y: 400,
                        vx: 0,
                        vy: 0,
                        rotation: 0,
                        angularVelocity: 0,
                        width: 40,
                        height: 20,
                        onGround: false,
                        crashed: false
                    };
                    score = 0;
                    gameRunning = true;
                }
                break;
        }
    }
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
        // Simple physics update
    function update() {
        // Input handling
        if (keys.gas) {
            car.vx += 0.3;
        }
        if (keys.brake) {
            car.vx *= 0.9;
        }
        if (keys.lean_back && !car.crashed) {
            car.angularVelocity += 0.02;
        }
        if (keys.lean_forward && !car.crashed) {
            car.angularVelocity -= 0.02;
        }
        
        // Gravity
        if (!car.crashed) {
            car.vy += 0.5;
        }
        
        // Update rotation and physics
        car.rotation += car.angularVelocity;
        car.angularVelocity *= 0.95; // Air resistance
        
        // Update position
        car.x += car.vx;
        car.y += car.vy;
        
        // Simple collision with terrain
        let groundY = 500 + Math.sin(car.x * 0.01) * 50;
        car.onGround = false;
        
        if (car.y > groundY) {
            car.y = groundY;
            car.vy = 0;
            car.onGround = true;
            
            // Check for crash conditions
            if (Math.abs(car.rotation) > Math.PI / 2 || Math.abs(car.vx) > 15) {
                car.crashed = true;
                gameRunning = false;
            }
            
            // Landing stabilization
            if (car.onGround) {
                car.angularVelocity *= 0.8;
                car.vx *= 0.98; // Ground friction
            }
        }
        
        // Update camera
        camera.x = car.x - 200;
        
        // Update score only if not crashed
        if (!car.crashed) {
            score += Math.floor(car.vx * 0.1);
        }
    }
    
    // Simple drawing function
    function draw() {
        // Clear canvas
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw terrain
        ctx.save();
        ctx.translate(-camera.x, 0);
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let i = 0; i < terrain.length - 1; i++) {
            if (i === 0) {
                ctx.moveTo(terrain[i].x, terrain[i].y);
            } else {
                ctx.lineTo(terrain[i].x, terrain[i].y);
            }
        }
        ctx.stroke();
        
        // Draw car
        ctx.save();
        ctx.translate(car.x, car.y);
        ctx.rotate(car.rotation);
        
        // Car body
        ctx.fillStyle = car.crashed ? '#666666' : '#FF0000';
        ctx.fillRect(-car.width/2, -car.height/2, car.width, car.height);
        
        // Car wheels
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(-car.width/3, car.height/2, 8, 0, Math.PI * 2);
        ctx.arc(car.width/3, car.height/2, 8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
        
        ctx.restore();
        
        // Draw UI
        ctx.fillStyle = '#000';
        ctx.font = '20px Arial';
        ctx.fillText('Score: ' + score, 10, 30);
        ctx.fillText('Speed: ' + Math.floor(car.vx), 10, 60);
        ctx.fillText('Rotation: ' + Math.floor(car.rotation * 180 / Math.PI) + '°', 10, 90);
        
        if (car.crashed) {
            ctx.fillStyle = 'rgba(255,0,0,0.8)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#FFF';
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('CRASHED!', canvas.width/2, canvas.height/2);
            ctx.font = '24px Arial';
            ctx.fillText('Final Score: ' + score, canvas.width/2, canvas.height/2 + 50);
            ctx.fillText('Press R to restart', canvas.width/2, canvas.height/2 + 80);
            ctx.textAlign = 'left';
        }
    }
    
    // Game loop
    function gameLoop() {
        if (!gameRunning) return;
        
        update();
        draw();
        
        animationId = requestAnimationFrame(gameLoop);
    }
    
    // Start game
    gameLoop();
    
    // Cleanup function
    function stopGame() {
        gameRunning = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
    }
    
    window.currentGameCleanup = stopGame;
}


function initMarioBros(canvas, ctx) {
    canvas.width = 800;
    canvas.height = 600;
    
    let gameRunning = true;
    let animationId;
    let score = 0;
    let lives = 3;
    
    const mario = {
        x: 50,
        y: canvas.height - 100,
        width: 32,
        height: 32,
        vx: 0,
        vy: 0,
        onGround: false,
        direction: 1
    };
    
    let cameraX = 0;
    let platforms = [];
    let enemies = [];
    let coins = [];
    let lastPlatformX = 0;
    
    // Generate level with infinite generation
    function generateLevel() {
        platforms = [];
        enemies = [];
        coins = [];
        lastPlatformX = 0;
        
        // Ground platforms
        for (let x = 0; x < 1000; x += 100) {
            platforms.push({
                x: x,
                y: canvas.height - 50,
                width: 100,
                height: 50,
                type: 'ground'
            });
            lastPlatformX = x;
        }
        
        // Floating platforms
        for (let x = 200; x < 800; x += 300) {
            platforms.push({
                x: x,
                y: canvas.height - 200 - Math.random() * 100,
                width: 100,
                height: 20,
                type: 'platform'
            });
            
            // Add coins on platforms
            coins.push({
                x: x + 40,
                y: canvas.height - 240 - Math.random() * 100,
                width: 16,
                height: 16,
                collected: false
            });
        }
        
        // Add enemies - more aggressive
        for (let x = 300; x < 700; x += 150) { // More enemies (every 150 instead of 200)
            enemies.push({
                x: x,
                y: canvas.height - 82,
                width: 24,
                height: 32,
                vx: Math.random() < 0.5 ? -1.5 : 1.5, // Faster and random direction
                direction: Math.random() < 0.5 ? -1 : 1,
                type: 'goomba'
            });
        }
    }
    
    // Extend level infinitely
    function extendLevel() {
        if (mario.x > lastPlatformX - 800) {
            let startX = lastPlatformX + 100;
            
            // Add ground platforms
            for (let x = startX; x < startX + 1000; x += 100) {
                platforms.push({
                    x: x,
                    y: canvas.height - 50,
                    width: 100,
                    height: 50,
                    type: 'ground'
                });
            }
            
            // Add floating platforms
            for (let x = startX + 100; x < startX + 800; x += 300) {
                platforms.push({
                    x: x,
                    y: canvas.height - 200 - Math.random() * 100,
                    width: 100,
                    height: 20,
                    type: 'platform'
                });
                
                // Add coins
                coins.push({
                    x: x + 40,
                    y: canvas.height - 240 - Math.random() * 100,
                    width: 16,
                    height: 16,
                    collected: false
                });
            }
            
            // Add enemies - more challenging
            for (let x = startX + 150; x < startX + 700; x += 180) { // More frequent enemies
                let enemySpeed = 1.2 + Math.random() * 0.8; // Speed 1.2-2.0
                enemies.push({
                    x: x,
                    y: canvas.height - 82,
                    width: 24,
                    height: 32,
                    vx: Math.random() < 0.5 ? -enemySpeed : enemySpeed,
                    direction: Math.random() < 0.5 ? -1 : 1,
                    type: Math.random() < 0.6 ? 'goomba' : 'koopa' // More goombas (harder)
                });
            }
            
            lastPlatformX += 1000;
            
            // Remove old elements to save memory
            platforms = platforms.filter(p => p.x > mario.x - 1000);
            enemies = enemies.filter(e => e.x > mario.x - 1000);
            coins = coins.filter(c => c.x > mario.x - 1000);
        }
    }
    
    function updateGame() {
        if (!gameRunning) return;
        
        // Extend level if needed
        extendLevel();
        
        // Mario physics - stronger gravity for more challenge
        mario.vy += 0.6; // gravity
        mario.x += mario.vx;
        mario.y += mario.vy;
        
        // Platform collisions
        mario.onGround = false;
        platforms.forEach(platform => {
            if (mario.x < platform.x + platform.width &&
                mario.x + mario.width > platform.x &&
                mario.y < platform.y + platform.height &&
                mario.y + mario.height > platform.y) {
                
                // Top collision (landing on platform)
                if (mario.vy > 0 && mario.y < platform.y) {
                    mario.y = platform.y - mario.height;
                    mario.vy = 0;
                    mario.onGround = true;
                }
            }
        });
        
        // Update enemies
        enemies.forEach(enemy => {
            enemy.x += enemy.vx;
            
            // Reverse direction at platform edges
            let onPlatform = false;
            platforms.forEach(platform => {
                if (enemy.x >= platform.x && enemy.x <= platform.x + platform.width &&
                    enemy.y >= platform.y - enemy.height && enemy.y <= platform.y) {
                    onPlatform = true;
                }
            });
            
            if (!onPlatform || enemy.x <= 0 || enemy.x >= 2000) {
                enemy.vx = -enemy.vx;
                enemy.direction = -enemy.direction;
            }
        });
        
        // Check collisions
        checkCollisions();
        
        // Update camera
        cameraX = mario.x - canvas.width / 3;
        if (cameraX < 0) cameraX = 0;
    }
    
    function checkCollisions() {
        // Enemy collisions
        enemies.forEach((enemy, index) => {
            if (mario.x < enemy.x + enemy.width &&
                mario.x + mario.width > enemy.x &&
                mario.y < enemy.y + enemy.height &&
                mario.y + mario.height > enemy.y) {
                
                // Jump on enemy
                if (mario.vy > 0 && mario.y < enemy.y) {
                    enemies.splice(index, 1);
                    mario.vy = -8;
                    score += 100;
                } else {
                    // Mario hit by enemy
                    lives--;
                    mario.x = 50;
                    mario.y = canvas.height - 100;
                    mario.vx = 0;
                    mario.vy = 0;
                    
                    if (lives <= 0) {
                        gameRunning = false;
                    }
                }
            }
        });
        
        // Coin collisions
        coins.forEach(coin => {
            if (!coin.collected &&
                mario.x < coin.x + coin.width &&
                mario.x + mario.width > coin.x &&
                mario.y < coin.y + coin.height &&
                mario.y + mario.height > coin.y) {
                coin.collected = true;
                score += 50;
            }
        });
    }
    
    function draw() {
        // Sky
        ctx.fillStyle = '#5C94FC';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw platforms with better textures
        platforms.forEach(platform => {
            let screenX = platform.x - cameraX;
            if (platform.type === 'ground') {
                // Ground blocks (brick texture)
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(screenX, platform.y, platform.width, platform.height);
                
                // Brick pattern
                ctx.strokeStyle = '#654321';
                ctx.lineWidth = 1;
                for (let x = 0; x < platform.width; x += 25) {
                    for (let y = 0; y < platform.height; y += 12) {
                        ctx.strokeRect(screenX + x, platform.y + y, 25, 12);
                    }
                }
            } else {
                // Platform blocks
                ctx.fillStyle = '#228B22';
                ctx.fillRect(screenX, platform.y, platform.width, platform.height);
                ctx.strokeStyle = '#006400';
                ctx.lineWidth = 2;
                ctx.strokeRect(screenX, platform.y, platform.width, platform.height);
            }
        });
        
        // Draw coins with rotation
        coins.forEach(coin => {
            if (!coin.collected) {
                let screenX = coin.x - cameraX;
                ctx.save();
                ctx.translate(screenX + coin.width/2, coin.y + coin.height/2);
                ctx.rotate(Date.now() * 0.01);
                
                // Coin body
                ctx.fillStyle = '#FFD700';
                ctx.beginPath();
                ctx.arc(0, 0, coin.width/2, 0, Math.PI * 2);
                ctx.fill();
                
                // Coin border
                ctx.strokeStyle = '#FFA500';
                ctx.lineWidth = 2;
                ctx.stroke();
                
                // $ symbol
                ctx.fillStyle = '#B8860B';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('$', 0, 4);
                ctx.textAlign = 'left';
                
                ctx.restore();
            }
        });
        
        // Draw enemies with improved textures
        enemies.forEach(enemy => {
            let screenX = enemy.x - cameraX;
            
            if (enemy.type === 'goomba') {
                // Goomba (brown mushroom enemy)
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(screenX, enemy.y + 8, enemy.width, enemy.height - 8);
                
                // Head
                ctx.fillStyle = '#A0522D';
                ctx.beginPath();
                ctx.arc(screenX + enemy.width/2, enemy.y + 12, 10, 0, Math.PI * 2);
                ctx.fill();
                
                // Eyes
                ctx.fillStyle = '#FFF';
                ctx.fillRect(screenX + 6, enemy.y + 8, 4, 4);
                ctx.fillRect(screenX + 14, enemy.y + 8, 4, 4);
                ctx.fillStyle = '#000';
                ctx.fillRect(screenX + 7, enemy.y + 9, 2, 2);
                ctx.fillRect(screenX + 15, enemy.y + 9, 2, 2);
                
                // Angry brow
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(screenX + 6, enemy.y + 6);
                ctx.lineTo(screenX + 10, enemy.y + 8);
                ctx.moveTo(screenX + 14, enemy.y + 8);
                ctx.lineTo(screenX + 18, enemy.y + 6);
                ctx.stroke();
                
                // Feet
                ctx.fillStyle = '#654321';
                ctx.fillRect(screenX + 2, enemy.y + enemy.height - 4, 6, 4);
                ctx.fillRect(screenX + enemy.width - 8, enemy.y + enemy.height - 4, 6, 4);
                
            } else if (enemy.type === 'koopa') {
                // Koopa Troopa (turtle enemy)
                ctx.fillStyle = '#228B22';
                ctx.fillRect(screenX, enemy.y + 6, enemy.width, enemy.height - 6);
                
                // Shell
                ctx.fillStyle = '#006400';
                ctx.beginPath();
                ctx.arc(screenX + enemy.width/2, enemy.y + 16, 10, 0, Math.PI * 2);
                ctx.fill();
                
                // Shell pattern
                ctx.strokeStyle = '#00FF00';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(screenX + enemy.width/2, enemy.y + 16, 8, 0, Math.PI * 2);
                ctx.stroke();
                
                // Head
                ctx.fillStyle = '#FFFF00';
                ctx.fillRect(screenX + 8, enemy.y + 2, 8, 10);
                
                // Eyes
                ctx.fillStyle = '#000';
                ctx.fillRect(screenX + 9, enemy.y + 4, 2, 2);
                ctx.fillRect(screenX + 13, enemy.y + 4, 2, 2);
                
                // Beak
                ctx.fillStyle = '#FFA500';
                ctx.fillRect(screenX + 11, enemy.y + 7, 2, 3);
            }
        });
        
        // Draw Mario with detailed sprite
        let screenX = mario.x - cameraX;
        
        // Mario body (red shirt)
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(screenX + 4, mario.y + 8, mario.width - 8, mario.height - 16);
        
        // Mario overalls (blue)
        ctx.fillStyle = '#0000FF';
        ctx.fillRect(screenX + 6, mario.y + 12, mario.width - 12, mario.height - 20);
        
        // Overalls straps
        ctx.fillStyle = '#0000FF';
        ctx.fillRect(screenX + 8, mario.y + 8, 4, 8);
        ctx.fillRect(screenX + 20, mario.y + 8, 4, 8);
        
        // Mario head (skin tone)
        ctx.fillStyle = '#FFDBAC';
        ctx.fillRect(screenX + 6, mario.y + 2, mario.width - 12, 12);
        
        // Mario hat
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(screenX + 4, mario.y - 2, mario.width - 8, 8);
        
        // Hat emblem (M)
        ctx.fillStyle = '#FFF';
        ctx.font = '8px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('M', screenX + mario.width/2, mario.y + 3);
        ctx.textAlign = 'left';
        
        // Mario mustache
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(screenX + 10, mario.y + 8, 12, 3);
        
        // Mario eyes
        ctx.fillStyle = '#000';
        ctx.fillRect(screenX + 8, mario.y + 5, 2, 2);
        ctx.fillRect(screenX + 22, mario.y + 5, 2, 2);
        
        // Mario nose
        ctx.fillStyle = '#FFDBAC';
        ctx.fillRect(screenX + 15, mario.y + 7, 2, 2);
        
        // Mario gloves
        ctx.fillStyle = '#FFF';
        ctx.fillRect(screenX + 2, mario.y + 12, 4, 6);
        ctx.fillRect(screenX + 26, mario.y + 12, 4, 6);
        
        // Mario shoes
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(screenX + 2, mario.y + mario.height - 4, 8, 4);
        ctx.fillRect(screenX + 22, mario.y + mario.height - 4, 8, 4);
        
        // UI
        ctx.fillStyle = '#FFF';
        ctx.font = '20px Arial';
        ctx.fillText('Score: ' + score, 10, 30);
        ctx.fillText('Lives: ' + lives, 10, 55);
        
        if (!gameRunning) {
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#FFF';
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Game Over!', canvas.width/2, canvas.height/2);
            ctx.font = '24px Arial';
            ctx.fillText('Final Score: ' + score, canvas.width/2, canvas.height/2 + 50);
            ctx.fillText('Press R to restart', canvas.width/2, canvas.height/2 + 80);
            ctx.textAlign = 'left';
        }
    }
    
    function gameLoop() {
        updateGame();
        draw();
        animationId = requestAnimationFrame(gameLoop);
    }
    
    function handleKeyDown(e) {
        if (!gameRunning && e.key.toLowerCase() === 'r') {
            // Restart
            score = 0;
            lives = 3;
            mario.x = 50;
            mario.y = canvas.height - 100;
            mario.vx = 0;
            mario.vy = 0;
            cameraX = 0;
            lastPlatformX = 0;
            generateLevel();
            gameRunning = true;
            return;
        }
        
        if (gameRunning) {
            switch(e.key) {
                case 'ArrowLeft':
                    mario.vx = -4;
                    mario.direction = -1;
                    break;
                case 'ArrowRight':
                    mario.vx = 4;
                    mario.direction = 1;
                    break;
                case 'ArrowUp':
                case ' ':
                    if (mario.onGround) {
                        mario.vy = -12;
                    }
                    break;
            }
        }
    }
    
    function handleKeyUp(e) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            mario.vx = 0;
        }
    }
    
    function stopGame() {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
    }
    
    generateLevel();
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    animationId = requestAnimationFrame(gameLoop);
    
    window.currentGameCleanup = stopGame;
}

// Duck Hunt Game
function initDuckHunt(canvas, ctx) {
    canvas.width = 800;
    canvas.height = 600;
    
    let gameRunning = true;
    let animationId;
    let score = 0;
    let round = 1;
    let ducksShot = 0;
    let shotsLeft = 3;
    
    let ducks = [];
    let crosshair = { x: canvas.width/2, y: canvas.height/2 };
    let roundTransition = false;
    let transitionTimer = 0;
    let levelTimer = 0;
    let maxLevelTime = 300; // 5 seconds at 60fps
    
    function spawnDucks() {
        if (roundTransition) return;
        
        ducks = [];
        let duckCount = Math.min(2 + Math.floor(round / 3), 5);
        
        // Spawn ducks from edges with proper velocity
        for (let i = 0; i < duckCount; i++) {
            let side = Math.random() < 0.5 ? 'left' : 'right';
            let startX, startVx;
            
            if (side === 'left') {
                startX = -50;
                startVx = 1 + Math.random() * 2;
            } else {
                startX = canvas.width + 50;
                startVx = -(1 + Math.random() * 2);
            }
            
            ducks.push({
                x: startX,
                y: 50 + Math.random() * (canvas.height - 250),
                vx: startVx,
                vy: (Math.random() - 0.5) * 1.5,
                width: 40,
                height: 30,
                alive: true,
                flightPattern: Math.floor(Math.random() * 3),
                timeAlive: 0
            });
        }
        
        shotsLeft = 3;
        ducksShot = 0;
        roundTransition = false;
        transitionTimer = 0;
        levelTimer = 0;
        maxLevelTime = Math.max(180, 360 - round * 10); // Time decreases with rounds (3-6 seconds)
    }
    
    function updateGame() {
        if (!gameRunning) return;
        
        // Handle round transition
        if (roundTransition) {
            transitionTimer++;
            if (transitionTimer > 120) { // 2 seconds at 60fps
                round++;
                spawnDucks();
            }
            return;
        }
        
        // Level timer - must kill enough ducks in time
        levelTimer++;
        let requiredDucks = Math.min(2 + Math.floor(round / 2), ducks.length);
        
        if (levelTimer > maxLevelTime) {
            // Time's up! Check if player killed enough ducks
            let killedDucks = ducks.filter(duck => !duck.alive).length;
            if (killedDucks < requiredDucks) {
                gameRunning = false; // Game Over - not enough ducks killed in time
                return;
            } else {
                // Success - advance to next round
                if (!roundTransition) {
                    roundTransition = true;
                    transitionTimer = 0;
                }
            }
        }
        
        // Update ducks
        ducks.forEach(duck => {
            if (!duck.alive) return;
            
            duck.timeAlive++;
            duck.x += duck.vx;
            duck.y += duck.vy;
            
            // Flight patterns
            switch(duck.flightPattern) {
                case 0: // Straight line with slight variation
                    duck.vy += (Math.random() - 0.5) * 0.1;
                    break;
                case 1: // Sine wave
                    duck.vy += Math.sin(duck.timeAlive * 0.1) * 0.2;
                    break;
                case 2: // Random direction changes
                    if (Math.random() < 0.02) {
                        duck.vx += (Math.random() - 0.5) * 0.3;
                        duck.vy += (Math.random() - 0.5) * 0.3;
                    }
                    break;
            }
            
            // Gentle bounce off edges
            if (duck.x <= 0 || duck.x >= canvas.width - duck.width) {
                duck.vx = -duck.vx * 0.8;
                duck.x = Math.max(0, Math.min(canvas.width - duck.width, duck.x));
            }
            if (duck.y <= 0 || duck.y >= canvas.height - 200) {
                duck.vy = -duck.vy * 0.8;
                duck.y = Math.max(0, Math.min(canvas.height - 200, duck.y));
            }
            
            // Limit speed
            duck.vx = Math.max(-3, Math.min(3, duck.vx));
            duck.vy = Math.max(-2, Math.min(2, duck.vy));
        });
        
        // Check round completion - removed automatic advance
        let aliveDucks = ducks.filter(duck => duck.alive).length;
        if (aliveDucks === 0) {
            // All ducks killed - advance immediately
            if (!roundTransition) {
                roundTransition = true;
                transitionTimer = 0;
            }
        } else if (shotsLeft === 0) {
            // No shots left - check if enough ducks killed
            let killedDucks = ducks.filter(duck => !duck.alive).length;
            let requiredDucks = Math.min(2 + Math.floor(round / 2), ducks.length);
            if (killedDucks < requiredDucks) {
                gameRunning = false; // Game Over
            } else {
                // Enough ducks killed - advance
                if (!roundTransition) {
                    roundTransition = true;
                    transitionTimer = 0;
                }
            }
        }
    }
    
    function draw() {
        // Sky background
        let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#98FB98');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Clouds
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        for (let i = 0; i < 5; i++) {
            let x = (Date.now() * 0.01 + i * 150) % (canvas.width + 100);
            ctx.beginPath();
            ctx.arc(x, 50 + i * 30, 20, 0, Math.PI * 2);
            ctx.arc(x + 25, 50 + i * 30, 25, 0, Math.PI * 2);
            ctx.arc(x + 50, 50 + i * 30, 20, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Ground
        ctx.fillStyle = '#228B22';
        ctx.fillRect(0, canvas.height - 150, canvas.width, 150);
        
        // Trees
        ctx.fillStyle = '#8B4513';
        for (let x = 50; x < canvas.width; x += 120) {
            ctx.fillRect(x, canvas.height - 200, 20, 50);
            
            // Tree crown
            ctx.fillStyle = '#228B22';
            ctx.beginPath();
            ctx.arc(x + 10, canvas.height - 220, 30, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#8B4513';
        }
        
        // Draw ducks
        ducks.forEach(duck => {
            if (duck.alive) {
                // Duck body
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(duck.x, duck.y, duck.width, duck.height);
                
                // Duck head
                ctx.fillStyle = '#654321';
                ctx.beginPath();
                ctx.arc(duck.x + duck.width - 10, duck.y + 10, 12, 0, Math.PI * 2);
                ctx.fill();
                
                // Wing animation
                ctx.fillStyle = '#A0522D';
                let wingOffset = Math.sin(Date.now() * 0.02) * 5;
                ctx.fillRect(duck.x + 10, duck.y + 5 + wingOffset, 15, 8);
                
                // Beak
                ctx.fillStyle = '#FFA500';
                ctx.fillRect(duck.x + duck.width - 5, duck.y + 8, 8, 4);
            }
        });
        
        // Crosshair
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(crosshair.x - 15, crosshair.y);
        ctx.lineTo(crosshair.x + 15, crosshair.y);
        ctx.moveTo(crosshair.x, crosshair.y - 15);
        ctx.lineTo(crosshair.x, crosshair.y + 15);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(crosshair.x, crosshair.y, 10, 0, Math.PI * 2);
        ctx.stroke();
        
        // UI
        ctx.fillStyle = '#000';
        ctx.font = '24px Arial';
        ctx.fillText('Score: ' + score, 10, 30);
        ctx.fillText('Round: ' + round, 10, 60);
        ctx.fillText('Shots: ' + shotsLeft, 10, 90);
        
        let aliveDucks = ducks.filter(d => d.alive).length;
        let killedDucks = ducks.filter(d => !d.alive).length;
        let requiredDucks = Math.min(2 + Math.floor(round / 2), ducks.length);
        
        ctx.fillText('Killed: ' + killedDucks + '/' + requiredDucks, 10, 120);
        
        // Timer
        let timeLeft = Math.max(0, maxLevelTime - levelTimer);
        let seconds = Math.ceil(timeLeft / 60);
        ctx.fillStyle = timeLeft < 60 ? '#FF0000' : '#000';
        ctx.fillText('Time: ' + seconds + 's', 10, 150);
        
        // Instructions
        ctx.font = '16px Arial';
        ctx.fillText('Move mouse to aim, click to shoot', 10, canvas.height - 20);
        
        // Round transition display
        if (roundTransition) {
            ctx.fillStyle = 'rgba(0,0,0,0.6)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#FFF';
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Round ' + round + ' Complete!', canvas.width/2, canvas.height/2 - 50);
            ctx.font = '32px Arial';
            ctx.fillText('Next Round: ' + (round + 1), canvas.width/2, canvas.height/2 + 20);
            ctx.font = '24px Arial';
            ctx.fillText('Get Ready...', canvas.width/2, canvas.height/2 + 70);
            ctx.textAlign = 'left';
        }
        
        if (!gameRunning) {
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#FFF';
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Game Over!', canvas.width/2, canvas.height/2);
            ctx.font = '24px Arial';
            ctx.fillText('Final Score: ' + score, canvas.width/2, canvas.height/2 + 50);
            ctx.fillText('Round Reached: ' + round, canvas.width/2, canvas.height/2 + 80);
            ctx.fillText('Press R to restart', canvas.width/2, canvas.height/2 + 110);
            ctx.textAlign = 'left';
        }
    }
    
    function gameLoop() {
        updateGame();
        draw();
        animationId = requestAnimationFrame(gameLoop);
    }
    
    function handleMouseMove(e) {
        const rect = canvas.getBoundingClientRect();
        crosshair.x = e.clientX - rect.left;
        crosshair.y = e.clientY - rect.top;
    }
    
    function handleClick(e) {
        if (!gameRunning) return;
        if (shotsLeft <= 0) return;
        
        shotsLeft--;
        
        // Check if any duck was hit
        ducks.forEach(duck => {
            if (duck.alive &&
                crosshair.x >= duck.x && crosshair.x <= duck.x + duck.width &&
                crosshair.y >= duck.y && crosshair.y <= duck.y + duck.height) {
                duck.alive = false;
                score += 100 * round;
                ducksShot++;
            }
        });
    }
    
    function handleKeyPress(e) {
        if (!gameRunning && e.key.toLowerCase() === 'r') {
            // Restart
            score = 0;
            round = 1;
            ducksShot = 0;
            levelTimer = 0;
            maxLevelTime = 300;
            gameRunning = true;
            spawnDucks();
        }
    }
    
    function stopGame() {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('click', handleClick);
        document.removeEventListener('keydown', handleKeyPress);
    }
    
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyPress);
    
    spawnDucks();
    animationId = requestAnimationFrame(gameLoop);
    
    window.currentGameCleanup = stopGame;
}

// Casino Slot Machine Game
function initCasinoSlots(canvas, ctx) {
    canvas.width = 800;
    canvas.height = 600;
    
    let gameRunning = true;
    let animationId;
    let money = 1000;
    let bet = 50;
    
    const symbols = ['🍒', '🍋', '🍊', '⭐', '💎', '🍀', '7️⃣'];
    const payouts = { '🍒': 2, '🍋': 3, '🍊': 4, '⭐': 5, '💎': 10, '🍀': 15, '7️⃣': 50 };
    
    let reels = [
        { symbols: [0, 1, 2, 3, 4, 5, 6], spinning: false, position: 0, speed: 0, targetPosition: 0 },
        { symbols: [1, 2, 3, 4, 5, 6, 0], spinning: false, position: 0, speed: 0, targetPosition: 0 },
        { symbols: [2, 3, 4, 5, 6, 0, 1], spinning: false, position: 0, speed: 0, targetPosition: 0 }
    ];
    
    let lastWin = 0;
    let spinning = false;
    let winMessage = '';
    let winTimer = 0;
    
    function spin() {
        if (spinning || money < bet) return;
        
        money -= bet;
        spinning = true;
        winMessage = '';
        lastWin = 0;
        
        reels.forEach((reel, index) => {
            reel.spinning = true;
            reel.speed = 20 + Math.random() * 10;
            reel.targetPosition = Math.floor(Math.random() * 7) * 100;
            
            // Stop reels one by one with delay
            setTimeout(() => {
                reel.spinning = false;
            }, 2000 + index * 500);
        });
        
        // Check for win after all reels stop
        setTimeout(() => {
            spinning = false;
            checkWin();
        }, 4000);
    }
    
    function checkWin() {
        let currentSymbols = reels.map(reel => {
            let symbolIndex = Math.floor((reel.position % 700) / 100);
            return symbols[reel.symbols[symbolIndex]];
        });
        
        // Check for three matching symbols
        if (currentSymbols[0] === currentSymbols[1] && currentSymbols[1] === currentSymbols[2]) {
            let symbol = currentSymbols[0];
            lastWin = bet * (payouts[symbol] || 1);
            money += lastWin;
            winMessage = `JACKPOT! ${symbol} ${symbol} ${symbol} - Won ${lastWin}€!`;
            winTimer = 180; // 3 seconds at 60fps
        } else if (currentSymbols[0] === currentSymbols[1] || currentSymbols[1] === currentSymbols[2] || currentSymbols[0] === currentSymbols[2]) {
            // Two matching symbols - smaller win
            lastWin = Math.floor(bet * 0.5);
            money += lastWin;
            winMessage = `Small Win! Won ${lastWin}€!`;
            winTimer = 120;
        } else {
            winMessage = 'Try again!';
            winTimer = 60;
        }
    }
    
    function updateGame() {
        if (!gameRunning) return;
        
        // Update spinning reels
        reels.forEach(reel => {
            if (reel.spinning) {
                reel.position += reel.speed;
                if (reel.position >= 700) reel.position = 0;
            } else if (reel.position !== reel.targetPosition) {
                // Smooth stop to target position
                let diff = reel.targetPosition - reel.position;
                if (Math.abs(diff) < 5) {
                    reel.position = reel.targetPosition;
                } else {
                    reel.position += diff * 0.1;
                }
            }
        });
        
        if (winTimer > 0) winTimer--;
    }
    
    function draw() {
        // Background
        let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#4A0E4E');
        gradient.addColorStop(1, '#2E1065');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Machine frame
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(150, 100, 500, 400);
        ctx.fillStyle = '#B8860B';
        ctx.fillRect(160, 110, 480, 380);
        
        // Reels background
        ctx.fillStyle = '#FFF';
        for (let i = 0; i < 3; i++) {
            ctx.fillRect(190 + i * 140, 150, 100, 300);
        }
        
        // Draw reels
        for (let i = 0; i < 3; i++) {
            let reel = reels[i];
            
            // Clip to reel area
            ctx.save();
            ctx.beginPath();
            ctx.rect(190 + i * 140, 150, 100, 300);
            ctx.clip();
            
            // Draw symbols
            for (let j = -1; j <= 4; j++) {
                let symbolIndex = Math.floor(((reel.position + j * 100) % 700) / 100);
                if (symbolIndex < 0) symbolIndex += 7;
                let symbol = symbols[reel.symbols[symbolIndex]];
                
                ctx.font = '60px Arial';
                ctx.textAlign = 'center';
                ctx.fillStyle = '#000';
                let y = 220 + j * 100 - (reel.position % 100);
                ctx.fillText(symbol, 240 + i * 140, y);
            }
            
            ctx.restore();
            
            // Reel borders
            ctx.strokeStyle = '#B8860B';
            ctx.lineWidth = 4;
            ctx.strokeRect(190 + i * 140, 150, 100, 300);
        }
        
        // Winning line
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 3;
        ctx.setLineDash([10, 5]);
        ctx.beginPath();
        ctx.moveTo(190, 300);
        ctx.lineTo(610, 300);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // UI Elements
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(200, 50, 400, 40);
        ctx.fillStyle = '#000';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('CASINO SLOT MACHINE', canvas.width/2, 75);
        
        // Money and bet display
        ctx.fillStyle = '#FFF';
        ctx.font = '20px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Money: ${money}€`, 50, 550);
        ctx.fillText(`Bet: ${bet}€`, 50, 575);
        
        // Spin button
        let buttonColor = (spinning || money < bet) ? '#666' : '#4CAF50';
        ctx.fillStyle = buttonColor;
        ctx.fillRect(600, 520, 120, 60);
        ctx.fillStyle = '#FFF';
        ctx.font = '18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('SPIN', 660, 555);
        
        // Bet controls
        ctx.fillStyle = '#FF9800';
        ctx.fillRect(250, 520, 60, 30);
        ctx.fillRect(250, 550, 60, 30);
        ctx.fillStyle = '#FFF';
        ctx.font = '16px Arial';
        ctx.fillText('BET+', 280, 540);
        ctx.fillText('BET-', 280, 570);
        
        // Win message
        if (winTimer > 0) {
            ctx.fillStyle = 'rgba(0,0,0,0.8)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = lastWin > 0 ? '#FFD700' : '#FFF';
            ctx.font = '36px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(winMessage, canvas.width/2, canvas.height/2);
        }
        
        // Instructions
        ctx.fillStyle = '#FFF';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Click SPIN to play! Adjust bet with BET+/BET- buttons', canvas.width/2, 30);
    }
    
    function gameLoop() {
        updateGame();
        draw();
        animationId = requestAnimationFrame(gameLoop);
    }
    
    function handleClick(e) {
        const rect = canvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        
        // Spin button
        if (x >= 600 && x <= 720 && y >= 520 && y <= 580) {
            spin();
        }
        
        // Bet+ button
        if (x >= 250 && x <= 310 && y >= 520 && y <= 550) {
            if (bet < money && bet < 500) bet += 10;
        }
        
        // Bet- button
        if (x >= 250 && x <= 310 && y >= 550 && y <= 580) {
            if (bet > 10) bet -= 10;
        }
    }
    
    function stopGame() {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        canvas.removeEventListener('click', handleClick);
    }
    
    canvas.addEventListener('click', handleClick);
    animationId = requestAnimationFrame(gameLoop);
    
    window.currentGameCleanup = stopGame;
}

// Blackjack Game
function initBlackjack(canvas, ctx) {
    canvas.width = 800;
    canvas.height = 600;
    
    let gameRunning = true;
    let animationId;
    let money = 1000;
    let bet = 50;
    let gameState = 'betting'; // 'betting', 'playing', 'dealer', 'finished'
    
    const suits = ['♠', '♥', '♦', '♣'];
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    
    let deck = [];
    let playerHand = [];
    let dealerHand = [];
    let playerScore = 0;
    let dealerScore = 0;
    let message = '';
    let lastWin = 0;
    
    function createDeck() {
        deck = [];
        for (let suit of suits) {
            for (let rank of ranks) {
                deck.push({ suit, rank });
            }
        }
        // Shuffle deck
        for (let i = deck.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }
    
    function getCardValue(card) {
        if (card.rank === 'A') return 11;
        if (['J', 'Q', 'K'].includes(card.rank)) return 10;
        return parseInt(card.rank);
    }
    
    function calculateScore(hand) {
        let score = 0;
        let aces = 0;
        
        for (let card of hand) {
            if (card.rank === 'A') {
                aces++;
                score += 11;
            } else if (['J', 'Q', 'K'].includes(card.rank)) {
                score += 10;
            } else {
                score += parseInt(card.rank);
            }
        }
        
        // Handle aces
        while (score > 21 && aces > 0) {
            score -= 10;
            aces--;
        }
        
        return score;
    }
    
    function dealCard(hand) {
        if (deck.length > 0) {
            hand.push(deck.pop());
        }
    }
    
    function startNewGame() {
        if (money < bet) {
            message = 'Not enough money!';
            return;
        }
        
        money -= bet;
        createDeck();
        playerHand = [];
        dealerHand = [];
        
        // Deal initial cards
        dealCard(playerHand);
        dealCard(dealerHand);
        dealCard(playerHand);
        dealCard(dealerHand);
        
        playerScore = calculateScore(playerHand);
        dealerScore = calculateScore(dealerHand);
        
        gameState = 'playing';
        message = 'Hit or Stand?';
        
        // Check for blackjack
        if (playerScore === 21) {
            gameState = 'dealer';
            dealerTurn();
        }
    }
    
    function hit() {
        if (gameState !== 'playing') return;
        
        dealCard(playerHand);
        playerScore = calculateScore(playerHand);
        
        if (playerScore > 21) {
            gameState = 'finished';
            message = 'Bust! You lose!';
            lastWin = 0;
        } else if (playerScore === 21) {
            gameState = 'dealer';
            dealerTurn();
        }
    }
    
    function stand() {
        if (gameState !== 'playing') return;
        gameState = 'dealer';
        dealerTurn();
    }
    
    function dealerTurn() {
        dealerScore = calculateScore(dealerHand);
        
        let dealerInterval = setInterval(() => {
            if (dealerScore < 17) {
                dealCard(dealerHand);
                dealerScore = calculateScore(dealerHand);
            } else {
                clearInterval(dealerInterval);
                endGame();
            }
        }, 1000);
    }
    
    function endGame() {
        gameState = 'finished';
        
        if (dealerScore > 21) {
            message = 'Dealer busts! You win!';
            lastWin = bet * 2;
            money += lastWin;
        } else if (playerScore > dealerScore) {
            message = 'You win!';
            lastWin = bet * 2;
            money += lastWin;
        } else if (playerScore === dealerScore) {
            message = 'Push! Bet returned.';
            lastWin = bet;
            money += lastWin;
        } else {
            message = 'Dealer wins!';
            lastWin = 0;
        }
        
        setTimeout(() => {
            gameState = 'betting';
            message = 'Place your bet and start new game';
        }, 3000);
    }
    
    function drawCard(card, x, y, faceDown = false) {
        // Card background
        ctx.fillStyle = faceDown ? '#000080' : '#FFF';
        ctx.fillRect(x, y, 60, 90);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, 60, 90);
        
        if (!faceDown) {
            // Card text
            ctx.fillStyle = (card.suit === '♥' || card.suit === '♦') ? '#FF0000' : '#000000';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(card.rank, x + 30, y + 25);
            ctx.font = '24px Arial';
            ctx.fillText(card.suit, x + 30, y + 55);
        } else {
            // Face down pattern
            ctx.fillStyle = '#FFD700';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('?', x + 30, y + 50);
        }
    }
    
    function draw() {
        // Background
        let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#0F5132');
        gradient.addColorStop(1, '#198754');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Title
        ctx.fillStyle = '#FFD700';
        ctx.font = '32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('BLACKJACK', canvas.width/2, 40);
        
        // Money and bet
        ctx.fillStyle = '#FFF';
        ctx.font = '20px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Money: ${money}€`, 50, 100);
        ctx.fillText(`Bet: ${bet}€`, 50, 125);
        
        // Dealer's hand
        ctx.fillStyle = '#FFF';
        ctx.font = '18px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Dealer:', 50, 200);
        for (let i = 0; i < dealerHand.length; i++) {
            let faceDown = (gameState === 'playing' && i === 1);
            drawCard(dealerHand[i], 150 + i * 70, 180, faceDown);
        }
        
        if (gameState !== 'playing') {
            ctx.fillText(`Score: ${dealerScore}`, 50, 300);
        }
        
        // Player's hand
        ctx.fillText('Player:', 50, 350);
        for (let i = 0; i < playerHand.length; i++) {
            drawCard(playerHand[i], 150 + i * 70, 330);
        }
        ctx.fillText(`Score: ${playerScore}`, 50, 450);
        
        // Buttons
        if (gameState === 'betting') {
            // New game button
            ctx.fillStyle = money >= bet ? '#4CAF50' : '#666';
            ctx.fillRect(300, 500, 120, 40);
            ctx.fillStyle = '#FFF';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('NEW GAME', 360, 525);
            
            // Bet controls
            ctx.fillStyle = '#FF9800';
            ctx.fillRect(450, 500, 60, 20);
            ctx.fillRect(450, 520, 60, 20);
            ctx.fillStyle = '#FFF';
            ctx.font = '12px Arial';
            ctx.fillText('BET+', 480, 514);
            ctx.fillText('BET-', 480, 534);
        } else if (gameState === 'playing') {
            // Hit button
            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(250, 500, 80, 40);
            ctx.fillStyle = '#FFF';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('HIT', 290, 525);
            
            // Stand button
            ctx.fillStyle = '#FF5722';
            ctx.fillRect(350, 500, 80, 40);
            ctx.fillStyle = '#FFF';
            ctx.fillText('STAND', 390, 525);
        }
        
        // Message
        ctx.fillStyle = '#FFD700';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(message, canvas.width/2, 480);
        
        // Instructions
        ctx.fillStyle = '#FFF';
        ctx.font = '14px Arial';
        ctx.fillText('Get as close to 21 as possible without going over!', canvas.width/2, 570);
    }
    
    function gameLoop() {
        draw();
        animationId = requestAnimationFrame(gameLoop);
    }
    
    function handleClick(e) {
        const rect = canvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        
        if (gameState === 'betting') {
            // New game button
            if (x >= 300 && x <= 420 && y >= 500 && y <= 540) {
                startNewGame();
            }
            
            // Bet+ button
            if (x >= 450 && x <= 510 && y >= 500 && y <= 520) {
                if (bet < money && bet < 500) bet += 10;
            }
            
            // Bet- button
            if (x >= 450 && x <= 510 && y >= 520 && y <= 540) {
                if (bet > 10) bet -= 10;
            }
        } else if (gameState === 'playing') {
            // Hit button
            if (x >= 250 && x <= 330 && y >= 500 && y <= 540) {
                hit();
            }
            
            // Stand button
            if (x >= 350 && x <= 430 && y >= 500 && y <= 540) {
                stand();
            }
        }
    }
    
    function stopGame() {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        canvas.removeEventListener('click', handleClick);
    }
    
    // Initialize
    message = 'Place your bet and start new game';
    canvas.addEventListener('click', handleClick);
    animationId = requestAnimationFrame(gameLoop);
    
    window.currentGameCleanup = stopGame;
}

// STACK GAME - Tower building with falling platforms
function initStack(canvas, ctx) {
    canvas.width = 800;
    canvas.height = 600;
    
    let gameRunning = true;
    let animationId;
    let score = 0;
    let gameOver = false;
    
    let stack = []; // All placed platforms
    let currentPlatform = null; // Moving platform
    let targetWidth = 100; // Width of the base platform
    let platformHeight = 40;
    let moveSpeed = 2;
    let dropSpeed = 3;
    
    // Colors
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FFB347', '#87CEEB'];
    
    function createBasePlatform() {
        stack = [{
            x: canvas.width/2 - targetWidth/2,
            y: canvas.height - platformHeight,
            width: targetWidth,
            height: platformHeight,
            color: colors[0],
            settled: true
        }];
    }
    
    function spawnNewPlatform() {
        if (stack.length === 0) return;
        
        let lastPlatform = stack[stack.length - 1];
        currentPlatform = {
            x: 0,
            y: lastPlatform.y - platformHeight - 10,
            width: Math.max(targetWidth * 0.8, 50), // Platform gets slightly smaller each time
            height: platformHeight,
            color: colors[stack.length % colors.length],
            direction: Math.random() > 0.5 ? 1 : -1,
            settled: false,
            dropping: false
        };
        
        // Start from random side
        if (currentPlatform.direction === 1) {
            currentPlatform.x = -currentPlatform.width;
        } else {
            currentPlatform.x = canvas.width;
        }
    }
    
    function updateGame() {
        if (!gameRunning || gameOver) return;
        
        if (currentPlatform && !currentPlatform.settled && !currentPlatform.dropping) {
            // Move platform side to side
            currentPlatform.x += moveSpeed * currentPlatform.direction;
            
            // Bounce off edges
            if (currentPlatform.x <= -currentPlatform.width || 
                currentPlatform.x >= canvas.width) {
                currentPlatform.direction *= -1;
            }
        }
        
        if (currentPlatform && currentPlatform.dropping) {
            // Platform is falling
            currentPlatform.y += dropSpeed;
            
            // Check collision with top platform
            let lastPlatform = stack[stack.length - 1];
            if (currentPlatform.y + currentPlatform.height >= lastPlatform.y) {
                // Landing!
                let leftEdge = Math.max(currentPlatform.x, lastPlatform.x);
                let rightEdge = Math.min(currentPlatform.x + currentPlatform.width, 
                                       lastPlatform.x + lastPlatform.width);
                let overlapWidth = rightEdge - leftEdge;
                
                if (overlapWidth <= 0) {
                    // No overlap - game over
                    gameOver = true;
                    return;
                }
                
                // Perfect landing bonus
                let perfectBonus = 1;
                if (overlapWidth >= currentPlatform.width * 0.95) {
                    perfectBonus = 2;
                    targetWidth = Math.min(targetWidth + 5, 120); // Grow platform for perfect landing
                } else {
                    targetWidth = Math.max(targetWidth - 2, 30); // Shrink platform
                }
                
                // Add to stack with adjusted size
                currentPlatform.x = leftEdge;
                currentPlatform.width = overlapWidth;
                currentPlatform.y = lastPlatform.y - platformHeight;
                currentPlatform.settled = true;
                currentPlatform.dropping = false;
                
                stack.push(currentPlatform);
                score += Math.floor(overlapWidth) * perfectBonus;
                
                // Spawn next platform
                currentPlatform = null;
                setTimeout(() => {
                    if (gameRunning) spawnNewPlatform();
                }, 500);
            }
        }
    }
    
    function draw() {
        // Sky gradient background
        let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#E0F6FF');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw stack platforms
        stack.forEach(platform => {
            ctx.fillStyle = platform.color;
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            
            // Platform border
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
        });
        
        // Draw current moving platform
        if (currentPlatform && !currentPlatform.settled) {
            ctx.fillStyle = currentPlatform.color;
            ctx.fillRect(currentPlatform.x, currentPlatform.y, currentPlatform.width, currentPlatform.height);
            
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            ctx.strokeRect(currentPlatform.x, currentPlatform.y, currentPlatform.width, currentPlatform.height);
            
            // Drop indicator
            if (!currentPlatform.dropping) {
                ctx.fillStyle = 'rgba(255,255,255,0.7)';
                ctx.font = '20px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('CLICK TO DROP!', canvas.width/2, 50);
            }
        }
        
        // UI
        ctx.fillStyle = '#000';
        ctx.font = '24px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Score: ' + score, 20, 40);
        ctx.fillText('Level: ' + stack.length, 20, 70);
        
        if (gameOver) {
            // Game over screen
            ctx.fillStyle = 'rgba(0,0,0,0.8)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#FFF';
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('TOWER COLLAPSED!', canvas.width/2, canvas.height/2 - 50);
            
            ctx.font = '32px Arial';
            ctx.fillText('Final Score: ' + score, canvas.width/2, canvas.height/2);
            ctx.fillText('Height: ' + (stack.length - 1) + ' blocks', canvas.width/2, canvas.height/2 + 40);
            
            ctx.font = '24px Arial';
            ctx.fillText('Click to restart', canvas.width/2, canvas.height/2 + 100);
        }
    }
    
    function gameLoop() {
        updateGame();
        draw();
        animationId = requestAnimationFrame(gameLoop);
    }
    
    function handleClick() {
        if (gameOver) {
            // Restart
            gameOver = false;
            score = 0;
            stack = [];
            currentPlatform = null;
            targetWidth = 100;
            gameRunning = true;
            createBasePlatform();
            spawnNewPlatform();
        } else if (currentPlatform && !currentPlatform.dropping && !currentPlatform.settled) {
            // Drop current platform
            currentPlatform.dropping = true;
        }
    }
    
    function stopGame() {
        gameRunning = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        canvas.removeEventListener('click', handleClick);
    }
    
    // Initialize
    canvas.addEventListener('click', handleClick);
    createBasePlatform();
    spawnNewPlatform();
    gameLoop();
    
    window.currentGameCleanup = stopGame;
}

// TRIPWIRE HOOK GAME - Swinging between skyscrapers
function initTripwireHook(canvas, ctx) {
    canvas.width = 800;
    canvas.height = 600;
    
    let gameRunning = true;
    let animationId;
    let score = 0;
    let gameOver = false;
    
    // Player
    let player = {
        x: 100,
        y: 300,
        vx: 0,
        vy: 0,
        radius: 8,
        onBuilding: true
    };
    
    // Hook/rope system
    let hook = {
        active: false,
        x: 0,
        y: 0,
        length: 0,
        angle: 0,
        swinging: false
    };
    
    // Buildings
    let buildings = [];
    let camera = { x: 0 };
    
    function generateBuildings() {
        buildings = [];
        for (let i = 0; i < 20; i++) {
            buildings.push({
                x: i * 150 + (i === 0 ? 0 : Math.random() * 50),
                y: 200 + Math.random() * 200,
                width: 80 + Math.random() * 40,
                height: 400 + Math.random() * 200,
                color: `hsl(${200 + Math.random() * 60}, 70%, ${30 + Math.random() * 20}%)`
            });
        }
    }
    
    function updateGame() {
        if (!gameRunning || gameOver) return;
        
        // Camera follows player
        camera.x = player.x - 200;
        
        if (hook.swinging) {
            // Rope physics
            let dx = player.x - hook.x;
            let dy = player.y - hook.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > hook.length) {
                // Constrain to rope length
                let angle = Math.atan2(dy, dx);
                player.x = hook.x + Math.cos(angle) * hook.length;
                player.y = hook.y + Math.sin(angle) * hook.length;
                
                // Apply pendulum physics
                let gravity = 0.3;
                let tension = (player.vx * dx + player.vy * dy) / hook.length;
                
                player.vx -= tension * dx / hook.length;
                player.vy -= tension * dy / hook.length;
                player.vy += gravity;
                
                // Damping
                player.vx *= 0.995;
                player.vy *= 0.995;
            }
        } else {
            // Free fall
            player.vy += 0.5; // gravity
            player.vx *= 0.98; // air resistance
        }
        
        // Update player position
        player.x += player.vx;
        player.y += player.vy;
        
        // Check building collisions
        player.onBuilding = false;
        buildings.forEach(building => {
            if (player.x >= building.x && 
                player.x <= building.x + building.width &&
                player.y + player.radius >= building.y &&
                player.y - player.radius <= building.y + building.height) {
                
                // Landing on top
                if (player.vy > 0 && player.y < building.y + 20) {
                    player.y = building.y - player.radius;
                    player.vy = 0;
                    player.vx *= 0.8;
                    player.onBuilding = true;
                    hook.swinging = false;
                    hook.active = false;
                    
                    // Score for reaching new building
                    if (player.x > score * 150) {
                        score = Math.floor(player.x / 150);
                    }
                }
            }
        });
        
        // Check death conditions
        if (player.y > canvas.height + 100) {
            gameOver = true;
        }
    }
    
    function draw() {
        // Sky gradient
        let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#1e3c72');
        gradient.addColorStop(1, '#2a568a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Stars
        ctx.fillStyle = '#FFF';
        for (let i = 0; i < 50; i++) {
            let x = (i * 37) % canvas.width;
            let y = (i * 23) % (canvas.height / 2);
            ctx.fillRect(x, y, 2, 2);
        }
        
        ctx.save();
        ctx.translate(-camera.x, 0);
        
        // Draw buildings
        buildings.forEach(building => {
            ctx.fillStyle = building.color;
            ctx.fillRect(building.x, building.y, building.width, building.height);
            
            // Building windows
            ctx.fillStyle = '#FFE135';
            for (let x = building.x + 10; x < building.x + building.width - 10; x += 20) {
                for (let y = building.y + 20; y < building.y + building.height - 20; y += 30) {
                    if (Math.random() > 0.3) {
                        ctx.fillRect(x, y, 8, 12);
                    }
                }
            }
        });
        
        // Draw rope
        if (hook.active) {
            ctx.strokeStyle = '#8B4513';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(hook.x, hook.y);
            ctx.lineTo(player.x, player.y);
            ctx.stroke();
            
            // Hook point
            ctx.fillStyle = '#FF4500';
            ctx.beginPath();
            ctx.arc(hook.x, hook.y, 5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Draw player
        ctx.fillStyle = player.onBuilding ? '#00FF00' : '#FF6B6B';
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Player outline
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.restore();
        
        // UI
        ctx.fillStyle = '#FFF';
        ctx.font = '24px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Score: ' + score, 20, 40);
        ctx.fillText('Buildings: ' + score + '/20', 20, 70);
        
        if (!hook.active && player.onBuilding) {
            ctx.fillStyle = 'rgba(255,255,255,0.8)';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('CLICK to shoot hook!', canvas.width/2, 50);
        }
        
        if (hook.swinging) {
            ctx.fillStyle = 'rgba(255,255,255,0.8)';
            ctx.font = '18px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('CLICK to release!', canvas.width/2, 50);
        }
        
        if (gameOver) {
            ctx.fillStyle = 'rgba(0,0,0,0.8)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#FFF';
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER!', canvas.width/2, canvas.height/2 - 50);
            
            ctx.font = '32px Arial';
            ctx.fillText('Buildings Reached: ' + score, canvas.width/2, canvas.height/2);
            
            ctx.font = '24px Arial';
            ctx.fillText('Click to restart', canvas.width/2, canvas.height/2 + 60);
        }
    }
    
    function gameLoop() {
        updateGame();
        draw();
        animationId = requestAnimationFrame(gameLoop);
    }
    
    function handleClick(e) {
        if (gameOver) {
            // Restart
            gameOver = false;
            score = 0;
            player = {
                x: 100,
                y: 300,
                vx: 0,
                vy: 0,
                radius: 8,
                onBuilding: true
            };
            hook = {
                active: false,
                x: 0,
                y: 0,
                length: 0,
                angle: 0,
                swinging: false
            };
            camera = { x: 0 };
            gameRunning = true;
            generateBuildings();
        } else if (!hook.active && player.onBuilding) {
            // Shoot hook
            let rect = canvas.getBoundingClientRect();
            let mouseX = e.clientX - rect.left + camera.x;
            let mouseY = e.clientY - rect.top;
            
            // Find nearest building in hook range
            let targetBuilding = null;
            let minDistance = Infinity;
            
            buildings.forEach(building => {
                if (building.x > player.x + 50) { // Only buildings ahead
                    let buildingCenterX = building.x + building.width/2;
                    let buildingTop = building.y;
                    let distance = Math.sqrt(
                        Math.pow(buildingCenterX - player.x, 2) + 
                        Math.pow(buildingTop - player.y, 2)
                    );
                    
                    if (distance < minDistance && distance < 200) {
                        minDistance = distance;
                        targetBuilding = building;
                    }
                }
            });
            
            if (targetBuilding) {
                hook.x = targetBuilding.x + targetBuilding.width/2;
                hook.y = targetBuilding.y;
                hook.length = Math.sqrt(
                    Math.pow(hook.x - player.x, 2) + 
                    Math.pow(hook.y - player.y, 2)
                );
                hook.active = true;
                hook.swinging = true;
                player.onBuilding = false;
                
                // Initial swing momentum
                player.vx = 3;
            }
        } else if (hook.swinging) {
            // Release hook
            hook.active = false;
            hook.swinging = false;
        }
    }
    
    function stopGame() {
        gameRunning = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        canvas.removeEventListener('click', handleClick);
    }
    
    // Initialize
    canvas.addEventListener('click', handleClick);
    generateBuildings();
    gameLoop();
    
    window.currentGameCleanup = stopGame;
}

// BASE JUMP GAME - Falling from height with timing challenge
function initBaseJump(canvas, ctx) {
    canvas.width = 800;
    canvas.height = 600;
    
    let gameRunning = true;
    let animationId;
    let score = 0;
    let round = 1;
    let gameOver = false;
    let gameState = 'falling'; // 'falling', 'success', 'failed', 'newround'
    
    // Player
    let player = {
        x: canvas.width / 2,
        y: 50,
        vy: 0,
        radius: 12,
        parachuteOpen: false
    };
    
    let fallHeight = 500;
    let groundY = canvas.height - 50;
    let dangerZone = 30; // How close to ground before danger
    let perfectZone = 10; // Perfect timing zone
    
    let clouds = [];
    let timer = 0;
    let bestScore = 0;
    
    function initializeClouds() {
        clouds = [];
        for (let i = 0; i < 8; i++) {
            clouds.push({
                x: Math.random() * canvas.width,
                y: 100 + Math.random() * 200,
                size: 20 + Math.random() * 30,
                speed: 0.5 + Math.random() * 1
            });
        }
    }
    
    function startNewRound() {
        player.x = canvas.width / 2;
        player.y = 50;
        player.vy = 0;
        player.parachuteOpen = false;
        gameState = 'falling';
        fallHeight += 50; // Increase difficulty
        dangerZone = Math.max(15, dangerZone - 1); // Shrink margin for error
        timer = 0;
    }
    
    function updateGame() {
        if (!gameRunning || gameOver) return;
        
        timer++;
        
        // Update clouds
        clouds.forEach(cloud => {
            cloud.x += cloud.speed;
            if (cloud.x > canvas.width + cloud.size) {
                cloud.x = -cloud.size;
            }
        });
        
        if (gameState === 'falling') {
            // Falling physics
            if (!player.parachuteOpen) {
                player.vy += 0.3; // Gravity acceleration
                player.vy = Math.min(player.vy, 12); // Terminal velocity
            } else {
                // Parachute slows fall dramatically
                player.vy *= 0.9;
                player.vy = Math.max(player.vy, 1); // Minimum fall speed with parachute
            }
            
            player.y += player.vy;
            
            // Check if player hits ground
            if (player.y + player.radius >= groundY) {
                if (player.parachuteOpen) {
                    // Calculate score based on timing
                    let distanceFromGround = groundY - (player.y + player.radius);
                    let points = 0;
                    
                    if (distanceFromGround <= perfectZone) {
                        points = 1000 + round * 500; // Perfect landing bonus
                        gameState = 'success';
                    } else if (distanceFromGround <= dangerZone) {
                        points = Math.floor((dangerZone - distanceFromGround) * 50 + round * 100);
                        gameState = 'success';
                    } else {
                        points = Math.floor(distanceFromGround * 10);
                        gameState = 'success';
                    }
                    
                    score += points;
                    if (score > bestScore) bestScore = score;
                    
                    setTimeout(() => {
                        round++;
                        startNewRound();
                    }, 2000);
                } else {
                    // Crashed without parachute
                    gameState = 'failed';
                    gameOver = true;
                }
            }
        }
    }
    
    function draw() {
        // Sky gradient
        let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(0.7, '#E0F6FF');
        gradient.addColorStop(1, '#90EE90');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw clouds
        clouds.forEach(cloud => {
            ctx.fillStyle = 'rgba(255,255,255,0.8)';
            ctx.beginPath();
            ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
            ctx.arc(cloud.x + cloud.size, cloud.y, cloud.size * 0.8, 0, Math.PI * 2);
            ctx.arc(cloud.x - cloud.size, cloud.y, cloud.size * 0.6, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Draw ground
        ctx.fillStyle = '#228B22';
        ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
        
        // Draw danger zone indicator
        let dangerStart = groundY - dangerZone;
        let perfectStart = groundY - perfectZone;
        
        ctx.fillStyle = 'rgba(255,255,0,0.3)';
        ctx.fillRect(0, dangerStart, canvas.width, dangerZone);
        
        ctx.fillStyle = 'rgba(0,255,0,0.4)';
        ctx.fillRect(0, perfectStart, canvas.width, perfectZone);
        
        // Zone labels
        ctx.fillStyle = '#000';
        ctx.font = '16px Arial';
        ctx.textAlign = 'right';
        ctx.fillText('DANGER ZONE', canvas.width - 10, dangerStart + 15);
        ctx.fillText('PERFECT ZONE', canvas.width - 10, perfectStart + 15);
        
        // Draw player
        if (player.parachuteOpen) {
            // Draw parachute
            ctx.fillStyle = '#FF6B6B';
            ctx.beginPath();
            ctx.arc(player.x, player.y - 30, 25, 0, Math.PI);
            ctx.fill();
            
            // Parachute lines
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(player.x - 20, player.y - 10);
            ctx.lineTo(player.x - 5, player.y + 5);
            ctx.moveTo(player.x + 20, player.y - 10);
            ctx.lineTo(player.x + 5, player.y + 5);
            ctx.moveTo(player.x, player.y - 25);
            ctx.lineTo(player.x, player.y + 5);
            ctx.stroke();
        }
        
        // Draw player
        ctx.fillStyle = player.parachuteOpen ? '#4ECDC4' : '#FF6B6B';
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Height indicator
        let height = Math.max(0, groundY - player.y);
        ctx.fillStyle = '#000';
        ctx.font = '20px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Height: ' + Math.floor(height) + 'm', 20, 40);
        ctx.fillText('Speed: ' + Math.floor(player.vy * 10) + ' km/h', 20, 70);
        ctx.fillText('Round: ' + round, 20, 100);
        ctx.fillText('Score: ' + score, 20, 130);
        
        // Distance to ground warning
        let distToGround = groundY - (player.y + player.radius);
        if (distToGround < 100 && !player.parachuteOpen && gameState === 'falling') {
            ctx.fillStyle = distToGround < dangerZone ? '#FF0000' : '#FFA500';
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('⚠️ ' + Math.floor(distToGround) + 'm TO GROUND! ⚠️', canvas.width/2, 200);
            
            if (!player.parachuteOpen) {
                ctx.fillStyle = 'rgba(255,255,255,0.9)';
                ctx.font = '20px Arial';
                ctx.fillText('PRESS SPACEBAR TO OPEN PARACHUTE!', canvas.width/2, 250);
            }
        }
        
        // Game state messages
        if (gameState === 'success') {
            ctx.fillStyle = 'rgba(0,255,0,0.8)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#FFF';
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('SAFE LANDING!', canvas.width/2, canvas.height/2 - 50);
            
            ctx.font = '32px Arial';
            let distance = Math.floor(groundY - (player.y + player.radius));
            if (distance <= perfectZone) {
                ctx.fillText('🎯 PERFECT TIMING! 🎯', canvas.width/2, canvas.height/2);
                ctx.fillText('Bonus: +' + (1000 + round * 500), canvas.width/2, canvas.height/2 + 40);
            } else {
                ctx.fillText('Distance: ' + distance + 'm', canvas.width/2, canvas.height/2);
            }
        }
        
        if (gameOver) {
            ctx.fillStyle = 'rgba(255,0,0,0.8)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#FFF';
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('CRASH LANDING!', canvas.width/2, canvas.height/2 - 50);
            
            ctx.font = '32px Arial';
            ctx.fillText('Final Score: ' + score, canvas.width/2, canvas.height/2);
            ctx.fillText('Best Score: ' + bestScore, canvas.width/2, canvas.height/2 + 40);
            
            ctx.font = '24px Arial';
            ctx.fillText('Press R to restart', canvas.width/2, canvas.height/2 + 100);
        }
    }
    
    function gameLoop() {
        updateGame();
        draw();
        animationId = requestAnimationFrame(gameLoop);
    }
    
    function handleKeyDown(e) {
        if (e.code === 'Space' && gameState === 'falling' && !player.parachuteOpen) {
            player.parachuteOpen = true;
            e.preventDefault();
        }
        
        if (e.code === 'KeyR' && gameOver) {
            // Restart game
            gameOver = false;
            score = 0;
            round = 1;
            fallHeight = 500;
            dangerZone = 30;
            perfectZone = 10;
            startNewRound();
        }
    }
    
    function stopGame() {
        gameRunning = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        document.removeEventListener('keydown', handleKeyDown);
    }
    
    // Initialize
    document.addEventListener('keydown', handleKeyDown);
    initializeClouds();
    startNewRound();
    gameLoop();
    
    window.currentGameCleanup = stopGame;
}

// CLICK SPEED TEST GAME - Configurable time limits with precise CPS calculation
function initClickSpeed(canvas, ctx) {
    canvas.width = 800;
    canvas.height = 600;
    
    let gameRunning = true;
    let animationId;
    let gameState = 'setup'; // 'setup', 'countdown', 'testing', 'results'
    
    let clickCount = 0;
    let timeLimit = 10; // Default 10 seconds
    let timeRemaining = 0;
    let startTime = 0;
    let endTime = 0;
    let clicksPerSecond = 0;
    let personalBest = 0;
    let averageCPS = 0;
    let testHistory = [];
    
    // Visual effects
    let clickEffects = [];
    let particles = [];
    let pulseEffect = 0;
    let comboMultiplier = 1;
    let lastClickTime = 0;
    let clickStreak = 0;
    
    // Sound visualization
    let soundWaves = [];
    
    const timeLimits = [5, 10, 15, 20, 30, 60];
    let selectedTimeIndex = 1; // Default to 10 seconds
    
    function updateGame() {
        if (!gameRunning) return;
        
        let currentTime = Date.now();
        
        // Update visual effects
        clickEffects = clickEffects.filter(effect => {
            effect.life -= 0.02;
            effect.scale += 0.05;
            effect.alpha = effect.life;
            return effect.life > 0;
        });
        
        particles = particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.2; // gravity
            particle.life -= 0.015;
            particle.alpha = particle.life;
            return particle.life > 0;
        });
        
        soundWaves = soundWaves.filter(wave => {
            wave.radius += wave.speed;
            wave.alpha -= 0.05;
            return wave.alpha > 0;
        });
        
        pulseEffect *= 0.95;
        
        if (gameState === 'countdown') {
            timeRemaining = Math.max(0, startTime + 3000 - currentTime);
            if (timeRemaining === 0) {
                gameState = 'testing';
                startTime = currentTime;
                timeRemaining = timeLimit * 1000;
                clickCount = 0;
            }
        } else if (gameState === 'testing') {
            timeRemaining = Math.max(0, startTime + (timeLimit * 1000) - currentTime);
            
            // Calculate real-time CPS
            if (timeRemaining > 0) {
                let elapsed = (timeLimit * 1000 - timeRemaining) / 1000;
                clicksPerSecond = elapsed > 0 ? clickCount / elapsed : 0;
            }
            
            // Check for click streak bonus
            if (currentTime - lastClickTime > 500) {
                clickStreak = 0;
                comboMultiplier = 1;
            }
            
            if (timeRemaining === 0) {
                endTime = currentTime;
                let totalTime = (endTime - startTime) / 1000;
                clicksPerSecond = clickCount / totalTime;
                
                // Update statistics
                testHistory.push({
                    clicks: clickCount,
                    time: timeLimit,
                    cps: clicksPerSecond,
                    date: new Date()
                });
                
                if (clicksPerSecond > personalBest) {
                    personalBest = clicksPerSecond;
                }
                
                // Calculate average CPS
                if (testHistory.length > 0) {
                    averageCPS = testHistory.reduce((sum, test) => sum + test.cps, 0) / testHistory.length;
                }
                
                gameState = 'results';
            }
        }
    }
    
    function createClickEffect(x, y) {
        clickEffects.push({
            x: x,
            y: y,
            scale: 0.5,
            life: 1,
            alpha: 1,
            color: `hsl(${Math.random() * 360}, 70%, 60%)`
        });
        
        // Create particles
        for (let i = 0; i < 8; i++) {
            particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10 - 3,
                life: 1,
                alpha: 1,
                color: `hsl(${Math.random() * 360}, 80%, 70%)`,
                size: 3 + Math.random() * 4
            });
        }
        
        // Sound wave effect
        soundWaves.push({
            x: x,
            y: y,
            radius: 0,
            speed: 5,
            alpha: 0.8,
            color: `hsl(${180 + Math.random() * 60}, 70%, 60%)`
        });
        
        pulseEffect = Math.min(pulseEffect + 0.3, 1);
    }
    
    function draw() {
        // Dynamic background based on game state
        let bgColor1, bgColor2;
        
        switch(gameState) {
            case 'setup':
                bgColor1 = '#2C3E50';
                bgColor2 = '#34495E';
                break;
            case 'countdown':
                bgColor1 = '#E74C3C';
                bgColor2 = '#C0392B';
                break;
            case 'testing':
                bgColor1 = '#27AE60';
                bgColor2 = '#229954';
                break;
            case 'results':
                bgColor1 = '#3498DB';
                bgColor2 = '#2980B9';
                break;
        }
        
        let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, bgColor1);
        gradient.addColorStop(1, bgColor2);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Pulse effect background
        if (pulseEffect > 0) {
            ctx.fillStyle = `rgba(255, 255, 255, ${pulseEffect * 0.1})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        // Draw sound waves
        soundWaves.forEach(wave => {
            ctx.strokeStyle = wave.color;
            ctx.globalAlpha = wave.alpha;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 1;
        });
        
        if (gameState === 'setup') {
            drawSetupScreen();
        } else if (gameState === 'countdown') {
            drawCountdownScreen();
        } else if (gameState === 'testing') {
            drawTestingScreen();
        } else if (gameState === 'results') {
            drawResultsScreen();
        }
        
        // Draw click effects
        clickEffects.forEach(effect => {
            ctx.save();
            ctx.globalAlpha = effect.alpha;
            ctx.fillStyle = effect.color;
            ctx.font = `${20 * effect.scale}px Arial`;
            ctx.textAlign = 'center';
            ctx.fillText('+1', effect.x, effect.y);
            
            // Ring effect
            ctx.strokeStyle = effect.color;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(effect.x, effect.y, 20 * effect.scale, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        });
        
        // Draw particles
        particles.forEach(particle => {
            ctx.save();
            ctx.globalAlpha = particle.alpha;
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    }
    
    function drawSetupScreen() {
        // Title
        ctx.fillStyle = '#ECF0F1';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🖱️ CLICK SPEED TEST 🖱️', canvas.width/2, 80);
        
        ctx.font = '24px Arial';
        ctx.fillText('Test your clicking speed and reaction time!', canvas.width/2, 120);
        
        // Time selection
        ctx.fillStyle = '#F39C12';
        ctx.font = '32px Arial';
        ctx.fillText('Select Test Duration:', canvas.width/2, 200);
        
        // Time buttons
        timeLimits.forEach((time, index) => {
            let x = 150 + (index % 3) * 200;
            let y = 250 + Math.floor(index / 3) * 80;
            let isSelected = index === selectedTimeIndex;
            
            // Button background
            ctx.fillStyle = isSelected ? '#E67E22' : '#95A5A6';
            ctx.fillRect(x - 60, y - 30, 120, 60);
            
            // Button border
            ctx.strokeStyle = isSelected ? '#D35400' : '#7F8C8D';
            ctx.lineWidth = 3;
            ctx.strokeRect(x - 60, y - 30, 120, 60);
            
            // Button text
            ctx.fillStyle = '#FFF';
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(time + 's', x, y + 8);
        });
        
        // Statistics
        if (testHistory.length > 0) {
            ctx.fillStyle = '#BDC3C7';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('📊 Your Statistics:', canvas.width/2, 420);
            
            ctx.font = '18px Arial';
            ctx.fillText(`Personal Best: ${personalBest.toFixed(2)} CPS`, canvas.width/2, 450);
            ctx.fillText(`Average CPS: ${averageCPS.toFixed(2)}`, canvas.width/2, 475);
            ctx.fillText(`Tests Completed: ${testHistory.length}`, canvas.width/2, 500);
        }
        
        // Start button
        ctx.fillStyle = '#27AE60';
        ctx.fillRect(canvas.width/2 - 100, 530, 200, 50);
        ctx.strokeStyle = '#229954';
        ctx.lineWidth = 3;
        ctx.strokeRect(canvas.width/2 - 100, 530, 200, 50);
        
        ctx.fillStyle = '#FFF';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('START TEST', canvas.width/2, 560);
    }
    
    function drawCountdownScreen() {
        let countdownSeconds = Math.ceil(timeRemaining / 1000);
        
        ctx.fillStyle = '#ECF0F1';
        ctx.font = '72px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GET READY!', canvas.width/2, 200);
        
        // Countdown number with pulse effect
        let pulseScale = 1 + Math.sin(Date.now() * 0.01) * 0.1;
        ctx.save();
        ctx.translate(canvas.width/2, canvas.height/2);
        ctx.scale(pulseScale, pulseScale);
        
        ctx.fillStyle = '#F1C40F';
        ctx.font = '120px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(countdownSeconds.toString(), 0, 20);
        
        ctx.restore();
        
        ctx.fillStyle = '#BDC3C7';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Test Duration: ${timeLimit} seconds`, canvas.width/2, 450);
        ctx.fillText('Click as fast as possible when the test starts!', canvas.width/2, 480);
    }
    
    function drawTestingScreen() {
        // Click target area
        let targetSize = 200 + pulseEffect * 50;
        ctx.strokeStyle = '#F39C12';
        ctx.lineWidth = 5;
        ctx.setLineDash([10, 10]);
        ctx.beginPath();
        ctx.arc(canvas.width/2, canvas.height/2, targetSize, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Central click area
        ctx.fillStyle = `rgba(231, 76, 60, ${0.3 + pulseEffect * 0.3})`;
        ctx.beginPath();
        ctx.arc(canvas.width/2, canvas.height/2, 100, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#C0392B';
        ctx.lineWidth = 4;
        ctx.stroke();
        
        // Click instruction
        ctx.fillStyle = '#FFF';
        ctx.font = '32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('CLICK HERE!', canvas.width/2, canvas.height/2);
        
        // Statistics display
        ctx.fillStyle = '#ECF0F1';
        ctx.font = '36px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Clicks: ${clickCount}`, 50, 80);
        ctx.fillText(`CPS: ${clicksPerSecond.toFixed(2)}`, 50, 130);
        
        // Time remaining with progress bar
        ctx.fillStyle = '#E74C3C';
        ctx.font = '36px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(`Time: ${(timeRemaining/1000).toFixed(1)}s`, canvas.width - 50, 80);
        
        // Progress bar
        let progress = 1 - (timeRemaining / (timeLimit * 1000));
        ctx.fillStyle = '#34495E';
        ctx.fillRect(canvas.width - 250, 100, 200, 20);
        ctx.fillStyle = '#27AE60';
        ctx.fillRect(canvas.width - 250, 100, 200 * progress, 20);
        
        // Combo multiplier
        if (clickStreak > 3) {
            ctx.fillStyle = '#F1C40F';
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`🔥 STREAK: ${clickStreak} 🔥`, canvas.width/2, 200);
            ctx.fillText(`Multiplier: x${comboMultiplier.toFixed(1)}`, canvas.width/2, 230);
        }
        
        // Performance indicator
        if (clicksPerSecond > personalBest) {
            ctx.fillStyle = '#E67E22';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('🏆 NEW PERSONAL BEST! 🏆', canvas.width/2, 400);
        }
    }
    
    function drawResultsScreen() {
        // Results title
        ctx.fillStyle = '#ECF0F1';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('📊 TEST RESULTS 📊', canvas.width/2, 80);
        
        // Main results
        ctx.fillStyle = '#F1C40F';
        ctx.font = '64px Arial';
        ctx.fillText(`${clicksPerSecond.toFixed(2)} CPS`, canvas.width/2, 180);
        
        ctx.fillStyle = '#BDC3C7';
        ctx.font = '24px Arial';
        ctx.fillText(`${clickCount} clicks in ${timeLimit} seconds`, canvas.width/2, 220);
        
        // Performance rating
        let rating = '';
        let ratingColor = '';
        if (clicksPerSecond >= 12) {
            rating = '🏆 LEGENDARY';
            ratingColor = '#F1C40F';
        } else if (clicksPerSecond >= 10) {
            rating = '⭐ EXCELLENT';
            ratingColor = '#E67E22';
        } else if (clicksPerSecond >= 8) {
            rating = '🎯 GOOD';
            ratingColor = '#27AE60';
        } else if (clicksPerSecond >= 6) {
            rating = '👍 AVERAGE';
            ratingColor = '#3498DB';
        } else {
            rating = '🐌 NEEDS PRACTICE';
            ratingColor = '#95A5A6';
        }
        
        ctx.fillStyle = ratingColor;
        ctx.font = '32px Arial';
        ctx.fillText(rating, canvas.width/2, 280);
        
        // Comparison with personal best
        if (clicksPerSecond > personalBest * 0.9) {
            ctx.fillStyle = '#E67E22';
            ctx.font = '20px Arial';
            if (clicksPerSecond > personalBest) {
                ctx.fillText('🎉 NEW PERSONAL BEST! 🎉', canvas.width/2, 320);
            } else {
                ctx.fillText(`Close to your best: ${personalBest.toFixed(2)} CPS`, canvas.width/2, 320);
            }
        }
        
        // Detailed statistics
        ctx.fillStyle = '#BDC3C7';
        ctx.font = '18px Arial';
        ctx.textAlign = 'left';
        
        let statsX = 100;
        let statsY = 380;
        ctx.fillText(`Average CPS: ${averageCPS.toFixed(2)}`, statsX, statsY);
        ctx.fillText(`Personal Best: ${personalBest.toFixed(2)} CPS`, statsX, statsY + 25);
        ctx.fillText(`Tests Completed: ${testHistory.length}`, statsX, statsY + 50);
        
        // Recent improvement
        if (testHistory.length >= 2) {
            let improvement = clicksPerSecond - testHistory[testHistory.length - 2].cps;
            let improvementText = improvement >= 0 ? 
                `↗️ +${improvement.toFixed(2)} CPS from last test` : 
                `↘️ ${improvement.toFixed(2)} CPS from last test`;
            ctx.fillText(improvementText, statsX + 300, statsY);
        }
        
        // Buttons
        ctx.fillStyle = '#27AE60';
        ctx.fillRect(150, 500, 150, 50);
        ctx.fillStyle = '#3498DB';
        ctx.fillRect(350, 500, 150, 50);
        ctx.fillStyle = '#E74C3C';
        ctx.fillRect(550, 500, 150, 50);
        
        ctx.fillStyle = '#FFF';
        ctx.font = '18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('TEST AGAIN', 225, 530);
        ctx.fillText('NEW DURATION', 425, 530);
        ctx.fillText('MAIN MENU', 625, 530);
    }
    
    function gameLoop() {
        updateGame();
        draw();
        animationId = requestAnimationFrame(gameLoop);
    }
    
    function handleClick(e) {
        let rect = canvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        
        if (gameState === 'setup') {
            // Check time selection buttons
            timeLimits.forEach((time, index) => {
                let buttonX = 150 + (index % 3) * 200;
                let buttonY = 250 + Math.floor(index / 3) * 80;
                
                if (x >= buttonX - 60 && x <= buttonX + 60 &&
                    y >= buttonY - 30 && y <= buttonY + 30) {
                    selectedTimeIndex = index;
                    timeLimit = timeLimits[selectedTimeIndex];
                }
            });
            
            // Check start button
            if (x >= canvas.width/2 - 100 && x <= canvas.width/2 + 100 &&
                y >= 530 && y <= 580) {
                gameState = 'countdown';
                startTime = Date.now();
                timeRemaining = 3000; // 3 second countdown
            }
        } else if (gameState === 'testing') {
            let centerX = canvas.width/2;
            let centerY = canvas.height/2;
            let distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
            
            if (distance <= 100) { // Click within target area
                clickCount++;
                createClickEffect(x, y);
                
                // Update click streak
                let currentTime = Date.now();
                if (currentTime - lastClickTime < 200) { // Fast clicking
                    clickStreak++;
                    comboMultiplier = Math.min(1 + clickStreak * 0.1, 2.0);
                } else {
                    clickStreak = 1;
                    comboMultiplier = 1;
                }
                lastClickTime = currentTime;
            }
        } else if (gameState === 'results') {
            // Check result buttons
            if (y >= 500 && y <= 550) {
                if (x >= 150 && x <= 300) {
                    // Test again
                    gameState = 'countdown';
                    startTime = Date.now();
                    timeRemaining = 3000;
                } else if (x >= 350 && x <= 500) {
                    // New duration
                    gameState = 'setup';
                } else if (x >= 550 && x <= 700) {
                    // Main menu (reset everything)
                    gameState = 'setup';
                    testHistory = [];
                    personalBest = 0;
                    averageCPS = 0;
                }
            }
        }
    }
    
    function stopGame() {
        gameRunning = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        canvas.removeEventListener('click', handleClick);
    }
    
    // Initialize
    canvas.addEventListener('click', handleClick);
    gameLoop();
    
    window.currentGameCleanup = stopGame;
}

// LONG JUMP GAME - Running speed buildup with precise takeoff timing
function initLongJump(canvas, ctx) {
    canvas.width = 800;
    canvas.height = 600;
    
    let gameRunning = true;
    let animationId;
    let gameState = 'setup'; // 'setup', 'running', 'takeoff', 'flying', 'landing', 'results'
    
    // Player character
    let player = {
        x: 50,
        y: 400,
        vx: 0,
        vy: 0,
        speed: 0,
        maxSpeed: 12,
        acceleration: 0.15,
        width: 20,
        height: 30,
        animFrame: 0,
        onGround: true
    };
    
    // Game mechanics
    let runDistance = 0;
    let maxRunDistance = 300;
    let takeoffZone = { start: 280, end: 320, perfect: 300 };
    let jumpDistance = 0;
    let jumpPower = 0;
    let multiplier = 1;
    let perfectTiming = false;
    let personalBest = 0;
    let attempts = 0;
    let scores = [];
    
    // Visual effects
    let speedLines = [];
    let dustParticles = [];
    let takeoffEffect = null;
    let perfectEffect = null;
    let cameraShake = 0;
    let runway = [];
    
    // Initialize runway markings
    function initializeRunway() {
        runway = [];
        for (let i = 0; i < 40; i++) {
            runway.push({
                x: i * 20,
                type: i % 5 === 0 ? 'major' : 'minor'
            });
        }
    }
    
    function updateGame() {
        if (!gameRunning) return;
        
        // Update camera shake
        cameraShake *= 0.9;
        
        // Update visual effects
        speedLines = speedLines.filter(line => {
            line.x -= line.speed;
            line.life -= 0.02;
            return line.x > -50 && line.life > 0;
        });
        
        dustParticles = dustParticles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.1; // gravity
            particle.life -= 0.015;
            particle.size *= 0.99;
            return particle.life > 0;
        });
        
        if (perfectEffect) {
            perfectEffect.life -= 0.02;
            perfectEffect.scale += 0.05;
            if (perfectEffect.life <= 0) perfectEffect = null;
        }
        
        if (takeoffEffect) {
            takeoffEffect.life -= 0.03;
            takeoffEffect.scale += 0.1;
            if (takeoffEffect.life <= 0) takeoffEffect = null;
        }
        
        if (gameState === 'running') {
            // Speed buildup phase
            if (player.speed < player.maxSpeed) {
                player.speed += player.acceleration;
                
                // Create speed lines
                if (Math.random() < 0.3 + player.speed * 0.05) {
                    speedLines.push({
                        x: canvas.width,
                        y: 350 + Math.random() * 100,
                        speed: 5 + player.speed * 0.5,
                        life: 1,
                        thickness: 1 + Math.random() * 2
                    });
                }
                
                // Create dust particles
                if (Math.random() < 0.2) {
                    dustParticles.push({
                        x: player.x - 10,
                        y: player.y + player.height,
                        vx: -2 - Math.random() * 3,
                        vy: -1 - Math.random() * 2,
                        life: 1,
                        size: 2 + Math.random() * 3,
                        color: `rgba(139, 69, 19, ${0.5 + Math.random() * 0.5})`
                    });
                }
            }
            
            // Update run distance
            runDistance += player.speed * 0.5;
            player.animFrame += player.speed * 0.2;
            
            // Check if reached takeoff zone
            if (runDistance >= takeoffZone.start) {
                gameState = 'takeoff';
            }
        } else if (gameState === 'takeoff') {
            // Continue running but allow takeoff
            runDistance += player.speed * 0.5;
            player.animFrame += player.speed * 0.2;
            
            // Automatic takeoff if missed the zone
            if (runDistance >= takeoffZone.end + 50) {
                performJump(0); // Late takeoff with no power
            }
        } else if (gameState === 'flying') {
            // Flying physics
            player.x += player.vx;
            player.y += player.vy;
            player.vy += 0.4; // gravity
            
            // Create trail particles
            if (Math.random() < 0.3) {
                dustParticles.push({
                    x: player.x,
                    y: player.y + player.height/2,
                    vx: -1 - Math.random() * 2,
                    vy: Math.random() * 2 - 1,
                    life: 0.8,
                    size: 1 + Math.random() * 2,
                    color: `rgba(135, 206, 235, ${0.6 + Math.random() * 0.4})`
                });
            }
            
            // Check landing
            if (player.y >= 400) {
                player.y = 400;
                player.vy = 0;
                player.vx *= 0.8; // Landing friction
                gameState = 'landing';
                
                // Calculate final jump distance
                jumpDistance = player.x - 50;
                
                // Update statistics
                attempts++;
                scores.push(jumpDistance);
                if (jumpDistance > personalBest) {
                    personalBest = jumpDistance;
                }
                
                // Camera shake on landing
                cameraShake = 8;
                
                // Landing particles
                for (let i = 0; i < 15; i++) {
                    dustParticles.push({
                        x: player.x,
                        y: player.y + player.height,
                        vx: (Math.random() - 0.5) * 8,
                        vy: -2 - Math.random() * 4,
                        life: 1,
                        size: 3 + Math.random() * 5,
                        color: `rgba(139, 69, 19, ${0.7 + Math.random() * 0.3})`
                    });
                }
                
                setTimeout(() => {
                    gameState = 'results';
                }, 2000);
            }
        }
    }
    
    function performJump(timing) {
        if (gameState !== 'takeoff') return;
        
        gameState = 'flying';
        
        // Calculate jump power based on timing and speed
        let timingBonus = 1;
        let distanceFromPerfect = Math.abs(runDistance - takeoffZone.perfect);
        
        if (distanceFromPerfect <= 5) {
            // Perfect timing
            timingBonus = 2.0;
            perfectTiming = true;
            perfectEffect = {
                x: player.x,
                y: player.y,
                life: 1,
                scale: 1
            };
            cameraShake = 5;
        } else if (distanceFromPerfect <= 15) {
            // Good timing
            timingBonus = 1.5;
        } else if (distanceFromPerfect <= 25) {
            // OK timing
            timingBonus = 1.2;
        } else {
            // Poor timing
            timingBonus = 0.8;
        }
        
        // Calculate jump physics
        jumpPower = player.speed * timingBonus;
        multiplier = timingBonus;
        
        player.vx = jumpPower * 0.8;
        player.vy = -jumpPower * 0.6;
        
        // Takeoff effect
        takeoffEffect = {
            x: player.x,
            y: player.y + player.height,
            life: 1,
            scale: 1
        };
        
        // Takeoff particles
        for (let i = 0; i < 20; i++) {
            dustParticles.push({
                x: player.x,
                y: player.y + player.height,
                vx: -5 + Math.random() * 10,
                vy: -3 - Math.random() * 5,
                life: 1,
                size: 2 + Math.random() * 4,
                color: `rgba(255, 215, 0, ${0.6 + Math.random() * 0.4})`
            });
        }
    }
    
    function draw() {
        // Sky gradient background
        let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(0.6, '#E0F6FF');
        gradient.addColorStop(1, '#90EE90');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Apply camera shake
        if (cameraShake > 0) {
            ctx.save();
            ctx.translate(
                (Math.random() - 0.5) * cameraShake,
                (Math.random() - 0.5) * cameraShake
            );
        }
        
        // Draw clouds
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        for (let i = 0; i < 5; i++) {
            let x = 100 + i * 150;
            let y = 50 + Math.sin(Date.now() * 0.001 + i) * 20;
            ctx.beginPath();
            ctx.arc(x, y, 25, 0, Math.PI * 2);
            ctx.arc(x + 30, y, 35, 0, Math.PI * 2);
            ctx.arc(x + 60, y, 25, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Draw runway and markings
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, 430, canvas.width, 170);
        
        runway.forEach(mark => {
            ctx.fillStyle = mark.type === 'major' ? '#FFF' : '#DDD';
            ctx.fillRect(mark.x, 425, mark.type === 'major' ? 4 : 2, 10);
            
            if (mark.type === 'major') {
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText((mark.x / 20).toString(), mark.x, 420);
            }
        });
        
        // Draw takeoff zone
        if (gameState === 'running' || gameState === 'takeoff') {
            // Zone background
            ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
            ctx.fillRect(takeoffZone.start, 430, takeoffZone.end - takeoffZone.start, 170);
            
            // Perfect takeoff line
            ctx.strokeStyle = '#FF0000';
            ctx.lineWidth = 3;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(takeoffZone.perfect, 430);
            ctx.lineTo(takeoffZone.perfect, 600);
            ctx.stroke();
            ctx.setLineDash([]);
            
            // Zone labels
            ctx.fillStyle = '#000';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('TAKEOFF ZONE', (takeoffZone.start + takeoffZone.end) / 2, 450);
            ctx.fillText('PERFECT', takeoffZone.perfect, 470);
        }
        
        // Draw speed lines
        speedLines.forEach(line => {
            ctx.strokeStyle = `rgba(255, 255, 255, ${line.life * 0.8})`;
            ctx.lineWidth = line.thickness;
            ctx.beginPath();
            ctx.moveTo(line.x, line.y);
            ctx.lineTo(line.x + 30, line.y);
            ctx.stroke();
        });
        
        // Draw dust particles
        dustParticles.forEach(particle => {
            ctx.save();
            ctx.globalAlpha = particle.life;
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
        
        // Draw player
        if (gameState !== 'results') {
            drawPlayer();
        }
        
        // Draw effects
        if (takeoffEffect) {
            ctx.save();
            ctx.globalAlpha = takeoffEffect.life;
            ctx.translate(takeoffEffect.x, takeoffEffect.y);
            ctx.scale(takeoffEffect.scale, takeoffEffect.scale);
            
            // Explosion effect
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 3;
            for (let i = 0; i < 8; i++) {
                let angle = (i / 8) * Math.PI * 2;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(Math.cos(angle) * 30, Math.sin(angle) * 30);
                ctx.stroke();
            }
            ctx.restore();
        }
        
        if (perfectEffect) {
            ctx.save();
            ctx.globalAlpha = perfectEffect.life;
            ctx.translate(perfectEffect.x, perfectEffect.y);
            ctx.scale(perfectEffect.scale, perfectEffect.scale);
            
            ctx.fillStyle = '#FFD700';
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('⭐ PERFECT! ⭐', 0, 0);
            ctx.restore();
        }
        
        if (cameraShake > 0) {
            ctx.restore();
        }
        
        // Draw UI based on game state
        if (gameState === 'setup') {
            drawSetupUI();
        } else if (gameState === 'running') {
            drawRunningUI();
        } else if (gameState === 'takeoff') {
            drawTakeoffUI();
        } else if (gameState === 'flying' || gameState === 'landing') {
            drawFlyingUI();
        } else if (gameState === 'results') {
            drawResultsUI();
        }
    }
    
    function drawPlayer() {
        ctx.save();
        ctx.translate(player.x, player.y);
        
        // Player body
        if (gameState === 'flying') {
            // Flying pose
            ctx.rotate(Math.atan2(player.vy, player.vx) * 0.3);
        } else {
            // Running animation
            let legOffset = Math.sin(player.animFrame * 0.3) * 5;
            ctx.translate(0, legOffset * 0.2);
        }
        
        // Head
        ctx.fillStyle = '#FFDBAC';
        ctx.beginPath();
        ctx.arc(0, -25, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Body
        ctx.fillStyle = '#4169E1';
        ctx.fillRect(-8, -15, 16, 20);
        
        // Arms
        ctx.strokeStyle = '#FFDBAC';
        ctx.lineWidth = 4;
        if (gameState === 'flying') {
            ctx.beginPath();
            ctx.moveTo(-8, -10);
            ctx.lineTo(-15, -5);
            ctx.moveTo(8, -10);
            ctx.lineTo(15, -5);
            ctx.stroke();
        } else {
            let armSwing = Math.sin(player.animFrame * 0.3 + Math.PI) * 10;
            ctx.beginPath();
            ctx.moveTo(-8, -10);
            ctx.lineTo(-12 + armSwing, 0);
            ctx.moveTo(8, -10);
            ctx.lineTo(12 - armSwing, 0);
            ctx.stroke();
        }
        
        // Legs
        if (gameState === 'flying') {
            ctx.beginPath();
            ctx.moveTo(-4, 5);
            ctx.lineTo(-8, 15);
            ctx.moveTo(4, 5);
            ctx.lineTo(8, 15);
            ctx.stroke();
        } else {
            let legSwing = Math.sin(player.animFrame * 0.3) * 8;
            ctx.beginPath();
            ctx.moveTo(-4, 5);
            ctx.lineTo(-6 + legSwing, 20);
            ctx.moveTo(4, 5);
            ctx.lineTo(6 - legSwing, 20);
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    function drawSetupUI() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#FFF';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🏃‍♂️ LONG JUMP 🏃‍♂️', canvas.width/2, 100);
        
        ctx.font = '24px Arial';
        ctx.fillText('Build speed, then jump at the perfect moment!', canvas.width/2, 150);
        
        // Instructions
        ctx.font = '20px Arial';
        ctx.textAlign = 'left';
        let instructions = [
            '1. Click and HOLD to build running speed',
            '2. Release at the PERFECT line for maximum distance',
            '3. Perfect timing gives 2x jump power!',
            '4. Try to beat your personal best!'
        ];
        
        instructions.forEach((instruction, index) => {
            ctx.fillText(instruction, 50, 220 + index * 30);
        });
        
        // Statistics
        if (attempts > 0) {
            ctx.textAlign = 'center';
            ctx.fillStyle = '#FFD700';
            ctx.font = '24px Arial';
            ctx.fillText('📊 YOUR STATS 📊', canvas.width/2, 350);
            
            ctx.fillStyle = '#FFF';
            ctx.font = '20px Arial';
            ctx.fillText(`Personal Best: ${personalBest.toFixed(1)}m`, canvas.width/2, 380);
            ctx.fillText(`Attempts: ${attempts}`, canvas.width/2, 410);
            
            if (scores.length > 0) {
                let average = scores.reduce((a, b) => a + b, 0) / scores.length;
                ctx.fillText(`Average: ${average.toFixed(1)}m`, canvas.width/2, 440);
            }
        }
        
        // Start button
        ctx.fillStyle = '#27AE60';
        ctx.fillRect(canvas.width/2 - 100, 500, 200, 60);
        ctx.strokeStyle = '#229954';
        ctx.lineWidth = 3;
        ctx.strokeRect(canvas.width/2 - 100, 500, 200, 60);
        
        ctx.fillStyle = '#FFF';
        ctx.font = '28px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('START RUN', canvas.width/2, 540);
    }
    
    function drawRunningUI() {
        // Speed meter
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(20, 20, 200, 80);
        
        ctx.fillStyle = '#FFF';
        ctx.font = '18px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('SPEED', 30, 40);
        
        // Speed bar
        let speedPercent = player.speed / player.maxSpeed;
        ctx.fillStyle = '#34495E';
        ctx.fillRect(30, 50, 180, 20);
        ctx.fillStyle = speedPercent > 0.8 ? '#E74C3C' : '#3498DB';
        ctx.fillRect(30, 50, 180 * speedPercent, 20);
        
        ctx.fillStyle = '#FFF';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${(speedPercent * 100).toFixed(0)}%`, 120, 64);
        
        // Distance to takeoff
        ctx.fillStyle = '#FFF';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        let distanceToTakeoff = takeoffZone.start - runDistance;
        if (distanceToTakeoff > 0) {
            ctx.fillText(`Distance to takeoff: ${distanceToTakeoff.toFixed(0)}m`, canvas.width/2, 50);
        }
        
        // Instruction
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = '24px Arial';
        ctx.fillText('HOLD TO BUILD SPEED!', canvas.width/2, 100);
    }
    
    function drawTakeoffUI() {
        // Critical timing warning
        ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, 80);
        
        ctx.fillStyle = '#FFF';
        ctx.font = '32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('⚠️ TAKEOFF ZONE! RELEASE NOW! ⚠️', canvas.width/2, 50);
        
        // Distance indicator
        let distanceFromPerfect = Math.abs(runDistance - takeoffZone.perfect);
        ctx.fillStyle = distanceFromPerfect <= 5 ? '#00FF00' : distanceFromPerfect <= 15 ? '#FFFF00' : '#FF0000';
        ctx.font = '24px Arial';
        ctx.fillText(`Perfect timing: ${distanceFromPerfect.toFixed(1)}m away`, canvas.width/2, 90);
    }
    
    function drawFlyingUI() {
        // Flight info
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(20, 20, 250, 120);
        
        ctx.fillStyle = '#FFF';
        ctx.font = '18px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('FLIGHT INFO', 30, 40);
        ctx.fillText(`Distance: ${jumpDistance.toFixed(1)}m`, 30, 65);
        ctx.fillText(`Jump Power: ${jumpPower.toFixed(1)}`, 30, 85);
        ctx.fillText(`Multiplier: x${multiplier.toFixed(1)}`, 30, 105);
        
        if (perfectTiming) {
            ctx.fillStyle = '#FFD700';
            ctx.fillText('🎯 PERFECT TIMING!', 30, 125);
        }
        
        // Trajectory indicator
        if (gameState === 'flying') {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(player.x, player.y);
            
            // Predict landing spot
            let tempX = player.x;
            let tempY = player.y;
            let tempVX = player.vx;
            let tempVY = player.vy;
            
            for (let i = 0; i < 100 && tempY < 400; i++) {
                tempX += tempVX;
                tempY += tempVY;
                tempVY += 0.4;
                
                if (i % 5 === 0) {
                    ctx.lineTo(tempX, tempY);
                }
            }
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }
    
    function drawResultsUI() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Results title
        ctx.fillStyle = '#FFF';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🏆 JUMP RESULTS 🏆', canvas.width/2, 80);
        
        // Main distance
        ctx.fillStyle = '#FFD700';
        ctx.font = '64px Arial';
        ctx.fillText(`${jumpDistance.toFixed(1)}m`, canvas.width/2, 180);
        
        // Performance rating
        let rating = '';
        let color = '';
        if (jumpDistance >= personalBest && perfectTiming) {
            rating = '🏆 LEGENDARY JUMP!';
            color = '#FFD700';
        } else if (jumpDistance >= personalBest) {
            rating = '🎯 NEW PERSONAL BEST!';
            color = '#E67E22';
        } else if (perfectTiming) {
            rating = '⭐ PERFECT TIMING!';
            color = '#3498DB';
        } else if (jumpDistance >= personalBest * 0.9) {
            rating = '👍 GREAT JUMP!';
            color = '#27AE60';
        } else {
            rating = '💪 KEEP PRACTICING!';
            color = '#95A5A6';
        }
        
        ctx.fillStyle = color;
        ctx.font = '32px Arial';
        ctx.fillText(rating, canvas.width/2, 240);
        
        // Detailed stats
        ctx.fillStyle = '#BDC3C7';
        ctx.font = '20px Arial';
        ctx.textAlign = 'left';
        
        let statsX = 200;
        let statsY = 300;
        ctx.fillText(`Jump Power: ${jumpPower.toFixed(1)}`, statsX, statsY);
        ctx.fillText(`Multiplier: x${multiplier.toFixed(1)}`, statsX, statsY + 30);
        ctx.fillText(`Perfect Timing: ${perfectTiming ? 'YES' : 'NO'}`, statsX, statsY + 60);
        ctx.fillText(`Personal Best: ${personalBest.toFixed(1)}m`, statsX, statsY + 90);
        
        // Buttons
        ctx.fillStyle = '#27AE60';
        ctx.fillRect(200, 480, 150, 50);
        ctx.fillStyle = '#3498DB';
        ctx.fillRect(450, 480, 150, 50);
        
        ctx.fillStyle = '#FFF';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('JUMP AGAIN', 275, 510);
        ctx.fillText('MAIN MENU', 525, 510);
    }
    
    function gameLoop() {
        updateGame();
        draw();
        animationId = requestAnimationFrame(gameLoop);
    }
    
    function handleMouseDown(e) {
        let rect = canvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        
        if (gameState === 'setup') {
            // Check start button
            if (x >= canvas.width/2 - 100 && x <= canvas.width/2 + 100 &&
                y >= 500 && y <= 560) {
                startRun();
            }
        } else if (gameState === 'running') {
            // Continue building speed (handled by mousedown state)
        } else if (gameState === 'results') {
            // Check result buttons
            if (y >= 480 && y <= 530) {
                if (x >= 200 && x <= 350) {
                    // Jump again
                    resetGame();
                    startRun();
                } else if (x >= 450 && x <= 600) {
                    // Main menu
                    resetGame();
                }
            }
        }
    }
    
    function handleMouseUp(e) {
        if (gameState === 'takeoff') {
            performJump();
        }
    }
    
    function startRun() {
        gameState = 'running';
        player.speed = 0;
        runDistance = 0;
        jumpDistance = 0;
        perfectTiming = false;
        player.animFrame = 0;
    }
    
    function resetGame() {
        gameState = 'setup';
        player.x = 50;
        player.y = 400;
        player.vx = 0;
        player.vy = 0;
        player.speed = 0;
        runDistance = 0;
        jumpDistance = 0;
        perfectTiming = false;
        multiplier = 1;
        jumpPower = 0;
        speedLines = [];
        dustParticles = [];
        takeoffEffect = null;
        perfectEffect = null;
        cameraShake = 0;
    }
    
    function stopGame() {
        gameRunning = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mouseup', handleMouseUp);
    }
    
    // Initialize
    initializeRunway();
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    gameLoop();
    
    window.currentGameCleanup = stopGame;
}

// PVP COMBAT GAME - Two-player fighting with mirrored map and weapons
function initPvPCombat(canvas, ctx) {
    canvas.width = 800;
    canvas.height = 600;
    
    let gameRunning = true;
    let animationId;
    let gameState = 'setup'; // 'setup', 'battle', 'victory'
    
    // Players
    let player1 = {
        x: 150,
        y: 400,
        vx: 0,
        vy: 0,
        width: 30,
        height: 40,
        health: 100,
        maxHealth: 100,
        facing: 1, // 1 = right, -1 = left
        onGround: false,
        weapon: 'pistol',
        ammo: 12,
        maxAmmo: 12,
        reloadTime: 0,
        maxReloadTime: 120, // 2 seconds
        lastShot: 0,
        fireRate: 300, // ms between shots
        kills: 0,
        animFrame: 0,
        muzzleFlash: 0,
        hitEffect: 0,
        color: '#4169E1'
    };
    
    let player2 = {
        x: 650,
        y: 400,
        vx: 0,
        vy: 0,
        width: 30,
        height: 40,
        health: 100,
        maxHealth: 100,
        facing: -1,
        onGround: false,
        weapon: 'pistol',
        ammo: 12,
        maxAmmo: 12,
        reloadTime: 0,
        maxReloadTime: 120,
        lastShot: 0,
        fireRate: 300,
        kills: 0,
        animFrame: 0,
        muzzleFlash: 0,
        hitEffect: 0,
        color: '#E74C3C'
    };
    
    // Game mechanics
    let bullets = [];
    let particles = [];
    let explosions = [];
    let powerUps = [];
    let map = [];
    let roundNumber = 1;
    let maxRounds = 5;
    let roundTimer = 0;
    let maxRoundTime = 180 * 60; // 3 minutes in frames
    
    // Controls
    let keys = {
        // Player 1 (WASD)
        w: false, a: false, s: false, d: false, shift: false,
        // Player 2 (Arrow keys)
        up: false, left: false, down: false, right: false, enter: false
    };
    
    // Weapons
    const weapons = {
        pistol: { damage: 25, fireRate: 300, ammo: 12, spread: 0.1, bulletSpeed: 15, color: '#FFD700' },
        shotgun: { damage: 15, fireRate: 800, ammo: 8, spread: 0.3, bulletSpeed: 12, pellets: 5, color: '#FF4500' },
        rifle: { damage: 35, fireRate: 150, ammo: 30, spread: 0.05, bulletSpeed: 20, color: '#00FF00' },
        rocket: { damage: 75, fireRate: 2000, ammo: 3, spread: 0, bulletSpeed: 8, explosive: true, color: '#FF0000' }
    };
    
    function initializeMap() {
        map = [
            // Ground platforms
            { x: 0, y: 550, width: 800, height: 50, type: 'ground' },
            
            // Lower platforms
            { x: 100, y: 450, width: 150, height: 20, type: 'platform' },
            { x: 550, y: 450, width: 150, height: 20, type: 'platform' },
            
            // Middle platforms
            { x: 200, y: 350, width: 100, height: 20, type: 'platform' },
            { x: 500, y: 350, width: 100, height: 20, type: 'platform' },
            
            // Center elevated platform
            { x: 350, y: 250, width: 100, height: 20, type: 'platform' },
            
            // Cover walls
            { x: 300, y: 480, width: 20, height: 70, type: 'wall' },
            { x: 480, y: 480, width: 20, height: 70, type: 'wall' },
            
            // Upper corner platforms
            { x: 50, y: 200, width: 100, height: 20, type: 'platform' },
            { x: 650, y: 200, width: 100, height: 20, type: 'platform' }
        ];
        
        // Add power-up spawn points
        spawnPowerUp(400, 230); // Center platform
        spawnPowerUp(175, 430); // Lower left
        spawnPowerUp(625, 430); // Lower right
    }
    
    function spawnPowerUp(x, y) {
        let types = ['health', 'ammo', 'weapon'];
        let type = types[Math.floor(Math.random() * types.length)];
        let weaponType = Object.keys(weapons)[Math.floor(Math.random() * Object.keys(weapons).length)];
        
        powerUps.push({
            x: x,
            y: y,
            type: type,
            weaponType: weaponType,
            animFrame: 0,
            respawnTime: 0,
            maxRespawnTime: 600 // 10 seconds
        });
    }
    
    function updateGame() {
        if (!gameRunning || gameState !== 'battle') return;
        
        roundTimer++;
        
        // Update players
        updatePlayer(player1);
        updatePlayer(player2);
        
        // Update bullets
        bullets = bullets.filter(bullet => {
            bullet.x += bullet.vx;
            bullet.y += bullet.vy;
            bullet.life--;
            
            // Check map collisions
            for (let platform of map) {
                if (bullet.x >= platform.x && bullet.x <= platform.x + platform.width &&
                    bullet.y >= platform.y && bullet.y <= platform.y + platform.height) {
                    
                    if (bullet.explosive) {
                        createExplosion(bullet.x, bullet.y, 60);
                    }
                    
                    // Impact particles
                    for (let i = 0; i < 5; i++) {
                        particles.push({
                            x: bullet.x,
                            y: bullet.y,
                            vx: (Math.random() - 0.5) * 6,
                            vy: -Math.random() * 4,
                            life: 30,
                            size: 2,
                            color: '#888888'
                        });
                    }
                    
                    return false;
                }
            }
            
            // Check player collisions
            if (checkBulletPlayerCollision(bullet, player1) && bullet.owner !== 'player1') {
                damagePlayer(player1, bullet.damage);
                if (bullet.explosive) {
                    createExplosion(bullet.x, bullet.y, 60);
                }
                return false;
            }
            
            if (checkBulletPlayerCollision(bullet, player2) && bullet.owner !== 'player2') {
                damagePlayer(player2, bullet.damage);
                if (bullet.explosive) {
                    createExplosion(bullet.x, bullet.y, 60);
                }
                return false;
            }
            
            return bullet.life > 0 && bullet.x >= -50 && bullet.x <= canvas.width + 50 &&
                   bullet.y >= -50 && bullet.y <= canvas.height + 50;
        });
        
        // Update particles
        particles = particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.1; // gravity
            particle.life--;
            particle.size *= 0.98;
            return particle.life > 0;
        });
        
        // Update explosions
        explosions = explosions.filter(explosion => {
            explosion.radius += explosion.expandSpeed;
            explosion.life--;
            explosion.alpha = explosion.life / explosion.maxLife;
            return explosion.life > 0;
        });
        
        // Update power-ups
        powerUps.forEach(powerUp => {
            powerUp.animFrame += 0.1;
            
            if (powerUp.respawnTime > 0) {
                powerUp.respawnTime--;
            }
            
            // Check player pickups
            if (powerUp.respawnTime === 0) {
                if (checkPlayerPowerUpCollision(player1, powerUp)) {
                    applyPowerUp(player1, powerUp);
                    powerUp.respawnTime = powerUp.maxRespawnTime;
                } else if (checkPlayerPowerUpCollision(player2, powerUp)) {
                    applyPowerUp(player2, powerUp);
                    powerUp.respawnTime = powerUp.maxRespawnTime;
                }
            }
        });
        
        // Update visual effects
        player1.muzzleFlash *= 0.8;
        player2.muzzleFlash *= 0.8;
        player1.hitEffect *= 0.9;
        player2.hitEffect *= 0.9;
        
        // Check win conditions
        if (player1.health <= 0) {
            player2.kills++;
            if (player2.kills >= Math.ceil(maxRounds / 2)) {
                gameState = 'victory';
            } else {
                respawnPlayer(player1);
                roundNumber++;
            }
        } else if (player2.health <= 0) {
            player1.kills++;
            if (player1.kills >= Math.ceil(maxRounds / 2)) {
                gameState = 'victory';
            } else {
                respawnPlayer(player2);
                roundNumber++;
            }
        }
        
        // Round time limit
        if (roundTimer >= maxRoundTime) {
            // Draw - reset round
            respawnPlayer(player1);
            respawnPlayer(player2);
            roundNumber++;
        }
    }
    
    function updatePlayer(player) {
        // Reduce reload time
        if (player.reloadTime > 0) {
            player.reloadTime--;
            if (player.reloadTime === 0) {
                player.ammo = player.maxAmmo;
            }
        }
        
        // Apply gravity
        if (!player.onGround) {
            player.vy += 0.5;
        }
        
        // Movement input
        let moveSpeed = 4;
        let jumpPower = 12;
        
        if (player === player1) {
            if (keys.a) {
                player.vx = -moveSpeed;
                player.facing = -1;
                player.animFrame += 0.2;
            } else if (keys.d) {
                player.vx = moveSpeed;
                player.facing = 1;
                player.animFrame += 0.2;
            } else {
                player.vx *= 0.8;
            }
            
            if (keys.w && player.onGround) {
                player.vy = -jumpPower;
                player.onGround = false;
            }
            
            if (keys.s && player.onGround) {
                // Crouch/duck
                player.height = 20;
            } else {
                player.height = 40;
            }
            
            if (keys.shift) {
                shoot(player, 'player1');
            }
        } else {
            if (keys.left) {
                player.vx = -moveSpeed;
                player.facing = -1;
                player.animFrame += 0.2;
            } else if (keys.right) {
                player.vx = moveSpeed;
                player.facing = 1;
                player.animFrame += 0.2;
            } else {
                player.vx *= 0.8;
            }
            
            if (keys.up && player.onGround) {
                player.vy = -jumpPower;
                player.onGround = false;
            }
            
            if (keys.down && player.onGround) {
                // Crouch/duck
                player.height = 20;
            } else {
                player.height = 40;
            }
            
            if (keys.enter) {
                shoot(player, 'player2');
            }
        }
        
        // Update position
        player.x += player.vx;
        player.y += player.vy;
        
        // Platform collisions
        player.onGround = false;
        for (let platform of map) {
            if (player.x < platform.x + platform.width &&
                player.x + player.width > platform.x &&
                player.y < platform.y + platform.height &&
                player.y + player.height > platform.y) {
                
                // Landing on top
                if (player.vy > 0 && player.y < platform.y) {
                    player.y = platform.y - player.height;
                    player.vy = 0;
                    player.onGround = true;
                }
                // Hitting from below
                else if (player.vy < 0 && player.y > platform.y) {
                    player.y = platform.y + platform.height;
                    player.vy = 0;
                }
                // Side collisions
                else if (player.vx > 0 && player.x < platform.x) {
                    player.x = platform.x - player.width;
                    player.vx = 0;
                } else if (player.vx < 0 && player.x > platform.x) {
                    player.x = platform.x + platform.width;
                    player.vx = 0;
                }
            }
        }
        
        // Screen boundaries
        player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
        if (player.y > canvas.height) {
            // Fall death
            damagePlayer(player, 50);
            respawnPlayer(player);
        }
    }
    
    function shoot(player, owner) {
        let currentTime = Date.now();
        let weapon = weapons[player.weapon];
        
        if (currentTime - player.lastShot < weapon.fireRate) return;
        if (player.ammo <= 0) {
            // Auto reload
            if (player.reloadTime === 0) {
                player.reloadTime = player.maxReloadTime;
            }
            return;
        }
        
        player.lastShot = currentTime;
        player.ammo--;
        player.muzzleFlash = 1;
        
        // Calculate bullet spawn position
        let bulletX = player.x + player.width/2 + player.facing * 20;
        let bulletY = player.y + player.height/2;
        
        // Determine target direction
        let targetX, targetY;
        if (player === player1) {
            targetX = player2.x + player2.width/2;
            targetY = player2.y + player2.height/2;
        } else {
            targetX = player1.x + player1.width/2;
            targetY = player1.y + player1.height/2;
        }
        
        let dx = targetX - bulletX;
        let dy = targetY - bulletY;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let angle = Math.atan2(dy, dx);
        
        // Create bullets (multiple for shotgun)
        let pellets = weapon.pellets || 1;
        for (let i = 0; i < pellets; i++) {
            let spreadAngle = angle + (Math.random() - 0.5) * weapon.spread;
            
            bullets.push({
                x: bulletX,
                y: bulletY,
                vx: Math.cos(spreadAngle) * weapon.bulletSpeed,
                vy: Math.sin(spreadAngle) * weapon.bulletSpeed,
                damage: weapon.damage,
                life: 180, // 3 seconds
                owner: owner,
                explosive: weapon.explosive || false,
                color: weapon.color
            });
        }
        
        // Muzzle flash particles
        for (let i = 0; i < 8; i++) {
            particles.push({
                x: bulletX,
                y: bulletY,
                vx: Math.cos(angle + (Math.random() - 0.5) * 0.5) * (3 + Math.random() * 5),
                vy: Math.sin(angle + (Math.random() - 0.5) * 0.5) * (3 + Math.random() * 5),
                life: 15,
                size: 2 + Math.random() * 3,
                color: '#FFD700'
            });
        }
    }
    
    function checkBulletPlayerCollision(bullet, player) {
        return bullet.x >= player.x && bullet.x <= player.x + player.width &&
               bullet.y >= player.y && bullet.y <= player.y + player.height;
    }
    
    function checkPlayerPowerUpCollision(player, powerUp) {
        return player.x < powerUp.x + 20 &&
               player.x + player.width > powerUp.x &&
               player.y < powerUp.y + 20 &&
               player.y + player.height > powerUp.y;
    }
    
    function damagePlayer(player, damage, fromExplosion = false) {
        player.health -= damage;
        player.hitEffect = 1;
        
        // Blood particles
        for (let i = 0; i < 10; i++) {
            particles.push({
                x: player.x + player.width/2,
                y: player.y + player.height/2,
                vx: (Math.random() - 0.5) * 8,
                vy: -Math.random() * 6,
                life: 60,
                size: 2 + Math.random() * 3,
                color: '#8B0000'
            });
        }
        
        if (player.health <= 0) {
            player.health = 0;
            // Only create death explosion if not already from an explosion
            if (!fromExplosion) {
                createExplosion(player.x + player.width/2, player.y + player.height/2, 40);
            }
        }
    }
    
    function createExplosion(x, y, radius) {
        explosions.push({
            x: x,
            y: y,
            radius: 0,
            maxRadius: radius,
            expandSpeed: 3,
            life: 30,
            maxLife: 30,
            alpha: 1
        });
        
        // Explosion particles
        for (let i = 0; i < 20; i++) {
            particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 15,
                vy: (Math.random() - 0.5) * 15,
                life: 45,
                size: 3 + Math.random() * 5,
                color: `hsl(${Math.random() * 60}, 100%, 60%)`
            });
        }
        
        // Damage players in explosion radius
        let p1Distance = Math.sqrt(Math.pow(player1.x + player1.width/2 - x, 2) + Math.pow(player1.y + player1.height/2 - y, 2));
        let p2Distance = Math.sqrt(Math.pow(player2.x + player2.width/2 - x, 2) + Math.pow(player2.y + player2.height/2 - y, 2));
        
        if (p1Distance < radius) {
            damagePlayer(player1, Math.floor(50 * (1 - p1Distance / radius)), true);
        }
        if (p2Distance < radius) {
            damagePlayer(player2, Math.floor(50 * (1 - p2Distance / radius)), true);
        }
    }
    
    function applyPowerUp(player, powerUp) {
        switch(powerUp.type) {
            case 'health':
                player.health = Math.min(player.maxHealth, player.health + 50);
                break;
            case 'ammo':
                player.ammo = player.maxAmmo;
                player.reloadTime = 0;
                break;
            case 'weapon':
                player.weapon = powerUp.weaponType;
                player.ammo = weapons[powerUp.weaponType].ammo;
                player.maxAmmo = weapons[powerUp.weaponType].ammo;
                break;
        }
        
        // Pickup effect
        for (let i = 0; i < 10; i++) {
            particles.push({
                x: powerUp.x + 10,
                y: powerUp.y + 10,
                vx: (Math.random() - 0.5) * 6,
                vy: -Math.random() * 8,
                life: 40,
                size: 2 + Math.random() * 3,
                color: powerUp.type === 'health' ? '#00FF00' : powerUp.type === 'ammo' ? '#FFD700' : '#00FFFF'
            });
        }
    }
    
    function respawnPlayer(player) {
        if (player === player1) {
            player.x = 150;
            player.y = 400;
        } else {
            player.x = 650;
            player.y = 400;
        }
        
        player.health = player.maxHealth;
        player.vx = 0;
        player.vy = 0;
        player.weapon = 'pistol';
        player.ammo = 12;
        player.maxAmmo = 12;
        player.reloadTime = 0;
        roundTimer = 0;
        
        // Respawn effect
        for (let i = 0; i < 15; i++) {
            particles.push({
                x: player.x + player.width/2,
                y: player.y + player.height/2,
                vx: (Math.random() - 0.5) * 10,
                vy: -Math.random() * 10,
                life: 60,
                size: 3 + Math.random() * 4,
                color: player.color
            });
        }
    }
    
    function draw() {
        // Background gradient
        let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#2C3E50');
        gradient.addColorStop(1, '#34495E');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        if (gameState === 'setup') {
            drawSetupScreen();
        } else if (gameState === 'battle') {
            drawBattleScreen();
        } else if (gameState === 'victory') {
            drawVictoryScreen();
        }
    }
    
    function drawSetupScreen() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#FFF';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('⚔️ PVP COMBAT ⚔️', canvas.width/2, 100);
        
        ctx.font = '24px Arial';
        ctx.fillText('Two-Player Battle Arena', canvas.width/2, 150);
        
        // Controls
        ctx.font = '20px Arial';
        ctx.textAlign = 'left';
        ctx.fillStyle = '#4169E1';
        ctx.fillText('Player 1 (Blue):', 100, 220);
        ctx.fillStyle = '#FFF';
        ctx.fillText('WASD - Move & Jump', 120, 250);
        ctx.fillText('SHIFT - Shoot', 120, 280);
        ctx.fillText('S (hold) - Crouch', 120, 310);
        
        ctx.fillStyle = '#E74C3C';
        ctx.fillText('Player 2 (Red):', 450, 220);
        ctx.fillStyle = '#FFF';
        ctx.fillText('Arrow Keys - Move & Jump', 470, 250);
        ctx.fillText('ENTER - Shoot', 470, 280);
        ctx.fillText('DOWN (hold) - Crouch', 470, 310);
        
        // Game info
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFD700';
        ctx.font = '18px Arial';
        ctx.fillText('🎯 Collect power-ups for health, ammo, and weapons!', canvas.width/2, 380);
        ctx.fillText('🏆 First to win 3 rounds wins the match!', canvas.width/2, 410);
        
        // Start button
        ctx.fillStyle = '#27AE60';
        ctx.fillRect(canvas.width/2 - 100, 480, 200, 60);
        ctx.strokeStyle = '#229954';
        ctx.lineWidth = 3;
        ctx.strokeRect(canvas.width/2 - 100, 480, 200, 60);
        
        ctx.fillStyle = '#FFF';
        ctx.font = '28px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('START BATTLE', canvas.width/2, 520);
    }
    
    function drawBattleScreen() {
        // Draw map
        map.forEach(platform => {
            if (platform.type === 'ground') {
                ctx.fillStyle = '#8B4513';
            } else if (platform.type === 'platform') {
                ctx.fillStyle = '#A0A0A0';
            } else if (platform.type === 'wall') {
                ctx.fillStyle = '#696969';
            }
            
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            
            // Platform borders
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
        });
        
        // Draw power-ups
        powerUps.forEach(powerUp => {
            if (powerUp.respawnTime === 0) {
                let bobOffset = Math.sin(powerUp.animFrame) * 3;
                let y = powerUp.y + bobOffset;
                
                ctx.save();
                ctx.translate(powerUp.x + 10, y + 10);
                ctx.rotate(powerUp.animFrame * 0.1);
                
                if (powerUp.type === 'health') {
                    ctx.fillStyle = '#00FF00';
                    ctx.fillRect(-8, -3, 16, 6);
                    ctx.fillRect(-3, -8, 6, 16);
                } else if (powerUp.type === 'ammo') {
                    ctx.fillStyle = '#FFD700';
                    ctx.fillRect(-6, -8, 12, 16);
                } else if (powerUp.type === 'weapon') {
                    ctx.fillStyle = '#00FFFF';
                    ctx.fillRect(-8, -4, 16, 8);
                    ctx.fillRect(6, -6, 4, 12);
                }
                
                ctx.restore();
            } else {
                // Respawn countdown
                let timeLeft = Math.ceil(powerUp.respawnTime / 60);
                ctx.fillStyle = '#FFF';
                ctx.font = '16px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(timeLeft.toString(), powerUp.x + 10, powerUp.y - 5);
            }
        });
        
        // Draw particles
        particles.forEach(particle => {
            ctx.save();
            ctx.globalAlpha = particle.life / 60;
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
        
        // Draw explosions
        explosions.forEach(explosion => {
            ctx.save();
            ctx.globalAlpha = explosion.alpha * 0.6;
            
            // Outer ring
            ctx.strokeStyle = '#FF4500';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
            ctx.stroke();
            
            // Inner fill
            ctx.fillStyle = '#FF6347';
            ctx.globalAlpha = explosion.alpha * 0.3;
            ctx.fill();
            
            ctx.restore();
        });
        
        // Draw bullets
        bullets.forEach(bullet => {
            ctx.save();
            ctx.fillStyle = bullet.color;
            ctx.beginPath();
            ctx.arc(bullet.x, bullet.y, bullet.explosive ? 4 : 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Bullet trail
            ctx.strokeStyle = bullet.color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(bullet.x, bullet.y);
            ctx.lineTo(bullet.x - bullet.vx * 3, bullet.y - bullet.vy * 3);
            ctx.stroke();
            
            ctx.restore();
        });
        
        // Draw players
        drawPlayer(player1);
        drawPlayer(player2);
        
        // Draw UI
        drawBattleUI();
    }
    
    function drawPlayer(player) {
        ctx.save();
        
        // Hit effect
        if (player.hitEffect > 0) {
            ctx.globalAlpha = 1 - player.hitEffect;
        }
        
        // Player body
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);
        
        // Player outline
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(player.x, player.y, player.width, player.height);
        
        // Face direction indicator
        ctx.fillStyle = '#FFF';
        ctx.fillRect(
            player.x + (player.facing > 0 ? player.width - 5 : 0),
            player.y + 5,
            5,
            10
        );
        
        // Weapon
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(player.x + player.width/2, player.y + player.height/2);
        ctx.lineTo(
            player.x + player.width/2 + player.facing * 25,
            player.y + player.height/2
        );
        ctx.stroke();
        
        // Muzzle flash
        if (player.muzzleFlash > 0) {
            ctx.save();
            ctx.globalAlpha = player.muzzleFlash;
            ctx.fillStyle = '#FFFF00';
            ctx.beginPath();
            ctx.arc(
                player.x + player.width/2 + player.facing * 25,
                player.y + player.height/2,
                8,
                0,
                Math.PI * 2
            );
            ctx.fill();
            ctx.restore();
        }
        
        // Health bar
        let barWidth = player.width;
        let barHeight = 4;
        let barY = player.y - 10;
        
        ctx.fillStyle = '#000';
        ctx.fillRect(player.x, barY, barWidth, barHeight);
        
        ctx.fillStyle = player.health > 50 ? '#00FF00' : player.health > 25 ? '#FFFF00' : '#FF0000';
        ctx.fillRect(player.x, barY, (player.health / player.maxHealth) * barWidth, barHeight);
        
        ctx.restore();
    }
    
    function drawBattleUI() {
        // Player 1 UI (left side)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(10, 10, 200, 100);
        
        ctx.fillStyle = player1.color;
        ctx.font = '18px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Player 1', 20, 30);
        
        ctx.fillStyle = '#FFF';
        ctx.font = '14px Arial';
        ctx.fillText(`Health: ${player1.health}/100`, 20, 50);
        ctx.fillText(`Weapon: ${player1.weapon}`, 20, 70);
        ctx.fillText(`Ammo: ${player1.ammo}/${player1.maxAmmo}`, 20, 90);
        
        if (player1.reloadTime > 0) {
            ctx.fillStyle = '#FFD700';
            ctx.fillText('RELOADING...', 120, 90);
        }
        
        // Player 2 UI (right side)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(canvas.width - 210, 10, 200, 100);
        
        ctx.fillStyle = player2.color;
        ctx.font = '18px Arial';
        ctx.textAlign = 'right';
        ctx.fillText('Player 2', canvas.width - 20, 30);
        
        ctx.fillStyle = '#FFF';
        ctx.font = '14px Arial';
        ctx.fillText(`Health: ${player2.health}/100`, canvas.width - 20, 50);
        ctx.fillText(`Weapon: ${player2.weapon}`, canvas.width - 20, 70);
        ctx.fillText(`Ammo: ${player2.ammo}/${player2.maxAmmo}`, canvas.width - 20, 90);
        
        if (player2.reloadTime > 0) {
            ctx.fillStyle = '#FFD700';
            ctx.fillText('RELOADING...', canvas.width - 120, 90);
        }
        
        // Score and round info
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(canvas.width/2 - 100, 10, 200, 60);
        
        ctx.fillStyle = '#FFF';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Round ${roundNumber}`, canvas.width/2, 30);
        ctx.fillText(`${player1.kills} - ${player2.kills}`, canvas.width/2, 50);
        
        // Round timer
        let timeLeft = Math.ceil((maxRoundTime - roundTimer) / 60);
        ctx.fillText(`${Math.floor(timeLeft/60)}:${(timeLeft%60).toString().padStart(2, '0')}`, canvas.width/2, 65);
    }
    
    function drawVictoryScreen() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        let winner = player1.kills > player2.kills ? 'Player 1' : 'Player 2';
        let winnerColor = player1.kills > player2.kills ? player1.color : player2.color;
        
        ctx.fillStyle = winnerColor;
        ctx.font = '64px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${winner} Wins!`, canvas.width/2, 200);
        
        ctx.fillStyle = '#FFF';
        ctx.font = '32px Arial';
        ctx.fillText(`Final Score: ${player1.kills} - ${player2.kills}`, canvas.width/2, 260);
        
        // Play again button
        ctx.fillStyle = '#27AE60';
        ctx.fillRect(canvas.width/2 - 100, 350, 200, 60);
        ctx.fillStyle = '#FFF';
        ctx.font = '24px Arial';
        ctx.fillText('PLAY AGAIN', canvas.width/2, 385);
    }
    
    function gameLoop() {
        updateGame();
        draw();
        animationId = requestAnimationFrame(gameLoop);
    }
    
    function handleKeyDown(e) {
        switch(e.code) {
            // Player 1
            case 'KeyW': keys.w = true; break;
            case 'KeyA': keys.a = true; break;
            case 'KeyS': keys.s = true; break;
            case 'KeyD': keys.d = true; break;
            case 'ShiftLeft': keys.shift = true; break;
            
            // Player 2
            case 'ArrowUp': keys.up = true; break;
            case 'ArrowLeft': keys.left = true; break;
            case 'ArrowDown': keys.down = true; break;
            case 'ArrowRight': keys.right = true; break;
            case 'Enter': keys.enter = true; break;
        }
        e.preventDefault();
    }
    
    function handleKeyUp(e) {
        switch(e.code) {
            // Player 1
            case 'KeyW': keys.w = false; break;
            case 'KeyA': keys.a = false; break;
            case 'KeyS': keys.s = false; break;
            case 'KeyD': keys.d = false; break;
            case 'ShiftLeft': keys.shift = false; break;
            
            // Player 2
            case 'ArrowUp': keys.up = false; break;
            case 'ArrowLeft': keys.left = false; break;
            case 'ArrowDown': keys.down = false; break;
            case 'ArrowRight': keys.right = false; break;
            case 'Enter': keys.enter = false; break;
        }
        e.preventDefault();
    }
    
    function handleClick(e) {
        let rect = canvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        
        if (gameState === 'setup') {
            if (x >= canvas.width/2 - 100 && x <= canvas.width/2 + 100 &&
                y >= 480 && y <= 540) {
                startBattle();
            }
        } else if (gameState === 'victory') {
            if (x >= canvas.width/2 - 100 && x <= canvas.width/2 + 100 &&
                y >= 350 && y <= 410) {
                resetGame();
            }
        }
    }
    
    function startBattle() {
        gameState = 'battle';
        initializeMap();
    }
    
    function resetGame() {
        gameState = 'setup';
        player1.kills = 0;
        player2.kills = 0;
        roundNumber = 1;
        respawnPlayer(player1);
        respawnPlayer(player2);
        bullets = [];
        particles = [];
        explosions = [];
        powerUps = [];
    }
    
    function stopGame() {
        gameRunning = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
        canvas.removeEventListener('click', handleClick);
    }
    
    // Initialize
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('click', handleClick);
    gameLoop();
    
    window.currentGameCleanup = stopGame;
}

export default GamePlayer;