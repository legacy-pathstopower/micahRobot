# Robot Rescue Mission Game

A fun browser-based game where players control robots to rescue items while navigating obstacles.

## Game Overview

In Robot Rescue Mission, players select one of four unique robots, each with a special power, and navigate through a randomly generated game world to collect rescue items before time runs out. The game features adjustable difficulty levels, obstacles to avoid, and a mini-map to help with navigation.

## How to Play

1. Choose one of the four robots, each with a unique special power:
   - **Blaze (Red)**: Can temporarily fly over obstacles
   - **Sonar (Blue)**: Can scan to reveal the location of a hidden item
   - **Bumble (Yellow)**: Can shrink temporarily to pass through tight spaces
   - **Crusher (Green)**: Can remove a nearby obstacle

2. Select your difficulty level and time limit
3. Use WASD or arrow keys to move your robot around the game world
4. Collect all the rescue items before time runs out
5. Use your robot's special power (spacebar or power button) when needed
6. Pause the game with P or ESC key

## Game Features

- Four unique robots with different special abilities
- Randomized obstacles and rescue items for each playthrough
- Multiple difficulty levels affecting the number of obstacles and item count
- Adjustable time limits
- Mini-map to help navigation in the large game world
- Special power effects with visual feedback
- Collision detection system
- Pause functionality
- Responsive controls (keyboard support)

## Code Organization

The game code has been modularized into multiple files for better organization:

### 1. **config.js**
- Contains all game configuration and global variables
- Sets up the game environment and constants
- Acts as a central data store for game state

### 2. **controls.js**
- Handles keyboard input and player movement
- Implements collision detection
- Controls the robot's interaction with the game world
- Contains movement interval and keyboard event listeners

### 3. **generation.js**
- Generates random obstacles
- Creates rescue items with random positions
- Sets up the robot's starting position
- Updates the mini-map display

### 4. **game-core.js**
- Contains the main game logic
- Handles robot selection, game start/end
- Implements special robot powers
- Manages game timer and score tracking

### 5. **main.js**
- Entry point for the game
- Initializes the game when the document loads
- Handles script loading and errors

## CSS Organization

The game's styles are modularized for better maintenance:

- **main.css**: Imports all other CSS files
- **base.css**: Basic typography and common styles
- **robot-selection.css**: Styles for the robot selection screen
- **game-screens.css**: Controls visibility and styling of game screens
- **game-world.css**: Styles for the game world, obstacles, and items
- **game-ui.css**: Game user interface elements
- **animations.css**: CSS animations for various game elements
- **touch-controls.css**: Support for touch devices (future implementation)

## File Structure

```
/robot-rescue-mission/
├── index.html         # Main HTML file
├── css/               # CSS styles directory
│   ├── main.css       # Main CSS file importing all others
│   ├── base.css       # Basic typography and common styles
│   ├── animations.css # Animations for game elements
│   ├── game-screens.css # Game screen styles
│   ├── game-ui.css    # UI element styles
│   ├── game-world.css # Game world and element styles
│   ├── robot-selection.css # Robot selection screen styles
│   └── touch-controls.css # Future touch support
├── js/                # JavaScript directory
│   ├── config.js      # Game configuration and variables
│   ├── controls.js    # Movement and keyboard controls
│   ├── generation.js  # Game element generation
│   ├── game-core.js   # Core game logic
│   └── main.js        # Entry point and initialization
├── .github/           # GitHub configuration
│   └── workflows/     # GitHub Actions workflows
│       └── deploy.yml # Auto deployment configuration
├── LICENSE            # MIT License
└── README.md          # This readme file
```

## Browser Compatibility

The game should work in all modern browsers including:
- Chrome
- Firefox
- Safari
- Edge

## Installation

No installation is required - simply open the index.html file in a web browser to play locally, or visit the deployed GitHub Pages version.

## Deployment

The game is configured with GitHub Actions for automatic deployment to GitHub Pages when changes are pushed to the main branch.

## Future Improvements

- Mobile touch controls (groundwork already laid in touch-controls.css)
- Additional robot types with new powers
- Multiple game levels with increasing difficulty
- High score tracking
- Sound effects and background music
- More varied obstacle types and rescue items

## License

This project is licensed under the MIT License - see the LICENSE file for details.