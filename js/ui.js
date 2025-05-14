// UI Management
const UI = {
    // DOM Elements
    elements: {
        core: null,
        coreContainer: null,
        manaDisplay: null,
        manaPerSecondDisplay: null,
        featureList: null,
        coreTypeDisplay: null,
        evolutionBar: null
    },

    // Initialize UI
    init() {
        // Cache DOM elements
        this.elements.core = document.getElementById('core');
        this.elements.coreContainer = document.getElementById('coreContainer');
        this.elements.manaDisplay = document.getElementById('manaDisplay');
        this.elements.manaPerSecondDisplay = document.getElementById('manaPerSecondDisplay');
        this.elements.featureList = document.getElementById('featureList');
        this.elements.coreTypeDisplay = document.getElementById('coreTypeDisplay');
        this.elements.evolutionBar = document.getElementById('evolutionBar');
        
        // Set up event listeners
        this.setupEventListeners();
    },

    // Set up all event listeners
    setupEventListeners() {
        // Core click event
        this.elements.core.addEventListener('click', this.handleCoreClick.bind(this));
        
        // Other event listeners can be added here
    },

    // Helper function to format numbers for display
    formatNumber(num) {
        if (num < 1000) return num.toFixed(1);
        if (num < 1000000) return (num / 1000).toFixed(2) + 'K';
        return (num / 1000000).toFixed(2) + 'M';
    },

    // Handle core click
    handleCoreClick(event) {
        // Call the game's clickCore method
        const manaGained = Game.clickCore();
        
        // Get position for particle effect (relative to core center)
        const rect = this.elements.core.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Create particle effect
        this.createManaParticle(x, y, manaGained);
        
        // Update displays
        this.updateDisplay();
    },

    // Create mana particle effect
    createManaParticle(x, y, amount) {
        const particle = document.createElement('div');
        particle.className = 'mana-particle';
        particle.textContent = '+' + amount;
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        this.elements.coreContainer.appendChild(particle);
        
        // Remove particle after animation completes
        setTimeout(() => {
            if (particle.parentNode) {
                this.elements.coreContainer.removeChild(particle);
            }
        }, 1500);
    },

    // Render the features list
    renderFeatures() {
        const featureList = this.elements.featureList;
        featureList.innerHTML = '';
        
        Game.state.features.forEach(feature => {
            if (!feature.unlocked) return;
            
            const cost = Game.calculateFeatureCost(feature);
            const canAfford = Game.state.mana >= cost;
            
            const li = document.createElement('li');
            li.className = 'feature-item';
            li.style.opacity = canAfford ? '1' : '0.6';
            li.dataset.featureId = feature.id;
            
            li.innerHTML = `
                <div class="feature-name">${feature.name} <span class="feature-count">${feature.count}</span></div>
                <div class="feature-cost">Cost: ${this.formatNumber(cost)} mana</div>
                <div class="feature-effect">+${this.formatNumber(feature.baseEffect)} mana/sec each</div>
            `;
            
            // Add click handler
            li.addEventListener('click', () => {
                const success = Game.purchaseFeature(feature.id);
                if (success) {
                    this.updateDisplay();
                    this.renderFeatures();
                }
            });
            
            featureList.appendChild(li);
        });
    },

    // Update all displays
    updateDisplay() {
        const { mana, manaPerSecond, coreType, evolutionProgress, evolutionThreshold } = Game.state;
        
        // Update mana display
        this.elements.manaDisplay.textContent = this.formatNumber(mana);
        this.elements.manaPerSecondDisplay.textContent = this.formatNumber(manaPerSecond);
        
        // Update core type display
        this.elements.coreTypeDisplay.textContent = coreType;
        
        // Update evolution progress
        const evolutionPercentage = (evolutionProgress / evolutionThreshold) * 100;
        this.elements.evolutionBar.style.width = Math.min(100, evolutionPercentage) + '%';
    }
};

// Export the UI object
window.UI = UI;