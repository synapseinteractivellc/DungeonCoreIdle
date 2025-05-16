# Implementation Plan for Dungeon Core Idle

This document outlines the development roadmap for Dungeon Core Idle, breaking down the implementation into manageable phases.

## Phase 1: Core Mechanics

### Foundation (Week 1-2)
- [X] Set up project structure and basic UI framework
- [X] Implement manual clicking for mana generation
- [X] Create basic resource tracking (mana, core level)
- [X] Implement simple dungeon features that provide passive income
- [X] Add basic upgrade system for dungeon features

### Core UI Elements (Week 2-3)
- [X] Design and implement main game screen
- [X] Create resource display panels
- [X] Implement feature purchase and upgrade interface
- [X] Add basic stats tracking

## Phase 2: Game Systems

### Research System (Week 3-4)
- [X] Implement research tree structure
- [X] Create 5 initial research paths:
  - [X] Natural Affinity (implemented as Mana Affinity)
  - [X] Mana Manipulation
  - [X] Lure System (implemented as Lures)
  - [X] Trap Mastery
  - [X] Core Enhancement
  - [ ] Absorbtion  
  - [ ] Mana Generation
  - [ ] Mana Bank
- [X] Add research point accrual system (implemented using mana instead of separate research points)
- [X] Implement research effects on game mechanics

### Dungeon Growth (Week 4-5)
- [X] Implement dungeon size mechanic
- [X] Create expansion system
- [ ] Add placement restrictions based on dungeon size
- [X] Implement visualization of dungeon growth
- [ ] Create an entrance (alter initial core placement, left hand side)
- [ ] Need a way to move the core

### Skills System (Week 5-6)
- [ ] Design skill unlocking mechanism
- [ ] Implement skill effects
- [ ] Create UI for viewing and managing skills
- [ ] Add skill level-up system

## Phase 3: Advanced Features

### Adventurer System (Week 6-7)
- [ ] Implement adventurer attraction mechanics
- [ ] Create adventurer interaction system
- [ ] Add essence collection from adventurers
- [ ] Implement basic adventurer difficulty scaling

### Evolution/Prestige System (Week 7-8)
- [ ] Design evolution thresholds
- [ ] Implement reset mechanics
- [ ] Create permanent bonuses from evolution
- [ ] Add visual changes for different core types
- [ ] Implement evolution points system

### Balance and Economy (Week 8-9)
- [ ] Balance mana generation rates
- [ ] Tune research costs and effects
- [ ] Balance evolution requirements and rewards
- [ ] Create scaling formulas for long-term progression

## Phase 4: Polish and Enhancement

### UI Refinement (Week 9-10)
- [ ] Improve visual feedback for actions
- [ ] Add animations for key events
- [ ] Implement tooltips and help system
- [ ] Create settings menu

### Saving/Loading (Week 10)
- [X] Implement save game functionality
- [X] Add auto-save feature
- [X] Create import/export save options
- [X] Add offline progression calculation

### Additional Content (Week 11)
- [ ] Add achievements system
- [ ] Implement special events
- [ ] Create additional research paths
- [ ] Add advanced evolution tiers

## Phase 5: Testing and Launch

### Testing (Week 12)
- [ ] Conduct balance testing
- [ ] Test for progression blockers
- [ ] Verify offline progress calculations
- [ ] Check for performance issues with late-game scaling

### Launch Preparation (Week 13)
- [ ] Final polish pass
- [ ] Create game description and marketing materials
- [ ] Prepare distribution platform(s)
- [ ] Set up feedback channels

## Future Enhancements (Post-Launch)
- [ ] Mobile adaptation
- [ ] Additional evolution paths
- [ ] Special challenge modes
- [ ] Expanded adventurer system
- [ ] Visual dungeon builder

## Technical Requirements

### Frontend
- HTML5, CSS3, JavaScript
- Responsive design for various screen sizes
- Minimalist visual style with focus on readability

### Game Engine
- Custom incremental game engine
- Efficient number handling for large values
- Timer-based update system for idle mechanics

### Data Management
- Local storage for saving game state
- Serialization/deserialization for save imports

## Notes
- Focus on core gameplay loop first, then expand features
- Prioritize smooth progression curve
- Balance active engagement vs. idle progression
- Ensure meaningful choices in research and evolution paths

## Progress Summary
- Phase 1 is fully completed
- Research System from Phase 2 is fully implemented with 5 research paths
- Saving/Loading from Phase 4 is already implemented
- Current focus: Dungeon Growth mechanics from Phase 2