export function initPvPCombat(canvas, ctx) {
    canvas.width = 800;
    canvas.height = 600;
    
    let gameRunning = true;
    let animationId;
    let gameState = 'setup'; // 'setup', 'battle', 'victory'
    
    // Players
    let player1 = {
        x: 150,
        y: 400,
        vx: 0,
        vy: 0,
        width: 30,
        height: 40,
        health: 100,
        maxHealth: 100,
        facing: 1, // 1 = right, -1 = left
        onGround: false,
        weapon: 'pistol',
        ammo: 12,
        maxAmmo: 12,
        reloadTime: 0,
        maxReloadTime: 120, // 2 seconds
        lastShot: 0,
        fireRate: 300, // ms between shots
        kills: 0,
        animFrame: 0,
        muzzleFlash: 0,
        hitEffect: 0,
        color: '#4169E1'
    };
    
    let player2 = {
        x: 650,
        y: 400,
        vx: 0,
        vy: 0,
        width: 30,
        height: 40,
        health: 100,
        maxHealth: 100,
        facing: -1,
        onGround: false,
        weapon: 'pistol',
        ammo: 12,
        maxAmmo: 12,
        reloadTime: 0,
        maxReloadTime: 120,
        lastShot: 0,
        fireRate: 300,
        kills: 0,
        animFrame: 0,
        muzzleFlash: 0,
        hitEffect: 0,
        color: '#E74C3C'
    };
    
    // Game mechanics
    let bullets = [];
    let particles = [];
    let explosions = [];
    let powerUps = [];
    let map = [];
    let roundNumber = 1;
    let maxRounds = 5;
    let roundTimer = 0;
    let maxRoundTime = 180 * 60; // 3 minutes in frames
    
    // Controls
    let keys = {
        // Player 1 (WASD)
        w: false, a: false, s: false, d: false, shift: false,
        // Player 2 (Arrow keys)
        up: false, left: false, down: false, right: false, enter: false
    };
    
    // Weapons
    const weapons = {
        pistol: { damage: 25, fireRate: 300, ammo: 12, spread: 0.1, bulletSpeed: 15, color: '#FFD700' },
        shotgun: { damage: 15, fireRate: 800, ammo: 8, spread: 0.3, bulletSpeed: 12, pellets: 5, color: '#FF4500' },
        rifle: { damage: 35, fireRate: 150, ammo: 30, spread: 0.05, bulletSpeed: 20, color: '#00FF00' },
        rocket: { damage: 75, fireRate: 2000, ammo: 3, spread: 0, bulletSpeed: 8, explosive: true, color: '#FF0000' }
    };
    
    function initializeMap() {
        map = [
            // Ground platforms
            { x: 0, y: 550, width: 800, height: 50, type: 'ground' },
            
            // Lower platforms
            { x: 100, y: 450, width: 150, height: 20, type: 'platform' },
            { x: 550, y: 450, width: 150, height: 20, type: 'platform' },
            
            // Middle platforms
            { x: 200, y: 350, width: 100, height: 20, type: 'platform' },
            { x: 500, y: 350, width: 100, height: 20, type: 'platform' },
            
            // Center elevated platform
            { x: 350, y: 250, width: 100, height: 20, type: 'platform' },
            
            // Cover walls
            { x: 300, y: 480, width: 20, height: 70, type: 'wall' },
            { x: 480, y: 480, width: 20, height: 70, type: 'wall' },
            
            // Upper corner platforms
            { x: 50, y: 200, width: 100, height: 20, type: 'platform' },
            { x: 650, y: 200, width: 100, height: 20, type: 'platform' }
        ];
        
        // Add power-up spawn points
        spawnPowerUp(400, 230); // Center platform
        spawnPowerUp(175, 430); // Lower left
        spawnPowerUp(625, 430); // Lower right
    }
    
    function spawnPowerUp(x, y) {
        let types = ['health', 'ammo', 'weapon'];
        let type = types[Math.floor(Math.random() * types.length)];
        let weaponType = Object.keys(weapons)[Math.floor(Math.random() * Object.keys(weapons).length)];
        
        powerUps.push({
            x: x,
            y: y,
            type: type,
            weaponType: weaponType,
            animFrame: 0,
            respawnTime: 0,
            maxRespawnTime: 600 // 10 seconds
        });
    }
    
    function updateGame() {
        if (!gameRunning || gameState !== 'battle') return;
        
        roundTimer++;
        
        // Update players
        updatePlayer(player1);
        updatePlayer(player2);
        
        // Update bullets
        bullets = bullets.filter(bullet => {
            bullet.x += bullet.vx;
            bullet.y += bullet.vy;
            bullet.life--;
            
            // Check map collisions
            for (let platform of map) {
                if (bullet.x >= platform.x && bullet.x <= platform.x + platform.width &&
                    bullet.y >= platform.y && bullet.y <= platform.y + platform.height) {
                    
                    if (bullet.explosive) {
                        createExplosion(bullet.x, bullet.y, 60);
                    }
                    
                    // Impact particles
                    for (let i = 0; i < 5; i++) {
                        particles.push({
                            x: bullet.x,
                            y: bullet.y,
                            vx: (Math.random() - 0.5) * 6,
                            vy: -Math.random() * 4,
                            life: 30,
                            size: 2,
                            color: '#888888'
                        });
                    }
                    
                    return false;
                }
            }
            
            // Check player collisions
            if (checkBulletPlayerCollision(bullet, player1) && bullet.owner !== 'player1') {
                damagePlayer(player1, bullet.damage);
                if (bullet.explosive) {
                    createExplosion(bullet.x, bullet.y, 60);
                }
                return false;
            }
            
            if (checkBulletPlayerCollision(bullet, player2) && bullet.owner !== 'player2') {
                damagePlayer(player2, bullet.damage);
                if (bullet.explosive) {
                    createExplosion(bullet.x, bullet.y, 60);
                }
                return false;
            }
            
            return bullet.life > 0 && bullet.x >= -50 && bullet.x <= canvas.width + 50 &&
                   bullet.y >= -50 && bullet.y <= canvas.height + 50;
        });
        
        // Update particles
        particles = particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.1; // gravity
            particle.life--;
            particle.size *= 0.98;
            return particle.life > 0;
        });
        
        // Update explosions
        explosions = explosions.filter(explosion => {
            explosion.radius += explosion.expandSpeed;
            explosion.life--;
            explosion.alpha = explosion.life / explosion.maxLife;
            return explosion.life > 0;
        });
        
        // Update power-ups
        powerUps.forEach(powerUp => {
            powerUp.animFrame += 0.1;
            
            if (powerUp.respawnTime > 0) {
                powerUp.respawnTime--;
            }
            
            // Check player pickups
            if (powerUp.respawnTime === 0) {
                if (checkPlayerPowerUpCollision(player1, powerUp)) {
                    applyPowerUp(player1, powerUp);
                    powerUp.respawnTime = powerUp.maxRespawnTime;
                } else if (checkPlayerPowerUpCollision(player2, powerUp)) {
                    applyPowerUp(player2, powerUp);
                    powerUp.respawnTime = powerUp.maxRespawnTime;
                }
            }
        });
        
        // Update visual effects
        player1.muzzleFlash *= 0.8;
        player2.muzzleFlash *= 0.8;
        player1.hitEffect *= 0.9;
        player2.hitEffect *= 0.9;
        
        // Check win conditions
        if (player1.health <= 0) {
            player2.kills++;
            if (player2.kills >= Math.ceil(maxRounds / 2)) {
                gameState = 'victory';
            } else {
                respawnPlayer(player1);
                roundNumber++;
            }
        } else if (player2.health <= 0) {
            player1.kills++;
            if (player1.kills >= Math.ceil(maxRounds / 2)) {
                gameState = 'victory';
            } else {
                respawnPlayer(player2);
                roundNumber++;
            }
        }
        
        // Round time limit
        if (roundTimer >= maxRoundTime) {
            // Draw - reset round
            respawnPlayer(player1);
            respawnPlayer(player2);
            roundNumber++;
        }
    }
    
    function updatePlayer(player) {
        // Reduce reload time
        if (player.reloadTime > 0) {
            player.reloadTime--;
            if (player.reloadTime === 0) {
                player.ammo = player.maxAmmo;
            }
        }
        
        // Apply gravity
        if (!player.onGround) {
            player.vy += 0.5;
        }
        
        // Movement input
        let moveSpeed = 4;
        let jumpPower = 12;
        
        if (player === player1) {
            if (keys.a) {
                player.vx = -moveSpeed;
                player.facing = -1;
                player.animFrame += 0.2;
            } else if (keys.d) {
                player.vx = moveSpeed;
                player.facing = 1;
                player.animFrame += 0.2;
            } else {
                player.vx *= 0.8;
            }
            
            if (keys.w && player.onGround) {
                player.vy = -jumpPower;
                player.onGround = false;
            }
            
            if (keys.s && player.onGround) {
                // Crouch/duck
                player.height = 20;
            } else {
                player.height = 40;
            }
            
            if (keys.shift) {
                shoot(player, 'player1');
            }
        } else {
            if (keys.left) {
                player.vx = -moveSpeed;
                player.facing = -1;
                player.animFrame += 0.2;
            } else if (keys.right) {
                player.vx = moveSpeed;
                player.facing = 1;
                player.animFrame += 0.2;
            } else {
                player.vx *= 0.8;
            }
            
            if (keys.up && player.onGround) {
                player.vy = -jumpPower;
                player.onGround = false;
            }
            
            if (keys.down && player.onGround) {
                // Crouch/duck
                player.height = 20;
            } else {
                player.height = 40;
            }
            
            if (keys.enter) {
                shoot(player, 'player2');
            }
        }
        
        // Update position
        player.x += player.vx;
        player.y += player.vy;
        
        // Platform collisions
        player.onGround = false;
        for (let platform of map) {
            if (player.x < platform.x + platform.width &&
                player.x + player.width > platform.x &&
                player.y < platform.y + platform.height &&
                player.y + player.height > platform.y) {
                
                // Landing on top
                if (player.vy > 0 && player.y < platform.y) {
                    player.y = platform.y - player.height;
                    player.vy = 0;
                    player.onGround = true;
                }
                // Hitting from below
                else if (player.vy < 0 && player.y > platform.y) {
                    player.y = platform.y + platform.height;
                    player.vy = 0;
                }
                // Side collisions
                else if (player.vx > 0 && player.x < platform.x) {
                    player.x = platform.x - player.width;
                    player.vx = 0;
                } else if (player.vx < 0 && player.x > platform.x) {
                    player.x = platform.x + platform.width;
                    player.vx = 0;
                }
            }
        }
        
        // Screen boundaries
        player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
        if (player.y > canvas.height) {
            // Fall death
            damagePlayer(player, 50);
            respawnPlayer(player);
        }
    }
    
    function shoot(player, owner) {
        let currentTime = Date.now();
        let weapon = weapons[player.weapon];
        
        if (currentTime - player.lastShot < weapon.fireRate) return;
        if (player.ammo <= 0) {
            // Auto reload
            if (player.reloadTime === 0) {
                player.reloadTime = player.maxReloadTime;
            }
            return;
        }
        
        player.lastShot = currentTime;
        player.ammo--;
        player.muzzleFlash = 1;
        
        // Calculate bullet spawn position
        let bulletX = player.x + player.width/2 + player.facing * 20;
        let bulletY = player.y + player.height/2;
        
        // Determine target direction
        let targetX, targetY;
        if (player === player1) {
            targetX = player2.x + player2.width/2;
            targetY = player2.y + player2.height/2;
        } else {
            targetX = player1.x + player1.width/2;
            targetY = player1.y + player1.height/2;
        }
        
        let dx = targetX - bulletX;
        let dy = targetY - bulletY;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let angle = Math.atan2(dy, dx);
        
        // Create bullets (multiple for shotgun)
        let pellets = weapon.pellets || 1;
        for (let i = 0; i < pellets; i++) {
            let spreadAngle = angle + (Math.random() - 0.5) * weapon.spread;
            
            bullets.push({
                x: bulletX,
                y: bulletY,
                vx: Math.cos(spreadAngle) * weapon.bulletSpeed,
                vy: Math.sin(spreadAngle) * weapon.bulletSpeed,
                damage: weapon.damage,
                life: 180, // 3 seconds
                owner: owner,
                explosive: weapon.explosive || false,
                color: weapon.color
            });
        }
        
        // Muzzle flash particles
        for (let i = 0; i < 8; i++) {
            particles.push({
                x: bulletX,
                y: bulletY,
                vx: Math.cos(angle + (Math.random() - 0.5) * 0.5) * (3 + Math.random() * 5),
                vy: Math.sin(angle + (Math.random() - 0.5) * 0.5) * (3 + Math.random() * 5),
                life: 15,
                size: 2 + Math.random() * 3,
                color: '#FFD700'
            });
        }
    }
    
    function checkBulletPlayerCollision(bullet, player) {
        return bullet.x >= player.x && bullet.x <= player.x + player.width &&
               bullet.y >= player.y && bullet.y <= player.y + player.height;
    }
    
    function checkPlayerPowerUpCollision(player, powerUp) {
        return player.x < powerUp.x + 20 &&
               player.x + player.width > powerUp.x &&
               player.y < powerUp.y + 20 &&
               player.y + player.height > powerUp.y;
    }
    
    function damagePlayer(player, damage, fromExplosion = false) {
        player.health -= damage;
        player.hitEffect = 1;
        
        // Blood particles
        for (let i = 0; i < 10; i++) {
            particles.push({
                x: player.x + player.width/2,
                y: player.y + player.height/2,
                vx: (Math.random() - 0.5) * 8,
                vy: -Math.random() * 6,
                life: 60,
                size: 2 + Math.random() * 3,
                color: '#8B0000'
            });
        }
        
        if (player.health <= 0) {
            player.health = 0;
            // Only create death explosion if not already from an explosion
            if (!fromExplosion) {
                createExplosion(player.x + player.width/2, player.y + player.height/2, 40);
            }
        }
    }
    
    function createExplosion(x, y, radius) {
        explosions.push({
            x: x,
            y: y,
            radius: 0,
            maxRadius: radius,
            expandSpeed: 3,
            life: 30,
            maxLife: 30,
            alpha: 1
        });
        
        // Explosion particles
        for (let i = 0; i < 20; i++) {
            particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 15,
                vy: (Math.random() - 0.5) * 15,
                life: 45,
                size: 3 + Math.random() * 5,
                color: `hsl(${Math.random() * 60}, 100%, 60%)`
            });
        }
        
        // Damage players in explosion radius
        let p1Distance = Math.sqrt(Math.pow(player1.x + player1.width/2 - x, 2) + Math.pow(player1.y + player1.height/2 - y, 2));
        let p2Distance = Math.sqrt(Math.pow(player2.x + player2.width/2 - x, 2) + Math.pow(player2.y + player2.height/2 - y, 2));
        
        if (p1Distance < radius) {
            damagePlayer(player1, Math.floor(50 * (1 - p1Distance / radius)), true);
        }
        if (p2Distance < radius) {
            damagePlayer(player2, Math.floor(50 * (1 - p2Distance / radius)), true);
        }
    }
    
    function applyPowerUp(player, powerUp) {
        switch(powerUp.type) {
            case 'health':
                player.health = Math.min(player.maxHealth, player.health + 50);
                break;
            case 'ammo':
                player.ammo = player.maxAmmo;
                player.reloadTime = 0;
                break;
            case 'weapon':
                player.weapon = powerUp.weaponType;
                player.ammo = weapons[powerUp.weaponType].ammo;
                player.maxAmmo = weapons[powerUp.weaponType].ammo;
                break;
        }
        
        // Pickup effect
        for (let i = 0; i < 10; i++) {
            particles.push({
                x: powerUp.x + 10,
                y: powerUp.y + 10,
                vx: (Math.random() - 0.5) * 6,
                vy: -Math.random() * 8,
                life: 40,
                size: 2 + Math.random() * 3,
                color: powerUp.type === 'health' ? '#00FF00' : powerUp.type === 'ammo' ? '#FFD700' : '#00FFFF'
            });
        }
    }
    
    function respawnPlayer(player) {
        if (player === player1) {
            player.x = 150;
            player.y = 400;
        } else {
            player.x = 650;
            player.y = 400;
        }
        
        player.health = player.maxHealth;
        player.vx = 0;
        player.vy = 0;
        player.weapon = 'pistol';
        player.ammo = 12;
        player.maxAmmo = 12;
        player.reloadTime = 0;
        roundTimer = 0;
        
        // Respawn effect
        for (let i = 0; i < 15; i++) {
            particles.push({
                x: player.x + player.width/2,
                y: player.y + player.height/2,
                vx: (Math.random() - 0.5) * 10,
                vy: -Math.random() * 10,
                life: 60,
                size: 3 + Math.random() * 4,
                color: player.color
            });
        }
    }
    
    function draw() {
        // Background gradient
        let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#2C3E50');
        gradient.addColorStop(1, '#34495E');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        if (gameState === 'setup') {
            drawSetupScreen();
        } else if (gameState === 'battle') {
            drawBattleScreen();
        } else if (gameState === 'victory') {
            drawVictoryScreen();
        }
    }
    
    function drawSetupScreen() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#FFF';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('⚔️ PVP COMBAT ⚔️', canvas.width/2, 100);
        
        ctx.font = '24px Arial';
        ctx.fillText('Two-Player Battle Arena', canvas.width/2, 150);
        
        // Controls
        ctx.font = '20px Arial';
        ctx.textAlign = 'left';
        ctx.fillStyle = '#4169E1';
        ctx.fillText('Player 1 (Blue):', 100, 220);
        ctx.fillStyle = '#FFF';
        ctx.fillText('WASD - Move & Jump', 120, 250);
        ctx.fillText('SHIFT - Shoot', 120, 280);
        ctx.fillText('S (hold) - Crouch', 120, 310);
        
        ctx.fillStyle = '#E74C3C';
        ctx.fillText('Player 2 (Red):', 450, 220);
        ctx.fillStyle = '#FFF';
        ctx.fillText('Arrow Keys - Move & Jump', 470, 250);
        ctx.fillText('ENTER - Shoot', 470, 280);
        ctx.fillText('DOWN (hold) - Crouch', 470, 310);
        
        // Game info
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFD700';
        ctx.font = '18px Arial';
        ctx.fillText('🎯 Collect power-ups for health, ammo, and weapons!', canvas.width/2, 380);
        ctx.fillText('🏆 First to win 3 rounds wins the match!', canvas.width/2, 410);
        
        // Start button
        ctx.fillStyle = '#27AE60';
        ctx.fillRect(canvas.width/2 - 100, 480, 200, 60);
        ctx.strokeStyle = '#229954';
        ctx.lineWidth = 3;
        ctx.strokeRect(canvas.width/2 - 100, 480, 200, 60);
        
        ctx.fillStyle = '#FFF';
        ctx.font = '28px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('START BATTLE', canvas.width/2, 520);
    }
    
    function drawBattleScreen() {
        // Draw map
        map.forEach(platform => {
            if (platform.type === 'ground') {
                ctx.fillStyle = '#8B4513';
            } else if (platform.type === 'platform') {
                ctx.fillStyle = '#A0A0A0';
            } else if (platform.type === 'wall') {
                ctx.fillStyle = '#696969';
            }
            
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            
            // Platform borders
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
        });
        
        // Draw power-ups
        powerUps.forEach(powerUp => {
            if (powerUp.respawnTime === 0) {
                let bobOffset = Math.sin(powerUp.animFrame) * 3;
                let y = powerUp.y + bobOffset;
                
                ctx.save();
                ctx.translate(powerUp.x + 10, y + 10);
                ctx.rotate(powerUp.animFrame * 0.1);
                
                if (powerUp.type === 'health') {
                    ctx.fillStyle = '#00FF00';
                    ctx.fillRect(-8, -3, 16, 6);
                    ctx.fillRect(-3, -8, 6, 16);
                } else if (powerUp.type === 'ammo') {
                    ctx.fillStyle = '#FFD700';
                    ctx.fillRect(-6, -8, 12, 16);
                } else if (powerUp.type === 'weapon') {
                    ctx.fillStyle = '#00FFFF';
                    ctx.fillRect(-8, -4, 16, 8);
                    ctx.fillRect(6, -6, 4, 12);
                }
                
                ctx.restore();
            } else {
                // Respawn countdown
                let timeLeft = Math.ceil(powerUp.respawnTime / 60);
                ctx.fillStyle = '#FFF';
                ctx.font = '16px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(timeLeft.toString(), powerUp.x + 10, powerUp.y - 5);
            }
        });
        
        // Draw particles
        particles.forEach(particle => {
            ctx.save();
            ctx.globalAlpha = particle.life / 60;
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
        
        // Draw explosions
        explosions.forEach(explosion => {
            ctx.save();
            ctx.globalAlpha = explosion.alpha * 0.6;
            
            // Outer ring
            ctx.strokeStyle = '#FF4500';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
            ctx.stroke();
            
            // Inner fill
            ctx.fillStyle = '#FF6347';
            ctx.globalAlpha = explosion.alpha * 0.3;
            ctx.fill();
            
            ctx.restore();
        });
        
        // Draw bullets
        bullets.forEach(bullet => {
            ctx.save();
            ctx.fillStyle = bullet.color;
            ctx.beginPath();
            ctx.arc(bullet.x, bullet.y, bullet.explosive ? 4 : 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Bullet trail
            ctx.strokeStyle = bullet.color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(bullet.x, bullet.y);
            ctx.lineTo(bullet.x - bullet.vx * 3, bullet.y - bullet.vy * 3);
            ctx.stroke();
            
            ctx.restore();
        });
        
        // Draw players
        drawPlayer(player1);
        drawPlayer(player2);
        
        // Draw UI
        drawBattleUI();
    }
    
    function drawPlayer(player) {
        ctx.save();
        
        // Hit effect
        if (player.hitEffect > 0) {
            ctx.globalAlpha = 1 - player.hitEffect;
        }
        
        // Player body
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);
        
        // Player outline
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(player.x, player.y, player.width, player.height);
        
        // Face direction indicator
        ctx.fillStyle = '#FFF';
        ctx.fillRect(
            player.x + (player.facing > 0 ? player.width - 5 : 0),
            player.y + 5,
            5,
            10
        );
        
        // Weapon
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(player.x + player.width/2, player.y + player.height/2);
        ctx.lineTo(
            player.x + player.width/2 + player.facing * 25,
            player.y + player.height/2
        );
        ctx.stroke();
        
        // Muzzle flash
        if (player.muzzleFlash > 0) {
            ctx.save();
            ctx.globalAlpha = player.muzzleFlash;
            ctx.fillStyle = '#FFFF00';
            ctx.beginPath();
            ctx.arc(
                player.x + player.width/2 + player.facing * 25,
                player.y + player.height/2,
                8,
                0,
                Math.PI * 2
            );
            ctx.fill();
            ctx.restore();
        }
        
        // Health bar
        let barWidth = player.width;
        let barHeight = 4;
        let barY = player.y - 10;
        
        ctx.fillStyle = '#000';
        ctx.fillRect(player.x, barY, barWidth, barHeight);
        
        ctx.fillStyle = player.health > 50 ? '#00FF00' : player.health > 25 ? '#FFFF00' : '#FF0000';
        ctx.fillRect(player.x, barY, (player.health / player.maxHealth) * barWidth, barHeight);
        
        ctx.restore();
    }
    
    function drawBattleUI() {
        // Player 1 UI (left side)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(10, 10, 200, 100);
        
        ctx.fillStyle = player1.color;
        ctx.font = '18px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Player 1', 20, 30);
        
        ctx.fillStyle = '#FFF';
        ctx.font = '14px Arial';
        ctx.fillText(`Health: ${player1.health}/100`, 20, 50);
        ctx.fillText(`Weapon: ${player1.weapon}`, 20, 70);
        ctx.fillText(`Ammo: ${player1.ammo}/${player1.maxAmmo}`, 20, 90);
        
        if (player1.reloadTime > 0) {
            ctx.fillStyle = '#FFD700';
            ctx.fillText('RELOADING...', 120, 90);
        }
        
        // Player 2 UI (right side)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(canvas.width - 210, 10, 200, 100);
        
        ctx.fillStyle = player2.color;
        ctx.font = '18px Arial';
        ctx.textAlign = 'right';
        ctx.fillText('Player 2', canvas.width - 20, 30);
        
        ctx.fillStyle = '#FFF';
        ctx.font = '14px Arial';
        ctx.fillText(`Health: ${player2.health}/100`, canvas.width - 20, 50);
        ctx.fillText(`Weapon: ${player2.weapon}`, canvas.width - 20, 70);
        ctx.fillText(`Ammo: ${player2.ammo}/${player2.maxAmmo}`, canvas.width - 20, 90);
        
        if (player2.reloadTime > 0) {
            ctx.fillStyle = '#FFD700';
            ctx.fillText('RELOADING...', canvas.width - 120, 90);
        }
        
        // Score and round info
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(canvas.width/2 - 100, 10, 200, 60);
        
        ctx.fillStyle = '#FFF';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Round ${roundNumber}`, canvas.width/2, 30);
        ctx.fillText(`${player1.kills} - ${player2.kills}`, canvas.width/2, 50);
        
        // Round timer
        let timeLeft = Math.ceil((maxRoundTime - roundTimer) / 60);
        ctx.fillText(`${Math.floor(timeLeft/60)}:${(timeLeft%60).toString().padStart(2, '0')}`, canvas.width/2, 65);
    }
    
    function drawVictoryScreen() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        let winner = player1.kills > player2.kills ? 'Player 1' : 'Player 2';
        let winnerColor = player1.kills > player2.kills ? player1.color : player2.color;
        
        ctx.fillStyle = winnerColor;
        ctx.font = '64px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${winner} Wins!`, canvas.width/2, 200);
        
        ctx.fillStyle = '#FFF';
        ctx.font = '32px Arial';
        ctx.fillText(`Final Score: ${player1.kills} - ${player2.kills}`, canvas.width/2, 260);
        
        // Play again button
        ctx.fillStyle = '#27AE60';
        ctx.fillRect(canvas.width/2 - 100, 350, 200, 60);
        ctx.fillStyle = '#FFF';
        ctx.font = '24px Arial';
        ctx.fillText('PLAY AGAIN', canvas.width/2, 385);
    }
    
    function gameLoop() {
        updateGame();
        draw();
        animationId = requestAnimationFrame(gameLoop);
    }
    
    function handleKeyDown(e) {
        switch(e.code) {
            // Player 1
            case 'KeyW': keys.w = true; break;
            case 'KeyA': keys.a = true; break;
            case 'KeyS': keys.s = true; break;
            case 'KeyD': keys.d = true; break;
            case 'ShiftLeft': keys.shift = true; break;
            
            // Player 2
            case 'ArrowUp': keys.up = true; break;
            case 'ArrowLeft': keys.left = true; break;
            case 'ArrowDown': keys.down = true; break;
            case 'ArrowRight': keys.right = true; break;
            case 'Enter': keys.enter = true; break;
        }
        e.preventDefault();
    }
    
    function handleKeyUp(e) {
        switch(e.code) {
            // Player 1
            case 'KeyW': keys.w = false; break;
            case 'KeyA': keys.a = false; break;
            case 'KeyS': keys.s = false; break;
            case 'KeyD': keys.d = false; break;
            case 'ShiftLeft': keys.shift = false; break;
            
            // Player 2
            case 'ArrowUp': keys.up = false; break;
            case 'ArrowLeft': keys.left = false; break;
            case 'ArrowDown': keys.down = false; break;
            case 'ArrowRight': keys.right = false; break;
            case 'Enter': keys.enter = false; break;
        }
        e.preventDefault();
    }
    
    function handleClick(e) {
        let rect = canvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        
        if (gameState === 'setup') {
            if (x >= canvas.width/2 - 100 && x <= canvas.width/2 + 100 &&
                y >= 480 && y <= 540) {
                startBattle();
            }
        } else if (gameState === 'victory') {
            if (x >= canvas.width/2 - 100 && x <= canvas.width/2 + 100 &&
                y >= 350 && y <= 410) {
                resetGame();
            }
        }
    }
    
    function startBattle() {
        gameState = 'battle';
        initializeMap();
    }
    
    function resetGame() {
        gameState = 'setup';
        player1.kills = 0;
        player2.kills = 0;
        roundNumber = 1;
        respawnPlayer(player1);
        respawnPlayer(player2);
        bullets = [];
        particles = [];
        explosions = [];
        powerUps = [];
    }
    
    function stopGame() {
        gameRunning = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
        canvas.removeEventListener('click', handleClick);
    }
    
    // Initialize
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('click', handleClick);
    gameLoop();
    
    window.currentGameCleanup = stopGame;
}