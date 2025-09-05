export function initFlappyBird(canvas, ctx) {
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
        
        bird.dy += GRAVITY;
        bird.y += bird.dy;
        
        if (bird.y <= 0 || bird.y >= canvas.height - bird.size) {
            gameRunning = false;
        }
    }
    
    function updatePipes() {
        if (!gameStarted) return;
        
        pipes.forEach(pipe => {
            pipe.x -= PIPE_SPEED;
            
            if (!pipe.passed && pipe.x + PIPE_WIDTH < bird.x) {
                pipe.passed = true;
                score++;
            }
        });
        
        pipes = pipes.filter(pipe => pipe.x > -PIPE_WIDTH);
        
        pipeTimer++;
        if (pipeTimer > 90) {
            createPipe();
            pipeTimer = 0;
        }
    }
    
    function checkCollisions() {
        if (!gameStarted) return;
        
        pipes.forEach(pipe => {
            if (bird.x + bird.size > pipe.x && bird.x < pipe.x + PIPE_WIDTH) {
                if (bird.y < pipe.topHeight || bird.y + bird.size > pipe.bottomY) {
                    gameRunning = false;
                }
            }
        });
    }
    
    function draw() {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#70C5CE');
        gradient.addColorStop(1, '#DEE4AA');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#90EE90';
        ctx.strokeStyle = '#228B22';
        ctx.lineWidth = 3;
        
        pipes.forEach(pipe => {
            ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
            ctx.strokeRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
            
            ctx.fillRect(pipe.x, pipe.bottomY, PIPE_WIDTH, pipe.bottomHeight);
            ctx.strokeRect(pipe.x, pipe.bottomY, PIPE_WIDTH, pipe.bottomHeight);
        });
        
        ctx.fillStyle = '#FFD700';
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 2;
        ctx.fillRect(bird.x, bird.y, bird.size, bird.size);
        ctx.strokeRect(bird.x, bird.y, bird.size, bird.size);
        
        ctx.fillStyle = '#000';
        ctx.fillRect(bird.x + 12, bird.y + 5, 4, 4);
        
        ctx.fillStyle = '#FF4500';
        ctx.fillRect(bird.x + bird.size, bird.y + 8, 6, 4);
        
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
    
    window.currentGameCleanup = stopGame;
}