export function initBreakout(canvas, ctx) {
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
    let extraBalls = [];
    let animationId = null;
    
    const keys = {};
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
    
    function initLevel() {
        bricks = [];
        powerUps = [];
        particles = [];
        
        const patterns = [
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
        
        if (ball.x <= 0 || ball.x >= canvas.width - BALL_SIZE) {
            ball.dx = -ball.dx;
        }
        if (ball.y <= 0) {
            ball.dy = -ball.dy;
        }
        
        if (ball.y >= paddle.y - ball.size && 
            ball.x >= paddle.x && 
            ball.x <= paddle.x + paddle.width) {
            const hitPos = (ball.x - paddle.x) / paddle.width;
            ball.dy = -Math.abs(ball.dy);
            ball.dx = (hitPos - 0.5) * 8;
        }
        
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
                            
                            if (brick.powerUp) {
                                powerUps.push({
                                    x: brick.x + BRICK_WIDTH/2,
                                    y: brick.y + BRICK_HEIGHT,
                                    type: brick.powerUp,
                                    dy: 2
                                });
                            }
                            
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
        
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.dx;
            p.y += p.dy;
            p.life--;
            if (p.life <= 0) particles.splice(i, 1);
        }
        
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
        
        for (let powerUp of powerUps) {
            ctx.fillStyle = powerUp.type === 'expand' ? '#00FF00' : 
                           powerUp.type === 'multiball' ? '#FF0000' : '#0000FF';
            ctx.fillRect(powerUp.x - 10, powerUp.y - 5, 20, 10);
        }
        
        for (let p of particles) {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life / 30;
            ctx.fillRect(p.x, p.y, 3, 3);
            ctx.globalAlpha = 1;
        }
        
        ctx.fillStyle = 'white';
        ctx.fillRect(paddle.x, paddle.y, paddle.width, PADDLE_HEIGHT);
        ctx.fillRect(ball.x, ball.y, ball.size, ball.size);
        
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
            level = 1;
            lives = 3;
            score = 0;
            gameRunning = true;
            gameWon = false;
            paddle = { x: canvas.width/2 - PADDLE_WIDTH/2, y: canvas.height - 30, width: PADDLE_WIDTH };
            ball = { x: canvas.width/2, y: canvas.height - 60, dx: 4, dy: -4, size: BALL_SIZE };
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
    
    window.currentGameCleanup = stopGame;
}