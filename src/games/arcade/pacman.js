export function initPacman(canvas, ctx) {
    const CELL_SIZE = 25;
    const ROWS = Math.floor(canvas.height / CELL_SIZE);
    const COLS = Math.floor(canvas.width / CELL_SIZE);
    
    let maze = Array(ROWS).fill().map(() => Array(COLS).fill(0));
    let pacman = { x: 1, y: 1, direction: 'right' };
    let ghosts = [
        { x: COLS-2, y: 1, direction: 'left', color: '#FF0000' },
        { x: COLS-2, y: ROWS-2, direction: 'up', color: '#FFB8FF' },
        { x: 1, y: ROWS-2, direction: 'right', color: '#00FFFF' }
    ];
    let dots = [];
    let score = 0;
    let gameRunning = true;
    let animationId = null;
    let lastMoveTime = 0;
    const moveSpeed = 200;
    
    // Generate simple maze
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (row === 0 || row === ROWS-1 || col === 0 || col === COLS-1) {
                maze[row][col] = 1; // wall
            } else if (row % 4 === 0 && col % 4 === 0) {
                maze[row][col] = 1; // internal walls
            } else {
                maze[row][col] = 0; // path
                if (!(row === 1 && col === 1)) { // not pacman start
                    dots.push({ x: col, y: row });
                }
            }
        }
    }
    
    function isValidMove(x, y) {
        return x >= 0 && x < COLS && y >= 0 && y < ROWS && maze[y][x] !== 1;
    }
    
    function movePacman() {
        let newX = pacman.x, newY = pacman.y;
        
        switch (pacman.direction) {
            case 'up': newY--; break;
            case 'down': newY++; break;
            case 'left': newX--; break;
            case 'right': newX++; break;
        }
        
        if (isValidMove(newX, newY)) {
            pacman.x = newX;
            pacman.y = newY;
            
            // Check dot collision
            dots = dots.filter(dot => {
                if (dot.x === pacman.x && dot.y === pacman.y) {
                    score += 10;
                    return false;
                }
                return true;
            });
            
            // Check win condition
            if (dots.length === 0) {
                gameRunning = false;
            }
        }
    }
    
    function moveGhosts() {
        ghosts.forEach(ghost => {
            const directions = ['up', 'down', 'left', 'right'];
            let newX = ghost.x, newY = ghost.y;
            
            // Simple AI: try to move toward pacman
            const dx = pacman.x - ghost.x;
            const dy = pacman.y - ghost.y;
            
            let preferredDirection;
            if (Math.abs(dx) > Math.abs(dy)) {
                preferredDirection = dx > 0 ? 'right' : 'left';
            } else {
                preferredDirection = dy > 0 ? 'down' : 'up';
            }
            
            // Try preferred direction first, then random
            let attempts = [preferredDirection, ...directions.filter(d => d !== preferredDirection)];
            
            for (let dir of attempts) {
                newX = ghost.x;
                newY = ghost.y;
                
                switch (dir) {
                    case 'up': newY--; break;
                    case 'down': newY++; break;
                    case 'left': newX--; break;
                    case 'right': newX++; break;
                }
                
                if (isValidMove(newX, newY)) {
                    ghost.x = newX;
                    ghost.y = newY;
                    ghost.direction = dir;
                    break;
                }
            }
            
            // Check collision with pacman
            if (ghost.x === pacman.x && ghost.y === pacman.y) {
                gameRunning = false;
            }
        });
    }
    
    function draw() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw maze
        ctx.fillStyle = '#0000FF';
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                if (maze[row][col] === 1) {
                    ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                }
            }
        }
        
        // Draw dots
        ctx.fillStyle = '#FFFF00';
        dots.forEach(dot => {
            ctx.beginPath();
            ctx.arc(dot.x * CELL_SIZE + CELL_SIZE/2, dot.y * CELL_SIZE + CELL_SIZE/2, 3, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Draw pacman
        ctx.fillStyle = '#FFFF00';
        ctx.beginPath();
        ctx.arc(pacman.x * CELL_SIZE + CELL_SIZE/2, pacman.y * CELL_SIZE + CELL_SIZE/2, CELL_SIZE/2 - 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw ghosts
        ghosts.forEach(ghost => {
            ctx.fillStyle = ghost.color;
            ctx.fillRect(ghost.x * CELL_SIZE + 2, ghost.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);
        });
        
        // Draw UI
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Score: ' + score, 10, 25);
        ctx.fillText('Dots: ' + dots.length, 150, 25);
        
        if (!gameRunning) {
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            if (dots.length === 0) {
                ctx.fillText('YOU WIN!', canvas.width/2, canvas.height/2);
            } else {
                ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2);
            }
            ctx.font = '24px Arial';
            ctx.fillText('Press R to restart', canvas.width/2, canvas.height/2 + 50);
            ctx.textAlign = 'left';
        }
    }
    
    function gameLoop(timestamp) {
        if (!gameRunning) return;
        
        if (timestamp - lastMoveTime > moveSpeed) {
            movePacman();
            moveGhosts();
            lastMoveTime = timestamp;
        }
        
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
    }
    
    function handleKeyPress(e) {
        if (!gameRunning) {
            if (e.key === 'r' || e.key === 'R') {
                // Restart game
                pacman = { x: 1, y: 1, direction: 'right' };
                ghosts = [
                    { x: COLS-2, y: 1, direction: 'left', color: '#FF0000' },
                    { x: COLS-2, y: ROWS-2, direction: 'up', color: '#FFB8FF' },
                    { x: 1, y: ROWS-2, direction: 'right', color: '#00FFFF' }
                ];
                dots = [];
                for (let row = 0; row < ROWS; row++) {
                    for (let col = 0; col < COLS; col++) {
                        if (maze[row][col] === 0 && !(row === 1 && col === 1)) {
                            dots.push({ x: col, y: row });
                        }
                    }
                }
                score = 0;
                gameRunning = true;
                lastMoveTime = 0;
                if (animationId) cancelAnimationFrame(animationId);
                animationId = requestAnimationFrame(gameLoop);
            }
            return;
        }
        
        switch (e.key) {
            case 'ArrowUp':
                pacman.direction = 'up';
                break;
            case 'ArrowDown':
                pacman.direction = 'down';
                break;
            case 'ArrowLeft':
                pacman.direction = 'left';
                break;
            case 'ArrowRight':
                pacman.direction = 'right';
                break;
        }
    }
    
    document.addEventListener('keydown', handleKeyPress);
    
    animationId = requestAnimationFrame(gameLoop);
    
    window.currentGameCleanup = stopGame;
}