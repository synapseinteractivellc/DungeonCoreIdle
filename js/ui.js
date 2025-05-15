// UI Management
const UI = {
    // DOM Elements
    elements: {
        core: null,
        coreContainer: null,
        manaDisplay: null,
        manaCapacityDisplay: null,
        manaPerSecondDisplay: null,
        manaPerClickDisplay: null,
        dungeonSizeDisplay: null,
        maxDungeonSizeDisplay: null,
        availableSpaceDisplay: null,
        coreTypeDisplay: null,
        evolutionBar: null,
        featureList: null,
        upgradeList: null,
        saveButton: null,
        wipeButton: null,
        
        // New navigation elements
        navButtons: null,
        gameSections: null,
        
        // Stats displays
        lifetimeManaDisplay: null,
        manaLostDisplay: null,
        totalClicksDisplay: null,
        featuresPurchasedDisplay: null,
        upgradesPurchasedDisplay: null,
        researchCompletedDisplay: null,
        playTimeDisplay: null,
        avgManaPerSecondDisplay: null
    },

    // Update the init() method to cache the new DOM elements
    init() {
        // Cache DOM elements (existing)
        this.elements.core = document.getElementById('core');
        this.elements.coreContainer = document.getElementById('coreContainer');
        this.elements.manaDisplay = document.getElementById('manaDisplay');
        this.elements.manaCapacityDisplay = document.getElementById('manaCapacityDisplay');
        this.elements.manaPerSecondDisplay = document.getElementById('manaPerSecondDisplay');
        this.elements.manaPerClickDisplay = document.getElementById('manaPerClickDisplay');
        this.elements.dungeonSizeDisplay = document.getElementById('dungeonSizeDisplay');
        this.elements.maxDungeonSizeDisplay = document.getElementById('maxDungeonSizeDisplay');
        this.elements.availableSpaceDisplay = document.getElementById('availableSpaceDisplay');
        this.elements.coreTypeDisplay = document.getElementById('coreTypeDisplay');
        this.elements.evolutionBar = document.getElementById('evolutionBar');
        this.elements.saveButton = document.querySelector('.header-buttons-right button:first-child');
        this.elements.wipeButton = document.querySelector('.header-buttons-right button:last-child');
        this.elements.featureList = document.getElementById('featureList');
        this.elements.upgradeList = document.getElementById('upgradeList');
        
        // Cache new DOM elements
        this.elements.navButtons = document.querySelectorAll('.nav-btn');
        this.elements.gameSections = document.querySelectorAll('.game-section');
        
        // Cache stats elements
        this.elements.lifetimeManaDisplay = document.getElementById('lifetimeManaDisplay');
        this.elements.manaLostDisplay = document.getElementById('manaLostDisplay');
        this.elements.totalClicksDisplay = document.getElementById('totalClicksDisplay');
        this.elements.featuresPurchasedDisplay = document.getElementById('featuresPurchasedDisplay');
        this.elements.upgradesPurchasedDisplay = document.getElementById('upgradesPurchasedDisplay');
        this.elements.researchCompletedDisplay = document.getElementById('researchCompletedDisplay');
        this.elements.playTimeDisplay = document.getElementById('playTimeDisplay');
        this.elements.avgManaPerSecondDisplay = document.getElementById('avgManaPerSecondDisplay');
        
        // Add research progress indicator and timer to the Research tab button
        const researchButton = document.querySelector('.nav-btn[data-section="research"]');
        if (researchButton) {
            // Check if the indicator already exists
            if (!researchButton.querySelector('.nav-progress-indicator')) {
                const progressIndicator = document.createElement('div');
                progressIndicator.className = 'nav-progress-indicator';
                researchButton.appendChild(progressIndicator);
            }
            
            // Check if the timer already exists
            if (!researchButton.querySelector('.nav-timer')) {
                const timerElement = document.createElement('div');
                timerElement.className = 'nav-timer research-timer hidden';
                timerElement.textContent = '--:--';
                researchButton.appendChild(timerElement);
            }
        }
        
        // Add mana progress indicator and timer to the Main tab button
        const mainButton = document.querySelector('.nav-btn[data-section="main"]');
        if (mainButton) {
            // Check if the indicator already exists
            if (!mainButton.querySelector('.nav-progress-indicator')) {
                const progressIndicator = document.createElement('div');
                progressIndicator.className = 'nav-progress-indicator';
                // Add a specific class for styling if needed
                progressIndicator.classList.add('mana-progress-indicator');
                mainButton.appendChild(progressIndicator);
            }
            
            // Check if the timer already exists
            if (!mainButton.querySelector('.nav-timer')) {
                const timerElement = document.createElement('div');
                timerElement.className = 'nav-timer mana-timer hidden';
                timerElement.textContent = '--:--';
                mainButton.appendChild(timerElement);
            }
        }
        
        // Set up event listeners
        this.setupEventListeners();
    },

    // Update the setupEventListeners method to handle navigation
    setupEventListeners() {
        // Existing event listeners
        this.elements.core.addEventListener('click', this.handleCoreClick.bind(this));
        this.elements.saveButton.addEventListener('click', this.handleSaveGame.bind(this));
        this.elements.wipeButton.addEventListener('click', this.handleWipeGame.bind(this));
        
        // Add navigation event listeners
        this.elements.navButtons.forEach(button => {
            button.addEventListener('click', this.handleNavigation.bind(this));
        });
    },
    
    updateResearchNavIndicator(progress) {
        const researchButton = document.querySelector('.nav-btn[data-section="research"]');
        if (!researchButton) return;
        
        const progressIndicator = researchButton.querySelector('.nav-progress-indicator');
        if (!progressIndicator) return;
        
        // Update width based on progress percentage
        progressIndicator.style.width = `${progress}%`;
        
        // Add/remove active class for glow effect
        if (progress > 0) {
            progressIndicator.classList.add('active');
        } else {
            progressIndicator.classList.remove('active');
        }
        
        // Also update the research timer
        this.updateResearchTimer();
    },
    
    // Add new method to update main nav indicator with mana/capacity
    updateMainNavIndicator(mana, capacity) {
        const mainButton = document.querySelector('.nav-btn[data-section="main"]');
        if (!mainButton) return;
        
        const progressIndicator = mainButton.querySelector('.nav-progress-indicator');
        if (!progressIndicator) return;
        
        // Calculate percentage of mana capacity
        const percentage = Math.min(100, (mana / capacity) * 100);
        
        // Update width based on progress percentage
        progressIndicator.style.width = `${percentage}%`;
        
        // Add/remove active class for glow effect
        if (percentage > 0) {
            progressIndicator.classList.add('active');
            
            // Add pulsing effect when mana is nearly full
            if (percentage > 90) {
                progressIndicator.classList.add('nearly-full');
            } else {
                progressIndicator.classList.remove('nearly-full');
            }
        } else {
            progressIndicator.classList.remove('active');
            progressIndicator.classList.remove('nearly-full');
        }
        
        // Update the mana fill timer
        this.updateManaFillTimer(mana, capacity);
    },
    
    // New method to update mana fill timer
    updateManaFillTimer(mana, capacity) {
        const timerElement = document.querySelector('.nav-btn[data-section="main"] .nav-timer');
        if (!timerElement) return;
        
        // If mana is already full or there's no passive generation
        if (mana >= capacity || Game.state.manaPerSecond <= 0) {
            timerElement.classList.add('hidden');
            return;
        }
        
        // Calculate time until full in seconds
        const remainingMana = capacity - mana;
        const secondsUntilFull = remainingMana / Game.state.manaPerSecond;
        
        // Format the time
        const timeString = this.formatTimerTime(secondsUntilFull);
        
        // Update the timer text
        timerElement.textContent = timeString;
        timerElement.classList.remove('hidden');
    },
    
    // Update research timer
    updateResearchTimer() {
        const timerElement = document.querySelector('.nav-btn[data-section="research"] .nav-timer');
        if (!timerElement) return;
        
        // If no active research
        if (!Game.state.research || !Game.state.research.activeResearch) {
            timerElement.classList.add('hidden');
            return;
        }
        
        // Get remaining time in seconds
        const remainingTime = Game.state.research.activeResearch.remainingTime;
        
        // Format the time
        const timeString = this.formatTimerTime(remainingTime);
        
        // Update the timer text
        timerElement.textContent = timeString;
        timerElement.classList.remove('hidden');
    },
    
    // Helper method to format time for timers
    formatTimerTime(seconds) {
        if (seconds < 0) return '00:00';
        
        // Handle very large times (> 1 hour)
        if (seconds > 3600) {
            const hours = Math.floor(seconds / 3600);
            return `${hours}h+`;
        }
        
        // Format as mm:ss
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    },

    // Add new handler methods
    handleSaveGame() {
        Game.saveGame();
        this.showNotification('Game saved successfully!');
    },

    handleWipeGame() {
        if (confirm('Are you sure you want to wipe all save data? This cannot be undone.')) {
            Game.resetGame();
        }
    },

    handleNavigation(event) {
        const sectionId = event.target.dataset.section;
        
        // Update active button
        this.elements.navButtons.forEach(button => {
            button.classList.remove('active');
        });
        event.target.classList.add('active');
        
        // Update active section
        this.elements.gameSections.forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${sectionId}-section`).classList.add('active');
    },

    // Add a notification method
    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Add it to the body
        document.body.appendChild(notification);
        
        // Remove it after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 3000);
    },

    // Helper function to format numbers for display
    formatNumber(num) {
        if (num < 1000) return num.toFixed(1);
        if (num < 1000000) return (num / 1000).toFixed(2) + 'K';
        if (num < 1000000000) return (num / 1000000).toFixed(2) + 'M';
        if (num < 1000000000000) return (num / 1000000000).toFixed(2) + 'B';
        if (num < 1000000000000000) return (num / 1000000000000).toFixed(2) + 'T';        
        if (num < 1000000000000000000) return (num / 1000000000000000).toFixed(2) + 'Quad';
        return (num / 1000000000000000000).toFixed(2) + 'Quin';
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
        particle.textContent = '+' + this.formatNumber(amount);
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
            const hasSpace = (Game.state.dungeonSize + feature.size) <= Game.state.maxDungeonSize;
            
            const li = document.createElement('li');
            li.className = 'feature-item';
            
            // Add styles for affordability and space constraints
            if (!canAfford) {
                li.style.opacity = '0.6';
            }
            
            if (!hasSpace) {
                li.classList.add('cant-fit');
            }
            
            li.dataset.featureId = feature.id;
            
            li.innerHTML = `
                <div class="feature-name">${feature.name} <span class="feature-count">${feature.count}</span></div>
                <div class="feature-cost">Cost: ${this.formatNumber(cost)} mana</div>
                <div class="feature-effect">+${this.formatNumber(feature.baseEffect)} mana/sec each</div>
                <div class="feature-size">Size: ${feature.size} ${feature.size > 1 ? 'tiles' : 'tile'}</div>
                ${!hasSpace ? `<div class="size-warning">Not enough space (need ${feature.size} tiles)</div>` : ''}
            `;
            
            // Add click handler
            li.addEventListener('click', () => {
                if (!hasSpace) {
                    UI.showNotification(`Not enough dungeon space! Need ${feature.size} free tiles.`);
                    return;
                }
                
                const success = Game.purchaseFeature(feature.id);
                if (success) {
                    this.updateDisplay();
                    this.renderFeatures();
                }
            });
            
            featureList.appendChild(li);
        });
    },

    // Add new method for rendering upgrades
    renderUpgrades() {
        const upgradeList = this.elements.upgradeList;
        if (!upgradeList) return; // Safety check
        
        upgradeList.innerHTML = '';
        
        Game.state.upgrades.forEach(upgrade => {
            if (!upgrade.unlocked) return;
            
            const cost = Game.calculateUpgradeCost(upgrade);
            const canAfford = Game.state.mana >= cost;
            
            const li = document.createElement('li');
            li.className = 'feature-item'; // Reusing the feature-item class
            li.style.opacity = canAfford ? '1' : '0.6';
            li.dataset.upgradeId = upgrade.id;
            
            if (upgrade.type === 'click') {
                li.innerHTML = `
                    <div class="feature-name">${upgrade.name} <span class="feature-count">Lvl ${upgrade.count}</span></div>
                    <div class="feature-cost">Cost: ${this.formatNumber(cost)} mana</div>
                    <div class="feature-effect">+${upgrade.effect} mana/click each</div>
                `;
            } else if (upgrade.type === 'storage') {
                li.innerHTML = `
                    <div class="feature-name">${upgrade.name} <span class="feature-count">Lvl ${upgrade.count}</span></div>
                    <div class="feature-cost">Cost: ${this.formatNumber(cost)} mana</div>
                    <div class="feature-effect">+${upgrade.effect} mana storage</div>
                `;
            } else if (upgrade.type === 'automation') {
                // Special display for automation upgrades
                const status = upgrade.count > 0 ? 'Active' : 'Inactive';
                const statusColor = upgrade.count > 0 ? '#8aff8a' : '#e63946';
                
                li.innerHTML = `
                    <div class="feature-name">${upgrade.name} <span class="feature-count" style="color: ${statusColor}">${status}</span></div>
                    <div class="feature-cost">Cost: ${this.formatNumber(cost)} mana</div>
                    <div class="feature-effect">${upgrade.description}</div>
                `;
            } else if (upgrade.type === 'expansion') {
                li.innerHTML = `
                    <div class="feature-name">${upgrade.name} <span class="feature-count">Lvl ${upgrade.count}</span></div>
                    <div class="feature-cost">Cost: ${this.formatNumber(cost)} mana</div>
                    <div class="feature-effect">+${upgrade.effect} dungeon size</div>
                    <div class="feature-effect">Current space: ${Game.state.dungeonSize}/${Game.state.maxDungeonSize}</div>
                `;
            }
            
            // Add click handler
            li.addEventListener('click', () => {
                const success = Game.purchaseUpgrade(upgrade.id);
                if (success) {
                    this.updateDisplay();
                    this.renderUpgrades();
                }
            });
            
            upgradeList.appendChild(li);
        });
    },

    updateStatsDisplay() {
        // Update lifetime mana
        this.elements.lifetimeManaDisplay.textContent = this.formatNumber(Game.state.totalMana);

        // Update total mana lost
        this.elements.manaLostDisplay.textContent = this.formatNumber(Game.state.totalManaLost);
        
        // Update total clicks
        this.elements.totalClicksDisplay.textContent = Game.state.totalClicks.toLocaleString();
        
        // Update features purchased
        this.elements.featuresPurchasedDisplay.textContent = Game.state.featuresPurchased.toLocaleString();
        
        // Update upgrades purchased
        this.elements.upgradesPurchasedDisplay.textContent = Game.state.upgradesPurchased.toLocaleString();
        
        // Update research completed
        if (this.elements.researchCompletedDisplay && Game.state.research) {
            this.elements.researchCompletedDisplay.textContent = 
                Game.state.research.completedResearch ? Game.state.research.completedResearch.length : 0;
        }
        
        // Update play time
        Game.updatePlayTime();
        this.elements.playTimeDisplay.textContent = Game.formatPlayTime();
        
        // Update average mana per second
        const avgManaPerSecond = Game.calculateAvgManaPerSecond();
        this.elements.avgManaPerSecondDisplay.textContent = this.formatNumber(avgManaPerSecond);
    },

    // Update the updateDisplay method to also update stats
    updateDisplay() {
        const { mana, manaCapacity, manaPerSecond, manaPerClick, coreType, evolutionProgress, evolutionThreshold } = Game.state;
        
        // Update mana display
        this.elements.manaDisplay.textContent = this.formatNumber(mana);
        this.elements.manaCapacityDisplay.textContent = this.formatNumber(manaCapacity);
        this.elements.manaPerSecondDisplay.textContent = this.formatNumber(manaPerSecond);
        
        // Update mana per click display if the element exists
        if (this.elements.manaPerClickDisplay) {
            this.elements.manaPerClickDisplay.textContent = this.formatNumber(manaPerClick);
        }

        // Update dungeon size display
        if (this.elements.dungeonSizeDisplay && this.elements.maxDungeonSizeDisplay && this.elements.availableSpaceDisplay) {
            this.elements.dungeonSizeDisplay.textContent = Game.state.dungeonSize;
            this.elements.maxDungeonSizeDisplay.textContent = Game.state.maxDungeonSize;
            this.elements.availableSpaceDisplay.textContent = Game.state.maxDungeonSize - Game.state.dungeonSize;
        }
        
        // Update core type display
        this.elements.coreTypeDisplay.textContent = coreType;
        
        // Update evolution progress
        const evolutionPercentage = (evolutionProgress / evolutionThreshold) * 100;
        this.elements.evolutionBar.style.width = Math.min(100, evolutionPercentage) + '%';
        
        // Update the mana progress indicator on the main button
        this.updateMainNavIndicator(mana, manaCapacity);
        
        // Update stats display
        this.updateStatsDisplay();
    },

    // Create a small indicator when autobuyers purchase something
    showAutobuyerIndicator(type) {
        const indicator = document.createElement('div');
        indicator.className = 'autobuyer-indicator';
        indicator.textContent = `Auto-purchased ${type}`;
        indicator.style.position = 'fixed';
        indicator.style.bottom = '60px';
        indicator.style.left = '50%';
        indicator.style.transform = 'translateX(-50%)';
        indicator.style.backgroundColor = '#4f8a8b';
        indicator.style.color = 'white';
        indicator.style.padding = '5px 10px';
        indicator.style.borderRadius = '4px';
        indicator.style.fontSize = '0.8rem';
        indicator.style.opacity = '0.8';
        indicator.style.zIndex = '999';
        
        document.body.appendChild(indicator);
        
        // Remove after 2 seconds
        setTimeout(() => {
            if (indicator.parentNode) {
                document.body.removeChild(indicator);
            }
        }, 2000);
    }
};

// Export the UI object
window.UI = UI;