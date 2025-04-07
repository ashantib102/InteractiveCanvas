// Get canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game state
const gameState = {
  background: "forest",
  characterPosition: 50, // percentage
  moveDirection: "x",
  items: {
    item1: true, // treasure chest
    item2: true, // magic crystal
    item3: true, // friendly creature
  },
};

// Assets to preload
const assets = {
  backgrounds: {
    forest: { loaded: false, image: new Image() },
    desert: { loaded: false, image: new Image() },
    space: { loaded: false, image: new Image() },
  },
  character: { loaded: false, image: new Image() },
  items: {
    item1: { loaded: false, image: new Image() }, // treasure chest
    item2: { loaded: false, image: new Image() }, // magic crystal
    item3: { loaded: false, image: new Image() }, // friendly creature
  },
  sounds: {
    sound1: new Audio(
      "https://assets.mixkit.co/active_storage/sfx/2019/magic-sweep-game-trophy-presentation-571.wav"
    ),
    sound2: new Audio(
      "https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3"
    ),
    sound3: new Audio(
      "https://assets.mixkit.co/active_storage/sfx/1434/1434-preview.mp3"
    ),
  },
};

// Load images
assets.backgrounds.forest.image.src = "forest.jpg";
assets.backgrounds.forest.image.onload = () =>
  (assets.backgrounds.forest.loaded = true);

assets.backgrounds.desert.image.src = "desert.jpg";
assets.backgrounds.desert.image.onload = () =>
  (assets.backgrounds.desert.loaded = true);

assets.backgrounds.space.image.src = "space.jpg";
assets.backgrounds.space.image.onload = () =>
  (assets.backgrounds.space.loaded = true);

assets.character.image.src =
  "https://cdn-icons-png.flaticon.com/512/4616/4616271.png";
assets.character.image.onload = () => (assets.character.loaded = true);

assets.items.item1.image.src =
  "https://cdn-icons-png.flaticon.com/512/4616/4616089.png";
assets.items.item1.image.onload = () => (assets.items.item1.loaded = true);

assets.items.item2.image.src =
  "https://cdn-icons-png.flaticon.com/512/4616/4616075.png";
assets.items.item2.image.onload = () => (assets.items.item2.loaded = true);

assets.items.item3.image.src =
  "https://cdn-icons-png.flaticon.com/512/4616/4616218.png";
assets.items.item3.image.onload = () => (assets.items.item3.loaded = true);

// Set crossOrigin to avoid CORS issues with canvas
assets.backgrounds.forest.image.crossOrigin = "anonymous";
assets.backgrounds.desert.image.crossOrigin = "anonymous";
assets.backgrounds.space.image.crossOrigin = "anonymous";
assets.character.image.crossOrigin = "anonymous";
assets.items.item1.image.crossOrigin = "anonymous";
assets.items.item2.image.crossOrigin = "anonymous";
assets.items.item3.image.crossOrigin = "anonymous";

// Event listeners for controls
// Background selection
document.querySelectorAll('input[name="background"]').forEach((radio) => {
  radio.addEventListener("change", (e) => {
    gameState.background = e.target.value;
    drawGame();
  });
});

// Character position slider
const positionSlider = document.getElementById("positionSlider");
positionSlider.addEventListener("input", (e) => {
  gameState.characterPosition = parseInt(e.target.value);
  drawGame();
});

// Movement direction
document.querySelectorAll('input[name="moveDirection"]').forEach((radio) => {
  radio.addEventListener("change", (e) => {
    gameState.moveDirection = e.target.value;
    drawGame();
  });
});

// Item checkboxes
document.getElementById("item1").addEventListener("change", (e) => {
  gameState.items.item1 = e.target.checked;
  drawGame();
});

document.getElementById("item2").addEventListener("change", (e) => {
  gameState.items.item2 = e.target.checked;
  drawGame();
});

document.getElementById("item3").addEventListener("change", (e) => {
  gameState.items.item3 = e.target.checked;
  drawGame();
});

// Sound buttons
document.getElementById("sound1").addEventListener("click", () => {
  playSound("sound1");
});

document.getElementById("sound2").addEventListener("click", () => {
  playSound("sound2");
});

document.getElementById("sound3").addEventListener("click", () => {
  playSound("sound3");
});

// Function to play sounds
function playSound(soundId) {
  // Stop and reset the sound first
  assets.sounds[soundId].pause();
  assets.sounds[soundId].currentTime = 0;

  // Play the sound
  assets.sounds[soundId].play().catch((error) => {
    console.error("Error playing sound:", error);
    alert("Sound could not be played. Please interact with the page first.");
  });
}

// Main drawing function
function drawGame() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background
  if (assets.backgrounds[gameState.background].loaded) {
    ctx.drawImage(
      assets.backgrounds[gameState.background].image,
      0,
      0,
      canvas.width,
      canvas.height
    );
  }

  // Calculate character position
  const characterSize = 80;
  let characterX, characterY;

  if (gameState.moveDirection === "x") {
    // Horizontal movement
    characterX =
      (canvas.width - characterSize) * (gameState.characterPosition / 100);
    characterY = canvas.height - characterSize - 50; // Fixed Y position
  } else {
    // Vertical movement
    characterX = canvas.width / 2 - characterSize / 2; // Fixed X position
    characterY =
      (canvas.height - characterSize) * (gameState.characterPosition / 100);
  }

  // Draw items
  if (gameState.items.item1 && assets.items.item1.loaded) {
    ctx.drawImage(assets.items.item1.image, 100, canvas.height - 120, 70, 70);
  }

  if (gameState.items.item2 && assets.items.item2.loaded) {
    ctx.drawImage(assets.items.item2.image, canvas.width - 170, 80, 70, 70);
  }

  if (gameState.items.item3 && assets.items.item3.loaded) {
    ctx.drawImage(assets.items.item3.image, canvas.width / 2 - 35, 100, 70, 70);
  }

  // Draw character
  if (assets.character.loaded) {
    ctx.drawImage(
      assets.character.image,
      characterX,
      characterY,
      characterSize,
      characterSize
    );
  }
}

// Initial draw when assets are loaded
const checkAssetsLoaded = setInterval(() => {
  if (
    assets.backgrounds.forest.loaded &&
    assets.backgrounds.desert.loaded &&
    assets.backgrounds.space.loaded &&
    assets.character.loaded &&
    assets.items.item1.loaded &&
    assets.items.item2.loaded &&
    assets.items.item3.loaded
  ) {
    clearInterval(checkAssetsLoaded);
    drawGame();
  }
}, 100);

// Handle window resize
window.addEventListener("resize", () => {
  // Maintain aspect ratio
  if (window.innerWidth < 800) {
    const aspectRatio = canvas.width / canvas.height;
    const newWidth = Math.min(window.innerWidth - 40, 800);
    canvas.style.width = newWidth + "px";
    canvas.style.height = newWidth / aspectRatio + "px";
  } else {
    canvas.style.width = "";
    canvas.style.height = "";
  }

  drawGame();
});

// Initial resize check
window.dispatchEvent(new Event("resize"));
