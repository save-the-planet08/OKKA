export function initDuckHunt(canvas, ctx) {
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
    
    function spawnDucks() {
        ducks = [];
        let duckCount = Math.min(2 + Math.floor(round / 3), 5);
        
        for (let i = 0; i < duckCount; i++) {
            ducks.push({
                x: Math.random() * canvas.width,
                y: canvas.height - 150 + Math.random() * 100,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 2,
                width: 40,
                height: 30,
                alive: true,
                flightPattern: Math.floor(Math.random() * 3)
            });
        }
        
        shotsLeft = 3;
        ducksShot = 0;
    }
    
    function updateGame() {
        if (!gameRunning) return;
        
        ducks.forEach(duck => {
            if (!duck.alive) return;
            
            duck.x += duck.vx;
            duck.y += duck.vy;
            
            switch(duck.flightPattern) {
                case 0: // Straight line
                    break;
                case 1: // Sine wave
                    duck.y += Math.sin(Date.now() * 0.01) * 0.5;
                    break;
                case 2: // Random direction changes
                    if (Math.random() < 0.02) {
                        duck.vx += (Math.random() - 0.5) * 0.5;
                        duck.vy += (Math.random() - 0.5) * 0.5;
                    }
                    break;
            }
            
            if (duck.x <= 0 || duck.x >= canvas.width - duck.width) {
                duck.vx = -duck.vx;
            }
            if (duck.y <= 0 || duck.y >= canvas.height - 200) {
                duck.vy = -duck.vy;
            }
            
            duck.x = Math.max(0, Math.min(canvas.width - duck.width, duck.x));
            duck.y = Math.max(0, Math.min(canvas.height - 200, duck.y));
        });
        
        let aliveDucks = ducks.filter(duck => duck.alive).length;
        if (aliveDucks === 0 || shotsLeft === 0) {
            setTimeout(() => {
                round++;
                spawnDucks();
            }, 1000);
        }
    }
    
    function draw() {
        let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#98FB98');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        for (let i = 0; i < 5; i++) {
            let x = (Date.now() * 0.01 + i * 150) % (canvas.width + 100);
            ctx.beginPath();
            ctx.arc(x, 50 + i * 30, 20, 0, Math.PI * 2);
            ctx.arc(x + 25, 50 + i * 30, 25, 0, Math.PI * 2);
            ctx.arc(x + 50, 50 + i * 30, 20, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.fillStyle = '#228B22';
        ctx.fillRect(0, canvas.height - 150, canvas.width, 150);
        
        ctx.fillStyle = '#8B4513';
        for (let x = 50; x < canvas.width; x += 120) {
            ctx.fillRect(x, canvas.height - 200, 20, 50);
            
            ctx.fillStyle = '#228B22';
            ctx.beginPath();
            ctx.arc(x + 10, canvas.height - 220, 30, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#8B4513';
        }
        
        ducks.forEach(duck => {
            if (duck.alive) {
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(duck.x, duck.y, duck.width, duck.height);
                
                ctx.fillStyle = '#654321';
                ctx.beginPath();
                ctx.arc(duck.x + duck.width - 10, duck.y + 10, 12, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = '#A0522D';
                let wingOffset = Math.sin(Date.now() * 0.02) * 5;
                ctx.fillRect(duck.x + 10, duck.y + 5 + wingOffset, 15, 8);
                
                ctx.fillStyle = '#FFA500';
                ctx.fillRect(duck.x + duck.width - 5, duck.y + 8, 8, 4);
            }
        });
        
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
        
        ctx.fillStyle = '#000';
        ctx.font = '24px Arial';
        ctx.fillText('Score: ' + score, 10, 30);
        ctx.fillText('Round: ' + round, 10, 60);
        ctx.fillText('Shots: ' + shotsLeft, 10, 90);
        ctx.fillText('Ducks: ' + ducks.filter(d => d.alive).length, 10, 120);
        
        ctx.font = '16px Arial';
        ctx.fillText('Move mouse to aim, click to shoot', 10, canvas.height - 20);
        
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
            score = 0;
            round = 1;
            ducksShot = 0;
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