export function initSlither(canvas, ctx) {
    const WORLD_WIDTH = 2000;
    const WORLD_HEIGHT = 2000;
    
    let camera = { x: 0, y: 0 };
    let mouse = { x: canvas.width/2, y: canvas.height/2 };
    let gameRunning = true;
    let score = 0;
    let animationId = null;
    
    const BOT_NAMES = [
        'SnakeKiller99', 'ProGamer2024', 'DeathViper', 'NinjaSnake', 'VenomStrike',
        'AlphaSlither', 'ShadowHunter', 'BlitzKrieg', 'StealthMode', 'RapidFire'
    ];
    
    let player, bots = [], food = [];
    
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
    
    function initGame() {
        player = new Snake(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, true, 'You');
        bots = [];
        food = [];
        
        for (let i = 0; i < 10; i++) {
            const name = BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];
            const bot = new Snake(Math.random() * WORLD_WIDTH, Math.random() * WORLD_HEIGHT, false, name);
            if (Math.random() < 0.3) {
                for (let j = 0; j < 5; j++) bot.grow();
            }
            bots.push(bot);
        }
        
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
        
        const worldMouseX = mouse.x + camera.x;
        const worldMouseY = mouse.y + camera.y;
        const head = player.segments[0];
        const angle = Math.atan2(worldMouseY - head.y, worldMouseX - head.x);
        player.direction.x = Math.cos(angle);
        player.direction.y = Math.sin(angle);
        
        player.update();
        bots.forEach(bot => bot.update());
        
        const allSnakes = [player, ...bots];
        if (player.checkCollision(allSnakes)) {
            gameRunning = false;
            return;
        }
        
        food = food.filter(f => {
            const head = player.segments[0];
            if (Math.hypot(f.x - head.x, f.y - head.y) < 15) {
                player.grow();
                score += 5;
                
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
        
        ctx.fillStyle = '#0f3460';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
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
        
        ctx.strokeStyle = '#ff6b6b';
        ctx.lineWidth = 3;
        ctx.strokeRect(-camera.x, -camera.y, WORLD_WIDTH, WORLD_HEIGHT);
        
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
        
        bots.forEach(bot => bot.draw());
        player.draw();
        
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
        
        document.removeEventListener('keydown', handleKeyPress);
        canvas.removeEventListener('mousemove', handleMouseMove);
    }
    
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
    
    document.addEventListener('keydown', handleKeyPress);
    canvas.addEventListener('mousemove', handleMouseMove);
    
    initGame();
    animationId = requestAnimationFrame(gameLoop);
    
    window.currentGameCleanup = stopGame;
}