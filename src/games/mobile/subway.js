export function initSubwaySurfers(canvas, ctx) {
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
    
    function spawnObstacle() {
        if (Math.random() < 0.02) {
            obstacles.push({
                x: lanes[Math.floor(Math.random() * 3)],
                y: -50,
                width: 30,
                height: 50,
                type: 'barrier'
            });
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
        
        player.x = lanes[player.lane];
        
        if (player.jumping) {
            player.jumpHeight += player.jumpSpeed;
            player.jumpSpeed += 0.8; // gravity
            
            if (player.jumpHeight >= 0) {
                player.jumpHeight = 0;
                player.jumping = false;
                player.jumpSpeed = 0;
            }
        }
        
        obstacles.forEach((obstacle, index) => {
            obstacle.y += speed;
            if (obstacle.y > canvas.height) {
                obstacles.splice(index, 1);
                score += 10;
                if (score % 100 === 0) speed += 0.5;
            }
        });
        
        coins.forEach((coin, index) => {
            coin.y += speed;
            if (coin.y > canvas.height) {
                coins.splice(index, 1);
            }
        });
        
        checkCollisions();
        spawnObstacle();
        spawnCoin();
    }
    
    function checkCollisions() {
        obstacles.forEach(obstacle => {
            if (player.x < obstacle.x + obstacle.width &&
                player.x + player.width > obstacle.x &&
                player.y - player.jumpHeight < obstacle.y + obstacle.height &&
                player.y + player.height - player.jumpHeight > obstacle.y &&
                !player.ducking) {
                gameRunning = false;
            }
        });
        
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
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#333';
        for (let i = 0; i < 3; i++) {
            ctx.fillRect(lanes[i] - 20, 0, 70, canvas.height);
        }
        
        ctx.fillStyle = '#FFF';
        ctx.fillRect(lanes[0] + 50, 0, 2, canvas.height);
        ctx.fillRect(lanes[1] + 50, 0, 2, canvas.height);
        
        ctx.fillStyle = player.ducking ? '#FF6B6B' : '#4ECDC4';
        const playerHeight = player.ducking ? player.height / 2 : player.height;
        ctx.fillRect(player.x, player.y - player.jumpHeight - (player.ducking ? 0 : playerHeight - player.height), 
                     player.width, playerHeight);
        
        ctx.fillStyle = '#E74C3C';
        obstacles.forEach(obstacle => {
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
        
        ctx.fillStyle = '#F1C40F';
        coins.forEach(coin => {
            ctx.beginPath();
            ctx.arc(coin.x + coin.width/2, coin.y + coin.height/2, coin.width/2, 0, Math.PI * 2);
            ctx.fill();
        });
        
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