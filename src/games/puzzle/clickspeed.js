export function initClickSpeed(canvas, ctx) {
    canvas.width = 800;
    canvas.height = 600;
    
    let gameRunning = true;
    let animationId;
    let clicks = 0;
    let timeLeft = 10;
    let gameStarted = false;
    let gameEnded = false;
    let bestScore = localStorage.getItem('clickSpeedBest') || 0;
    let particles = [];
    
    function startGame() {
        clicks = 0;
        timeLeft = 10;
        gameStarted = true;
        gameEnded = false;
        particles = [];
    }
    
    function updateGame() {
        if (!gameRunning) return;
        
        if (gameStarted && !gameEnded) {
            timeLeft -= 1/60; // 60 FPS
            
            if (timeLeft <= 0) {
                timeLeft = 0;
                gameEnded = true;
                
                if (clicks > bestScore) {
                    bestScore = clicks;
                    localStorage.setItem('clickSpeedBest', bestScore);
                }
            }
        }
        
        // Update particles
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.1;
            particle.life--;
        });
        particles = particles.filter(p => p.life > 0);
    }
    
    function draw() {
        // Background
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#1e3c72');
        gradient.addColorStop(1, '#2a5298');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Title
        ctx.fillStyle = '#FFF';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Click Speed Test', canvas.width/2, 80);
        
        if (!gameStarted) {
            // Start screen
            ctx.font = '24px Arial';
            ctx.fillText('Test your clicking speed!', canvas.width/2, 150);
            ctx.fillText('Click as many times as you can in 10 seconds', canvas.width/2, 180);
            
            // Start button
            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(canvas.width/2 - 100, 250, 200, 60);
            ctx.fillStyle = '#FFF';
            ctx.font = '24px Arial';
            ctx.fillText('START', canvas.width/2, 285);
            
            ctx.font = '20px Arial';
            ctx.fillText(`Best Score: ${bestScore} clicks`, canvas.width/2, 350);
            
        } else if (!gameEnded) {
            // Game screen
            ctx.font = '72px Arial';
            ctx.fillStyle = '#FFD700';
            ctx.fillText(clicks.toString(), canvas.width/2, 200);
            
            ctx.font = '32px Arial';
            ctx.fillStyle = '#FFF';
            ctx.fillText('clicks', canvas.width/2, 240);
            
            // Time left
            ctx.font = '36px Arial';
            ctx.fillStyle = timeLeft <= 3 ? '#FF4444' : '#FFF';
            ctx.fillText(`Time: ${timeLeft.toFixed(1)}s`, canvas.width/2, 320);
            
            // Click area
            const pulseSize = Math.sin(Date.now() * 0.01) * 10;
            ctx.fillStyle = '#FF6B6B';
            ctx.beginPath();
            ctx.arc(canvas.width/2, 420, 80 + pulseSize, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#FFF';
            ctx.font = '20px Arial';
            ctx.fillText('CLICK HERE!', canvas.width/2, 425);
            
        } else {
            // Results screen
            ctx.font = '48px Arial';
            ctx.fillStyle = '#FFD700';
            ctx.fillText(`${clicks} Clicks!`, canvas.width/2, 180);
            
            const cps = (clicks / 10).toFixed(1);
            ctx.font = '24px Arial';
            ctx.fillStyle = '#FFF';
            ctx.fillText(`${cps} clicks per second`, canvas.width/2, 220);
            
            // Performance rating
            let rating = 'Beginner';
            let color = '#95A5A6';
            if (clicks >= 100) { rating = 'Lightning!'; color = '#9B59B6'; }
            else if (clicks >= 80) { rating = 'Excellent!'; color = '#E74C3C'; }
            else if (clicks >= 60) { rating = 'Great!'; color = '#E67E22'; }
            else if (clicks >= 40) { rating = 'Good'; color = '#F39C12'; }
            else if (clicks >= 20) { rating = 'Average'; color = '#3498DB'; }
            
            ctx.fillStyle = color;
            ctx.fillText(rating, canvas.width/2, 260);
            
            if (clicks > bestScore) {
                ctx.fillStyle = '#2ECC71';
                ctx.fillText('NEW BEST SCORE!', canvas.width/2, 300);
            } else {
                ctx.fillStyle = '#BDC3C7';
                ctx.fillText(`Best: ${bestScore}`, canvas.width/2, 300);
            }
            
            // Play again button
            ctx.fillStyle = '#3498DB';
            ctx.fillRect(canvas.width/2 - 100, 350, 200, 50);
            ctx.fillStyle = '#FFF';
            ctx.font = '20px Arial';
            ctx.fillText('PLAY AGAIN', canvas.width/2, 380);
        }
        
        // Draw particles
        particles.forEach(particle => {
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = particle.life / 30;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;
        
        ctx.textAlign = 'left';
    }
    
    function handleClick(e) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (!gameStarted) {
            // Start button
            if (x >= canvas.width/2 - 100 && x <= canvas.width/2 + 100 && 
                y >= 250 && y <= 310) {
                startGame();
            }
        } else if (!gameEnded) {
            // Click counting
            clicks++;
            
            // Create particles
            for (let i = 0; i < 3; i++) {
                particles.push({
                    x: x + (Math.random() - 0.5) * 40,
                    y: y + (Math.random() - 0.5) * 40,
                    vx: (Math.random() - 0.5) * 4,
                    vy: Math.random() * -3 - 1,
                    life: 30,
                    color: `hsl(${Math.random() * 360}, 80%, 60%)`
                });
            }
        } else {
            // Play again button
            if (x >= canvas.width/2 - 100 && x <= canvas.width/2 + 100 && 
                y >= 350 && y <= 400) {
                gameStarted = false;
                gameEnded = false;
            }
        }
    }
    
    function gameLoop() {
        updateGame();
        draw();
        animationId = requestAnimationFrame(gameLoop);
    }
    
    function stopGame() {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        canvas.removeEventListener('click', handleClick);
    }
    
    canvas.addEventListener('click', handleClick);
    animationId = requestAnimationFrame(gameLoop);
    
    window.currentGameCleanup = stopGame;
}