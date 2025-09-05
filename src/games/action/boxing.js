export const initBoxing = (canvas, ctx) => {
    // Game state variables
    let gameRunning = true;
    let animationId = null;
    let score = 0;
    let health = 100;
    let round = 1;
    let roundTimer = 180000; // 3 minutes per round
    let lastTime = 0;
    
    // Player boxer
    const player = {
        x: 100,
        y: canvas.height - 150,
        width: 60,
        height: 120,
        health: 100,
        isAttacking: false,
        attackTimer: 0,
        isBlocking: false,
        stamina: 100,
        leftPunch: false,
        rightPunch: false
    };
    
    // Opponent boxer
    const opponent = {
        x: canvas.width - 160,
        y: canvas.height - 150,
        width: 60,
        height: 120,
        health: 100,
        isAttacking: false,
        attackTimer: 0,
        isBlocking: false,
        aiTimer: 0,
        aiState: 'idle' // idle, attacking, blocking
    };
    
    // Punch effects
    const punches = [];
    
    function gameLoop(timestamp) {
        if (!gameRunning) return;
        
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        
        update(deltaTime);
        draw();
        
        if (gameRunning) {
            animationId = requestAnimationFrame(gameLoop);
        }
    }
    
    function update(deltaTime) {
        // Update round timer
        roundTimer -= deltaTime;
        if (roundTimer <= 0) {
            nextRound();
        }
        
        // Update player
        if (player.attackTimer > 0) {
            player.attackTimer -= deltaTime;
            if (player.attackTimer <= 0) {
                player.isAttacking = false;
                player.leftPunch = false;
                player.rightPunch = false;
            }
        }
        
        // Regenerate player stamina
        if (player.stamina < 100 && !player.isAttacking) {
            player.stamina = Math.min(100, player.stamina + deltaTime * 0.02);
        }
        
        // Update opponent AI
        updateOpponentAI(deltaTime);
        
        if (opponent.attackTimer > 0) {
            opponent.attackTimer -= deltaTime;
            if (opponent.attackTimer <= 0) {
                opponent.isAttacking = false;
            }
        }
        
        // Check collisions
        checkCollisions();
        
        // Update punch effects
        for (let i = punches.length - 1; i >= 0; i--) {
            punches[i].life -= deltaTime;
            if (punches[i].life <= 0) {
                punches.splice(i, 1);
            }
        }
        
        // Check game over conditions
        if (player.health <= 0) {
            gameRunning = false;
        } else if (opponent.health <= 0) {
            score += round * 1000;
            nextRound();
        }
    }
    
    function updateOpponentAI(deltaTime) {
        opponent.aiTimer += deltaTime;
        
        const distanceToPlayer = Math.abs(player.x - opponent.x);
        
        if (opponent.aiTimer > 1000 + Math.random() * 2000) {
            opponent.aiTimer = 0;
            
            if (distanceToPlayer < 120 && Math.random() < 0.4) {
                // Attack
                opponent.aiState = 'attacking';
                opponent.isAttacking = true;
                opponent.attackTimer = 300;
            } else if (Math.random() < 0.3) {
                // Block
                opponent.aiState = 'blocking';
                opponent.isBlocking = true;
                setTimeout(() => {
                    opponent.isBlocking = false;
                    opponent.aiState = 'idle';
                }, 1000 + Math.random() * 1000);
            } else {
                // Move
                opponent.aiState = 'idle';
                opponent.isBlocking = false;
            }
        }
        
        // Move opponent slightly towards player
        if (!opponent.isAttacking && !opponent.isBlocking) {
            if (distanceToPlayer > 100) {
                opponent.x += distanceToPlayer > player.x ? -0.3 : 0.3;
            }
        }
    }
    
    function checkCollisions() {
        const distanceToOpponent = Math.abs(player.x - opponent.x);
        
        // Player punch hits opponent
        if (player.isAttacking && distanceToOpponent < 80 && !opponent.isBlocking) {
            const damage = 8 + Math.random() * 7;
            opponent.health -= damage;
            opponent.health = Math.max(0, opponent.health);
            score += Math.floor(damage * 10);
            
            // Add punch effect
            punches.push({
                x: opponent.x + opponent.width/2,
                y: opponent.y + 30,
                life: 500,
                type: 'hit'
            });
        }
        
        // Opponent punch hits player
        if (opponent.isAttacking && distanceToOpponent < 80 && !player.isBlocking) {
            const damage = 6 + Math.random() * 5;
            player.health -= damage;
            player.health = Math.max(0, player.health);
            
            // Add punch effect
            punches.push({
                x: player.x + player.width/2,
                y: player.y + 30,
                life: 500,
                type: 'hit'
            });
        }
    }
    
    function nextRound() {
        if (opponent.health <= 0) {
            round++;
            opponent.health = Math.min(100, 80 + round * 5); // Opponents get stronger
            player.health = Math.min(100, player.health + 20); // Heal player between rounds
        }
        player.health = Math.min(100, player.health);
        roundTimer = 180000; // Reset timer
    }
    
    function performPunch(type) {
        if (player.isAttacking || player.stamina < 15) return;
        
        player.isAttacking = true;
        player.attackTimer = 400;
        player.stamina -= 15;
        
        if (type === 'left') {
            player.leftPunch = true;
        } else {
            player.rightPunch = true;
        }
    }
    
    function draw() {
        // Clear canvas
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw boxing ring
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
        
        // Draw ring ropes
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - 200);
        ctx.lineTo(canvas.width, canvas.height - 200);
        ctx.moveTo(0, canvas.height - 120);
        ctx.lineTo(canvas.width, canvas.height - 120);
        ctx.stroke();
        
        // Draw boxers
        drawBoxer(player, '#3498db', true);
        drawBoxer(opponent, '#e74c3c', false);
        
        // Draw punch effects
        ctx.fillStyle = 'yellow';
        for (const punch of punches) {
            const alpha = punch.life / 500;
            ctx.globalAlpha = alpha;
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('POW!', punch.x, punch.y);
        }
        ctx.globalAlpha = 1;
        
        // Draw UI
        drawUI();
        
        // Game over screen
        if (!gameRunning) {
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            
            if (player.health <= 0) {
                ctx.fillText('KNOCKOUT!', canvas.width/2, canvas.height/2);
                ctx.font = '24px Arial';
                ctx.fillText('You got knocked out!', canvas.width/2, canvas.height/2 + 40);
            }
            
            ctx.fillText('Press R to restart', canvas.width/2, canvas.height/2 + 80);
            ctx.textAlign = 'left';
        }
    }
    
    function drawBoxer(boxer, color, isPlayer) {
        // Body
        ctx.fillStyle = color;
        ctx.fillRect(boxer.x, boxer.y, boxer.width, boxer.height);
        
        // Head
        ctx.fillStyle = '#FDBCB4';
        ctx.fillRect(boxer.x + 15, boxer.y - 40, 30, 40);
        
        // Boxing gloves
        ctx.fillStyle = '#8B0000';
        const gloveSize = 20;
        
        if (isPlayer) {
            // Left glove
            let leftX = boxer.x - 10;
            let leftY = boxer.y + 20;
            if (boxer.leftPunch) {
                leftX += 15;
            }
            ctx.fillRect(leftX, leftY, gloveSize, gloveSize);
            
            // Right glove  
            let rightX = boxer.x + boxer.width - 10;
            let rightY = boxer.y + 20;
            if (boxer.rightPunch) {
                rightX += 15;
            }
            ctx.fillRect(rightX, rightY, gloveSize, gloveSize);
        } else {
            // Opponent gloves
            let leftX = boxer.x - 10;
            let rightX = boxer.x + boxer.width - 10;
            let gloveY = boxer.y + 20;
            
            if (boxer.isAttacking) {
                leftX -= 15;
                rightX -= 15;
            }
            
            ctx.fillRect(leftX, gloveY, gloveSize, gloveSize);
            ctx.fillRect(rightX, gloveY, gloveSize, gloveSize);
        }
        
        // Block indicator
        if (boxer.isBlocking) {
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 3;
            ctx.strokeRect(boxer.x - 5, boxer.y - 5, boxer.width + 10, boxer.height + 10);
        }
    }
    
    function drawUI() {
        // Player health bar
        ctx.fillStyle = 'red';
        ctx.fillRect(20, 20, 200, 20);
        ctx.fillStyle = 'green';
        ctx.fillRect(20, 20, (player.health / 100) * 200, 20);
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.fillText('Player Health', 20, 15);
        
        // Opponent health bar
        ctx.fillStyle = 'red';
        ctx.fillRect(canvas.width - 220, 20, 200, 20);
        ctx.fillStyle = 'green';
        ctx.fillRect(canvas.width - 220, 20, (opponent.health / 100) * 200, 20);
        ctx.fillStyle = 'white';
        ctx.fillText('Opponent Health', canvas.width - 220, 15);
        
        // Player stamina bar
        ctx.fillStyle = '#444';
        ctx.fillRect(20, 50, 150, 15);
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(20, 50, (player.stamina / 100) * 150, 15);
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.fillText('Stamina', 20, 45);
        
        // Score and round info
        ctx.fillStyle = 'white';
        ctx.font = '18px Arial';
        ctx.fillText('Score: ' + score, canvas.width/2 - 100, 25);
        ctx.fillText('Round: ' + round, canvas.width/2, 25);
        
        const timeLeft = Math.ceil(roundTimer / 1000);
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        ctx.fillText(`Time: ${minutes}:${seconds.toString().padStart(2, '0')}`, canvas.width/2 + 60, 25);
        
        // Controls
        ctx.font = '12px Arial';
        ctx.fillText('Controls: A/D - Left/Right Punch, S - Block', 20, canvas.height - 20);
    }
    
    function stopGame() {
        gameRunning = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        document.removeEventListener('keydown', handleKeyPress);
        document.removeEventListener('keyup', handleKeyUp);
    }
    
    function handleKeyPress(e) {
        if (!gameRunning && (e.key === 'r' || e.key === 'R')) {
            // Restart game
            gameRunning = true;
            score = 0;
            round = 1;
            roundTimer = 180000;
            player.health = 100;
            player.stamina = 100;
            player.isAttacking = false;
            player.isBlocking = false;
            opponent.health = 100;
            opponent.isAttacking = false;
            opponent.isBlocking = false;
            punches.length = 0;
            
            if (animationId) cancelAnimationFrame(animationId);
            animationId = requestAnimationFrame(gameLoop);
            return;
        }
        
        if (gameRunning) {
            switch(e.key.toLowerCase()) {
                case 'a':
                    performPunch('left');
                    break;
                case 'd':
                    performPunch('right');
                    break;
                case 's':
                    player.isBlocking = true;
                    break;
            }
        }
    }
    
    function handleKeyUp(e) {
        if (gameRunning) {
            switch(e.key.toLowerCase()) {
                case 's':
                    player.isBlocking = false;
                    break;
            }
        }
    }
    
    // Initialize event listeners
    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('keyup', handleKeyUp);
    
    // Start game loop
    animationId = requestAnimationFrame(gameLoop);
    
    // Return cleanup function
    return stopGame;
};