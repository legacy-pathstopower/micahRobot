// Game variables
let selectedRobot = null;
let score = 0;
let timer = 30;
let powerUsed = false;
let timerInterval;
let foundItems = [];
let playerPosition = { x: 20, y: 320 }

// Setup keyboard movement controls
function setupMovementControls() {
    // Clean up any existing listeners first
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
    
    // Add keyboard event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // Clear any existing interval
    if (moveInterval) {
        clearInterval(moveInterval);
    }
    
    // Start movement interval
    moveInterval = setInterval(movePlayer, 30); // Update position 30 times per second
    
    // Add instruction for controls to the instructions div
    document.querySelector('.instructions').innerHTML = 'Find all the items before time runs out!<br>Use W, A, S, D keys to move your robot!';
    
    console.log("Movement controls set up");
}

// Handle key down events
function handleKeyDown(event) {
    const key = event.key.toLowerCase();
    if (key === 'w' || key === 'a' || key === 's' || key === 'd') {
        keyStates[key] = true;
        event.preventDefault(); // Prevent default behavior like scrolling
    }
}

// Handle key up events
function handleKeyUp(event) {
    const key = event.key.toLowerCase();
    if (key === 'w' || key === 'a' || key === 's' || key === 'd') {
        keyStates[key] = false;
    }
}

// Move player based on key states
function movePlayer() {
    // Check for active gameplay
    if (document.getElementById('gameplay-screen').style.display !== 'block') {
        return;
    }
    
    const gameWorld = document.getElementById('game-world');
    const playerRobot = document.getElementById('player-robot');
    const moveSpeed = 5; // Pixels per frame
    
    // Debug log - remove these later
    if (keyStates.w || keyStates.a || keyStates.s || keyStates.d) {
        console.log("Key pressed:", keyStates);
        console.log("Current position:", playerPosition);
    }
    
    // Get game world boundaries
    const worldWidth = gameWorld.offsetWidth;
    const worldHeight = gameWorld.offsetHeight;
    const robotWidth = playerRobot.offsetWidth;
    const robotHeight = playerRobot.offsetHeight;
    
    // Get obstacle positions for collision detection
    const obstacles = [];
    document.querySelectorAll('.obstacle').forEach(obstacle => {
        obstacles.push({
            left: obstacle.offsetLeft,
            top: obstacle.offsetTop,
            right: obstacle.offsetLeft + obstacle.offsetWidth,
            bottom: obstacle.offsetTop + obstacle.offsetHeight
        });
    });
    
    // Calculate new position based on key states
    let newX = playerPosition.x;
    let newY = playerPosition.y;
    
    if (keyStates.w) newY += moveSpeed; // Up
    if (keyStates.s) newY -= moveSpeed; // Down
    if (keyStates.a) newX -= moveSpeed; // Left
    if (keyStates.d) newX += moveSpeed; // Right
    
    // Ensure robot stays within boundaries
    newX = Math.max(0, Math.min(newX, worldWidth - robotWidth));
    newY = Math.max(0, Math.min(newY, worldHeight - robotHeight));
    
    // Simple collision detection with obstacles
    let collision = false;
    for (const obstacle of obstacles) {
        const robotLeft = newX;
        const robotRight = newX + robotWidth;
        const robotTop = worldHeight - newY - robotHeight;
        const robotBottom = worldHeight - newY;
        
        if (
            robotRight > obstacle.left && 
            robotLeft < obstacle.right && 
            robotBottom > obstacle.top && 
            robotTop < obstacle.bottom
        ) {
            collision = true;
            break;
        }
    }
    
    // Update position if there's no collision
    if (!collision) {
        playerPosition.x = newX;
        playerPosition.y = newY;
        playerRobot.style.left = newX + 'px';
        playerRobot.style.bottom = newY + 'px';
    }
    
    // Check for item collection
    document.querySelectorAll('.rescue-item').forEach(item => {
        if (!foundItems.includes(item.id)) {
            // Simulate click on the item if player is close enough
            const itemRect = item.getBoundingClientRect();
            const robotRect = playerRobot.getBoundingClientRect();
            
            // Calculate centers and distance
            const robotCenter = {
                x: robotRect.left + robotRect.width / 2,
                y: robotRect.top + robotRect.height / 2
            };
            
            const itemCenter = {
                x: itemRect.left + itemRect.width / 2,
                y: itemRect.top + itemRect.height / 2
            };
            
            const distance = Math.sqrt(
                Math.pow(robotCenter.x - itemCenter.x, 2) + 
                Math.pow(robotCenter.y - itemCenter.y, 2)
            );
            
            // Auto-collect if close enough
            if (distance < 60) {
                findItem(item.id);
            }
        }
    });
}; // Starting position
let keyStates = { w: false, a: false, s: false, d: false }; // Track key states
let moveInterval; // Interval for movement

