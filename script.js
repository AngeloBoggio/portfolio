let currentSlide = 0;
const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");

const box = 20; // Size of each grid square
const canvasSize = canvas.width / box; // Grid size
let snake = [{ x: 10 * box, y: 10 * box }]; // Snake starting position
let food = {
  x: Math.floor(Math.random() * canvasSize) * box,
  y: Math.floor(Math.random() * canvasSize) * box,
};
let score = 0;
let direction = "RIGHT"; // Initial direction
let touchStartX = 0;
let touchStartY = 0;
let game; // Holds the interval ID for the game loop

// Function to show the current slide
function showSlide(index) {
  const cards = document.querySelectorAll(".card");
  const totalSlides = cards.length;

  cards.forEach((card, i) => {
    const translateValue = (i - index) * 100;
    card.style.transform = `translateX(${translateValue}%)`;
    console.log(`Card ${i + 1}: translateX(${translateValue}%)`);
  });

  console.log(`Showing slide ${index + 1}`);
}

// Previous slide
function prevSlide() {
  const cards = document.querySelectorAll(".card");
  const totalSlides = cards.length;

  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  showSlide(currentSlide);
}

// Next slide
function nextSlide() {
  const cards = document.querySelectorAll(".card");
  const totalSlides = cards.length;

  currentSlide = (currentSlide + 1) % totalSlides;
  showSlide(currentSlide);
}

// Initialize the slideshow
showSlide(currentSlide);

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Control the snake with keyboard
document.addEventListener("keydown", (event) => {
  if (event.key === "w" && direction !== "DOWN") direction = "UP";
  if (event.key === "s" && direction !== "UP") direction = "DOWN";
  if (event.key === "a" && direction !== "RIGHT") direction = "LEFT";
  if (event.key === "d" && direction !== "LEFT") direction = "RIGHT";

  if (["w", "a", "s", "d"].includes(event.key.toLowerCase())) {
    event.preventDefault(); // Prevent default behavior
  }
});

// Draw the game
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

  // Draw food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "lime" : "white";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
    ctx.strokeStyle = "black";
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  // Move the snake
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === "UP") snakeY -= box;
  if (direction === "DOWN") snakeY += box;
  if (direction === "LEFT") snakeX -= box;
  if (direction === "RIGHT") snakeX += box;

  // Check if snake eats food
  if (snakeX === food.x && snakeY === food.y) {
    score++;
    food = {
      x: Math.floor(Math.random() * canvasSize) * box,
      y: Math.floor(Math.random() * canvasSize) * box,
    };
  } else {
    snake.pop(); // Remove last element if no food eaten
  }

  // Add new head
  const newHead = { x: snakeX, y: snakeY };

  // Check for game over
  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= canvas.width ||
    snakeY >= canvas.height ||
    collision(newHead, snake)
  ) {
    endGame();
    return;
  }

  snake.unshift(newHead); // Add new head at the beginning
}

// Collision detection
function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) {
      return true;
    }
  }
  return false;
}

// Add swipe controls
document.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});

function handleTouchMove(e) {
  const touchEndX = e.touches[0].clientX;
  const touchEndY = e.touches[0].clientY;

  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // Horizontal swipe
    if (deltaX > 0 && direction !== "LEFT") {
      direction = "RIGHT";
    } else if (deltaX < 0 && direction !== "RIGHT") {
      direction = "LEFT";
    }
  } else {
    // Vertical swipe
    if (deltaY > 0 && direction !== "UP") {
      direction = "DOWN";
    } else if (deltaY < 0 && direction !== "DOWN") {
      direction = "UP";
    }
  }

  e.preventDefault(); // Prevent scrolling
}

// Start game
document.getElementById("startButton").addEventListener("click", () => {
  if (game) return;
  game = setInterval(draw, 100);
  console.log("Game started");

  document.addEventListener("touchmove", handleTouchMove, { passive: false });
});

// End game
function endGame() {
  clearInterval(game);
  alert(`Game Over! Your score: ${score}`);
  updateLeaderboard(score);
  resetGame();

  document.removeEventListener("touchmove", handleTouchMove, {
    passive: false,
  });
}

// Reset game
function resetGame() {
  snake = [{ x: 10 * box, y: 10 * box }]; // Reset snake to initial position
  food = {
    x: Math.floor(Math.random() * canvasSize) * box,
    y: Math.floor(Math.random() * canvasSize) * box,
  }; // Reset food position
  score = 0; // Reset score
  direction = "RIGHT"; // Reset direction
  game = null; // Allow the Start button to restart the game
  console.log("Game reset. Click Start Game to play again.");
}

// Leaderboard
const topScores = JSON.parse(localStorage.getItem("topScores")) || [];

function updateLeaderboard(score) {
  const playerName = prompt("Enter your name:") || "Anonymous";
  topScores.push({ name: playerName, score });
  topScores.sort((a, b) => b.score - a.score);
  topScores.splice(3);
  localStorage.setItem("topScores", JSON.stringify(topScores));
  displayLeaderboard();
}

function displayLeaderboard() {
  const topScoresList = document.getElementById("topScores");
  topScoresList.innerHTML = "";
  topScores.forEach((entry, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ${entry.name} - ${entry.score}`;
    topScoresList.appendChild(li);
  });
}

// Initialize leaderboard
document.addEventListener("DOMContentLoaded", () => {
  displayLeaderboard();
});
