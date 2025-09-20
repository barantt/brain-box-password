# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an interactive L-shaped block puzzle game built with vanilla JavaScript and Konva.js. The game features a diamond-shaped grid where players manipulate 12 colored L-shaped blocks to fill the entire board.

## Architecture

### Single-File Structure
The entire application is contained in `game.html` with embedded HTML, CSS, and JavaScript. There is no build system or package management.

### Key Components
- **Game Canvas**: 900x700px Konva.js stage
- **Diamond Grid**: Generated programmatically using offset coordinates
- **Physics System**: Custom gravity simulation with configurable parameters
- **12 L-shaped Blocks**: Each with unique colors and transform capabilities
- **Grid Occupancy System**: Tracks which blocks occupy which grid positions
- **Win Detection**: Automatically detects when the board is complete

### Game Mechanics
- Blocks fall under gravity when not selected
- Click to select blocks (disables gravity for selected block)
- Drag blocks to reposition them
- Rotate using the transform controller (45-degree increments)
- Flip horizontally with H key or arrow keys
- Flip vertically with V key or arrow keys
- Double-click to reset block position
- Automatic snap-to-grid functionality
- Collision prevention between blocks

## Development Commands

The game is now organized as a modular ES6 application:
- Open `index.html` for the original version
- Open `game-tailwind.html` for the Tailwind CSS enhanced version
- Use `test.html` for debugging with console access
- Modern browsers with ES6 module support required

## Tailwind CSS Integration

The game includes an enhanced version with Tailwind CSS styling:
- `game-tailwind.html`: Modern UI with Tailwind CSS
- Responsive design that works on mobile and desktop
- Beautiful cards, gradients, and shadows
- Real-time progress tracking
- Enhanced visual feedback
- No changes to game logic

## Project Structure

```
src/
├── config/
│   └── gameConfig.js     # Game configuration constants
├── components/
│   ├── Game.js          # Main game controller
│   ├── Grid.js          # Diamond grid management
│   ├── Block.js         # L-shaped block components
│   ├── Physics.js       # Physics engine
│   ├── InputHandler.js  # User input management
│   └── UI.js            # UI elements and effects
└── utils/
    └── helpers.js       # Utility functions
```

## Component Architecture

### Game Class (`src/components/Game.js`)
- Main orchestrator that initializes all components
- Manages game state and lifecycle
- Coordinates interactions between components

### Grid Class (`src/components/Grid.js`)
- Manages diamond-shaped grid creation and rendering
- Tracks grid occupancy state
- Provides grid snapping and collision detection

### Block Class (`src/components/Block.js`)
- Represents individual L-shaped puzzle pieces
- Handles block rendering, physics, and transformations
- Manages block-grid interactions

### Physics Class (`src/components/Physics.js`)
- Implements gravity simulation
- Handles block movement and collisions
- Runs animation loop for smooth physics

### InputHandler Class (`src/components/InputHandler.js`)
- Processes mouse and keyboard input
- Manages block selection and transformation controls
- Handles drag, drop, and rotation operations

### UI Class (`src/components/UI.js`)
- Renders game interface elements
- Manages completion celebrations
- Handles styling and layout

## Key Features

- **Modular Design**: Each component has a single responsibility
- **Event-Driven**: Components communicate through events and callbacks
- **Configuration-Driven**: Game parameters centralized in `gameConfig.js`
- **ES6 Modules**: Modern JavaScript module system for better organization

## Configuration

### Game Settings (lines 56-67)
```javascript
const width = 900;
const height = 700;
const halfBlockSize = 30;
const gravity = {
  force: 0.3,
  friction: 0.98,
  bounce: 5,
  groundY: height
};
```

### Block Colors
Each of the 12 blocks has a unique color scheme defined in the `createLBlock()` function.

## Important Notes

- The game uses Konva.js loaded from CDN
- All coordinates are relative to the canvas center
- Grid positions use a diamond pattern with offset rows
- Physics simulation runs via Konva.Animation
- Chinese UI text is embedded in the HTML