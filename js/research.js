// Research System
const Research = {
    // Initialize research system
    init() {
        // If game state doesn't have research data, initialize it
        if (!Game.state.research) {
            Game.state.research = {
                activeResearch: null,
                completedResearch: [],
                currentProgress: 0,
                researchSpeed: 1, // Base research speed multiplier
            };
        }

        // Initialize research paths if they don't exist
        if (!Game.state.researchPaths) {
            Game.state.researchPaths = this.getDefaultResearchPaths();
        }

        // Update research availability based on current game state
        this.updateAvailability();
    },

    // Default research paths
    getDefaultResearchPaths() {
        return {
            manaAffinity: {
                name: "Mana Affinity",
                description: "Improve your core's natural connection to mana.",
                icon: "🔮",
                researchProjects: [
                    {
                        id: "manaAffinity1",
                        name: "Natural Attunement",
                        description: "Attune your core to the natural flow of mana, increasing passive generation.",
                        cost: 100,
                        researchTime: 30, // in seconds
                        effect: {
                            type: "manaPerSecondMultiplier",
                            value: 1.1 // 10% increase to passive mana generation
                        },
                        unlocked: true,
                        completed: false,
                        requires: [],
                        tier: 1
                    },
                    {
                        id: "manaAffinity2",
                        name: "Mana Channels",
                        description: "Develop specialized channels for mana flow, increasing storage capacity.",
                        cost: 500,
                        researchTime: 120,
                        effect: {
                            type: "manaCapacityMultiplier",
                            value: 1.2 // 20% increase to mana capacity
                        },
                        unlocked: false,
                        completed: false,
                        requires: ["manaAffinity1"],
                        tier: 2
                    },
                    {
                        id: "manaAffinity3",
                        name: "Resonant Harmony",
                        description: "Harmonize your core's frequency with ambient mana, greatly enhancing absorption.",
                        cost: 2000,
                        researchTime: 300,
                        effect: {
                            type: "manaPerSecondMultiplier",
                            value: 1.25 // 25% increase to passive mana generation
                        },
                        unlocked: false,
                        completed: false,
                        requires: ["manaAffinity2"],
                        tier: 3
                    }
                ]
            },
            manaManipulation: {
                name: "Mana Manipulation",
                description: "Learn to control and shape mana for various effects.",
                icon: "✨",
                researchProjects: [
                    {
                        id: "manaManipulation1",
                        name: "Mana Focusing",
                        description: "Focus ambient mana into more concentrated forms, increasing click efficiency.",
                        cost: 150,
                        researchTime: 45,
                        effect: {
                            type: "manaPerClickMultiplier",
                            value: 1.15 // 15% increase to click mana
                        },
                        unlocked: true,
                        completed: false,
                        requires: [],
                        tier: 1
                    },
                    {
                        id: "manaManipulation2",
                        name: "Mana Compression",
                        description: "Compress mana to store more in the same space, significantly increasing capacity.",
                        cost: 600,
                        researchTime: 150,
                        effect: {
                            type: "manaCapacityMultiplier",
                            value: 1.3 // 30% increase to mana capacity
                        },
                        unlocked: false,
                        completed: false,
                        requires: ["manaManipulation1"],
                        tier: 2
                    },
                    {
                        id: "manaManipulation3",
                        name: "Mana Cycling",
                        description: "Learn to cycle and reuse mana, reducing waste and increasing efficiency.",
                        cost: 2500,
                        researchTime: 360,
                        effect: {
                            type: "researchSpeedMultiplier",
                            value: 1.2 // 20% faster research speed
                        },
                        unlocked: false,
                        completed: false,
                        requires: ["manaManipulation2"],
                        tier: 3
                    }
                ]
            },
            lures: {
                name: "Lures",
                description: "Develop methods to attract creatures into your dungeon.",
                icon: "🦌",
                researchProjects: [
                    {
                        id: "lures1",
                        name: "Natural Scent",
                        description: "Emit subtle scents that attract small animals to your dungeon.",
                        cost: 200,
                        researchTime: 60,
                        effect: {
                            type: "unlockFeature",
                            value: "smallAnimalLure" // Will need to create this feature
                        },
                        unlocked: true,
                        completed: false,
                        requires: [],
                        tier: 1
                    },
                    {
                        id: "lures2",
                        name: "Comfort Aura",
                        description: "Create an aura of comfort that makes creatures feel safe in your vicinity.",
                        cost: 800,
                        researchTime: 180,
                        effect: {
                            type: "unlockFeature",
                            value: "mediumAnimalLure" // Will need to create this feature
                        },
                        unlocked: false,
                        completed: false,
                        requires: ["lures1"],
                        tier: 2
                    },
                    {
                        id: "lures3",
                        name: "Curiosity Whisper",
                        description: "Send out subtle psychic whispers that attract intelligent creatures.",
                        cost: 3000,
                        researchTime: 420,
                        effect: {
                            type: "unlockFeature",
                            value: "adventurerLure" // Will need to create this feature
                        },
                        unlocked: false,
                        completed: false,
                        requires: ["lures2"],
                        tier: 3
                    }
                ]
            },
            traps: {
                name: "Trap Mastery",
                description: "Design and deploy various traps throughout your dungeon.",
                icon: "⚔️",
                researchProjects: [
                    {
                        id: "traps1",
                        name: "Basic Snares",
                        description: "Simple traps that catch small creatures.",
                        cost: 250,
                        researchTime: 75,
                        effect: {
                            type: "unlockFeature",
                            value: "basicSnare" // Will need to create this feature
                        },
                        unlocked: true,
                        completed: false,
                        requires: [],
                        tier: 1
                    },
                    {
                        id: "traps2",
                        name: "Pit Traps",
                        description: "Concealed pits that trap larger creatures.",
                        cost: 1000,
                        researchTime: 210,
                        effect: {
                            type: "unlockFeature",
                            value: "pitTrap" // Will need to create this feature
                        },
                        unlocked: false,
                        completed: false,
                        requires: ["traps1"],
                        tier: 2
                    },
                    {
                        id: "traps3",
                        name: "Mana Drain Trap",
                        description: "Advanced traps that drain essence from caught creatures, converting it to mana.",
                        cost: 3500,
                        researchTime: 480,
                        effect: {
                            type: "unlockFeature",
                            value: "manaDrainTrap" // Will need to create this feature
                        },
                        unlocked: false,
                        completed: false,
                        requires: ["traps2"],
                        tier: 3
                    }
                ]
            },
            coreEnhancement: {
                name: "Core Enhancement",
                description: "Improve your core's fundamental abilities and prepare for evolution.",
                icon: "💎",
                researchProjects: [
                    {
                        id: "coreEnhancement1",
                        name: "Core Stabilization",
                        description: "Stabilize your core structure, improving overall efficiency.",
                        cost: 300,
                        researchTime: 90,
                        effect: {
                            type: "globalEfficiencyMultiplier",
                            value: 1.05 // 5% global efficiency increase
                        },
                        unlocked: true,
                        completed: false,
                        requires: [],
                        tier: 1
                    },
                    {
                        id: "coreEnhancement2",
                        name: "Crystal Integration",
                        description: "Integrate crystal formations into your core, preparing for evolution.",
                        cost: 1500,
                        researchTime: 240,
                        effect: {
                            type: "evolutionProgressMultiplier",
                            value: 1.1 // 10% faster evolution progress
                        },
                        unlocked: false,
                        completed: false,
                        requires: ["coreEnhancement1"],
                        tier: 2
                    },
                    {
                        id: "coreEnhancement3",
                        name: "Evolution Catalyst",
                        description: "Develop a catalyst that will accelerate your first evolution.",
                        cost: 5000,
                        researchTime: 600,
                        effect: {
                            type: "unlockEvolution",
                            value: "crystalCore" // First evolution stage
                        },
                        unlocked: false,
                        completed: false,
                        requires: ["coreEnhancement2"],
                        tier: 3
                    },
                    {
                        id: "autoFeaturesBuyer",
                        name: "Autonomous Mana Channeling",
                        description: "Develop autonomous processes that automatically create dungeon features when sufficient mana is available.",
                        cost: 10000,
                        researchTime: 600, // 10 minutes
                        effect: {
                            type: "unlockFeature",
                            value: "autoFeaturesBuyer"
                        },
                        unlocked: false,
                        completed: false,
                        requires: ["coreEnhancement2"],
                        tier: 3
                    },
                    {
                        id: "autoUpgradesBuyer",
                        name: "Core Self-Optimization",
                        description: "Enable your core to autonomously apply click upgrades when enough mana is accumulated.",
                        cost: 10000,
                        researchTime: 600, // 10 minutes
                        effect: {
                            type: "unlockFeature",
                            value: "autoUpgradesBuyer"
                        },
                        unlocked: false,
                        completed: false,
                        requires: ["coreEnhancement2"],
                        tier: 3
                    },
                    {
                        id: "autoStorageBuyer",
                        name: "Dimensional Auto-Expansion",
                        description: "Allow your core to automatically expand its storage capacity when sufficient mana is available.",
                        cost: 10000,
                        researchTime: 600, // 10 minutes
                        effect: {
                            type: "unlockFeature",
                            value: "autoStorageBuyer"
                        },
                        unlocked: false,
                        completed: false,
                        requires: ["coreEnhancement2"],
                        tier: 3
                    }
                ]
            },
            // New research path: Mana Generation
            manaGeneration: {
                name: "Mana Generation",
                description: "Develop methods to passively generate mana through dungeon features.",
                icon: "⚡",
                researchProjects: [
                    {
                        id: "manaGeneration1",
                        name: "Dungeon Features",
                        description: "Learn to create physical features in your dungeon that generate mana passively.",
                        cost: 100,
                        researchTime: 90, // 1:30 minutes
                        effect: {
                            type: "unlockUIElement",
                            value: "featuresTab" // Will unlock the features tab in the side panel
                        },
                        unlocked: true,
                        completed: false,
                        requires: [],
                        tier: 1
                    },
                    {
                        id: "manaGeneration2",
                        name: "Enhanced Features",
                        description: "Improve your understanding of mana-generating features, making them more efficient.",
                        cost: 500,
                        researchTime: 180, // 3 minutes
                        effect: {
                            type: "featureEfficiencyMultiplier",
                            value: 1.2 // 20% increase to all feature effects
                        },
                        unlocked: false,
                        completed: false,
                        requires: ["manaGeneration1"],
                        tier: 2
                    },
                    {
                        id: "manaGeneration3",
                        name: "Advanced Mana Conduits",
                        description: "Develop advanced mana conduits that significantly boost passive generation.",
                        cost: 2000,
                        researchTime: 300, // 5 minutes
                        effect: {
                            type: "featureEfficiencyMultiplier",
                            value: 1.5 // 50% increase to all feature effects
                        },
                        unlocked: false,
                        completed: false,
                        requires: ["manaGeneration2"],
                        tier: 3
                    }
                ]
            },
            
            // New research path: Mana Bank
            manaBank: {
                name: "Mana Bank",
                description: "Develop methods to store greater amounts of mana within your core.",
                icon: "💾",
                researchProjects: [
                    {
                        id: "manaBank1",
                        name: "Mana Storage",
                        description: "Learn techniques to increase your core's mana storage capacity.",
                        cost: 100,
                        researchTime: 90, // 1:30 minutes
                        effect: {
                            type: "unlockUIElement",
                            value: "storageTab" // Will unlock the storage tab in the side panel
                        },
                        unlocked: true,
                        completed: false,
                        requires: [],
                        tier: 1
                    },
                    {
                        id: "manaBank2",
                        name: "Compressed Storage",
                        description: "Develop methods to compress mana, allowing for greater storage in the same space.",
                        cost: 500,
                        researchTime: 180, // 3 minutes
                        effect: {
                            type: "manaCapacityMultiplier",
                            value: 1.3 // 30% increase to mana capacity
                        },
                        unlocked: false,
                        completed: false,
                        requires: ["manaBank1"],
                        tier: 2
                    },
                    {
                        id: "manaBank3",
                        name: "Dimensional Storage",
                        description: "Create a pocket dimension within your core to store vast amounts of mana.",
                        cost: 2000,
                        researchTime: 300, // 5 minutes
                        effect: {
                            type: "manaCapacityMultiplier",
                            value: 1.5 // 50% increase to mana capacity
                        },
                        unlocked: false,
                        completed: false,
                        requires: ["manaBank2"],
                        tier: 3
                    }
                ]
            }
        };
    },

    // Update which research projects are available based on prerequisites
    updateAvailability() {
        const completedResearch = Game.state.research.completedResearch;
        
        // For each research path
        Object.values(Game.state.researchPaths).forEach(path => {
            // For each project in the path
            path.researchProjects.forEach(project => {
                // If the project is already completed, no need to check
                if (project.completed) return;
                
                // Check if all requirements are met
                const requirementsMet = project.requires.every(reqId => 
                    completedResearch.includes(reqId)
                );
                
                // Update unlocked status
                project.unlocked = requirementsMet || project.requires.length === 0;
            });
        });
    },

    // Start researching a project
    startResearch(projectId) {
        // Find the project across all research paths
        let selectedProject = null;
        let parentPath = null;

        Object.entries(Game.state.researchPaths).forEach(([pathKey, path]) => {
            const project = path.researchProjects.find(p => p.id === projectId);
            if (project) {
                selectedProject = project;
                parentPath = pathKey;
            }
        });

        // If project not found or already completed, return
        if (!selectedProject || selectedProject.completed) return false;
        
        // Check if we can afford it
        if (Game.state.mana < selectedProject.cost) return false;
        
        // Deduct the cost and start research
        Game.state.mana -= selectedProject.cost;
        Game.state.research.activeResearch = {
            projectId: projectId,
            path: parentPath,
            totalTime: selectedProject.researchTime,
            remainingTime: selectedProject.researchTime
        };
        Game.state.research.currentProgress = 0;
        
        return true;
    },

    // Cancel the current research project and refund half the cost
    cancelResearch() {
        const activeResearch = Game.state.research.activeResearch;
        if (!activeResearch) return false;
        
        // Find the project
        const project = this.findProject(activeResearch.projectId);
        if (!project) return false;
        
        // Calculate refund (half the cost)
        const refund = Math.floor(project.cost / 2);
        
        // Add refund back to mana
        Game.state.mana = Math.min(Game.state.mana + refund, Game.state.manaCapacity);
        
        // Reset active research
        Game.state.research.activeResearch = null;
        Game.state.research.currentProgress = 0;
        
        // Reset nav indicator (if UI is initialized)
        if (window.UI && UI.updateResearchNavIndicator) {
            UI.updateResearchNavIndicator(0);
        }
        
        return true;
    },

    // Helper to find a research project by ID
    findProject(projectId) {
        for (const path of Object.values(Game.state.researchPaths)) {
            const project = path.researchProjects.find(p => p.id === projectId);
            if (project) return project;
        }
        return null;
    },

    // Process research progress in the game loop
    processResearch(deltaTime) {
        const research = Game.state.research;
        if (!research.activeResearch) return false;
        
        // Calculate progress for this tick
        const progressThisTick = (deltaTime / 1000) * research.researchSpeed;
        
        // Update remaining time
        research.activeResearch.remainingTime -= progressThisTick;
        
        // Calculate progress percentage
        const totalTime = research.activeResearch.totalTime;
        research.currentProgress = (totalTime - research.activeResearch.remainingTime) / totalTime;
        
        // Check if research is complete
        if (research.activeResearch.remainingTime <= 0) {
            this.completeResearch();
            return true;
        }
        
        return false;
    },

    // Complete the current research project
    completeResearch() {
        const research = Game.state.research;
        if (!research.activeResearch) return false;
        
        // Find the project
        const projectId = research.activeResearch.projectId;
        const pathKey = research.activeResearch.path;
        
        if (!Game.state.researchPaths[pathKey]) return false;
        
        const project = Game.state.researchPaths[pathKey].researchProjects.find(p => p.id === projectId);
        if (!project) return false;
        
        // Mark as completed
        project.completed = true;
        research.completedResearch.push(projectId);
        
        // Apply research effect
        this.applyResearchEffect(project.effect);
        
        // Reset active research
        research.activeResearch = null;
        research.currentProgress = 0;
        
        // Reset nav indicator (if UI is initialized)
        if (window.UI && UI.updateResearchNavIndicator) {
            UI.updateResearchNavIndicator(0);
        }
        
        // Update which research is now available
        this.updateAvailability();
        
        return {
            projectId,
            projectName: project.name,
            effect: project.effect
        };
    },

    // Apply the effect of completed research
    applyResearchEffect(effect) {
        if (!effect) return;
        
        switch (effect.type) {
            case "manaPerSecondMultiplier":
                if (!Game.state.multipliers) Game.state.multipliers = {};
                if (!Game.state.multipliers.manaPerSecond) Game.state.multipliers.manaPerSecond = 1;
                Game.state.multipliers.manaPerSecond *= effect.value;
                Game.calculateManaPerSecond(); // Recalculate with new multiplier
                break;
                
            case "manaPerClickMultiplier":
                if (!Game.state.multipliers) Game.state.multipliers = {};
                if (!Game.state.multipliers.manaPerClick) Game.state.multipliers.manaPerClick = 1;
                Game.state.multipliers.manaPerClick *= effect.value;
                Game.calculateManaPerClick(); // Recalculate with new multiplier
                break;
                
            case "manaCapacityMultiplier":
                if (!Game.state.multipliers) Game.state.multipliers = {};
                if (!Game.state.multipliers.manaCapacity) Game.state.multipliers.manaCapacity = 1;
                Game.state.multipliers.manaCapacity *= effect.value;
                Game.calculateManaCapacity(); // Recalculate with new multiplier
                break;
                
            case "researchSpeedMultiplier":
                Game.state.research.researchSpeed *= effect.value;
                break;
                
            case "globalEfficiencyMultiplier":
                if (!Game.state.multipliers) Game.state.multipliers = {};
                if (!Game.state.multipliers.global) Game.state.multipliers.global = 1;
                Game.state.multipliers.global *= effect.value;
                // Update all stats that depend on this
                Game.calculateManaPerSecond();
                Game.calculateManaPerClick();
                Game.calculateManaCapacity();
                break;
                
            case "evolutionProgressMultiplier":
                if (!Game.state.multipliers) Game.state.multipliers = {};
                if (!Game.state.multipliers.evolutionProgress) Game.state.multipliers.evolutionProgress = 1;
                Game.state.multipliers.evolutionProgress *= effect.value;
                break;
                
            case "unlockEvolution":
                // This will be handled when we implement evolution
                // Just a placeholder for now
                console.log(`Evolution unlocked: ${effect.value}`);
                break;

            case "unlockFeature":
                // Handle existing feature unlocks
                console.log(`Feature unlocked: ${effect.value}`);
                
                // Add special handling for autobuyer unlocks
                if (effect.value === "autoFeaturesBuyer" || 
                    effect.value === "autoUpgradesBuyer" || 
                    effect.value === "autoStorageBuyer") {
                    
                    // Find the upgrade in the upgrades list and unlock it
                    const upgrade = Game.state.upgrades.find(u => u.id === effect.value);
                    if (upgrade) {
                        upgrade.unlocked = true;
                    }
                }
                break;
            
            case "unlockUIElement":
                // Handle UI element unlocks (new case)
                console.log(`UI Element unlocked: ${effect.value}`);
                
                // Update the unlockedContent in Game state
                if (Game.state.unlockedContent && effect.value in Game.state.unlockedContent) {
                    Game.state.unlockedContent[effect.value] = true;
                    
                    // Apply the UI unlock
                    Game.applyUIUnlocks(effect.value);
                    
                    // Refresh tab display
                    if (window.UI && UI.refreshTabDisplay) {
                        UI.refreshTabDisplay();
                    }

                    // Show a notification
                    if (window.UI) {
                        let notificationText = "New feature unlocked!";
                        
                        // Customize notification based on what was unlocked
                        if (effect.value === "featuresTab") {
                            notificationText = "Dungeon Features unlocked! Check the Features tab.";
                        } else if (effect.value === "storageTab") {
                            notificationText = "Mana Storage upgrades unlocked! Check the Storage tab.";
                        } else if (effect.value === "automationTab") {
                            notificationText = "Automation features unlocked! Check the Automation tab.";
                        }
                        
                        UI.showNotification(notificationText);
                    }
                }
                break;
        }
    },

    // Get all available (unlocked but not completed) research projects
    getAvailableResearch() {
        const available = [];
        
        Object.entries(Game.state.researchPaths).forEach(([pathKey, path]) => {
            path.researchProjects.forEach(project => {
                if (project.unlocked && !project.completed) {
                    available.push({
                        ...project,
                        path: pathKey
                    });
                }
            });
        });
        
        return available;
    },

    // Get all completed research projects
    getCompletedResearch() {
        const completed = [];
        
        Object.entries(Game.state.researchPaths).forEach(([pathKey, path]) => {
            path.researchProjects.forEach(project => {
                if (project.completed) {
                    completed.push({
                        ...project,
                        path: pathKey
                    });
                }
            });
        });
        
        return completed;
    }
};

// Export the Research object
window.Research = Research;