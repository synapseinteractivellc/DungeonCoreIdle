// Research UI Management
const ResearchUI = {
    // DOM Elements
    elements: {
        researchSection: null,
        researchPathsContainer: null,
        activeResearchContainer: null,
        researchProgressBar: null,
        researchProgressText: null,
        researchNameText: null,
        researchCancelButton: null,
        completedResearchContainer: null
    },

    // Initialize the research UI
    init() {
        // First, update the research section in the HTML if it doesn't exist
        this.createResearchTab();
        
        // Cache DOM elements
        this.elements.researchSection = document.getElementById('research-section');
        this.elements.researchPathsContainer = document.getElementById('research-paths-container');
        this.elements.activeResearchContainer = document.getElementById('active-research-container');
        this.elements.researchProgressBar = document.getElementById('research-progress-bar');
        this.elements.researchProgressText = document.getElementById('research-progress-text');
        this.elements.researchNameText = document.getElementById('research-name-text');
        this.elements.researchCancelButton = document.getElementById('research-cancel-button');
        this.elements.completedResearchContainer = document.getElementById('completed-research-container');

        // Set up event listeners
        this.setupEventListeners();
    },

    // Create the research tab structure
    createResearchTab() {
        const researchSection = document.getElementById('research-section');
        
        // If the section is still using the placeholder content, replace it
        if (researchSection.querySelector('.placeholder-content')) {
            researchSection.innerHTML = `
                <div class="research-container">
                    <div class="research-header">
                        <h2>Research Laboratory</h2>
                        <div class="research-info">
                            <p>Invest mana to research new abilities and upgrades for your dungeon core.</p>
                        </div>
                    </div>
                    
                    <div class="active-research-container" id="active-research-container">
                        <h3>Current Research</h3>
                        <div class="no-active-research" id="no-active-research">
                            <p>No research in progress. Select a research project below to begin.</p>
                        </div>
                        <div class="active-research-details" id="active-research-details" style="display: none;">
                            <div class="research-name" id="research-name-text">Research Name</div>
                            <div class="research-progress">
                                <div class="progress-bar-container">
                                    <div class="progress-bar" id="research-progress-bar"></div>
                                </div>
                                <div class="progress-text" id="research-progress-text">0%</div>
                            </div>
                            <button class="research-cancel-button" id="research-cancel-button">Cancel Research</button>
                        </div>
                    </div>

                    <div class="research-paths-container" id="research-paths-container">
                        <h3>Research Paths</h3>
                        <div class="research-paths-grid">
                            <!-- Research paths will be added here dynamically -->
                        </div>
                    </div>

                    <div class="completed-research-container" id="completed-research-container">
                        <h3>Completed Research</h3>
                        <div class="completed-research-list">
                            <!-- Completed research will be added here dynamically -->
                            <p class="no-completed-research">No research completed yet.</p>
                        </div>
                    </div>
                </div>
            `;
        }
    },

    // Set up event listeners
    setupEventListeners() {
        // Cancel research button
        if (this.elements.researchCancelButton) {
            this.elements.researchCancelButton.addEventListener('click', this.handleCancelResearch.bind(this));
        }
    },

    // Handle cancel research button click
    handleCancelResearch() {
        const success = Research.cancelResearch();
        if (success) {
            this.updateActiveResearch();
            UI.updateDisplay(); // Update mana display with refund
            UI.showNotification('Research cancelled. Half of the mana cost has been refunded.');
        }
    },

    // Render all research paths and projects
    renderResearchPaths() {
        const pathsContainer = this.elements.researchPathsContainer.querySelector('.research-paths-grid');
        if (!pathsContainer) return;

        pathsContainer.innerHTML = '';
        
        // For each research path
        Object.entries(Game.state.researchPaths).forEach(([pathKey, path]) => {
            const pathElement = document.createElement('div');
            pathElement.className = 'research-path';
            
            // Path header
            pathElement.innerHTML = `
                <div class="path-header">
                    <div class="path-icon">${path.icon}</div>
                    <div class="path-title">${path.name}</div>
                </div>
                <div class="path-description">${path.description}</div>
                <div class="research-projects-list" data-path="${pathKey}"></div>
            `;
            
            pathsContainer.appendChild(pathElement);
            
            // Add research projects for this path
            const projectsList = pathElement.querySelector(`.research-projects-list[data-path="${pathKey}"]`);
            
            // Group projects by tier
            const projectsByTier = {};
            path.researchProjects.forEach(project => {
                if (!projectsByTier[project.tier]) {
                    projectsByTier[project.tier] = [];
                }
                projectsByTier[project.tier].push(project);
            });
            
            // For each tier, add projects
            Object.keys(projectsByTier).sort((a, b) => a - b).forEach(tier => {
                const tierProjects = projectsByTier[tier];
                
                tierProjects.forEach(project => {
                    // Skip if not unlocked yet
                    if (!project.unlocked) return;
                    
                    // Skip if already completed
                    if (project.completed) return;
                    
                    // Check if the project is the active research
                    const isActive = Game.state.research.activeResearch && 
                                     Game.state.research.activeResearch.projectId === project.id;
                    
                    // Check if we can afford it
                    const canAfford = Game.state.mana >= project.cost;
                    
                    const projectElement = document.createElement('div');
                    projectElement.className = `research-project ${isActive ? 'active' : ''} ${canAfford ? '' : 'cant-afford'}`;
                    projectElement.dataset.projectId = project.id;
                    projectElement.dataset.path = pathKey;
                    
                    projectElement.innerHTML = `
                        <div class="project-header">
                            <div class="project-name">${project.name}</div>
                            <div class="project-cost">${UI.formatNumber(project.cost)} mana</div>
                        </div>
                        <div class="project-time">Research Time: ${this.formatTime(project.researchTime)}</div>
                        <div class="project-description">${project.description}</div>
                        <div class="project-effect">${this.formatEffect(project.effect)}</div>
                    `;
                    
                    // Add click handler
                    if (!isActive) {
                        projectElement.addEventListener('click', () => this.handleResearchClick(project.id, pathKey));
                    }
                    
                    projectsList.appendChild(projectElement);
                });
            });
        });
        
        // Update the active research display
        this.updateActiveResearch();
        
        // Update completed research
        this.updateCompletedResearch();
    },

    // Format research effect for display
    formatEffect(effect) {
        if (!effect) return '';
        
        switch (effect.type) {
            case 'manaPerSecondMultiplier':
                return `+${((effect.value - 1) * 100).toFixed(0)}% Mana Per Second`;
                
            case 'manaPerClickMultiplier':
                return `+${((effect.value - 1) * 100).toFixed(0)}% Mana Per Click`;
                
            case 'manaCapacityMultiplier':
                return `+${((effect.value - 1) * 100).toFixed(0)}% Mana Capacity`;
                
            case 'researchSpeedMultiplier':
                return `+${((effect.value - 1) * 100).toFixed(0)}% Research Speed`;
                
            case 'globalEfficiencyMultiplier':
                return `+${((effect.value - 1) * 100).toFixed(0)}% Global Efficiency`;
                
            case 'evolutionProgressMultiplier':
                return `+${((effect.value - 1) * 100).toFixed(0)}% Evolution Progress Speed`;
                
            case 'unlockFeature':
                return `Unlocks: ${this.getFeatureName(effect.value)}`;
                
            case 'unlockEvolution':
                return `Unlocks Evolution: ${this.getEvolutionName(effect.value)}`;
                
            default:
                return `Effect: ${effect.type}`;
        }
    },

    // Get feature name from ID
    getFeatureName(featureId) {
        const featureNames = {
            'smallAnimalLure': 'Small Animal Lure',
            'mediumAnimalLure': 'Medium Animal Lure',
            'adventurerLure': 'Adventurer Lure',
            'basicSnare': 'Basic Snare Trap',
            'pitTrap': 'Pit Trap',
            'manaDrainTrap': 'Mana Drain Trap'
        };
        
        return featureNames[featureId] || featureId;
    },

    // Get evolution name from ID
    getEvolutionName(evolutionId) {
        const evolutionNames = {
            'crystalCore': 'Crystal Core',
            'gemCore': 'Gem Core',
            'elementalCore': 'Elemental Core',
            'sentientCore': 'Sentient Core'
        };
        
        return evolutionNames[evolutionId] || evolutionId;
    },

    // Format time in seconds to mm:ss
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
    },

    // Handle click on a research project
    handleResearchClick(projectId, pathKey) {
        // Find the project
        const project = Game.state.researchPaths[pathKey].researchProjects.find(p => p.id === projectId);
        
        // Check if we can afford it
        if (Game.state.mana < project.cost) {
            UI.showNotification('Not enough mana for this research!');
            return;
        }
        
        // Start research
        const success = Research.startResearch(projectId);
        
        if (success) {
            // Update UI
            this.updateActiveResearch();
            UI.updateDisplay(); // Update mana display
            
            // Update the research project display
            this.renderResearchPaths();
            
            UI.showNotification(`Started researching: ${project.name}`);
        }
    },

    // Update active research display
    updateActiveResearch() {
        const activeResearch = Game.state.research.activeResearch;
        const noActiveResearchElem = document.getElementById('no-active-research');
        const activeResearchDetailsElem = document.getElementById('active-research-details');
        
        if (!activeResearch) {
            // No active research
            if (noActiveResearchElem) noActiveResearchElem.style.display = 'block';
            if (activeResearchDetailsElem) activeResearchDetailsElem.style.display = 'none';
            return;
        }
        
        // We have active research
        if (noActiveResearchElem) noActiveResearchElem.style.display = 'none';
        if (activeResearchDetailsElem) activeResearchDetailsElem.style.display = 'block';
        
        // Find the research project
        const project = Research.findProject(activeResearch.projectId);
        
        if (!project) return;
        
        // Update research name
        if (this.elements.researchNameText) {
            this.elements.researchNameText.textContent = project.name;
        }
        
        // Update progress bar
        const progress = Game.state.research.currentProgress * 100;
        if (this.elements.researchProgressBar) {
            this.elements.researchProgressBar.style.width = `${progress}%`;
        }
        
        // Update progress text
        if (this.elements.researchProgressText) {
            this.elements.researchProgressText.textContent = `${Math.floor(progress)}%`;
        }
    },

    // Update completed research display
    updateCompletedResearch() {
        const completedList = this.elements.completedResearchContainer.querySelector('.completed-research-list');
        if (!completedList) return;
        
        // Get completed research
        const completed = Research.getCompletedResearch();
        
        // Update display
        if (completed.length === 0) {
            completedList.innerHTML = '<p class="no-completed-research">No research completed yet.</p>';
            return;
        }
        
        completedList.innerHTML = '';
        
        // Group by path
        const byPath = {};
        completed.forEach(project => {
            if (!byPath[project.path]) {
                byPath[project.path] = [];
            }
            byPath[project.path].push(project);
        });
        
        // For each path
        Object.entries(byPath).forEach(([pathKey, projects]) => {
            const pathName = Game.state.researchPaths[pathKey].name;
            
            const pathElement = document.createElement('div');
            pathElement.className = 'completed-path';
            
            pathElement.innerHTML = `
                <div class="completed-path-name">${pathName}</div>
                <div class="completed-projects-list"></div>
            `;
            
            const projectsList = pathElement.querySelector('.completed-projects-list');
            
            // Add each completed project
            projects.forEach(project => {
                const projectElement = document.createElement('div');
                projectElement.className = 'completed-project';
                
                projectElement.innerHTML = `
                    <div class="completed-project-name">${project.name}</div>
                    <div class="completed-project-effect">${this.formatEffect(project.effect)}</div>
                `;
                
                projectsList.appendChild(projectElement);
            });
            
            completedList.appendChild(pathElement);
        });
    }
};

// Export the ResearchUI object
window.ResearchUI = ResearchUI;