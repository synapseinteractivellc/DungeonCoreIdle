// Updated Dungeon System Implementation
const Dungeon = {
    // Grid state to track unlocked cells
    gridState: [],
    expansionCost: 100, // Base cost for expansion
    costMultiplier: 1.5, // Cost increases by this multiplier
    gridSize: 15, // Expanded to 15x15 grid
    
    // Initialize the dungeon system
    init() {        
        // Initialize grid state based on current dungeon size
        this.initializeGridState();
        
        // Set up the dungeon visualization UI
        this.setupDungeonUI();
        
        // Set up event listeners for the dungeon cells
        this.setupEventListeners();
        
        // Update UI to match game state
        this.updateDungeonDisplay();
    },
    
    // Initialize grid state
    initializeGridState() {
        // Create a 15x15 grid with all cells locked by default
        this.gridState = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill('locked'));
        
        // Set the center cell (7,7) as the core - starting with size 1
        const centerPos = Math.floor(this.gridSize / 2);
        this.gridState[centerPos][centerPos] = 'core';
        
        // If max dungeon size is greater than 1 (the core), unlock additional cells
        if (Game.state.maxDungeonSize > 1) {
            // Get cells to unlock based on current dungeon size
            const cellsToUnlock = this.getCellsToUnlock(Game.state.maxDungeonSize - 1);
            
            // Unlock these cells
            cellsToUnlock.forEach(([row, col]) => {
                this.gridState[row][col] = 'unlocked';
            });
        }
        
        // Mark available cells (adjacent to unlocked or core)
        this.updateAvailableCells();
    },
    
    // Get cells to unlock in a spiral pattern starting from center
    getCellsToUnlock(count) {
        const centerPos = Math.floor(this.gridSize / 2);
        const cells = [];
        
        // Add cells in a spiral pattern
        // Start with the 4 adjacent cells to the core
        const initialAdjacent = [
            [centerPos-1, centerPos], // Top
            [centerPos, centerPos+1], // Right
            [centerPos+1, centerPos], // Bottom
            [centerPos, centerPos-1]  // Left
        ];
        
        for (let i = 0; i < initialAdjacent.length && cells.length < count; i++) {
            cells.push(initialAdjacent[i]);
        }
        
        // If we need more cells, add the diagonals
        const diagonals = [
            [centerPos-1, centerPos-1], // Top-left
            [centerPos-1, centerPos+1], // Top-right
            [centerPos+1, centerPos+1], // Bottom-right
            [centerPos+1, centerPos-1]  // Bottom-left
        ];
        
        for (let i = 0; i < diagonals.length && cells.length < count; i++) {
            cells.push(diagonals[i]);
        }
        
        // If we need even more, add cells in expanding rings
        let ring = 2; // Start with cells 2 away from center
        while (cells.length < count && ring < this.gridSize / 2) {
            // Add top and bottom rows of this ring
            for (let col = centerPos - ring; col <= centerPos + ring && cells.length < count; col++) {
                cells.push([centerPos - ring, col]); // Top row
                cells.push([centerPos + ring, col]); // Bottom row
            }
            
            // Add left and right columns of this ring (excluding corners already added)
            for (let row = centerPos - ring + 1; row <= centerPos + ring - 1 && cells.length < count; row++) {
                cells.push([row, centerPos - ring]); // Left column
                cells.push([row, centerPos + ring]); // Right column
            }
            
            ring++;
        }
        
        return cells.slice(0, count);
    },
    
    // Update which cells are available for expansion
    updateAvailableCells() {
        // First, mark all non-unlocked cells as locked
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (this.gridState[row][col] !== 'unlocked' && 
                    this.gridState[row][col] !== 'core') {
                    this.gridState[row][col] = 'locked';
                }
            }
        }
        
        // Then mark cells adjacent to unlocked or core as available
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (this.gridState[row][col] === 'unlocked' || 
                    this.gridState[row][col] === 'core') {
                    this.markAdjacentCellsAvailable(row, col);
                }
            }
        }
    },
    
    // Mark adjacent cells as available
    markAdjacentCellsAvailable(row, col) {
        const adjacentPositions = [
            [row-1, col], // Up
            [row+1, col], // Down
            [row, col-1], // Left
            [row, col+1]  // Right
        ];
        
        adjacentPositions.forEach(([r, c]) => {
            // Check if position is valid and cell is locked
            if (r >= 0 && r < this.gridSize && c >= 0 && c < this.gridSize && 
                this.gridState[r][c] === 'locked') {
                this.gridState[r][c] = 'available';
            }
        });
    },
    
    // Calculate expansion cost based on current dungeon size
    calculateExpansionCost() {
        const currentSize = Game.state.maxDungeonSize;
        
        // For cells beyond the starting 1, calculate cost with increasing multiplier
        return Math.floor(this.expansionCost * Math.pow(this.costMultiplier, currentSize - 1));
    },
    
    // Set up the dungeon UI
    setupDungeonUI() {
        const dungeonSection = document.getElementById('dungeon-section');
        
        // Replace placeholder content with our dungeon layout
        if (dungeonSection.querySelector('.placeholder-content')) {
            dungeonSection.innerHTML = `
                <div class="dungeon-grid-container">
                  <h2>Dungeon Expansion</h2>
                  <p class="dungeon-description">Expand your dungeon by purchasing adjacent cells. Click on highlighted cells to expand.</p>
                  
                  <div class="dungeon-grid">
                    <!-- Grid will be generated dynamically -->
                  </div>
                  
                  <div class="dungeon-info-panel">
                    <div class="dungeon-stats">
                      <div class="dungeon-stat">
                        <span class="stat-label">Current Size:</span>
                        <span class="stat-value" id="current-dungeon-size"></span>
                      </div>
                      <div class="dungeon-stat">
                        <span class="stat-label">Next Expansion Cost:</span>
                        <span class="stat-value" id="expansion-cost"></span>
                      </div>
                    </div>
                    <div class="dungeon-legend">
                      <div class="legend-item">
                        <div class="legend-color core-color"></div>
                        <div class="legend-text">Core</div>
                      </div>
                      <div class="legend-item">
                        <div class="legend-color unlocked-color"></div>
                        <div class="legend-text">Unlocked</div>
                      </div>
                      <div class="legend-item">
                        <div class="legend-color available-color"></div>
                        <div class="legend-text">Available to Purchase</div>
                      </div>
                      <div class="legend-item">
                        <div class="legend-color locked-color"></div>
                        <div class="legend-text">Locked</div>
                      </div>
                    </div>
                  </div>
                </div>
            `;
            
            // Generate the grid
            this.generateGrid();
        }
    },
    
    // Generate the grid dynamically
    generateGrid() {
        const grid = document.querySelector('.dungeon-grid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        // Set grid template columns and rows to match gridSize
        grid.style.gridTemplateColumns = `repeat(${this.gridSize}, 32px)`;
        grid.style.gridTemplateRows = `repeat(${this.gridSize}, 32px)`;
        
        // Get center position
        const centerPos = Math.floor(this.gridSize / 2);
        
        // Create the grid cells
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const cell = document.createElement('div');
                cell.className = 'dungeon-cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                // Core cell
                if (row === centerPos && col === centerPos) {
                    cell.classList.add('core-cell');
                    cell.innerHTML = '<div class="cell-icon">💎</div>';
                }
                
                grid.appendChild(cell);
            }
        }
    },
    
    // Set up event listeners
    setupEventListeners() {
        document.querySelectorAll('.dungeon-cell').forEach(cell => {
            cell.addEventListener('click', (e) => {
                const row = parseInt(e.currentTarget.dataset.row);
                const col = parseInt(e.currentTarget.dataset.col);
                this.handleCellClick(row, col);
            });
            
            // Add hover effect for available cells
            cell.addEventListener('mouseenter', (e) => {
                const row = parseInt(e.currentTarget.dataset.row);
                const col = parseInt(e.currentTarget.dataset.col);
                this.handleCellHover(row, col);
            });
            
            cell.addEventListener('mouseleave', () => {
                // Hide cost tooltip
                const tooltip = document.getElementById('cost-tooltip');
                if (tooltip) tooltip.remove();
            });
        });
    },
    
    // Handle cell click
    handleCellClick(row, col) {
        // Check if the cell is available for purchase
        if (this.gridState[row][col] !== 'available') return;
        
        // Calculate cost
        const cost = this.calculateExpansionCost();
        
        // Check if player can afford it
        if (Game.state.mana < cost) {
            UI.showNotification('Not enough mana to expand dungeon');
            return;
        }
        
        // Purchase the expansion
        Game.state.mana -= cost;
        Game.state.maxDungeonSize += 1;
        this.gridState[row][col] = 'unlocked';
        
        // Update available cells
        this.updateAvailableCells();
        
        // Update display
        this.updateDungeonDisplay();
        UI.updateDisplay();
        
        UI.showNotification('Dungeon expanded!');
    },
    
    // Handle cell hover
    handleCellHover(row, col) {
        // Only show tooltip for available cells
        if (this.gridState[row][col] !== 'available') return;
        
        const cost = this.calculateExpansionCost();
        const canAfford = Game.state.mana >= cost;
        
        // Remove any existing tooltip
        const oldTooltip = document.getElementById('cost-tooltip');
        if (oldTooltip) oldTooltip.remove();
        
        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.id = 'cost-tooltip';
        tooltip.className = 'cost-tooltip';
        tooltip.innerHTML = `
            <div>Expand Dungeon</div>
            <div class="tooltip-cost ${canAfford ? 'can-afford' : 'cant-afford'}">
                Cost: ${UI.formatNumber(cost)} mana
            </div>
        `;
        
        // Position tooltip near the cell
        const cell = document.querySelector(`.dungeon-cell[data-row="${row}"][data-col="${col}"]`);
        const rect = cell.getBoundingClientRect();
        
        tooltip.style.left = `${rect.left + window.scrollX}px`;
        tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
        
        document.body.appendChild(tooltip);
    },
    
    // Update the dungeon display
    updateDungeonDisplay() {
        // Update grid cell styles based on gridState
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const cell = document.querySelector(`.dungeon-cell[data-row="${row}"][data-col="${col}"]`);
                if (!cell) continue;
                
                // Remove existing state classes
                cell.classList.remove('core-cell', 'unlocked-cell', 'available-cell', 'locked-cell');
                
                // Add class based on current state
                const state = this.gridState[row][col];
                cell.classList.add(`${state}-cell`);
                
                // Add appropriate content/icon
                if (state === 'core') {
                    cell.innerHTML = '<div class="cell-icon">💎</div>';
                } else if (state === 'unlocked') {
                    cell.innerHTML = '';
                } else if (state === 'available') {
                    cell.innerHTML = '<div class="expansion-icon">+</div>';
                } else {
                    cell.innerHTML = '';
                }
            }
        }
        
        // Update stats display
        const currentSizeElem = document.getElementById('current-dungeon-size');
        const expansionCostElem = document.getElementById('expansion-cost');
        
        if (currentSizeElem) {
            currentSizeElem.textContent = Game.state.maxDungeonSize;
        }
        
        if (expansionCostElem) {
            expansionCostElem.textContent = UI.formatNumber(this.calculateExpansionCost()) + ' mana';
        }
    }
};

// Export the Dungeon object
window.Dungeon = Dungeon;