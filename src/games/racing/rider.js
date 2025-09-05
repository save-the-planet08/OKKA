export function initRider(canvas, ctx) {
    canvas.width = 800;
    canvas.height = 600;
    
    let gameRunning = true;
    let animationId;
    let score = 0;
    
    const car = {
        x: 100,
        y: canvas.height - 150,
        width: 40,
        height: 20,
        vx: 0,
        vy: 0,
        rotation: 0,
        onGround: false
    };
    
    let cameraX = 0;
    let terrain = [];
    let loops = [];
    
    function generateTerrain() {
        terrain = [];
        for (let x = 0; x < 5000; x += 20) {
            let height = canvas.height - 100 + Math.sin(x * 0.01) * 50;
            
            if (x > 500 && x % 800 === 0) {
                for (let i = 0; i < 360; i += 10) {
                    let loopX = x + i * 2;
                    let loopY = height - 150 + Math.sin(i * Math.PI / 180) * 80;
                    terrain.push({x: loopX, y: loopY, isLoop: true});
                }
            } else {
                terrain.push({x: x, y: height, isLoop: false});
            }
        }
    }
    
    function updatePhysics() {
        if (!gameRunning) return;
        
        car.vy += 0.5;
        car.x += car.vx;
        car.y += car.vy;
        
        car.onGround = false;
        terrain.forEach(point => {
            if (Math.abs(car.x - point.x) < 20 && car.y + car.height/2 > point.y) {
                car.y = point.y - car.height/2;
                car.vy = 0;
                car.onGround = true;
                
                if (car.vx > 1) car.rotation = Math.atan2(point.y - car.y, 20);
            }
        });
        
        cameraX = car.x - canvas.width / 3;
        score = Math.floor(car.x / 10);
    }
    
    function draw() {
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        terrain.forEach((point, index) => {
            let screenX = point.x - cameraX;
            if (screenX > -50 && screenX < canvas.width + 50) {
                if (index === 0) {
                    ctx.moveTo(screenX, point.y);
                } else {
                    ctx.lineTo(screenX, point.y);
                }
                
                if (point.isLoop) {
                    ctx.fillStyle = '#CD853F';
                } else {
                    ctx.fillStyle = '#8B4513';
                }
            }
        });
        ctx.stroke();
        
        ctx.save();
        ctx.translate(car.x - cameraX, car.y);
        ctx.rotate(car.rotation);
        ctx.fillStyle = '#E74C3C';
        ctx.fillRect(-car.width/2, -car.height/2, car.width, car.height);
        
        ctx.fillStyle = '#2C3E50';
        ctx.beginPath();
        ctx.arc(-10, car.height/2, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(10, car.height/2, 6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
        
        ctx.fillStyle = '#FFF';
        ctx.font = '20px Arial';
        ctx.fillText('Score: ' + score, 10, 30);
        ctx.fillText('Speed: ' + Math.abs(car.vx).toFixed(1), 10, 55);
        
        if (!gameRunning) {
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#FFF';
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Crashed!', canvas.width/2, canvas.height/2);
            ctx.font = '24px Arial';
            ctx.fillText('Final Score: ' + score, canvas.width/2, canvas.height/2 + 50);
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
            car.y = canvas.height - 150;
            car.vx = 0;
            car.vy = 0;
            car.rotation = 0;
            cameraX = 0;
            score = 0;
            gameRunning = true;
            return;
        }
        
        if (gameRunning) {
            if (e.key === 'ArrowRight') {
                car.vx += 0.5;
                if (car.vx > 8) car.vx = 8;
            }
            if (e.key === 'ArrowLeft') {
                car.vx -= 0.5;
                if (car.vx < -3) car.vx = -3;
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
    
    generateTerrain();
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    animationId = requestAnimationFrame(gameLoop);
    
    window.currentGameCleanup = stopGame;
}