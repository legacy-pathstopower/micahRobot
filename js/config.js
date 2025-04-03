// Game configuration and global variables
const gameConfig = {
    // Game state variables
    selectedRobot: null,
    score: 0,
    timer: 60,
    powerUsed: false,
    foundItems: [],
    playerPosition: { x: 20, y: 20 },
    keyStates: { w: false, a: false, s: false, d: false },
    totalItems: 0,
    obstacles: [],
    gamePaused: false,
    
    // Intervals and timers
    moveInterval: null,
    timerInterval: null,
    
    // Robot data
    robots: {
        'red': {name: 'Blaze', power: 'Flight', color: 'robot-red'},
        'blue': {name: 'Sonar', power: 'Scan', color: 'robot-blue'},
        'yellow': {name: 'Bumble', power: 'Shrink', color: 'robot-yellow'},
        'green': {name: 'Crusher', power: 'Strength', color: 'robot-green'}
    },
    
    // Debug mode
    debug: true
};

// Export as global variable
window.gameConfig = gameConfig;