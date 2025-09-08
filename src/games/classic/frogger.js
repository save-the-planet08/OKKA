export function initFrogger(canvas, ctx) {
    const GRID_SIZE = 40;
    const ROWS = Math.floor(canvas.height / GRID_SIZE);
    const COLS = Math.floor(canvas.width / GRID_SIZE);
    
    let frog = { x: Math.floor(COLS/2), y: ROWS - 1 };
    let cars = [];
    let logs = [];
    let score = 0;
    let lives = 3;
    let gameRunning = true;
    let animationId = null;
    let gameTime = 0;
    
    function initLevel() {
        cars = [];
        logs = [];
        
        for (let row = ROWS - 6; row >= ROWS - 10; row--) {
            const direction = (row % 2 === 0) ? 1 : -1;
            const speed = (1 + Math.random() * 2) * 0.7;
            
            for (let i = 0; i < 3; i++) {
                cars.push({
                    x: (i * COLS/3 + Math.random() * COLS/3) % COLS,
                    y: row,
                    direction: direction,
                    speed: speed,
                    width: 2
                });
            }
        }
        
        for (let row = ROWS - 11; row >= ROWS - 15; row--) {
            const direction = (row % 2 === 0) ? 1 : -1;
            const speed = 0.5 + Math.random() * 1;
            
            for (let i = 0; i < 2; i++) {
                logs.push({
                    x: (i * COLS/2 + Math.random() * COLS/2) % COLS,
                    y: row,
                    direction: direction,
                    speed: speed,
                    width: 3
                });
            }
        }
    }
    
    function updateGame() {
        gameTime++;
        
        cars.forEach(car => {
            car.x += car.direction * car.speed * 0.1;
            if (car.direction > 0 && car.x > COLS) car.x = -car.width;
            if (car.direction < 0 && car.x < -car.width) car.x = COLS;
        });
        
        logs.forEach(log => {
            log.x += log.direction * log.speed * 0.1;
            if (log.direction > 0 && log.x > COLS) log.x = -log.width;
            if (log.direction < 0 && log.x < -log.width) log.x = COLS;
        });
        
        const frogRow = frog.y;
        if (frogRow >= ROWS - 15 && frogRow <= ROWS - 11) {
            let onLog = false;
            logs.forEach(log => {
                if (log.y === frogRow && 
                    frog.x >= log.x && frog.x < log.x + log.width) {
                    onLog = true;
                    frog.x += log.direction * log.speed * 0.1;
                    
                    if (frog.x < 0) frog.x = 0;
                    if (frog.x >= COLS) frog.x = COLS - 1;
                }
            });
            
            if (!onLog) {
                lives--;
                resetFrog();
                if (lives <= 0) gameRunning = false;
            }
        }
        
        cars.forEach(car => {
            if (car.y === frog.y && 
                frog.x >= car.x && frog.x < car.x + car.width) {
                lives--;
                resetFrog();
                if (lives <= 0) gameRunning = false;
            }
        });
        
        if (frog.y <= 2) {
            score += 100;
            resetFrog();
        }
    }
    
    function resetFrog() {
        frog.x = Math.floor(COLS/2);
        frog.y = ROWS - 1;
    }
    
    function draw() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#333';
        ctx.fillRect(0, (ROWS - 10) * GRID_SIZE, canvas.width, 5 * GRID_SIZE);
        
        ctx.fillStyle = '#0066CC';
        ctx.fillRect(0, (ROWS - 15) * GRID_SIZE, canvas.width, 5 * GRID_SIZE);
        
        ctx.fillStyle = '#00AA00';
        ctx.fillRect(0, 0, canvas.width, 2 * GRID_SIZE);
        ctx.fillRect(0, (ROWS - 5) * GRID_SIZE, canvas.width, 5 * GRID_SIZE);
        
        cars.forEach(car => {
            // Car body with gradient effect
            const gradient = ctx.createLinearGradient(
                car.x * GRID_SIZE, 
                car.y * GRID_SIZE + 5,
                car.x * GRID_SIZE, 
                car.y * GRID_SIZE + GRID_SIZE - 5
            );
            gradient.addColorStop(0, '#FF4444');
            gradient.addColorStop(0.5, '#FF0000');
            gradient.addColorStop(1, '#CC0000');
            ctx.fillStyle = gradient;
            ctx.fillRect(
                car.x * GRID_SIZE, 
                car.y * GRID_SIZE + 5, 
                car.width * GRID_SIZE - 5, 
                GRID_SIZE - 10
            );
            
            // Car windows
            ctx.fillStyle = '#444488';
            ctx.fillRect(
                car.x * GRID_SIZE + 3, 
                car.y * GRID_SIZE + 8, 
                car.width * GRID_SIZE - 11, 
                8
            );
            
            // Car highlights
            ctx.fillStyle = '#FFAAAA';
            ctx.fillRect(
                car.x * GRID_SIZE + 2, 
                car.y * GRID_SIZE + 6, 
                car.width * GRID_SIZE - 9, 
                2
            );
        });
        
        logs.forEach(log => {
            // Log body with wood texture
            const gradient = ctx.createLinearGradient(
                log.x * GRID_SIZE, 
                log.y * GRID_SIZE + 8,
                log.x * GRID_SIZE, 
                log.y * GRID_SIZE + GRID_SIZE - 8
            );
            gradient.addColorStop(0, '#CD853F');
            gradient.addColorStop(0.5, '#8B4513');
            gradient.addColorStop(1, '#654321');
            ctx.fillStyle = gradient;
            ctx.fillRect(
                log.x * GRID_SIZE, 
                log.y * GRID_SIZE + 8, 
                log.width * GRID_SIZE - 5, 
                GRID_SIZE - 16
            );
            
            // Wood rings
            ctx.strokeStyle = '#654321';
            ctx.lineWidth = 1;
            for (let i = 0; i < log.width; i++) {
                ctx.beginPath();
                ctx.arc(
                    (log.x + i + 0.5) * GRID_SIZE, 
                    log.y * GRID_SIZE + GRID_SIZE / 2, 
                    8, 0, Math.PI * 2
                );
                ctx.stroke();
            }
        });
        
        // Frog body
        ctx.fillStyle = '#00CC00';
        ctx.fillRect(
            frog.x * GRID_SIZE + 8, 
            frog.y * GRID_SIZE + 8, 
            GRID_SIZE - 16, 
            GRID_SIZE - 16
        );
        
        // Frog highlights
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(
            frog.x * GRID_SIZE + 10, 
            frog.y * GRID_SIZE + 10, 
            GRID_SIZE - 20, 
            4
        );
        
        // Frog eyes
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(
            frog.x * GRID_SIZE + 12, 
            frog.y * GRID_SIZE + 10, 
            4, 4
        );
        ctx.fillRect(
            frog.x * GRID_SIZE + GRID_SIZE - 16, 
            frog.y * GRID_SIZE + 10, 
            4, 4
        );
        ctx.fillStyle = '#000000';
        ctx.fillRect(
            frog.x * GRID_SIZE + 14, 
            frog.y * GRID_SIZE + 12, 
            2, 2
        );
        ctx.fillRect(
            frog.x * GRID_SIZE + GRID_SIZE - 14, 
            frog.y * GRID_SIZE + 12, 
            2, 2
        );
        
        ctx.fillStyle = 'white';
        ctx.font = '18px Arial';
        ctx.fillText('Score: ' + score, 10, 25);
        ctx.fillText('Lives: ' + lives, 150, 25);
        
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
            updateGame();
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
    }
    
    function handleKeyPress(e) {
        if (!gameRunning) {
            if (e.key === 'r' || e.key === 'R') {
                score = 0;
                lives = 3;
                gameRunning = true;
                gameTime = 0;
                resetFrog();
                if (animationId) cancelAnimationFrame(animationId);
                initLevel();
                animationId = requestAnimationFrame(gameLoop);
            }
            return;
        }
        
        switch (e.key) {
            case 'ArrowUp':
                if (frog.y > 0) frog.y--;
                break;
            case 'ArrowDown':
                if (frog.y < ROWS - 1) frog.y++;
                break;
            case 'ArrowLeft':
                if (frog.x > 0) frog.x--;
                break;
            case 'ArrowRight':
                if (frog.x < COLS - 1) frog.x++;
                break;
        }
    }
    
    document.addEventListener('keydown', handleKeyPress);
    
    initLevel();
    animationId = requestAnimationFrame(gameLoop);
    
    window.currentGameCleanup = stopGame;
}