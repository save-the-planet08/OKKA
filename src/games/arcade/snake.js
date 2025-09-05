export const initSnake = (canvas, ctx) => {
  const GRID_SIZE = 20;
  const GRID_WIDTH = canvas.width / GRID_SIZE;
  const GRID_HEIGHT = canvas.height / GRID_SIZE;
  
  let snake = [{x: 10, y: 10}];
  let direction = {x: 0, y: 0};
  let food = {x: 15, y: 15};
  let gameRunning = true;
  let score = 0;
  
  function randomFood() {
    food = {
      x: Math.floor(Math.random() * GRID_WIDTH),
      y: Math.floor(Math.random() * GRID_HEIGHT)
    };
    
    // Make sure food doesn't spawn on snake
    for (let segment of snake) {
      if (segment.x === food.x && segment.y === food.y) {
        randomFood();
        return;
      }
    }
  }
  
  function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake
    ctx.fillStyle = '#0f0';
    for (let segment of snake) {
      ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
    }
    
    // Draw food
    ctx.fillStyle = '#f00';
    ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
    
    // Draw score
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 25);
  }
  
  function update() {
    if (!gameRunning) return;
    
    const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};
    
    // Check wall collision
    if (head.x < 0 || head.x >= GRID_WIDTH || head.y < 0 || head.y >= GRID_HEIGHT) {
      gameRunning = false;
      return;
    }
    
    // Check self collision
    for (let segment of snake) {
      if (head.x === segment.x && head.y === segment.y) {
        gameRunning = false;
        return;
      }
    }
    
    snake.unshift(head);
    
    // Check food collision
    if (head.x === food.x && head.y === food.y) {
      score += 10;
      randomFood();
    } else {
      snake.pop();
    }
  }
  
  function handleKeyPress(e) {
    if (!gameRunning) return;
    
    switch (e.key) {
      case 'ArrowUp':
        if (direction.y === 0) {
          direction = {x: 0, y: -1};
        }
        e.preventDefault();
        break;
      case 'ArrowDown':
        if (direction.y === 0) {
          direction = {x: 0, y: 1};
        }
        e.preventDefault();
        break;
      case 'ArrowLeft':
        if (direction.x === 0) {
          direction = {x: -1, y: 0};
        }
        e.preventDefault();
        break;
      case 'ArrowRight':
        if (direction.x === 0) {
          direction = {x: 1, y: 0};
        }
        e.preventDefault();
        break;
    }
  }
  
  function gameLoop() {
    update();
    draw();
    
    if (!gameRunning) {
      ctx.fillStyle = 'rgba(0,0,0,0.8)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#fff';
      ctx.font = '48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2);
      ctx.font = '24px Arial';
      ctx.fillText(`Final Score: ${score}`, canvas.width/2, canvas.height/2 + 50);
      ctx.textAlign = 'left';
      return;
    }
    
    setTimeout(gameLoop, 150);
  }
  
  document.addEventListener('keydown', handleKeyPress);
  randomFood();
  gameLoop();
  
  return () => {
    gameRunning = false;
    document.removeEventListener('keydown', handleKeyPress);
  };
};