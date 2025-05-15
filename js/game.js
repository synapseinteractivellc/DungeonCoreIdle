// Game state and mechanics
const Game = {
    
    // Initialize game state to null
    state: null, // Will be initialized in init()

    // Default game state from the beginning
    getDefaultState() {
        return {
            mana: 0,
            totalMana: 0,
            manaCapacity: 100,
            totalManaLost: 0,
            manaPerClick: 1,
            manaPerSecond: 0,
            coreLevel: 1,
            coreType: 'Stone Core',
            evolutionProgress: 0,
            evolutionThreshold: 1000000,
            lastSave: Date.now(),
            
            // New statistics tracking
            totalClicks: 0,
            featuresPurchased: 0,
            upgradesPurchased: 0,
            startTime: Date.now(),
            playTime: 0,
            features: [
                {
                    id: 'manaVein',
                    type: 'passive',
                    name: 'Mana Vein',
                    description: 'A small crack in the earth that leaks mana.',
                    baseCost: 10,
                    baseEffect: 0.1,
                    count: 0,
                    unlocked: true
                },
                {
                    id: 'crystalFormation',
                    type: 'passive',
                    name: 'Crystal Formation',
                    description: 'Small crystals that attract ambient mana.',
                    baseCost: 50,
                    baseEffect: 0.5,
                    count: 0,
                    unlocked: true
                },
                {
                    id: 'manaPool',
                    type: 'passive',
                    name: 'Mana Pool',
                    description: 'A small pool of liquid mana that slowly generates more mana.',
                    baseCost: 200,
                    baseEffect: 2,
                    count: 0,
                    unlocked: true
                },
                {
                    id: 'fungalGrowth',
                    type: 'passive',
                    name: 'Fungal Growth',
                    description: 'Magical fungi that convert organic matter into mana.',
                    baseCost: 500,
                    baseEffect: 5,
                    count: 0,
                    unlocked: false,
                    unlockAt: 100 // Total mana required to unlock
                }
            ],
            upgrades: [
                {
                    id: 'manaCapacityI',
                    type: 'storage',
                    name: 'Expanded Mana Channels',
                    description: 'Increase your core\'s ability to store mana.',
                    baseCost: 75,
                    effect: 100,  // Adds +100 to manaCapacity
                    count: 0,
                    unlocked: true
                },
                {
                    id: 'manaCapacityII',
                    type: 'storage',
                    name: 'Mana Compression',
                    description: 'Learn to compress mana, vastly increasing storage.',
                    baseCost: 750,
                    effect: 500,  // Adds +500 to manaCapacity
                    count: 0,
                    unlocked: false,
                    unlockAt: 500
                },
                {
                    id: 'manaCapacityIII',
                    type: 'storage',
                    name: 'Dimensional Mana Pocket',
                    description: 'Create a small pocket dimension to store excess mana.',
                    baseCost: 5000,
                    effect: 2500,  // Adds +2500 to manaCapacity
                    count: 0,
                    unlocked: false,
                    unlockAt: 2000
                },
                {
                    id: 'coreEnhancement',
                    type: 'click',
                    name: 'Core Enhancement',
                    description: 'Strengthen your core to absorb more mana with each click.',
                    baseCost: 25,
                    effect: 1,  // Adds +1 to manaPerClick
                    count: 0,
                    unlocked: true
                },
                {
                    id: 'manaResonance',
                    type: 'click',
                    name: 'Mana Resonance',
                    description: 'Tune your core to resonate with ambient mana, increasing click effectiveness.',
                    baseCost: 100,
                    effect: 2,  // Adds +2 to manaPerClick
                    count: 0,
                    unlocked: false,
                    unlockAt: 200  // Total mana required to unlock
                },
                {
                    id: 'coreExpansion',
                    type: 'click',
                    name: 'Core Expansion',
                    description: 'Expand your core\'s mana absorption surface area.',
                    baseCost: 500,
                    effect: 5,  // Adds +5 to manaPerClick
                    count: 0,
                    unlocked: false,
                    unlockAt: 1000  // Total mana required to unlock
                }
            ]
        };
    },
    

    // Initialize the game state
    init() {
        // Start with default state
        this.state = this.getDefaultState();
        
        // Check if we're coming from a reset
        const isReset = sessionStorage.getItem('dungeonCoreReset') === 'true';
        if (isReset) {
            // Clear the reset flag
            sessionStorage.removeItem('dungeonCoreReset');
            console.log("Game reset to default state");
            // We're already using default state, so no need to do anything else
        } else {
            // Try to load saved game
            this.loadGame();
        }
        
        // Calculate derived values
        this.calculateManaPerSecond();
        this.calculateManaPerClick();
        return this.state;
    },

    // Helper functions
    calculateFeatureCost(feature) {
        return Math.floor(feature.baseCost * Math.pow(1.15, feature.count));
    },

    // Calculate upgrade cost based on count
    calculateUpgradeCost(upgrade) {
        return Math.floor(upgrade.baseCost * Math.pow(1.25, upgrade.count));
    },

    calculateFeatureEffect(feature) {
        return feature.baseEffect * feature.count;
    },

    // Game mechanics
    clickCore() {
        // Calculate potential mana gain
        const potentialMana = this.state.mana + this.state.manaPerClick;
        
        // Check if adding mana would exceed capacity
        if (potentialMana > this.state.manaCapacity) {
            // Calculate lost mana
            const lostMana = potentialMana - this.state.manaCapacity;
            // Add to total mana lost
            this.state.totalManaLost += lostMana;
        }
        
        // Set mana to min of potential gain or capacity (original code)
        this.state.mana = Math.min(this.state.mana + this.state.manaPerClick, this.state.manaCapacity);
        this.state.totalMana += this.state.manaPerClick;
        this.state.evolutionProgress += this.state.manaPerClick;
        
        // Increment click counter
        this.state.totalClicks++;
        
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
            
            // Increment features purchased counter
            this.state.featuresPurchased++;
            
            // Recalculate mana per second
            this.calculateManaPerSecond();
            
            return true;
        }
        
        return false;
    },

    // Update the purchaseUpgrade() method to track purchases
    purchaseUpgrade(upgradeId) {
        const upgrade = this.state.upgrades.find(u => u.id === upgradeId);
        
        if (!upgrade) return false;
        
        const cost = this.calculateUpgradeCost(upgrade);
        
        if (this.state.mana >= cost) {
            this.state.mana -= cost;
            upgrade.count++;
            
            // Increment upgrades purchased counter
            this.state.upgradesPurchased++;
            
            if (upgrade.type === 'click') {
                this.calculateManaPerClick();
            } else if (upgrade.type === 'storage') {
                this.calculateManaCapacity();
            }
            
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

    // Calculate mana per click based on upgrades
    calculateManaPerClick() {
        // Start with base value of 1
        let manaPerClick = 1;
        
        // Add effects from all click upgrades
        this.state.upgrades.forEach(upgrade => {
            if (upgrade.type === 'click') {
                manaPerClick += upgrade.effect * upgrade.count;
            }            
        });
        
        this.state.manaPerClick = manaPerClick;
    },

    // Calculate mana storage
    calculateManaCapacity() {
        // start with base of 100
        let manaCapacity = 100;

        // Add effects from all storage upgrades
        this.state.upgrades.forEach(upgrade => {
            if (upgrade.type === 'storage') {
                manaCapacity += upgrade.effect * upgrade.count;
            }
        });

        this.state.manaCapacity = manaCapacity;
    },

    // Add a method to update play time
    updatePlayTime() {
        const now = Date.now();
        this.state.playTime += (now - this.state.lastSave);
        this.state.lastSave = now;
    },

    // Add a method to format play time
    formatPlayTime() {
        let seconds = Math.floor(this.state.playTime / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
        
        seconds %= 60;
        minutes %= 60;
        
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    },

    // Add a method to calculate average mana per second
    calculateAvgManaPerSecond() {
        const playTimeInSeconds = this.state.playTime / 1000;
        if (playTimeInSeconds <= 0) return 0;
        
        return this.state.totalMana / playTimeInSeconds;
    },

    checkUnlocks() {
        let newUnlocks = false;
        
        // Check features unlocks
        this.state.features.forEach(feature => {
            if (!feature.unlocked && this.state.totalMana >= feature.unlockAt) {
                feature.unlocked = true;
                newUnlocks = true;
            }
        });
        
        // Check upgrades unlocks
        this.state.upgrades.forEach(upgrade => {
            if (!upgrade.unlocked && this.state.totalMana >= upgrade.unlockAt) {
                upgrade.unlocked = true;
                newUnlocks = true;
            }
        });
        
        return newUnlocks;
    },

    checkEvolution() {
        if (this.state.evolutionProgress >= this.state.evolutionThreshold) {
            // Future evolution mechanic placeholder
            // this.evolveCore();
            return false;
        }
        return false;
    },

    // Game loop - process idle gains
    processTick(deltaTime) {
        // Calculate mana gain for this tick (in seconds)
        const manaGain = (this.state.manaPerSecond * deltaTime) / 1000;
        
        // Calculate potential new mana value
        const potentialMana = this.state.mana + manaGain;
        
        // Check if adding mana would exceed capacity
        if (potentialMana > this.state.manaCapacity) {
            // Calculate lost mana
            const lostMana = potentialMana - this.state.manaCapacity;
            // Add to total mana lost
            this.state.totalManaLost += lostMana;
        }
        
        // Set mana to min of potential or capacity (original code)
        this.state.mana = Math.min(this.state.mana + manaGain, this.state.manaCapacity);
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
            try {
                const loadedState = JSON.parse(saveData);
                
                // Calculate offline progress
                const offlineTime = Date.now() - loadedState.lastSave;
                
                // Merge loaded state with current state
                // This allows new properties added in updates to use default values
                this.state = {...this.state, ...loadedState};
                
                // Process offline gains if appropriate
                if (offlineTime > 0) {
                    this.processOfflineProgress(offlineTime);
                }
                
                console.log("Game loaded from save");
            } catch (error) {
                console.error("Error loading save data:", error);
                // If there's an error loading, we already have default state
                console.log("Using default state due to error");
            }
        } else {
            console.log("No save data found, using default state");
            // We already have default state, so no need to do anything
        }
    },

    // Reset game state
    resetGame() {
        // Remove the save data
        localStorage.removeItem('dungeonCoreIdleSave');
        
        // Set a flag in sessionStorage to indicate we're resetting
        sessionStorage.setItem('dungeonCoreReset', 'true');
        
        console.log("Game data wiped from localStorage");
        
        // Reload the page
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