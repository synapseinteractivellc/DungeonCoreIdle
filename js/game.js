// Game state and mechanics
const Game = {
    // Core game state
    state: {
        mana: 0,
        totalMana: 0,
        manaPerClick: 1,
        manaPerSecond: 0,
        coreLevel: 1,
        coreType: 'Stone Core',
        evolutionProgress: 0,
        evolutionThreshold: 1000000,
        lastSave: Date.now(),
        features: [
            {
                id: 'manaVein',
                name: 'Mana Vein',
                description: 'A small crack in the earth that leaks mana.',
                baseCost: 10,
                baseEffect: 0.1,
                count: 0,
                unlocked: true
            },
            {
                id: 'crystalFormation',
                name: 'Crystal Formation',
                description: 'Small crystals that attract ambient mana.',
                baseCost: 50,
                baseEffect: 0.5,
                count: 0,
                unlocked: true
            },
            {
                id: 'manaPool',
                name: 'Mana Pool',
                description: 'A small pool of liquid mana that slowly generates more mana.',
                baseCost: 200,
                baseEffect: 2,
                count: 0,
                unlocked: true
            },
            {
                id: 'fungalGrowth',
                name: 'Fungal Growth',
                description: 'Magical fungi that convert organic matter into mana.',
                baseCost: 500,
                baseEffect: 5,
                count: 0,
                unlocked: false,
                unlockAt: 100 // Total mana required to unlock
            }
        ]
    },

    // Initialize the game state
    init() {
        this.loadGame();
        this.calculateManaPerSecond();
        return this.state;
    },

    // Helper functions
    calculateFeatureCost(feature) {
        return Math.floor(feature.baseCost * Math.pow(1.15, feature.count));
    },

    calculateFeatureEffect(feature) {
        return feature.baseEffect * feature.count;
    },

    // Game mechanics
    clickCore() {
        this.state.mana += this.state.manaPerClick;
        this.state.totalMana += this.state.manaPerClick;
        this.state.evolutionProgress += this.state.manaPerClick;
        
        // Check for unlocks based on total mana
        this.checkUnlocks();
        
        // Check for evolution
        this.checkEvolution();
        
        return this.state.manaPerClick;
    },

    purchaseFeature(featureId) {
        const feature = this.state.features.find(f => f.id === featureId);
        
        if (!feature) return false;
        
        const cost = this.calculateFeatureCost(feature);
        
        if (this.state.mana >= cost) {
            this.state.mana -= cost;
            feature.count++;
            
            // Recalculate mana per second
            this.calculateManaPerSecond();
            
            return true;
        }
        
        return false;
    },

    calculateManaPerSecond() {
        this.state.manaPerSecond = 0;
        
        this.state.features.forEach(feature => {
            this.state.manaPerSecond += this.calculateFeatureEffect(feature);
        });
    },

    checkUnlocks() {
        let newUnlocks = false;
        
        this.state.features.forEach(feature => {
            if (!feature.unlocked && this.state.totalMana >= feature.unlockAt) {
                feature.unlocked = true;
                newUnlocks = true;
            }
        });
        
        return newUnlocks;
    },

    checkEvolution() {
        if (this.state.evolutionProgress >= this.state.evolutionThreshold) {
            // Future evolution mechanic placeholder
            // this.evolveCore();
            return true;
        }
        return false;
    },

    // Game loop - process idle gains
    processTick(deltaTime) {
        // Calculate mana gain for this tick (in seconds)
        const manaGain = (this.state.manaPerSecond * deltaTime) / 1000;
        
        this.state.mana += manaGain;
        this.state.totalMana += manaGain;
        this.state.evolutionProgress += manaGain;
        
        // Check for unlocks and evolution
        const newUnlocks = this.checkUnlocks();
        const canEvolve = this.checkEvolution();
        
        return { 
            newUnlocks,
            canEvolve
        };
    },

    // Save/Load functions
    saveGame() {
        const saveData = JSON.stringify(this.state);
        localStorage.setItem('dungeonCoreIdleSave', saveData);
        this.state.lastSave = Date.now();
    },

    loadGame() {
        const saveData = localStorage.getItem('dungeonCoreIdleSave');
        
        if (saveData) {
            const loadedState = JSON.parse(saveData);
            
            // Calculate offline progress
            const offlineTime = Date.now() - loadedState.lastSave;
            
            // Merge loaded state with default state (to handle new properties in updates)
            Object.assign(this.state, loadedState);
            
            // Process offline gains if appropriate
            if (offlineTime > 0) {
                this.processOfflineProgress(offlineTime);
            }
        }
    },

    resetGame() {
        localStorage.removeItem('dungeonCoreIdleSave');
        location.reload();
    },

    processOfflineProgress(offlineTime) {
        // Cap offline time to prevent excessive gains (e.g., max 12 hours)
        const cappedOfflineTime = Math.min(offlineTime, 12 * 60 * 60 * 1000);
        
        // Process the offline time gains
        this.processTick(cappedOfflineTime);
    }
};

// Export the Game object
window.Game = Game;