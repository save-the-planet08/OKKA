export function initStack(canvas, ctx) {
    canvas.width = 800;
    canvas.height = 600;
    
    let gameRunning = true;
    let animationId;
    let score = 0;
    let level = 1;
    let gameOver = false;
    
    let blocks = [];
    let currentBlock = null;
    let baseWidth = 200;
    let blockHeight = 40;
    let speed = 2;
    
    function createBlock(y, width = baseWidth) {
        return {
            x: 0,
            y: y,
            width: width,
            height: blockHeight,
            vx: speed,
            color: `hsl(${(level * 30) % 360}, 70%, 60%)`
        };
    }
    
    function initGame() {
        blocks = [];
        // Base block
        blocks.push({
            x: canvas.width/2 - baseWidth/2,
            y: canvas.height - blockHeight,
            width: baseWidth,
            height: blockHeight,
            vx: 0,
            color: '#4ECDC4'
        });
        
        currentBlock = createBlock(canvas.height - blockHeight * 2);
        score = 0;
        level = 1;
        speed = 2;
        gameOver = false;
    }
    
    function updateGame() {
        if (!gameRunning || gameOver) return;
        
        if (currentBlock) {
            currentBlock.x += currentBlock.vx;
            
            // Bounce off walls
            if (currentBlock.x <= 0 || currentBlock.x + currentBlock.width >= canvas.width) {
                currentBlock.vx = -currentBlock.vx;
            }
        }
    }
    
    function dropBlock() {
        if (!currentBlock || gameOver) return;
        
        const lastBlock = blocks[blocks.length - 1];
        
        // Calculate overlap
        const leftEdge = Math.max(currentBlock.x, lastBlock.x);
        const rightEdge = Math.min(currentBlock.x + currentBlock.width, lastBlock.x + lastBlock.width);
        const overlap = rightEdge - leftEdge;
        
        if (overlap <= 0) {
            // No overlap - game over
            gameOver = true;
            return;
        }
        
        // Create new block with overlap width
        const newBlock = {
            x: leftEdge,
            y: lastBlock.y - blockHeight,
            width: overlap,
            height: blockHeight,
            vx: 0,
            color: currentBlock.color
        };
        
        blocks.push(newBlock);
        score += Math.floor(overlap);
        level++;
        
        // Check for perfect drop bonus
        if (Math.abs(overlap - lastBlock.width) < 5) {
            score += 100;
            // Perfect drops don't reduce width
            newBlock.width = lastBlock.width;
            newBlock.x = lastBlock.x;
        }
        
        // Increase speed every 5 levels
        if (level % 5 === 0) {
            speed += 0.5;
        }
        
        // Create next block if game continues
        if (newBlock.width > 10) {
            currentBlock = createBlock(newBlock.y - blockHeight, newBlock.width);
        } else {
            gameOver = true;
        }
        
        // Camera follow
        if (blocks.length > 10) {
            blocks.shift();
        }
    }
    
    function draw() {
        // Background
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#2C3E50');
        gradient.addColorStop(1, '#34495E');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Calculate camera offset
        let cameraY = 0;
        if (blocks.length > 8) {
            const topBlock = blocks[blocks.length - 1];
            cameraY = (canvas.height - 200) - topBlock.y;
        }
        
        ctx.save();
        ctx.translate(0, cameraY);
        
        // Draw blocks
        blocks.forEach((block, index) => {
            ctx.fillStyle = block.color;
            ctx.fillRect(block.x, block.y, block.width, block.height);
            
            // Add shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(block.x + 2, block.y + 2, block.width, block.height);
            
            // Highlight top edge
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillRect(block.x, block.y, block.width, 2);
        });
        
        // Draw current moving block
        if (currentBlock && !gameOver) {
            ctx.fillStyle = currentBlock.color;
            ctx.fillRect(currentBlock.x, currentBlock.y, currentBlock.width, currentBlock.height);
            
            // Add glow effect
            ctx.shadowColor = currentBlock.color;
            ctx.shadowBlur = 10;
            ctx.fillRect(currentBlock.x, currentBlock.y, currentBlock.width, currentBlock.height);
            ctx.shadowBlur = 0;
            
            // Drop guide
            const lastBlock = blocks[blocks.length - 1];
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(currentBlock.x, currentBlock.y + currentBlock.height);
            ctx.lineTo(currentBlock.x, lastBlock.y);
            ctx.moveTo(currentBlock.x + currentBlock.width, currentBlock.y + currentBlock.height);
            ctx.lineTo(currentBlock.x + currentBlock.width, lastBlock.y);
            ctx.stroke();
            ctx.setLineDash([]);
        }
        
        ctx.restore();
        
        // UI
        ctx.fillStyle = '#FFF';
        ctx.font = '24px Arial';
        ctx.fillText('Score: ' + score, 20, 40);
        ctx.fillText('Level: ' + level, 20, 70);
        ctx.fillText('Speed: ' + speed.toFixed(1), 20, 100);
        
        // Height indicator
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(canvas.width - 30, 50, 20, canvas.height - 100);
        
        if (blocks.length > 1) {
            const height = blocks.length * blockHeight;
            const maxHeight = canvas.height - 100;
            const heightPercent = Math.min(height / 500, 1); // Max visual height
            
            ctx.fillStyle = `hsl(${120 * (1 - heightPercent)}, 80%, 60%)`;
            ctx.fillRect(canvas.width - 30, 50 + maxHeight * (1 - heightPercent), 
                        20, maxHeight * heightPercent);
        }
        
        // Instructions
        ctx.font = '16px Arial';
        ctx.fillText('Click or press SPACE to drop block', 20, canvas.height - 60);
        ctx.fillText('Stack blocks perfectly for bonus points!', 20, canvas.height - 40);
        ctx.fillText('Perfect drops don\'t shrink the block', 20, canvas.height - 20);
        
        if (gameOver) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#FFF';
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Game Over!', canvas.width/2, canvas.height/2 - 50);
            
            ctx.font = '24px Arial';
            ctx.fillText(`Final Score: ${score}`, canvas.width/2, canvas.height/2);
            ctx.fillText(`Height: ${level} blocks`, canvas.width/2, canvas.height/2 + 30);
            ctx.fillText('Press R to restart', canvas.width/2, canvas.height/2 + 80);
            
            ctx.textAlign = 'left';
        }
    }
    
    function gameLoop() {
        updateGame();
        draw();
        animationId = requestAnimationFrame(gameLoop);
    }
    
    function handleInput() {
        dropBlock();
    }
    
    function handleKeyPress(e) {
        if (e.key === ' ') {
            handleInput();
        } else if (e.key.toLowerCase() === 'r' && gameOver) {
            initGame();
        }
    }
    
    function handleClick() {
        if (!gameOver) {
            handleInput();
        } else {
            initGame();
        }
    }
    
    function stopGame() {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        canvas.removeEventListener('click', handleClick);
        document.removeEventListener('keydown', handleKeyPress);
    }
    
    canvas.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyPress);
    
    initGame();
    animationId = requestAnimationFrame(gameLoop);
    
    window.currentGameCleanup = stopGame;
}