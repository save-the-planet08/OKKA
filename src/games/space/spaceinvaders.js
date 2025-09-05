export function initSpaceInvaders(canvas, ctx) {
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
                    type: row
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
        bullets = bullets.filter(bullet => {
            bullet.y -= 8;
            return bullet.y > 0;
        });
        
        enemyBullets = enemyBullets.filter(bullet => {
            bullet.y += 4;
            return bullet.y < canvas.height;
        });
    }
    
    function updateEnemies() {
        let moveDown = false;
        let direction = 1;
        
        enemies.forEach(enemy => {
            if (enemy.alive && (enemy.x <= 0 || enemy.x >= canvas.width - 30)) {
                moveDown = true;
            }
        });
        
        enemies.forEach(enemy => {
            if (enemy.alive) {
                if (moveDown) {
                    enemy.y += 20;
                    enemy.x += direction * 2;
                } else {
                    enemy.x += level * 0.5;
                }
                
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
        bullets.forEach((bullet, bulletIndex) => {
            enemies.forEach((enemy, enemyIndex) => {
                if (enemy.alive &&
                    bullet.x < enemy.x + enemy.width &&
                    bullet.x + bullet.width > enemy.x &&
                    bullet.y < enemy.y + enemy.height &&
                    bullet.y + bullet.height > enemy.y) {
                    
                    bullets.splice(bulletIndex, 1);
                    enemy.alive = false;
                    score += (5 - enemy.type) * 10;
                }
            });
        });
        
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
        
        if (enemies.every(enemy => !enemy.alive)) {
            level++;
            createEnemies();
        }
        
        enemies.forEach(enemy => {
            if (enemy.alive && enemy.y + enemy.height >= player.y) {
                gameRunning = false;
            }
        });
    }
    
    function draw() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(player.x, player.y, player.width, player.height);
        
        enemies.forEach(enemy => {
            if (enemy.alive) {
                const colors = ['#FF0000', '#FF8800', '#FFFF00', '#00FF88', '#0088FF'];
                ctx.fillStyle = colors[enemy.type];
                ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            }
        });
        
        ctx.fillStyle = '#FFFFFF';
        bullets.forEach(bullet => {
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });
        
        ctx.fillStyle = '#FF0000';
        enemyBullets.forEach(bullet => {
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });
        
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
    
    window.currentGameCleanup = stopGame;
}