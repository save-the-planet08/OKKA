export function initAsteroids(canvas, ctx) {
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
        
        player.dx *= 0.99;
        player.dy *= 0.99;
        
        player.x += player.dx;
        player.y += player.dy;
        
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
            
            if (asteroid.x < 0) asteroid.x = canvas.width;
            if (asteroid.x > canvas.width) asteroid.x = 0;
            if (asteroid.y < 0) asteroid.y = canvas.height;
            if (asteroid.y > canvas.height) asteroid.y = 0;
        });
    }
    
    function checkCollisions() {
        bullets.forEach((bullet, bulletIndex) => {
            asteroids.forEach((asteroid, asteroidIndex) => {
                const dx = bullet.x - asteroid.x;
                const dy = bullet.y - asteroid.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < asteroid.size) {
                    bullets.splice(bulletIndex, 1);
                    asteroids.splice(asteroidIndex, 1);
                    score += 100;
                    
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
        
        asteroids.forEach(asteroid => {
            const dx = player.x - asteroid.x;
            const dy = player.y - asteroid.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < asteroid.size + player.size) {
                lives--;
                if (lives <= 0) {
                    gameRunning = false;
                } else {
                    player.x = canvas.width/2;
                    player.y = canvas.height/2;
                    player.dx = 0;
                    player.dy = 0;
                }
            }
        });
        
        if (asteroids.length === 0) {
            createAsteroids();
        }
    }
    
    function draw() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
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
        
        if (thrust) {
            ctx.strokeStyle = 'red';
            ctx.beginPath();
            ctx.moveTo(-8, 0);
            ctx.lineTo(-15, 0);
            ctx.stroke();
        }
        ctx.restore();
        
        ctx.fillStyle = 'white';
        bullets.forEach(bullet => {
            ctx.beginPath();
            ctx.arc(bullet.x, bullet.y, 2, 0, Math.PI * 2);
            ctx.fill();
        });
        
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
    
    window.currentGameCleanup = stopGame;
}