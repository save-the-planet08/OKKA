export function initDoodleJump(canvas, ctx) {
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
        
        platforms.push({
            x: canvas.width/2 - PLATFORM_WIDTH/2,
            y: canvas.height - 50,
            type: 'normal'
        });
        
        for (let i = 1; i < 100; i++) {
            platforms.push({
                x: Math.random() * (canvas.width - PLATFORM_WIDTH),
                y: canvas.height - 50 - (i * 120),
                type: Math.random() < 0.1 ? 'spring' : 'normal'
            });
        }
    }
    
    function updatePlayer() {
        if (keys['ArrowLeft']) {
            player.x -= 5;
        }
        if (keys['ArrowRight']) {
            player.x += 5;
        }
        
        if (player.x < 0) player.x = canvas.width;
        if (player.x > canvas.width) player.x = 0;
        
        player.dy += GRAVITY;
        player.y += player.dy;
        
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
        
        if (player.y < highestY) {
            highestY = player.y;
            score = Math.max(score, Math.floor((canvas.height - 100 - highestY) / 10));
        }
        
        camera.y = player.y - canvas.height/2;
        
        if (player.y > camera.y + canvas.height + 100) {
            gameRunning = false;
        }
    }
    
    function draw() {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#98FB98');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        platforms.forEach(platform => {
            const screenY = platform.y - camera.y;
            if (screenY > -PLATFORM_HEIGHT && screenY < canvas.height + PLATFORM_HEIGHT) {
                if (platform.type === 'spring') {
                    ctx.fillStyle = '#FF6B6B';
                } else {
                    ctx.fillStyle = '#90EE90';
                }
                ctx.fillRect(platform.x, screenY, PLATFORM_WIDTH, PLATFORM_HEIGHT);
                
                if (platform.type === 'spring') {
                    ctx.fillStyle = '#FF0000';
                    ctx.fillRect(platform.x + PLATFORM_WIDTH/2 - 5, screenY - 10, 10, 10);
                }
            }
        });
        
        const playerScreenY = player.y - camera.y;
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(player.x, playerScreenY, player.width, player.height);
        
        ctx.fillStyle = '#000';
        ctx.fillRect(player.x + 5, playerScreenY + 5, 3, 3);
        ctx.fillRect(player.x + 12, playerScreenY + 5, 3, 3);
        
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
    
    window.currentGameCleanup = stopGame;
}