// js/dungeon-features.js

// Dungeon Feature Placement System
const DungeonFeatures = {
    // Track placed features on the grid
    placedFeatures: [],
    
    // Track features being dragged
    draggedFeature: null,
    dragOffset: { x: 0, y: 0 },
    
    // Grid cell size in pixels
    cellSize: 32,
    cellGap: 2,
    
    // Initialize the feature placement system
    init() {
        // Create the features panel in the dungeon screen if we're on the dungeon page
        if (document.querySelector('.nav-btn[data-section="dungeon"].active')) {
            this.createFeaturesPanel();
        }
        
        // Set up event listeners for drag and drop
        this.setupEventListeners();
        
        // Load placed features from game state if available
        this.loadPlacedFeatures();
        
        // Update the features display
        this.updateFeaturesPanel();
    },
    
    // Create the features panel in the dungeon screen
    createFeaturesPanel() {
        const dungeonSection = document.getElementById('dungeon-section');
        if (!dungeonSection) return;
        
        // Remove any existing panel first to avoid duplicates
        let existingPanel = dungeonSection.querySelector('.dungeon-features-panel');
        if (existingPanel) {
            existingPanel.remove();
        }
        
        // Create the panel
        const featuresPanel = document.createElement('div');
        featuresPanel.className = 'dungeon-features-panel';
        featuresPanel.innerHTML = `
            <h3>AVAILABLE FEATURES</h3>
            <p class="feature-instructions">Drag features to place them in your dungeon</p>
            <div class="available-features-container" id="available-features-container">
                <!-- Features will be added here dynamically -->
            </div>
        `;
        
        // Add panel to dungeon section
        dungeonSection.appendChild(featuresPanel);
    },
    
    // Set up event listeners for drag and drop
    setupEventListeners() {
        // Delegate event listeners to handle dynamically created elements
        document.addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
        
        // Add event listener for remove buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.remove-feature-btn')) {
                const featureElement = e.target.closest('.placed-feature');
                if (featureElement) {
                    this.removeFeature(featureElement.dataset.id);
                }
            }
        });
        
        // Add tab change listener to create features panel when switching to dungeon tab
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const section = e.target.dataset.section;
                if (section === 'dungeon') {
                    // Small delay to ensure DOM is updated
                    setTimeout(() => {
                        this.createFeaturesPanel();
                        this.updateFeaturesPanel();
                    }, 100);
                }
            });
        });
    },
    
    // Helper method to get feature dimensions
    getFeatureDimensions(featureId) {
        let width, height;
        if (featureId === 'manaPool' || featureId === 'fungalGrowth') {
            width = 2;
            height = 1;
        } else if (featureId === 'essenceConduit') {
            width = 3;
            height = 1;
        } else if (featureId === 'manaNexus') {
            width = 2;
            height = 2;
        } else {
            width = 1;
            height = 1;
        }
        return { width, height };
    },
    
    // Handle mouse down on a feature (start drag)
    handleMouseDown(e) {
        const featureElement = e.target.closest('.feature-item-draggable');
        if (!featureElement) return;
        
        const featureId = featureElement.dataset.featureId;
        const feature = Game.state.features.find(f => f.id === featureId);
        if (!feature || feature.count <= 0) return;
        
        // Mark as dragging
        this.draggedFeature = {
            id: featureId,
            element: featureElement,
            feature: feature
        };
        
        // Create a visual representation for dragging that matches the grid size
        const { width, height } = this.getFeatureDimensions(featureId);
        const cellSize = this.cellSize + this.cellGap;
        
        const clone = document.createElement('div');
        clone.className = 'feature-item-dragging';
        const cloneWidth = width * cellSize - this.cellGap;
        const cloneHeight = height * cellSize - this.cellGap;
        clone.style.width = cloneWidth + 'px';
        clone.style.height = cloneHeight + 'px';
        
        // Add a simple icon and name
        const icon = this.getFeatureIcon(featureId);
        clone.innerHTML = `
            <div class="drag-preview-content">
                <div class="drag-preview-icon">${icon}</div>
                <div class="drag-preview-name">${feature.name}</div>
            </div>
        `;
        
        document.body.appendChild(clone);
        this.draggedFeature.clone = clone;
        
        // Calculate offset to center the smaller clone under the cursor
        this.dragOffset = {
            x: cloneWidth / 2,
            y: cloneHeight / 2
        };
        
        // Position the clone
        this.updateDragPosition(e);
        
        // Create placement preview
        this.createPlacementPreview(featureId);
        
        // Prevent default behaviors
        e.preventDefault();
    },
    
    // Handle mouse move during drag
    handleMouseMove(e) {
        if (!this.draggedFeature) return;
        
        // Update the position of the dragged clone
        this.updateDragPosition(e);
        
        // Update placement preview on the grid
        this.updatePlacementPreview(e);
    },
    
    // Handle mouse up (drop the feature)
    handleMouseUp(e) {
        if (!this.draggedFeature) return;
        
        // Check if we're over the dungeon grid
        const gridElement = document.querySelector('.dungeon-grid');
        const preview = document.querySelector('.feature-placement-preview');
        
        if (gridElement && preview && this.isValidPlacement(preview)) {
            // Get grid coordinates from preview position
            const gridRect = gridElement.getBoundingClientRect();
            const gridStyle = window.getComputedStyle(gridElement);
            const gridPadding = parseFloat(gridStyle.paddingLeft) || 0;
            const previewRect = preview.getBoundingClientRect();
            
            // Calculate grid cell coordinates accounting for padding
            const cellSize = this.cellSize + this.cellGap;
            const col = Math.floor((previewRect.left - gridRect.left - gridPadding) / cellSize);
            const row = Math.floor((previewRect.top - gridRect.top - gridPadding) / cellSize);
            
            // Place the feature
            this.placeFeature(this.draggedFeature.feature, row, col);
        }
        
        // Clean up after dragging
        this.cleanupDrag();
    },
    
    // Update the position of the dragged element
    updateDragPosition(e) {
        if (!this.draggedFeature || !this.draggedFeature.clone) return;
        
        const clone = this.draggedFeature.clone;
        clone.style.left = (e.clientX - this.dragOffset.x) + 'px';
        clone.style.top = (e.clientY - this.dragOffset.y) + 'px';
    },
    
    // Create a preview element for feature placement
    createPlacementPreview(featureId) {
        // Remove any existing preview
        this.removePlacementPreview();
        
        // Get dimensions based on feature ID
        const { width, height } = this.getFeatureDimensions(featureId);
        
        // Create new preview
        const preview = document.createElement('div');
        preview.className = 'feature-placement-preview';
        
        // Set size based on feature dimensions and cell size
        const cellSize = this.cellSize + this.cellGap;
        const totalWidth = width * cellSize - this.cellGap;
        const totalHeight = height * cellSize - this.cellGap;
        
        preview.style.width = totalWidth + 'px';
        preview.style.height = totalHeight + 'px';
        
        document.body.appendChild(preview);
    },
    
    // Update placement preview position and validity
    updatePlacementPreview(e) {
        const preview = document.querySelector('.feature-placement-preview');
        if (!preview || !this.draggedFeature) return;
        
        const gridElement = document.querySelector('.dungeon-grid');
        if (!gridElement) return;
        
        const gridRect = gridElement.getBoundingClientRect();
        const gridStyle = window.getComputedStyle(gridElement);
        const gridPadding = parseFloat(gridStyle.paddingLeft) || 0;
        
        // Check if mouse is over the grid
        const isOverGrid = (
            e.clientX >= gridRect.left &&
            e.clientX <= gridRect.right &&
            e.clientY >= gridRect.top &&
            e.clientY <= gridRect.bottom
        );
        
        if (!isOverGrid) {
            preview.style.display = 'none';
            return;
        }
        
        // Calculate cell position accounting for padding
        const cellSize = this.cellSize + this.cellGap;
        const col = Math.floor((e.clientX - gridRect.left - gridPadding) / cellSize);
        const row = Math.floor((e.clientY - gridRect.top - gridPadding) / cellSize);
        
        // Snap preview to grid accounting for padding
        const left = gridRect.left + gridPadding + col * cellSize;
        const top = gridRect.top + gridPadding + row * cellSize;
        
        preview.style.display = 'block';
        preview.style.left = left + 'px';
        preview.style.top = top + 'px';
        
        // Check if placement is valid
        const isValid = this.checkPlacementValid(row, col, this.draggedFeature.id);
        
        // Update preview appearance based on validity
        preview.classList.remove('valid', 'invalid');
        preview.classList.add(isValid ? 'valid' : 'invalid');
    },
    
    // Check if placement at the given position is valid
    checkPlacementValid(row, col, featureId) {
        // Get dimensions based on feature ID
        const { width, height } = this.getFeatureDimensions(featureId);
        
        // Check grid boundaries
        if (!Dungeon.gridState) return false;
        
        const gridState = Dungeon.gridState;
        const gridSize = Dungeon.gridSize;
        
        if (row < 0 || col < 0 || row + height > gridSize || col + width > gridSize) {
            return false;
        }
        
        // Check if all cells in the placement area are unlocked and not occupied
        for (let r = row; r < row + height; r++) {
            for (let c = col; c < col + width; c++) {
                // Check if cell is unlocked and not already occupied by another feature
                if (gridState[r][c] !== 'unlocked' || this.isCellOccupied(r, c)) {
                    return false;
                }
            }
        }
        
        return true;
    },
    
    // Check if a cell is already occupied by a placed feature
    isCellOccupied(row, col) {
        return this.placedFeatures.some(feature => {
            // Get feature dimensions
            const { width, height } = this.getFeatureDimensions(feature.featureId);
            
            // Check if the cell is within the feature's area
            return (
                row >= feature.row && 
                row < feature.row + height &&
                col >= feature.col && 
                col < feature.col + width
            );
        });
    },
    
    // Check if current preview position is valid
    isValidPlacement(previewElement) {
        return previewElement.classList.contains('valid');
    },
    
    // Place a feature on the grid
    placeFeature(feature, row, col) {
        // Ensure we have a valid feature and position
        if (!feature || row < 0 || col < 0) return false;
        
        // Check if placement is valid
        if (!this.checkPlacementValid(row, col, feature.id)) return false;
        
        // Reduce the feature count in game state
        feature.count--;
        
        // Create a unique ID for this placed feature
        const featureId = `placed-${feature.id}-${Date.now()}`;
        
        // Get dimensions
        const { width, height } = this.getFeatureDimensions(feature.id);
        
        // Add to placed features array
        this.placedFeatures.push({
            id: featureId,
            featureId: feature.id,
            name: feature.name,
            row: row,
            col: col,
            width: width,
            height: height
        });
        
        // Save to game state
        this.savePlacedFeatures();
        
        // Add visual representation to the grid
        this.renderPlacedFeature(featureId, feature, row, col);
        
        // Update available features panel
        this.updateFeaturesPanel();
        
        // Update game mana generation
        Game.calculateManaPerSecond();
        UI.updateDisplay();
        
        return true;
    },
    
    // Render a placed feature on the grid
    renderPlacedFeature(id, feature, row, col) {
        const gridElement = document.querySelector('.dungeon-grid');
        if (!gridElement) return;
        
        // Get grid padding
        const gridStyle = window.getComputedStyle(gridElement);
        const gridPadding = parseFloat(gridStyle.paddingLeft) || 0;
        
        // Calculate position
        const cellSize = this.cellSize + this.cellGap;
        
        // Get feature dimensions - check if we have a placed feature with stored dimensions
        const placedFeature = this.placedFeatures.find(f => f.id === id);
        let width, height;
        
        if (placedFeature && placedFeature.width && placedFeature.height) {
            // Use stored dimensions from placed feature
            width = placedFeature.width;
            height = placedFeature.height;
        } else {
            // Calculate dimensions based on feature ID
            const dimensions = this.getFeatureDimensions(feature.id);
            width = dimensions.width;
            height = dimensions.height;
        }
        
        // Calculate total size in pixels
        const totalWidth = width * cellSize - this.cellGap;
        const totalHeight = height * cellSize - this.cellGap;
        
        // Create feature element
        const featureElement = document.createElement('div');
        featureElement.className = 'placed-feature';
        featureElement.dataset.id = id;
        featureElement.dataset.featureId = feature.id;
        
        // Set position and size - account for grid padding in positioning
        featureElement.style.left = (gridPadding + col * cellSize) + 'px';
        featureElement.style.top = (gridPadding + row * cellSize) + 'px';
        featureElement.style.width = totalWidth + 'px';
        featureElement.style.height = totalHeight + 'px';
        
        // Add feature icon based on feature type
        const featureIcon = this.getFeatureIcon(feature.id);
        
        featureElement.innerHTML = `
            <div class="placed-feature-content">
                <div class="placed-feature-icon">${featureIcon}</div>
                <div class="placed-feature-name">${feature.name}</div>
            </div>
            <button class="remove-feature-btn">×</button>
        `;
        
        gridElement.appendChild(featureElement);
    },
    
    // Get icon for a feature based on its ID
    getFeatureIcon(featureId) {
        // Map of feature icons
        const icons = {
            manaVein: '💧',
            crystalFormation: '💎',
            manaPool: '🌊',
            fungalGrowth: '🍄',
            essenceConduit: '⚡',
            manaNexus: '✨',
            smallAnimalLure: '🐇',
            mediumAnimalLure: '🦌',
            adventurerLure: '👤',
            basicSnare: '🕸️',
            pitTrap: '🕳️',
            manaDrainTrap: '⚔️'
        };
        
        return icons[featureId] || '🔮';
    },
    
    // Remove a placed feature
    removeFeature(featureId) {
        // Find the feature in our placed features array
        const featureIndex = this.placedFeatures.findIndex(f => f.id === featureId);
        if (featureIndex === -1) return;
        
        const placedFeature = this.placedFeatures[featureIndex];
        
        // Find the original feature in game state to increment its count
        const gameFeature = Game.state.features.find(f => f.id === placedFeature.featureId);
        if (gameFeature) {
            gameFeature.count++;
        }
        
        // Remove from placed features array
        this.placedFeatures.splice(featureIndex, 1);
        
        // Remove visual element from grid
        const featureElement = document.querySelector(`.placed-feature[data-id="${featureId}"]`);
        if (featureElement) {
            featureElement.remove();
        }
        
        // Save state
        this.savePlacedFeatures();
        
        // Update available features panel
        this.updateFeaturesPanel();
        
        // Update game mana generation
        Game.calculateManaPerSecond();
        UI.updateDisplay();
    },
    
    // Remove placement preview
    removePlacementPreview() {
        const preview = document.querySelector('.feature-placement-preview');
        if (preview) {
            preview.remove();
        }
    },
    
    // Clean up after dragging ends
    cleanupDrag() {
        if (this.draggedFeature && this.draggedFeature.clone) {
            this.draggedFeature.clone.remove();
        }
        
        this.removePlacementPreview();
        this.draggedFeature = null;
    },
    
    // Update the features panel with available features
    updateFeaturesPanel() {
        const container = document.getElementById('available-features-container');
        if (!container) return;
        
        // Clear current content
        container.innerHTML = '';
        
        // Get available features (unlocked and count > 0)
        const availableFeatures = Game.state.features.filter(f => f.unlocked && f.count > 0);
        
        if (availableFeatures.length === 0) {
            container.innerHTML = '<p class="no-features-message">Purchase features from the main screen to place them in your dungeon.</p>';
            return;
        }
        
        // Add each available feature
        availableFeatures.forEach(feature => {
            const featureElement = document.createElement('div');
            featureElement.className = 'feature-item-draggable';
            featureElement.dataset.featureId = feature.id;
            
            // Feature icon
            const icon = this.getFeatureIcon(feature.id);
            
            // Create size display (width x height)
            const { width, height } = this.getFeatureDimensions(feature.id);
            const sizeDisplay = `${width}x${height}`;
            
            featureElement.innerHTML = `
                <div class="feature-icon">${icon}</div>
                <div class="feature-info">
                    <div class="feature-name-label">${feature.name}</div>
                    <div class="feature-details">
                        <div class="feature-size-badge">${sizeDisplay}</div>
                        <div class="feature-effect-badge">+${feature.baseEffect} mana/s</div>
                    </div>
                </div>
                <div class="feature-count-badge">${feature.count}</div>
            `;
            
            container.appendChild(featureElement);
        });
    },
    
    // Save placed features to game state
    savePlacedFeatures() {
        Game.state.placedFeatures = this.placedFeatures;
    },
    
    // Load placed features from game state
    loadPlacedFeatures() {
        // Check if we have placed features in game state
        if (Game.state.placedFeatures && Game.state.placedFeatures.length > 0) {
            this.placedFeatures = Game.state.placedFeatures;
            
            // Render all placed features
            this.placedFeatures.forEach(placed => {
                const feature = Game.state.features.find(f => f.id === placed.featureId);
                if (feature) {
                    // Ensure the placed feature has the correct dimensions
                    if (!placed.width || !placed.height) {
                        const { width, height } = this.getFeatureDimensions(placed.featureId);
                        placed.width = width;
                        placed.height = height;
                    }
                    this.renderPlacedFeature(placed.id, feature, placed.row, placed.col);
                }
            });
        } else {
            // Initialize empty array if none exists
            this.placedFeatures = [];
            Game.state.placedFeatures = [];
        }
    },
    
    // Clear all placed features (used when resetting the game)
    clearPlacedFeatures() {
        // Remove all placed feature elements
        document.querySelectorAll('.placed-feature').forEach(el => el.remove());
        
        // Clear the array
        this.placedFeatures = [];
        Game.state.placedFeatures = [];
    }
};

// Export the DungeonFeatures object
window.DungeonFeatures = DungeonFeatures;