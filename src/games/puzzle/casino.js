export function initCasino(canvas, ctx) {
    canvas.width = 800;
    canvas.height = 600;
    
    let gameRunning = true;
    let animationId;
    let money = 1000;
    let bet = 50;
    
    const symbols = ['🍒', '🍋', '🍊', '⭐', '💎', '🍀', '7️⃣'];
    const payouts = { '🍒': 2, '🍋': 3, '🍊': 4, '⭐': 5, '💎': 10, '🍀': 15, '7️⃣': 50 };
    
    let reels = [
        { symbols: [0, 1, 2, 3, 4, 5, 6], spinning: false, position: 0, speed: 0, targetPosition: 0 },
        { symbols: [1, 2, 3, 4, 5, 6, 0], spinning: false, position: 0, speed: 0, targetPosition: 0 },
        { symbols: [2, 3, 4, 5, 6, 0, 1], spinning: false, position: 0, speed: 0, targetPosition: 0 }
    ];
    
    let lastWin = 0;
    let spinning = false;
    let winMessage = '';
    let winTimer = 0;
    
    function spin() {
        if (spinning || money < bet) return;
        
        money -= bet;
        spinning = true;
        winMessage = '';
        lastWin = 0;
        
        reels.forEach((reel, index) => {
            reel.spinning = true;
            reel.speed = 20 + Math.random() * 10;
            reel.targetPosition = Math.floor(Math.random() * 7) * 100;
            
            // Stop reels one by one with delay
            setTimeout(() => {
                reel.spinning = false;
            }, 2000 + index * 500);
        });
        
        // Check for win after all reels stop
        setTimeout(() => {
            spinning = false;
            checkWin();
        }, 4000);
    }
    
    function checkWin() {
        let currentSymbols = reels.map(reel => {
            let symbolIndex = Math.floor((reel.position % 700) / 100);
            return symbols[reel.symbols[symbolIndex]];
        });
        
        // Check for three matching symbols
        if (currentSymbols[0] === currentSymbols[1] && currentSymbols[1] === currentSymbols[2]) {
            let symbol = currentSymbols[0];
            lastWin = bet * (payouts[symbol] || 1);
            money += lastWin;
            winMessage = `JACKPOT! ${symbol} ${symbol} ${symbol} - Won ${lastWin}€!`;
            winTimer = 180; // 3 seconds at 60fps
        } else if (currentSymbols[0] === currentSymbols[1] || currentSymbols[1] === currentSymbols[2] || currentSymbols[0] === currentSymbols[2]) {
            // Two matching symbols - smaller win
            lastWin = Math.floor(bet * 0.5);
            money += lastWin;
            winMessage = `Small Win! Won ${lastWin}€!`;
            winTimer = 120;
        } else {
            winMessage = 'Try again!';
            winTimer = 60;
        }
    }
    
    function updateGame() {
        if (!gameRunning) return;
        
        // Update spinning reels
        reels.forEach(reel => {
            if (reel.spinning) {
                reel.position += reel.speed;
                if (reel.position >= 700) reel.position = 0;
            } else if (reel.position !== reel.targetPosition) {
                // Smooth stop to target position
                let diff = reel.targetPosition - reel.position;
                if (Math.abs(diff) < 5) {
                    reel.position = reel.targetPosition;
                } else {
                    reel.position += diff * 0.1;
                }
            }
        });
        
        if (winTimer > 0) winTimer--;
    }
    
    function draw() {
        // Background
        let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#4A0E4E');
        gradient.addColorStop(1, '#2E1065');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Machine frame
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(150, 100, 500, 400);
        ctx.fillStyle = '#B8860B';
        ctx.fillRect(160, 110, 480, 380);
        
        // Reels background
        ctx.fillStyle = '#FFF';
        for (let i = 0; i < 3; i++) {
            ctx.fillRect(190 + i * 140, 150, 100, 300);
        }
        
        // Draw reels
        for (let i = 0; i < 3; i++) {
            let reel = reels[i];
            
            // Clip to reel area
            ctx.save();
            ctx.beginPath();
            ctx.rect(190 + i * 140, 150, 100, 300);
            ctx.clip();
            
            // Draw symbols
            for (let j = -1; j <= 4; j++) {
                let symbolIndex = Math.floor(((reel.position + j * 100) % 700) / 100);
                if (symbolIndex < 0) symbolIndex += 7;
                let symbol = symbols[reel.symbols[symbolIndex]];
                
                ctx.font = '60px Arial';
                ctx.textAlign = 'center';
                ctx.fillStyle = '#000';
                let y = 220 + j * 100 - (reel.position % 100);
                ctx.fillText(symbol, 240 + i * 140, y);
            }
            
            ctx.restore();
            
            // Reel borders
            ctx.strokeStyle = '#B8860B';
            ctx.lineWidth = 4;
            ctx.strokeRect(190 + i * 140, 150, 100, 300);
        }
        
        // Winning line
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 3;
        ctx.setLineDash([10, 5]);
        ctx.beginPath();
        ctx.moveTo(190, 300);
        ctx.lineTo(610, 300);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // UI Elements
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(200, 50, 400, 40);
        ctx.fillStyle = '#000';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('CASINO SLOT MACHINE', canvas.width/2, 75);
        
        // Money and bet display
        ctx.fillStyle = '#FFF';
        ctx.font = '20px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Money: ${money}€`, 50, 550);
        ctx.fillText(`Bet: ${bet}€`, 50, 575);
        
        // Spin button
        let buttonColor = (spinning || money < bet) ? '#666' : '#4CAF50';
        ctx.fillStyle = buttonColor;
        ctx.fillRect(600, 520, 120, 60);
        ctx.fillStyle = '#FFF';
        ctx.font = '18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('SPIN', 660, 555);
        
        // Bet controls
        ctx.fillStyle = '#FF9800';
        ctx.fillRect(250, 520, 60, 30);
        ctx.fillRect(250, 550, 60, 30);
        ctx.fillStyle = '#FFF';
        ctx.font = '16px Arial';
        ctx.fillText('BET+', 280, 540);
        ctx.fillText('BET-', 280, 570);
        
        // Win message
        if (winTimer > 0) {
            ctx.fillStyle = 'rgba(0,0,0,0.8)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = lastWin > 0 ? '#FFD700' : '#FFF';
            ctx.font = '36px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(winMessage, canvas.width/2, canvas.height/2);
        }
        
        // Instructions
        ctx.fillStyle = '#FFF';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Click SPIN to play! Adjust bet with BET+/BET- buttons', canvas.width/2, 30);
    }
    
    function gameLoop() {
        updateGame();
        draw();
        animationId = requestAnimationFrame(gameLoop);
    }
    
    function handleClick(e) {
        const rect = canvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        
        // Spin button
        if (x >= 600 && x <= 720 && y >= 520 && y <= 580) {
            spin();
        }
        
        // Bet+ button
        if (x >= 250 && x <= 310 && y >= 520 && y <= 550) {
            if (bet < money && bet < 500) bet += 10;
        }
        
        // Bet- button
        if (x >= 250 && x <= 310 && y >= 550 && y <= 580) {
            if (bet > 10) bet -= 10;
        }
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