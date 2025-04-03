# Robot Rescue Mission Game

A fun browser-based game where players control robots to rescue items while navigating obstacles.

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

## File Structure

```
/robot-rescue-mission/
├── index.html         # Main HTML file
├── styles.css         # CSS styles for the game
├── js/
│   ├── config.js      # Game configuration and variables
│   ├── controls.js    # Movement and keyboard controls
│   ├── generation.js  # Game element generation
│   ├── game-core.js   # Core game logic
│   └── main.js        # Entry point and initialization
```

## How to Play

1. Choose one of the four robots, each with a unique special power
2. Use WASD or arrow keys to move your robot around the game world
3. Collect all the rescue items before time runs out
4. Use your robot's special power (spacebar) when needed
5. Pause the game with P or ESC key

## Game Features

- Randomized obstacles and rescue items for each playthrough
- Multiple difficulty levels affecting the number of obstacles and time limit
- Mini-map to help navigation in the large game world
- Special powers unique to each robot
- Visual effects for collecting items and using powers

## Troubleshooting

If the game doesn't load properly:
1. Check the browser console for errors
2. Make sure all JavaScript files are in the correct directory structure
3. Try clearing your browser cache and refreshing

## Browser Compatibility

The game should work in all modern browsers including:
- Chrome
- Firefox
- Safari
- Edge

## Future Improvements

- Mobile touch controls
- Additional robot types
- Multiple levels with increasing difficulty
- High score tracking
- Sound effects and background music