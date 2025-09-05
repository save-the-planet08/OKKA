export function initHillClimbRacing(canvas, ctx) {
    canvas.width = 800;
    canvas.height = 600;
    
    let gameRunning = true;
    let animationId;
    let score = 0;
    let fuel = 100;
    
    const car = {
        x: 100,
        y: 400,
        width: 60,
        height: 30,
        vx: 0,
        vy: 0,
        rotation: 0,
        onGround: false
    };
    
    let cameraX = 0;
    let hills = [];
    
    function generateHills() {
        hills = [];
        let y = canvas.height - 100;
        
        for (let x = 0; x < 3000; x += 30) {
            y += (Math.random() - 0.5) * 40;
            y = Math.max(200, Math.min(canvas.height - 50, y));
            
            hills.push({x: x, y: y});
        }
    }
    
    function updatePhysics() {
        if (!gameRunning) return;
        
        car.vy += 0.3;
        car.vx *= 0.99;
        
        car.x += car.vx;
        car.y += car.vy;
        
        car.onGround = false;
        
        for (let i = 0; i < hills.length - 1; i++) {
            let p1 = hills[i];
            let p2 = hills[i + 1];
            
            if (car.x >= p1.x && car.x <= p2.x) {
                let ratio = (car.x - p1.x) / (p2.x - p1.x);
                let groundY = p1.y + (p2.y - p1.y) * ratio;
                
                if (car.y + car.height/2 >= groundY) {
                    car.y = groundY - car.height/2;
                    car.vy = 0;
                    car.onGround = true;
                    
                    let slope = (p2.y - p1.y) / (p2.x - p1.x);
                    car.rotation = Math.atan(slope);
                    break;
                }
            }
        }
        
        if (Math.abs(car.rotation) > Math.PI/2 && car.onGround) {
            gameRunning = false;
        }
        
        cameraX = car.x - canvas.width / 3;
        
        if (car.vx > 0.1) {
            fuel -= 0.05;
        }
        
        if (fuel <= 0) {
            gameRunning = false;
        }
        
        score = Math.floor(car.x / 5);
    }
    
    function draw() {
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.moveTo(-cameraX, canvas.height);
        
        hills.forEach(hill => {
            ctx.lineTo(hill.x - cameraX, hill.y);
        });
        
        ctx.lineTo(3000 - cameraX, canvas.height);
        ctx.closePath();
        ctx.fill();
        
        ctx.save();
        ctx.translate(car.x - cameraX, car.y);
        ctx.rotate(car.rotation);
        
        ctx.fillStyle = '#E74C3C';
        ctx.fillRect(-car.width/2, -car.height/2, car.width, car.height);
        
        ctx.fillStyle = '#2C3E50';
        ctx.beginPath();
        ctx.arc(-15, car.height/2, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(15, car.height/2, 10, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
        
        ctx.fillStyle = '#FFF';
        ctx.font = '20px Arial';
        ctx.fillText('Distance: ' + score + 'm', 10, 30);
        
        ctx.fillStyle = '#333';
        ctx.fillRect(10, 50, 200, 20);
        ctx.fillStyle = fuel > 20 ? '#2ECC71' : '#E74C3C';
        ctx.fillRect(10, 50, (fuel / 100) * 200, 20);
        ctx.fillStyle = '#FFF';
        ctx.fillText('Fuel', 10, 85);
        
        if (!gameRunning) {
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#FFF';
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Game Over!', canvas.width/2, canvas.height/2);
            ctx.font = '24px Arial';
            ctx.fillText('Distance: ' + score + 'm', canvas.width/2, canvas.height/2 + 50);
            ctx.fillText('Press R to restart', canvas.width/2, canvas.height/2 + 80);
            ctx.textAlign = 'left';
        }
    }
    
    function gameLoop() {
        updatePhysics();
        draw();
        animationId = requestAnimationFrame(gameLoop);
    }
    
    let keys = {};
    
    function handleKeyDown(e) {
        keys[e.key] = true;
        
        if (!gameRunning && e.key.toLowerCase() === 'r') {
            car.x = 100;
            car.y = 400;
            car.vx = 0;
            car.vy = 0;
            car.rotation = 0;
            cameraX = 0;
            score = 0;
            fuel = 100;
            gameRunning = true;
            return;
        }
        
        if (gameRunning && car.onGround) {
            if (e.key === 'ArrowRight') {
                car.vx += 0.3;
                if (car.vx > 6) car.vx = 6;
            }
            if (e.key === 'ArrowLeft') {
                car.vx -= 0.2;
                if (car.vx < -2) car.vx = -2;
            }
        }
    }
    
    function handleKeyUp(e) {
        keys[e.key] = false;
    }
    
    function stopGame() {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
    }
    
    generateHills();
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    animationId = requestAnimationFrame(gameLoop);
    
    window.currentGameCleanup = stopGame;
}