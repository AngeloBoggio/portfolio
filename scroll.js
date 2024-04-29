// scroll.js

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const target = document.querySelector(this.getAttribute("href"));
    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
});

// Array of motivational quotes
const quotes = [
  "Believe you can and you're halfway there.",
  "The only way to do great work is to love what you do.",
  "Success is not final, failure is not fatal: It is the courage to continue that counts.",
  // Add more quotes as needed
];

// Function to randomly select a quote
function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

// Function to insert a random quote into the moving text container
function insertRandomQuote() {
  const movingText = document.querySelector(".moving-text");
  const quote = getRandomQuote();
  movingText.textContent = quote;
}

// Insert a random quote initially
insertRandomQuote();