// Robot data
const robots = {
    'red': {name: 'Blaze', power: 'Flight', color: 'robot-red'},
    'blue': {name: 'Sonar', power: 'Scan', color: 'robot-blue'},
    'yellow': {name: 'Bumble', power: 'Shrink', color: 'robot-yellow'},
    'green': {name: 'Crusher', power: 'Strength', color: 'robot-green'}
};

// Select robot function
function selectRobot(robotId) {
    // Reset previous selection
    document.querySelectorAll('.robot-card').forEach(card => {
        card.classList.remove('selected');
        card.style.borderColor = '#ccc';
    });
    
    // Set new selection
    const robotCard = document.querySelector(`.robot-card[data-robot="${robotId}"]`);
    robotCard.classList.add('selected');
    
    // Set border color based on robot
    if (robotId === 'red') robotCard.style.borderColor = '#ff0000';
    if (robotId === 'blue') robotCard.style.borderColor = '#0066cc';
    if (robotId === 'yellow') robotCard.style.borderColor = '#cc9900';
    if (robotId === 'green') robotCard.style.borderColor = '#009900';
    
    // Store selected robot
    selectedRobot = robotId;
    
    // Enable start button
    document.getElementById('start-button').disabled = false;
}

// Function to randomize position
function randomizePosition(element) {
    // Get game world dimensions
    const gameWorld = document.getElementById('game-world');
    const worldWidth = gameWorld.offsetWidth;
    const worldHeight = gameWorld.offsetHeight;
    const itemSize = 40; // Size of rescue item
    
    // Get positions of obstacles to avoid overlap
    const obstacles = [];
    document.querySelectorAll('.obstacle').forEach(obstacle => {
        obstacles.push({
            left: obstacle.offsetLeft,
            top: obstacle.offsetTop,
            right: obstacle.offsetLeft + obstacle.offsetWidth,
            bottom: obstacle.offsetTop + obstacle.offsetHeight
        });
    });
    
    // Try to find a position that doesn't overlap with obstacles
    let validPosition = false;
    let left, top;
    let attempts = 0; // Fixed the typo here
    
    while (!validPosition && attempts < 50) {
        attempts++;
        
        // Generate random position
        left = Math.floor(Math.random() * (worldWidth - itemSize - 40)) + 20;
        top = Math.floor(Math.random() * (worldHeight - itemSize - 40)) + 20;
        
        // Check if position overlaps with any obstacle
        validPosition = true;
        const padding = 10; // Extra space around obstacles
        
        for (const obstacle of obstacles) {
            if (
                left < obstacle.right + padding && 
                left + itemSize > obstacle.left - padding && 
                top < obstacle.bottom + padding && 
                top + itemSize > obstacle.top - padding
            ) {
                validPosition = false;
                break;
            }
        }
    }
    
    // Apply position
    element.style.left = left + 'px';
    element.style.top = top + 'px';
}

// Start game function
function startGame() {
    if (!selectedRobot) return;
    
    // Hide selection screen, show gameplay screen
    document.getElementById('selection-screen').style.display = 'none';
    document.getElementById('gameplay-screen').style.display = 'block';
    
    // Reset game state
    score = 0;
    timer = 30;
    powerUsed = false;
    foundItems = [];
    
    // Set a safe starting position for the robot
    setSafeStartingPosition();
    
    // Update UI
    document.getElementById('robot-name').textContent = robots[selectedRobot].name;
    document.getElementById('score').textContent = score;
    document.getElementById('timer').textContent = timer;
    
    // Set player robot color
    const playerRobot = document.getElementById('player-robot');
    playerRobot.className = 'player-robot ' + robots[selectedRobot].color;
    playerRobot.style.left = playerPosition.x + 'px';
    playerRobot.style.bottom = playerPosition.y + 'px';
    
    // Set power button color and text
    const powerButton = document.getElementById('power-button');
    powerButton.textContent = `Use ${robots[selectedRobot].power} Power!`;
    if (selectedRobot === 'red') powerButton.style.backgroundColor = '#ff4d4d';
    if (selectedRobot === 'blue') powerButton.style.backgroundColor = '#4d94ff';
    if (selectedRobot === 'yellow') powerButton.style.backgroundColor = '#ffcc00';
    if (selectedRobot === 'green') powerButton.style.backgroundColor = '#4dff4d';
    powerButton.disabled = false;
    
    // Reset rescue items and randomize their positions
    document.querySelectorAll('.rescue-item').forEach(item => {
        item.classList.remove('found');
        randomizePosition(item);
    });
    
    // Start timer and movement
    startTimer();
    setupMovementControls();
    
    console.log("Game started with robot at position:", playerPosition);
}

