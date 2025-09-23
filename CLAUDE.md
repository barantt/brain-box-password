# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "Brain Box Password" (智能方块密码) - an interactive L-shaped block puzzle game built with vanilla JavaScript and Konva.js. The game features a diamond-shaped grid where players manipulate 12 colored L-shaped blocks to fill the entire board.

## Architecture

### Project Structure
The project exists in multiple forms:
- **Modular ES6 Version** (`src/` directory): Modern component-based architecture
- **Monolithic Version** (`game.html`): Original single-file implementation for reference
- **No Build System**: Client-side only with CDN dependencies (Konva.js)

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

### Running the Game
- **Main Version**: Open `index.html` in a modern browser (loads modular ES6 version)
- **Enhanced UI**: Open `game-tailwind.html` for Tailwind CSS styling
- **Debug Mode**: Open `test.html` - exposes game instance to `window.game` for console debugging
- **Legacy Reference**: Open `game.html` for original monolithic implementation

### Testing
- No automated test framework
- Use `test.html` for manual testing and debugging
- Access game state via browser console: `window.game`
- Test on browsers with ES6 module support

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

### Game Settings (`src/config/gameConfig.js`)
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

### Block Configuration
- 12 unique L-shaped blocks with distinct colors
- Each block defined by shape coordinates and color
- Configurable physics parameters per block
- Shape definitions in `src/config/gameConfig.js:shapes`

## Implementation Details

### Physics System
- Custom gravity simulation in `src/components/Physics.js`
- Animation loop powered by Konva.Animation
- Configurable gravity force, friction, and bounce
- Collision detection between blocks and grid boundaries

### Grid System
- Diamond-shaped 11x9 grid with offset coordinates
- Grid cells calculated from center point
- Occupancy tracking prevents block overlap
- Automatic snap-to-grid on block release

### Component Communication
- Event-driven architecture using custom events
- Game class orchestrates all component interactions
- InputHandler manages user input and forwards to Game
- Physics updates block positions independently

### Browser Requirements
- Modern browser with ES6 module support
- No polyfills or transpilation required
- Works offline after initial load
- Chinese language UI (no internationalization)