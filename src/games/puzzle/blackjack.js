export function initBlackjack(canvas, ctx) {
    canvas.width = 800;
    canvas.height = 600;
    
    let gameRunning = true;
    let animationId;
    let money = 1000;
    let bet = 50;
    let gameState = 'betting'; // 'betting', 'playing', 'dealer', 'finished'
    
    const suits = ['♠', '♥', '♦', '♣'];
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    
    let deck = [];
    let playerHand = [];
    let dealerHand = [];
    let playerScore = 0;
    let dealerScore = 0;
    let message = '';
    let lastWin = 0;
    
    function createDeck() {
        deck = [];
        for (let suit of suits) {
            for (let rank of ranks) {
                deck.push({ suit, rank });
            }
        }
        // Shuffle deck
        for (let i = deck.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }
    
    function getCardValue(card) {
        if (card.rank === 'A') return 11;
        if (['J', 'Q', 'K'].includes(card.rank)) return 10;
        return parseInt(card.rank);
    }
    
    function calculateScore(hand) {
        let score = 0;
        let aces = 0;
        
        for (let card of hand) {
            if (card.rank === 'A') {
                aces++;
                score += 11;
            } else if (['J', 'Q', 'K'].includes(card.rank)) {
                score += 10;
            } else {
                score += parseInt(card.rank);
            }
        }
        
        // Handle aces
        while (score > 21 && aces > 0) {
            score -= 10;
            aces--;
        }
        
        return score;
    }
    
    function dealCard(hand) {
        if (deck.length > 0) {
            hand.push(deck.pop());
        }
    }
    
    function startNewGame() {
        if (money < bet) {
            message = 'Not enough money!';
            return;
        }
        
        money -= bet;
        createDeck();
        playerHand = [];
        dealerHand = [];
        
        // Deal initial cards
        dealCard(playerHand);
        dealCard(dealerHand);
        dealCard(playerHand);
        dealCard(dealerHand);
        
        playerScore = calculateScore(playerHand);
        dealerScore = calculateScore(dealerHand);
        
        gameState = 'playing';
        message = 'Hit or Stand?';
        
        // Check for blackjack
        if (playerScore === 21) {
            gameState = 'dealer';
            dealerTurn();
        }
    }
    
    function hit() {
        if (gameState !== 'playing') return;
        
        dealCard(playerHand);
        playerScore = calculateScore(playerHand);
        
        if (playerScore > 21) {
            gameState = 'finished';
            message = 'Bust! You lose!';
            lastWin = 0;
        } else if (playerScore === 21) {
            gameState = 'dealer';
            dealerTurn();
        }
    }
    
    function stand() {
        if (gameState !== 'playing') return;
        gameState = 'dealer';
        dealerTurn();
    }
    
    function dealerTurn() {
        dealerScore = calculateScore(dealerHand);
        
        let dealerInterval = setInterval(() => {
            if (dealerScore < 17) {
                dealCard(dealerHand);
                dealerScore = calculateScore(dealerHand);
            } else {
                clearInterval(dealerInterval);
                endGame();
            }
        }, 1000);
    }
    
    function endGame() {
        gameState = 'finished';
        
        if (dealerScore > 21) {
            message = 'Dealer busts! You win!';
            lastWin = bet * 2;
            money += lastWin;
        } else if (playerScore > dealerScore) {
            message = 'You win!';
            lastWin = bet * 2;
            money += lastWin;
        } else if (playerScore === dealerScore) {
            message = 'Push! Bet returned.';
            lastWin = bet;
            money += lastWin;
        } else {
            message = 'Dealer wins!';
            lastWin = 0;
        }
        
        setTimeout(() => {
            gameState = 'betting';
            message = 'Place your bet and start new game';
        }, 3000);
    }
    
    function drawCard(card, x, y, faceDown = false) {
        // Card background
        ctx.fillStyle = faceDown ? '#000080' : '#FFF';
        ctx.fillRect(x, y, 60, 90);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, 60, 90);
        
        if (!faceDown) {
            // Card text
            ctx.fillStyle = (card.suit === '♥' || card.suit === '♦') ? '#FF0000' : '#000000';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(card.rank, x + 30, y + 25);
            ctx.font = '24px Arial';
            ctx.fillText(card.suit, x + 30, y + 55);
        } else {
            // Face down pattern
            ctx.fillStyle = '#FFD700';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('?', x + 30, y + 50);
        }
    }
    
    function draw() {
        // Background
        let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#0F5132');
        gradient.addColorStop(1, '#198754');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Title
        ctx.fillStyle = '#FFD700';
        ctx.font = '32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('BLACKJACK', canvas.width/2, 40);
        
        // Money and bet
        ctx.fillStyle = '#FFF';
        ctx.font = '20px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Money: ${money}€`, 50, 100);
        ctx.fillText(`Bet: ${bet}€`, 50, 125);
        
        // Dealer's hand
        ctx.fillStyle = '#FFF';
        ctx.font = '18px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Dealer:', 50, 200);
        for (let i = 0; i < dealerHand.length; i++) {
            let faceDown = (gameState === 'playing' && i === 1);
            drawCard(dealerHand[i], 150 + i * 70, 180, faceDown);
        }
        
        if (gameState !== 'playing') {
            ctx.fillText(`Score: ${dealerScore}`, 50, 300);
        }
        
        // Player's hand
        ctx.fillText('Player:', 50, 350);
        for (let i = 0; i < playerHand.length; i++) {
            drawCard(playerHand[i], 150 + i * 70, 330);
        }
        ctx.fillText(`Score: ${playerScore}`, 50, 450);
        
        // Buttons
        if (gameState === 'betting') {
            // New game button
            ctx.fillStyle = money >= bet ? '#4CAF50' : '#666';
            ctx.fillRect(300, 500, 120, 40);
            ctx.fillStyle = '#FFF';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('NEW GAME', 360, 525);
            
            // Bet controls
            ctx.fillStyle = '#FF9800';
            ctx.fillRect(450, 500, 60, 20);
            ctx.fillRect(450, 520, 60, 20);
            ctx.fillStyle = '#FFF';
            ctx.font = '12px Arial';
            ctx.fillText('BET+', 480, 514);
            ctx.fillText('BET-', 480, 534);
        } else if (gameState === 'playing') {
            // Hit button
            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(250, 500, 80, 40);
            ctx.fillStyle = '#FFF';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('HIT', 290, 525);
            
            // Stand button
            ctx.fillStyle = '#FF5722';
            ctx.fillRect(350, 500, 80, 40);
            ctx.fillStyle = '#FFF';
            ctx.fillText('STAND', 390, 525);
        }
        
        // Message
        ctx.fillStyle = '#FFD700';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(message, canvas.width/2, 480);
        
        // Instructions
        ctx.fillStyle = '#FFF';
        ctx.font = '14px Arial';
        ctx.fillText('Get as close to 21 as possible without going over!', canvas.width/2, 570);
    }
    
    function gameLoop() {
        draw();
        animationId = requestAnimationFrame(gameLoop);
    }
    
    function handleClick(e) {
        const rect = canvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        
        if (gameState === 'betting') {
            // New game button
            if (x >= 300 && x <= 420 && y >= 500 && y <= 540) {
                startNewGame();
            }
            
            // Bet+ button
            if (x >= 450 && x <= 510 && y >= 500 && y <= 520) {
                if (bet < money && bet < 500) bet += 10;
            }
            
            // Bet- button
            if (x >= 450 && x <= 510 && y >= 520 && y <= 540) {
                if (bet > 10) bet -= 10;
            }
        } else if (gameState === 'playing') {
            // Hit button
            if (x >= 250 && x <= 330 && y >= 500 && y <= 540) {
                hit();
            }
            
            // Stand button
            if (x >= 350 && x <= 430 && y >= 500 && y <= 540) {
                stand();
            }
        }
    }
    
    function stopGame() {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        canvas.removeEventListener('click', handleClick);
    }
    
    // Initialize
    message = 'Place your bet and start new game';
    canvas.addEventListener('click', handleClick);
    animationId = requestAnimationFrame(gameLoop);
    
    window.currentGameCleanup = stopGame;
}