// Function to set a safe starting position for the robot
function setSafeStartingPosition() {
    const gameWorld = document.getElementById('game-world');
    const worldWidth = gameWorld.offsetWidth;
    const worldHeight = gameWorld.offsetHeight;
    
    // Define safe starting areas (away from obstacles)
    const safeStartingPositions = [
        { x: 30, y: 30 },
        { x: worldWidth - 100, y: 30 },
        { x: worldWidth / 2 - 30, y: 30 },
        { x: 30, y: worldHeight - 100 },
        { x: worldWidth - 100, y: worldHeight - 100 }
    ];
    
    // Choose a random safe position
    const safePosition = safeStartingPositions[Math.floor(Math.random() * safeStartingPositions.length)];
    playerPosition = { ...safePosition };
    
    console.log("Safe starting position set:", playerPosition);
}

// Timer function
function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timer--;
        document.getElementById('timer').textContent = timer;
        
        if (timer <= 0) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
}

// Find item function
function findItem(itemId) {
    const item = document.getElementById(itemId);
    if (foundItems.includes(itemId)) return;
    
    // Check if player is close enough to the item to collect it
    const playerRobot = document.getElementById('player-robot');
    const robotRect = playerRobot.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    
    // Calculate the center points of both elements
    const robotCenter = {
        x: robotRect.left + robotRect.width / 2,
        y: robotRect.top + robotRect.height / 2
    };
    
    const itemCenter = {
        x: itemRect.left + itemRect.width / 2,
        y: itemRect.top + itemRect.height / 2
    };
    
    // Calculate distance between centers
    const distance = Math.sqrt(
        Math.pow(robotCenter.x - itemCenter.x, 2) + 
        Math.pow(robotCenter.y - itemCenter.y, 2)
    );
    
    // If the robot is close enough (adjust the 70 value to make it easier or harder)
    if (distance < 70) {
        foundItems.push(itemId);
        score++;
        
        // Update UI
        document.getElementById('score').textContent = score;
        item.classList.add('found');
        
        // Check if all items found
        if (score === 5) {
            clearInterval(timerInterval);
            setTimeout(endGame, 500);
        }
    }
}

// Use power function
function usePower() {
    if (powerUsed) return;
    
    powerUsed = true;
    document.getElementById('power-button').disabled = true;
    document.getElementById('power-button').style.backgroundColor = '#cccccc';
    
    // Special power effect based on robot
    if (selectedRobot === 'blue') {
        // Find an unfound item
        const allItems = ['item-1', 'item-2', 'item-3', 'item-4', 'item-5'];
        const unfoundItems = allItems.filter(item => !foundItems.includes(item));
        
        if (unfoundItems.length > 0) {
            const itemToHint = unfoundItems[0];
            const item = document.getElementById(itemToHint);
            
            // Visual hint
            item.style.boxShadow = '0 0 20px 10px rgba(0, 100, 255, 0.7)';
            setTimeout(() => {
                item.style.boxShadow = 'none';
            }, 3000);
        }
    } else {
        // For other robots, just show a visual effect
        const playerRobot = document.getElementById('player-robot');
        playerRobot.style.transform = 'scale(1.5)';
        setTimeout(() => {
            playerRobot.style.transform = 'scale(1)';
        }, 500);
    }
}

// End game function
function endGame() {
    // Stop movement interval
    clearInterval(moveInterval);
    
    // Remove event listeners
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
    
    // Hide gameplay screen, show complete screen
    document.getElementById('gameplay-screen').style.display = 'none';
    document.getElementById('complete-screen').style.display = 'block';
    
    // Update final score
    document.getElementById('final-score').textContent = score;
    
    // Show appropriate message
    if (score === 5) {
        document.getElementById('perfect-score-message').style.display = 'block';
        document.getElementById('try-again-message').style.display = 'none';
    } else {
        document.getElementById('perfect-score-message').style.display = 'none';
        document.getElementById('try-again-message').style.display = 'block';
    }
}

// Reset game function
function resetGame() {
    // Hide complete screen, show selection screen
    document.getElementById('complete-screen').style.display = 'none';
    document.getElementById('selection-screen').style.display = 'block';
    
    // Reset selection
    selectedRobot = null;
    document.querySelectorAll('.robot-card').forEach(card => {
        card.classList.remove('selected');
        card.style.borderColor = '#ccc';
    });
    
    // Disable start button
    document.getElementById('start-button').disabled = true;
}