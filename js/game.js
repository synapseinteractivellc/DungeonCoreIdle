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
            dungeonSize: 0,           // Current used space in the dungeon
            maxDungeonSize: 0,        // Max available space in the dungeon
            coreLevel: 1,
            coreType: 'Stone Core',
            evolutionProgress: 0,
            evolutionThreshold: 1000000,
            lastSave: Date.now(),

            // Unlocked UI content
            unlockedContent: {
                // Nav tabs
                dungeonNav: false,
                researchNav: false,
                skillsNav: false,
                
                // Side panel tabs
                featuresTab: false,
                storageTab: false,
                automationTab: false
            },
            
            // Multipliers for various game mechanics
            multipliers: {
                manaPerSecond: 1,
                manaPerClick: 1,
                manaCapacity: 1,
                evolutionProgress: 1,
                global: 1
            },
            
            // New statistics tracking
            totalClicks: 0,
            featuresPurchased: 0,
            upgradesPurchased: 0,
            researchCompleted: 0,
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
                    size: 1, 
                    unlocked: false,                    
                    unlockAt: 100,
                    affordable: false
                },
                {
                    id: 'crystalFormation',
                    type: 'passive',
                    name: 'Crystal Formation',
                    description: 'Small crystals that attract ambient mana.',
                    baseCost: 50,
                    baseEffect: 0.5,
                    count: 0,
                    size: 1, 
                    unlocked: false,
                    unlockAt: 500, // Total mana required to unlock
                    affordable: false
                },
                {
                    id: 'manaPool',
                    type: 'passive',
                    name: 'Mana Pool',
                    description: 'A small pool of liquid mana that slowly generates more mana.',
                    baseCost: 200,
                    baseEffect: 2,
                    count: 0,
                    size: 2, 
                    unlocked: false,
                    unlockAt: 500, // Total mana required to unlock
                    affordable: false
                },
                {
                    id: 'fungalGrowth',
                    type: 'passive',
                    name: 'Fungal Growth',
                    description: 'Magical fungi that convert organic matter into mana.',
                    baseCost: 500,
                    baseEffect: 5,
                    count: 0,
                    size: 2, 
                    unlocked: false,
                    unlockAt: 1000, // Total mana required to unlock
                    affordable: false
                },
                {
                    id: 'essenceConduit',
                    type: 'passive',
                    name: 'Essence Conduit',
                    description: 'A crystalline structure that channels ambient mana from the surrounding area directly into your core.',
                    baseCost: 2000,
                    baseEffect: 10,
                    count: 0,
                    size: 3, 
                    unlocked: false,
                    unlockAt: 5000, // Total mana required to unlock
                    affordable: false
                },
                {
                    id: 'manaNexus',
                    type: 'passive',
                    name: 'Mana Nexus',
                    description: 'A powerful convergence point where ley lines intersect, creating a vortex that draws in magical energy.',
                    baseCost: 10000,
                    baseEffect: 25,
                    count: 0,
                    size: 4, 
                    unlocked: false,
                    unlockAt: 20000, // Total mana required to unlock
                    affordable: false
                }
            ],
            upgrades: [
                {
                    id: 'dungeonExpansion',
                    type: 'expansion',
                    name: 'Dungeon Expansion',
                    description: 'Expand your dungeon\'s capacity, allowing more features to be placed.',
                    baseCost: 100,
                    effect: 1,  // Each purchase adds 1 to maxDungeonSize
                    count: 0,
                    unlocked: true,
                    affordable: false
                },
                {
                    id: 'manaCapacityI',
                    type: 'storage',
                    name: 'Expanded Mana Channels',
                    description: 'Increase your core\'s ability to store mana.',
                    baseCost: 75,
                    effect: 100,  // Adds +100 to manaCapacity
                    count: 0,
                    unlocked: false,                    
                    unlockAt: 75,
                    affordable: false
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
                    unlockAt: 500,
                    affordable: false
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
                    unlockAt: 2000,
                    affordable: false
                },
                {
                    id: 'coreEnhancement',
                    type: 'click',
                    name: 'Core Enhancement',
                    description: 'Strengthen your core to absorb more mana with each click.',
                    baseCost: 25,
                    effect: 1,  // Adds +1 to manaPerClick
                    count: 0,
                    unlocked: true,
                    affordable: false
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
                    unlockAt: 200, // Total mana required to unlock
                    affordable: false  
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
                    unlockAt: 1000,  // Total mana required to unlock
                    affordable: false
                },
                {
                    id: 'autoFeaturesBuyer',
                    type: 'automation',
                    name: 'Mana Feature Automaton',
                    description: 'Automatically purchases dungeon features when you have enough mana.',
                    baseCost: 50000,
                    effect: 'automate',
                    count: 0,
                    unlocked: false,
                    affordable: false
                },
                {
                    id: 'autoUpgradesBuyer',
                    type: 'automation',
                    name: 'Click Upgrade Automaton',
                    description: 'Automatically purchases click upgrades when you have enough mana.',
                    baseCost: 50000,
                    effect: 'automate',
                    count: 0,
                    unlocked: false,
                    affordable: false
                },
                {
                    id: 'autoStorageBuyer',
                    type: 'automation',
                    name: 'Storage Expansion Automaton',
                    description: 'Automatically purchases storage upgrades when you have enough mana.',
                    baseCost: 50000,
                    effect: 'automate',
                    count: 0,
                    unlocked: false,
                    affordable: false
                }
            ],
            dungeonGrid: []
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
        
        // Apply any UI unlocks from saved state
        this.applyAllUIUnlocks();
        
        // Initialize the research system
        Research.init();
        
        // Calculate derived values
        this.calculateManaPerSecond();
        this.calculateManaPerClick();
        this.calculateManaCapacity();
        
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
        
        // Set mana to min of potential gain or capacity
        this.state.mana = Math.min(this.state.mana + this.state.manaPerClick, this.state.manaCapacity);
        this.state.totalMana += this.state.manaPerClick;
        
        // Apply evolution progress multiplier if it exists
        const evolutionMultiplier = 
            (this.state.multipliers && this.state.multipliers.evolutionProgress) 
            ? this.state.multipliers.evolutionProgress 
            : 1;
            
        this.state.evolutionProgress += this.state.manaPerClick * evolutionMultiplier;
        
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
        
        // Check if we can afford it
        if (this.state.mana < cost) return false;
        
        // Check if we have enough dungeon space
        if (this.state.dungeonSize + feature.size > this.state.maxDungeonSize) {
            UI.showNotification('Not enough dungeon space!');
            return false;
        }
        
        // If we have enough mana and space, purchase the feature
        this.state.mana -= cost;
        feature.count++;
        
        // Update dungeon size
        this.state.dungeonSize += feature.size;
        
        // Increment features purchased counter
        this.state.featuresPurchased++;
        
        // Recalculate mana per second
        this.calculateManaPerSecond();
        
        return true;
    },

    sellFeature (featureId) {
        const feature = this.state.features.find(f => f.id === featureId);
        
        if (!feature || feature.count <= 0) return false;
        
        // Calculate sell value (typically 50% of purchase cost)
        const currentCost = this.calculateFeatureCost(feature);
        const sellValue = Math.floor(currentCost * 0.5); // 50% refund
        
        // Update feature count and dungeon size
        feature.count--;
        this.state.dungeonSize -= feature.size;
        
        // Add mana from selling
        this.state.mana = Math.min(this.state.mana + sellValue, this.state.manaCapacity);
        
        // Recalculate mana per second
        this.calculateManaPerSecond();
        
        return {
            soldFeature: feature.name,
            refundAmount: sellValue
        };
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
            } else if (upgrade.type === 'expansion') {
                // Update max dungeon size for expansion upgrades
                this.state.maxDungeonSize += upgrade.effect;
                UI.showNotification(`Dungeon expanded to ${this.state.maxDungeonSize} tiles!`);
            }
            
            return true;
        }
        
        return false;
    },

    calculateManaPerSecond() {
        let basePerSecond = 0;
        
        // Calculate base value from features
        this.state.features.forEach(feature => {
            basePerSecond += this.calculateFeatureEffect(feature);
        });
        
        // Apply multipliers
        let totalMultiplier = 1;
        
        // Apply specific multiplier if it exists
        if (this.state.multipliers && this.state.multipliers.manaPerSecond) {
            totalMultiplier *= this.state.multipliers.manaPerSecond;
        }
        
        // Apply global multiplier if it exists
        if (this.state.multipliers && this.state.multipliers.global) {
            totalMultiplier *= this.state.multipliers.global;
        }
        
        this.state.manaPerSecond = basePerSecond * totalMultiplier;
    },

    // Calculate mana per click based on upgrades
    calculateManaPerClick() {
        // Start with base value of 1
        let basePerClick = 1;
        
        // Add effects from all click upgrades
        this.state.upgrades.forEach(upgrade => {
            if (upgrade.type === 'click') {
                basePerClick += upgrade.effect * upgrade.count;
            }            
        });
        
        // Apply multipliers
        let totalMultiplier = 1;
        
        // Apply specific multiplier if it exists
        if (this.state.multipliers && this.state.multipliers.manaPerClick) {
            totalMultiplier *= this.state.multipliers.manaPerClick;
        }
        
        // Apply global multiplier if it exists
        if (this.state.multipliers && this.state.multipliers.global) {
            totalMultiplier *= this.state.multipliers.global;
        }
        
        this.state.manaPerClick = basePerClick * totalMultiplier;
    },

    // Calculate mana storage
    calculateManaCapacity() {
        // start with base of 100
        let baseCapacity = 100;

        capacityIncreaseFromSize = this.state.maxDungeonSize * 75;

        baseCapacity += capacityIncreaseFromSize;

        // Add effects from all storage upgrades
        this.state.upgrades.forEach(upgrade => {
            if (upgrade.type === 'storage') {
                baseCapacity += upgrade.effect * upgrade.count;
            }
        });

        // Apply multipliers
        let totalMultiplier = 1;
        
        // Apply specific multiplier if it exists
        if (this.state.multipliers && this.state.multipliers.manaCapacity) {
            totalMultiplier *= this.state.multipliers.manaCapacity;
        }
        
        // Apply global multiplier if it exists
        if (this.state.multipliers && this.state.multipliers.global) {
            totalMultiplier *= this.state.multipliers.global;
        }
        
        this.state.manaCapacity = baseCapacity * totalMultiplier;
    },

    // Process autobuyers in the game loop
    processAutobuyers(deltaTime) {
        // Check if we have any active autobuyers
        const autoFeaturesBuyer = this.state.upgrades.find(u => u.id === 'autoFeaturesBuyer');
        const autoUpgradesBuyer = this.state.upgrades.find(u => u.id === 'autoUpgradesBuyer');
        const autoStorageBuyer = this.state.upgrades.find(u => u.id === 'autoStorageBuyer');
        
        let purchaseMade = false;
        
        // Process features autobuyer
        if (autoFeaturesBuyer && autoFeaturesBuyer.count > 0) {
            // Sort features by cost (cheapest first)
            const affordableFeatures = this.state.features
                .filter(f => f.unlocked)
                .sort((a, b) => this.calculateFeatureCost(a) - this.calculateFeatureCost(b));
            
            // Try to buy each feature
            for (const feature of affordableFeatures) {
                if (this.purchaseFeature(feature.id)) {
                    purchaseMade = true;
                    // Show indicator
                    UI.showAutobuyerIndicator(`Feature: ${feature.name}`);
                    break; // Only buy one feature per tick
                }
            }
        }
        
        // Process click upgrades autobuyer
        if (autoUpgradesBuyer && autoUpgradesBuyer.count > 0) {
            // Sort upgrades by cost for 'click' type
            const clickUpgrades = this.state.upgrades
                .filter(u => u.unlocked && u.type === 'click')
                .sort((a, b) => this.calculateUpgradeCost(a) - this.calculateUpgradeCost(b));
            
            // Try to buy each upgrade
            for (const upgrade of clickUpgrades) {
                if (this.purchaseUpgrade(upgrade.id)) {
                    purchaseMade = true;
                    // Show indicator
                    UI.showAutobuyerIndicator(`Upgrade: ${upgrade.name}`);
                    break; // Only buy one upgrade per tick
                }
            }
        }
        
        // Process storage upgrades autobuyer
        if (autoStorageBuyer && autoStorageBuyer.count > 0) {
            // Sort upgrades by cost for 'storage' type
            const storageUpgrades = this.state.upgrades
                .filter(u => u.unlocked && u.type === 'storage')
                .sort((a, b) => this.calculateUpgradeCost(a) - this.calculateUpgradeCost(b));
            
            // Try to buy each upgrade
            for (const upgrade of storageUpgrades) {
                if (this.purchaseUpgrade(upgrade.id)) {
                    purchaseMade = true;
                    UI.showAutobuyerIndicator(`Upgrade: ${upgrade.name}`);
                    break;
                }
            }
        }
        
        return purchaseMade;
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
        
        // Check UI unlocks - returns true if anything new was unlocked
        const uiUnlocks = this.checkUIUnlocks();
        
        return newUnlocks || uiUnlocks;
    },

    // Check for UI unlocks based on game progress
    checkUIUnlocks() {
        let anyNewUnlocks = false;
        
        // Unlock Dungeon tab at 100 total mana
        if (!this.state.unlockedContent.dungeonNav && this.state.mana >= 100) {
            this.state.unlockedContent.dungeonNav = true;
            this.applyUIUnlocks('dungeonNav');
            anyNewUnlocks = true;
            
            // Show a notification
            if (window.UI) {
                UI.showNotification('Dungeon expansion unlocked!');
            }
        }
        
        return anyNewUnlocks;
    },

    // Apply UI unlocks in the DOM
    applyUIUnlocks(unlockType) {
        switch(unlockType) {
            case 'dungeonNav':
                const dungeonBtn = document.querySelector('.nav-btn[data-section="dungeon"]');
                if (dungeonBtn) dungeonBtn.classList.add('unlocked');
                break;
                
            case 'researchNav':
                const researchBtn = document.querySelector('.nav-btn[data-section="research"]');
                if (researchBtn) researchBtn.classList.add('unlocked');
                break;
                
            case 'skillsNav':
                const skillsBtn = document.querySelector('.nav-btn[data-section="skills"]');
                if (skillsBtn) skillsBtn.classList.add('unlocked');
                break;
                
            // Add cases for other UI elements as needed
        }
    },

    // Apply all currently unlocked UI elements
    applyAllUIUnlocks() {
        // Apply each unlocked element
        if (this.state.unlockedContent.dungeonNav) this.applyUIUnlocks('dungeonNav');
        if (this.state.unlockedContent.researchNav) this.applyUIUnlocks('researchNav');
        if (this.state.unlockedContent.skillsNav) this.applyUIUnlocks('skillsNav');
        
        // Add more as needed for other UI elements
    },

    checkEvolution() {
        if (this.state.evolutionProgress >= this.state.evolutionThreshold) {
            // Future evolution mechanic placeholder
            // this.evolveCore();
            return false;
        }
        return false;
    },

    checkAffordability() {
        let newAffordable = false;
        
        // Check features
        this.state.features.forEach(feature => {
            if (feature.unlocked) {
                const cost = this.calculateFeatureCost(feature);
                // If we couldn't afford it before but can now
                if (!feature.affordable && this.state.mana >= cost) {
                    feature.affordable = true;
                    newAffordable = true;
                } 
                // If we could afford it before but can't now
                else if (feature.affordable && this.state.mana < cost) {
                    feature.affordable = false;
                }
            }
        });
        
        // Check upgrades
        this.state.upgrades.forEach(upgrade => {
            if (upgrade.unlocked) {
                const cost = this.calculateUpgradeCost(upgrade);
                // If we couldn't afford it before but can now
                if (!upgrade.affordable && this.state.mana >= cost) {
                    upgrade.affordable = true;
                    newAffordable = true;
                } 
                // If we could afford it before but can't now
                else if (upgrade.affordable && this.state.mana < cost) {
                    upgrade.affordable = false;
                }
            }
        });
        
        return newAffordable;
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
        
        // Set mana to min of potential or capacity
        this.state.mana = Math.min(this.state.mana + manaGain, this.state.manaCapacity);
        this.state.totalMana += manaGain;
        
        // Apply evolution progress multiplier if it exists
        const evolutionMultiplier = 
            (this.state.multipliers && this.state.multipliers.evolutionProgress) 
            ? this.state.multipliers.evolutionProgress 
            : 1;
            
        this.state.evolutionProgress += manaGain * evolutionMultiplier;
        
        // Process research progress
        const researchComplete = Research.processResearch(deltaTime);
        
        // Process autobuyers
        const autobuyerPurchase = this.processAutobuyers(deltaTime);
        
        // Check for unlocks and evolution
        const newUnlocks = this.checkUnlocks();
        const canEvolve = this.checkEvolution();
        const newAffordable = this.checkAffordability();
        
        return { 
            newUnlocks,
            canEvolve,
            researchComplete,
            needsUIUpdate: newUnlocks || newAffordable || researchComplete || autobuyerPurchase
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