export const initTetris = (canvas, ctx) => {
  const BOARD_WIDTH = 10;
  const BOARD_HEIGHT = 20;
  const BLOCK_SIZE = 30;
  
  let board = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0));
  let currentPiece = null;
  let gameRunning = true;
  let dropTime = 0;
  let score = 0;
  
  const pieces = [
    [[1,1,1,1]], // I
    [[1,1],[1,1]], // O
    [[0,1,0],[1,1,1]], // T
    [[0,1,1],[1,1,0]], // S
    [[1,1,0],[0,1,1]], // Z
    [[1,0,0],[1,1,1]], // J
    [[0,0,1],[1,1,1]] // L
  ];
  
  const colors = ['#000', '#00f', '#0f0', '#f00', '#ff0', '#f0f', '#0ff', '#fff'];
  
  function createPiece() {
    const shape = pieces[Math.floor(Math.random() * pieces.length)];
    return {
      shape: shape,
      x: Math.floor(BOARD_WIDTH / 2) - Math.floor(shape[0].length / 2),
      y: 0,
      color: Math.floor(Math.random() * 7) + 1
    };
  }
  
  function drawBlock(x, y, color) {
    ctx.fillStyle = colors[color];
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeStyle = '#333';
    ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
  }
  
  function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw board
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        if (board[y][x]) {
          drawBlock(x, y, board[y][x]);
        }
      }
    }
    
    // Draw current piece
    if (currentPiece) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            drawBlock(currentPiece.x + x, currentPiece.y + y, currentPiece.color);
          }
        }
      }
    }
    
    // Draw score
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, BOARD_WIDTH * BLOCK_SIZE + 10, 30);
  }
  
  function collision(piece, dx = 0, dy = 0) {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = piece.x + x + dx;
          const newY = piece.y + y + dy;
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return true;
          }
          if (newY >= 0 && board[newY][newX]) {
            return true;
          }
        }
      }
    }
    return false;
  }
  
  function placePiece() {
    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x]) {
          board[currentPiece.y + y][currentPiece.x + x] = currentPiece.color;
        }
      }
    }
    
    // Clear lines
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (board[y].every(cell => cell !== 0)) {
        board.splice(y, 1);
        board.unshift(Array(BOARD_WIDTH).fill(0));
        score += 100;
        y++;
      }
    }
    
    currentPiece = createPiece();
    if (collision(currentPiece)) {
      gameRunning = false;
    }
  }
  
  function rotatePiece() {
    if (!currentPiece) return;
    const rotated = currentPiece.shape[0].map((_, i) => 
      currentPiece.shape.map(row => row[i]).reverse()
    );
    const oldShape = currentPiece.shape;
    currentPiece.shape = rotated;
    if (collision(currentPiece)) {
      currentPiece.shape = oldShape;
    }
  }
  
  function handleKeyPress(e) {
    if (!gameRunning || !currentPiece) return;
    
    switch (e.key) {
      case 'ArrowLeft':
        if (!collision(currentPiece, -1, 0)) {
          currentPiece.x--;
        }
        break;
      case 'ArrowRight':
        if (!collision(currentPiece, 1, 0)) {
          currentPiece.x++;
        }
        break;
      case 'ArrowDown':
        if (!collision(currentPiece, 0, 1)) {
          currentPiece.y++;
        }
        break;
      case 'ArrowUp':
      case ' ':
        rotatePiece();
        break;
    }
  }
  
  function gameLoop() {
    if (!gameRunning) {
      ctx.fillStyle = 'rgba(0,0,0,0.8)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#fff';
      ctx.font = '48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2);
      ctx.font = '24px Arial';
      ctx.fillText(`Final Score: ${score}`, canvas.width/2, canvas.height/2 + 50);
      return;
    }
    
    if (!currentPiece) {
      currentPiece = createPiece();
    }
    
    dropTime += 16;
    if (dropTime > 500) {
      if (!collision(currentPiece, 0, 1)) {
        currentPiece.y++;
      } else {
        placePiece();
      }
      dropTime = 0;
    }
    
    draw();
    requestAnimationFrame(gameLoop);
  }
  
  document.addEventListener('keydown', handleKeyPress);
  gameLoop();
  
  return () => {
    gameRunning = false;
    document.removeEventListener('keydown', handleKeyPress);
  };
};