// Create a new file called js/dungeon.js

// Dungeon System Implementation
const Dungeon = {
    // Initialize the dungeon system
    init() {
        // Set up the dungeon visualization UI
        this.setupDungeonUI();
        
        // Set up event listeners for the dungeon cells
        this.setupEventListeners();
        
        // Update UI to match game state
        this.updateDungeonDisplay();
    },
    
    // Set up the dungeon UI
    setupDungeonUI() {
        const dungeonSection = document.getElementById('dungeon-section');
        
        // Replace placeholder content with our dungeon layout
        if (dungeonSection.querySelector('.placeholder-content')) {
            dungeonSection.innerHTML = `
                <div class="dungeon-grid-container">
                  <div class="dungeon-grid">
                    <!-- Top Row -->
                    <div class="dungeon-cell" data-position="0,1"></div>
                    
                    <!-- Middle Row -->
                    <div class="dungeon-cell" data-position="1,0"></div>
                    <div class="dungeon-cell dungeon-core-cell" data-position="1,1">
                      <div class="dungeon-core-icon">💎</div>
                    </div>
                    <div class="dungeon-cell" data-position="1,2"></div>
                    
                    <!-- Bottom Row -->
                    <div class="dungeon-cell" data-position="2,1"></div>
                  </div>
                  
                  <div class="dungeon-controls">
                    <h3>Dungeon Layout</h3>
                    <p>Current Size: <span id="dungeon-size-display">0</span> / <span id="dungeon-max-size-display">5</span></p>
                    <div class="dungeon-feature-list">
                      <h4>Available Features</h4>
                      <div id="dungeon-available-features">
                        <!-- Available features will be listed here -->
                      </div>
                    </div>
                  </div>
                </div>
            `;
        }
    },
    
    // Set up event listeners
    setupEventListeners() {
        // Get all dungeon cells (except the core cell)
        const dungeonCells = document.querySelectorAll('.dungeon-cell:not(.dungeon-core-cell)');
        
        // Add click event listener to each cell
        dungeonCells.forEach(cell => {
            cell.addEventListener('click', () => {
                // When a cell is clicked, we'll show a feature selection menu
                const position = cell.dataset.position;
                this.showFeatureSelectionMenu(position, cell);
            });
        });
    },
    
    // Show feature selection menu
    showFeatureSelectionMenu(position, cell) {
        // For now, we'll just add a placeholder feature to demonstrate
        // In a full implementation, this would show a menu of available features
        
        // Get available features from Game state
        const availableFeatures = Game.state.features.filter(feature => 
            feature.unlocked && feature.count > 0
        );
        
        if (availableFeatures.length === 0) {
            UI.showNotification('No features available to place');
            return;
        }
        
        // For this demo, just place the first available feature
        const feature = availableFeatures[0];
        
        // Add feature to cell
        cell.classList.add('occupied-cell');
        cell.innerHTML = `
            <div class="feature-icon">🔮</div>
            <div class="feature-name">${feature.name}</div>
        `;
        
        // In a real implementation, we would track the placed feature in the game state
        UI.showNotification(`Placed ${feature.name} in the dungeon`);
    },
    
    // Update the dungeon display
    updateDungeonDisplay() {
        // Update the size display
        const sizeDisplay = document.getElementById('dungeon-size-display');
        const maxSizeDisplay = document.getElementById('dungeon-max-size-display');
        
        if (sizeDisplay && maxSizeDisplay) {
            sizeDisplay.textContent = Game.state.dungeonSize;
            maxSizeDisplay.textContent = Game.state.maxDungeonSize;
        }
        
        // Update available features
        this.updateAvailableFeatures();
    },
    
    // Update the list of available features
    updateAvailableFeatures() {
        const featuresContainer = document.getElementById('dungeon-available-features');
        if (!featuresContainer) return;
        
        // Clear current content
        featuresContainer.innerHTML = '';
        
        // Get available features from Game state
        const availableFeatures = Game.state.features.filter(feature => 
            feature.unlocked && feature.count > 0
        );
        
        if (availableFeatures.length === 0) {
            featuresContainer.innerHTML = '<p>No features available. Purchase features from the main screen.</p>';
            return;
        }
        
        // Add each feature to the list
        availableFeatures.forEach(feature => {
            const featureElement = document.createElement('div');
            featureElement.className = 'dungeon-feature-item';
            featureElement.innerHTML = `
                <div>${feature.name} (${feature.count} available)</div>
                <div class="feature-effect">${feature.description}</div>
            `;
            
            featuresContainer.appendChild(featureElement);
        });
    }
};

// Export the Dungeon object
window.Dungeon = Dungeon;