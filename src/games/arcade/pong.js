export function initPong(canvas, ctx) {
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
        const deadZone = 20 / difficulty;
        
        // Predict where ball will be
        let predictedY = ballCenter;
        if (ball.dx > 0) {
            const timeToReach = (rightPaddle.x - ball.x) / ball.dx;
            predictedY = ball.y + ball.dy * timeToReach;
        }
        
        if (paddleCenter < predictedY - deadZone) {
            rightPaddle.y += aiSpeed;
        } else if (paddleCenter > predictedY + deadZone) {
            rightPaddle.y -= aiSpeed;
        }
        
        if (Math.random() < 0.05) {
            rightPaddle.y += (Math.random() - 0.5) * 10;
        }
        
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
        
        if (ball.y <= 0 || ball.y >= canvas.height - BALL_SIZE) {
            ball.dy = -ball.dy;
        }
        
        if (ball.x <= leftPaddle.x + PADDLE_WIDTH && 
            ball.y >= leftPaddle.y && 
            ball.y <= leftPaddle.y + PADDLE_HEIGHT) {
            ball.dx = Math.abs(ball.dx);
            const relativeIntersectY = (leftPaddle.y + PADDLE_HEIGHT/2) - ball.y;
            const normalizedRelativeIntersection = relativeIntersectY / (PADDLE_HEIGHT/2);
            ball.dy = normalizedRelativeIntersection * -5;
        }
        
        if (ball.x >= rightPaddle.x - BALL_SIZE && 
            ball.y >= rightPaddle.y && 
            ball.y <= rightPaddle.y + PADDLE_HEIGHT) {
            ball.dx = -Math.abs(ball.dx);
            const relativeIntersectY = (rightPaddle.y + PADDLE_HEIGHT/2) - ball.y;
            const normalizedRelativeIntersection = relativeIntersectY / (PADDLE_HEIGHT/2);
            ball.dy = normalizedRelativeIntersection * -5;
        }
        
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
        
        for (let i = powerUps.length - 1; i >= 0; i--) {
            powerUps[i].timer--;
            if (powerUps[i].timer <= 0) {
                powerUps.splice(i, 1);
            }
        }
        
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
        
        ctx.setLineDash([5, 15]);
        ctx.beginPath();
        ctx.moveTo(canvas.width/2, 0);
        ctx.lineTo(canvas.width/2, canvas.height);
        ctx.strokeStyle = 'white';
        ctx.stroke();
        ctx.setLineDash([]);
        
        ctx.fillStyle = 'white';
        ctx.fillRect(leftPaddle.x, leftPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);
        ctx.fillRect(rightPaddle.x, rightPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);
        
        ctx.fillStyle = `rgba(255, 255, 255, 0.8)`;
        ctx.fillRect(ball.x, ball.y, BALL_SIZE, BALL_SIZE);
        
        for (let powerUp of powerUps) {
            const alpha = Math.sin(powerUp.timer * 0.1) * 0.3 + 0.7;
            ctx.fillStyle = powerUp.type === 'speed' ? 
                `rgba(255, 100, 100, ${alpha})` : 
                `rgba(100, 255, 100, ${alpha})`;
            ctx.fillRect(powerUp.x, powerUp.y, 20, 20);
            
            ctx.fillStyle = 'white';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(powerUp.type === 'speed' ? 'S' : '+', powerUp.x + 10, powerUp.y + 13);
        }
        
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(leftScore.toString(), canvas.width/4, 60);
        ctx.fillText(rightScore.toString(), 3*canvas.width/4, 60);
        
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
    
    window.currentGameCleanup = stopGame;
}