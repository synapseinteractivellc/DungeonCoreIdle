// Main game initialization and loop

// Game timer variables
let lastTick = Date.now();
const saveInterval = 60000; // Save every minute
let lastSaveTime = Date.now();

// Initialize the game
function initGame() {
    // Initialize game state
    Game.init();
    
    // Initialize UI
    UI.init();
    
    // Initial render
    UI.updateDisplay();
    UI.renderFeatures();
    UI.renderUpgrades();
    
    // Start the game loop
    requestAnimationFrame(gameLoop);
}

// Main game loop
function gameLoop() {
    const now = Date.now();
    const deltaTime = now - lastTick;
    
    // Process game tick
    const tickResult = Game.processTick(deltaTime);
    
    // Update UI if there are changes
    UI.updateDisplay();
    
    // Re-render features if there are new unlocks
    if (tickResult.newUnlocks) {
        UI.renderFeatures();
        UI.renderUpgrades();
    }
    
    // Handle auto-save
    if (now - lastSaveTime > saveInterval) {
        Game.saveGame();
        lastSaveTime = now;
    }
    
    // Update lastTick
    lastTick = now;
    
    // Continue the game loop
    requestAnimationFrame(gameLoop);
}

// Start the game when the page loads
document.addEventListener('DOMContentLoaded', initGame);

// Add event listener for page unload to save the game
window.addEventListener('beforeunload', () => {
    Game.saveGame();
});