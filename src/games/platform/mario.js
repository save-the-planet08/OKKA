export function initMarioBros(canvas, ctx) {
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
    
    function generateLevel() {
        platforms = [];
        enemies = [];
        coins = [];
        
        for (let x = 0; x < 2000; x += 100) {
            platforms.push({
                x: x,
                y: canvas.height - 50,
                width: 100,
                height: 50
            });
        }
        
        for (let x = 200; x < 1800; x += 300) {
            platforms.push({
                x: x,
                y: canvas.height - 200 - Math.random() * 100,
                width: 100,
                height: 20
            });
            
            coins.push({
                x: x + 40,
                y: canvas.height - 240 - Math.random() * 100,
                width: 16,
                height: 16,
                collected: false
            });
        }
        
        for (let x = 300; x < 1500; x += 200) {
            enemies.push({
                x: x,
                y: canvas.height - 82,
                width: 24,
                height: 32,
                vx: -1,
                direction: -1
            });
        }
    }
    
    function updateGame() {
        if (!gameRunning) return;
        
        mario.vy += 0.5;
        mario.x += mario.vx;
        mario.y += mario.vy;
        
        mario.onGround = false;
        platforms.forEach(platform => {
            if (mario.x < platform.x + platform.width &&
                mario.x + mario.width > platform.x &&
                mario.y < platform.y + platform.height &&
                mario.y + mario.height > platform.y) {
                
                if (mario.vy > 0 && mario.y < platform.y) {
                    mario.y = platform.y - mario.height;
                    mario.vy = 0;
                    mario.onGround = true;
                }
            }
        });
        
        enemies.forEach(enemy => {
            enemy.x += enemy.vx;
            
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
        
        checkCollisions();
        
        cameraX = mario.x - canvas.width / 3;
        if (cameraX < 0) cameraX = 0;
        
        if (mario.x > 1900) {
            score += 1000;
            generateLevel();
            mario.x = 50;
        }
    }
    
    function checkCollisions() {
        enemies.forEach((enemy, index) => {
            if (mario.x < enemy.x + enemy.width &&
                mario.x + mario.width > enemy.x &&
                mario.y < enemy.y + enemy.height &&
                mario.y + mario.height > enemy.y) {
                
                if (mario.vy > 0 && mario.y < enemy.y) {
                    enemies.splice(index, 1);
                    mario.vy = -8;
                    score += 100;
                } else {
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
        ctx.fillStyle = '#5C94FC';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#8B4513';
        platforms.forEach(platform => {
            ctx.fillRect(platform.x - cameraX, platform.y, platform.width, platform.height);
        });
        
        ctx.fillStyle = '#FFD700';
        coins.forEach(coin => {
            if (!coin.collected) {
                ctx.beginPath();
                ctx.arc(coin.x + coin.width/2 - cameraX, coin.y + coin.height/2, coin.width/2, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        
        ctx.fillStyle = '#8B0000';
        enemies.forEach(enemy => {
            ctx.fillRect(enemy.x - cameraX, enemy.y, enemy.width, enemy.height);
        });
        
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(mario.x - cameraX, mario.y, mario.width, mario.height);
        
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(mario.x - cameraX + 5, mario.y - 5, mario.width - 10, 8);
        
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
            score = 0;
            lives = 3;
            mario.x = 50;
            mario.y = canvas.height - 100;
            mario.vx = 0;
            mario.vy = 0;
            cameraX = 0;
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