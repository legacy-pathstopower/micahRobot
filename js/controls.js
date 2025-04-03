// Player Movement and Controls

// Setup keyboard movement controls
function setupMovementControls() {
    if (gameConfig.debug) console.log("Setting up movement controls...");
    
    // Clean up any existing listeners first
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
    
    // Add keyboard event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // Clear any existing interval
    if (gameConfig.moveInterval) {
        clearInterval(gameConfig.moveInterval);
        if (gameConfig.debug) console.log("Cleared previous movement interval");
    }
    
    // Start movement interval
    gameConfig.moveInterval = setInterval(movePlayer, 30); // Update position 30 times per second
    if (gameConfig.debug) console.log("Started movement interval:", gameConfig.moveInterval);
    
    // Add instruction for controls to the instructions div
    document.querySelector('.instructions').innerHTML = '<p>Find all the items before time runs out!</p>' +
        '<ul class="controls-list">' +
        '<li><strong>Movement:</strong> W, A, S, D or Arrow keys</li>' +
        '<li><strong>Use Power:</strong> Spacebar or click power button</li>' +
        '<li><strong>Pause Game:</strong> P or ESC key</li>' +
        '</ul>';
    
    if (gameConfig.debug) {
        console.log("Movement controls set up successfully");
        console.log("Initial key states:", gameConfig.keyStates);
    }
}

// Handle key down events
function handleKeyDown(event) {
    const key = event.key.toLowerCase();
    if (gameConfig.debug) console.log("Key pressed:", key);
    
    // Movement keys
    if (key === 'w' || key === 'a' || key === 's' || key === 'd' || 
        key === 'arrowup' || key === 'arrowleft' || key === 'arrowdown' || key === 'arrowright') {
        
        // Map arrow keys to WASD
        if (key === 'arrowup') {
            gameConfig.keyStates['w'] = true;
            if (gameConfig.debug) console.log("Up key pressed, w state:", gameConfig.keyStates['w']);
        }
        else if (key === 'arrowleft') {
            gameConfig.keyStates['a'] = true;
            if (gameConfig.debug) console.log("Left key pressed, a state:", gameConfig.keyStates['a']);
        }
        else if (key === 'arrowdown') {
            gameConfig.keyStates['s'] = true;
            if (gameConfig.debug) console.log("Down key pressed, s state:", gameConfig.keyStates['s']);
        }
        else if (key === 'arrowright') {
            gameConfig.keyStates['d'] = true;
            if (gameConfig.debug) console.log("Right key pressed, d state:", gameConfig.keyStates['d']);
        }
        else {
            gameConfig.keyStates[key] = true;
            if (gameConfig.debug) console.log("WASD key pressed, key state:", key, gameConfig.keyStates[key]);
        }
        
        if (gameConfig.debug) console.log("Current key states:", gameConfig.keyStates);
        event.preventDefault(); // Prevent default behavior like scrolling
    }
    
    // Power key (spacebar)
    if (key === ' ' && document.getElementById('gameplay-screen').style.display === 'block') {
        usePower();
        event.preventDefault();
    }
    
    // Pause/Resume key (p or escape)
    if ((key === 'p' || key === 'escape') && document.getElementById('gameplay-screen').style.display === 'block') {
        togglePause();
        event.preventDefault();
    }
}

// Handle key up events
function handleKeyUp(event) {
    const key = event.key.toLowerCase();
    
    // Movement keys
    if (key === 'w' || key === 'a' || key === 's' || key === 'd' || 
        key === 'arrowup' || key === 'arrowleft' || key === 'arrowdown' || key === 'arrowright') {
        
        // Map arrow keys to WASD
        if (key === 'arrowup') gameConfig.keyStates['w'] = false;
        else if (key === 'arrowleft') gameConfig.keyStates['a'] = false;
        else if (key === 'arrowdown') gameConfig.keyStates['s'] = false;
        else if (key === 'arrowright') gameConfig.keyStates['d'] = false;
        else gameConfig.keyStates[key] = false;
    }
}

// Move player based on key states
function movePlayer() {
    // Check for active gameplay and not paused
    if (document.getElementById('gameplay-screen').style.display !== 'block' || gameConfig.gamePaused) {
        return;
    }
    
    const gameWorld = document.getElementById('game-world');
    const playerRobot = document.getElementById('player-robot');
    
    // Base speed with difficulty modifier (if available)
    const baseSpeed = 8; // Increased speed for larger game area
    const moveSpeedModifier = window.gameSettings?.moveSpeedModifier || 1.0;
    const moveSpeed = baseSpeed * moveSpeedModifier;
    
    // Check if game world should scroll to follow player
    const viewportHeight = window.innerHeight;
    const robotRect = playerRobot.getBoundingClientRect();
    const gameWorldRect = gameWorld.getBoundingClientRect();
    
    // Auto-scroll the game world to follow the robot if needed
    if (robotRect.top < gameWorldRect.top + 100) {
        gameWorld.scrollTop -= 10;
    } else if (robotRect.bottom > gameWorldRect.bottom - 100) {
        gameWorld.scrollTop += 10;
    }
    
    if (robotRect.left < gameWorldRect.left + 100) {
        gameWorld.scrollLeft -= 10;
    } else if (robotRect.right > gameWorldRect.right - 100) {
        gameWorld.scrollLeft += 10;
    }
    
    // Get game world boundaries
    const worldWidth = gameWorld.offsetWidth;
    const worldHeight = gameWorld.offsetHeight;
    const robotWidth = playerRobot.offsetWidth;
    const robotHeight = playerRobot.offsetHeight;
    
    // Calculate new position based on key states
    let newX = gameConfig.playerPosition.x;
    let newY = gameConfig.playerPosition.y;
    
    // Fixed the movement directions
    if (gameConfig.keyStates.w) newY -= moveSpeed; // Up
    if (gameConfig.keyStates.s) newY += moveSpeed; // Down
    if (gameConfig.keyStates.a) newX -= moveSpeed; // Left
    if (gameConfig.keyStates.d) newX += moveSpeed; // Right
    
    // Debug info
    if (gameConfig.debug && (gameConfig.keyStates.w || gameConfig.keyStates.a || gameConfig.keyStates.s || gameConfig.keyStates.d)) {
        console.log("Moving with keys:", gameConfig.keyStates);
        console.log("Position before:", gameConfig.playerPosition);
        console.log("New position calculated:", {x: newX, y: newY});
    }
    
    // Ensure robot stays within boundaries
    newX = Math.max(0, Math.min(newX, worldWidth - robotWidth));
    newY = Math.max(0, Math.min(newY, worldHeight - robotHeight));
    
    // Simple collision detection with obstacles
    let collision = false;
    
    // Get obstacle positions for collision detection
    const obstacleElements = document.querySelectorAll('.obstacle');
    
    for (const obstacle of obstacleElements) {
        const obstacleRect = obstacle.getBoundingClientRect();
        const gameWorldRect = gameWorld.getBoundingClientRect();
        
        // Convert to game world coordinates
        const obstacleLeft = obstacle.offsetLeft;
        const obstacleTop = obstacle.offsetTop;
        const obstacleRight = obstacleLeft + obstacle.offsetWidth;
        const obstacleBottom = obstacleTop + obstacle.offsetHeight;
        
        const robotLeft = newX;
        const robotTop = newY;
        const robotRight = newX + robotWidth;
        const robotBottom = newY + robotHeight;
        
        if (
            robotRight > obstacleLeft && 
            robotLeft < obstacleRight && 
            robotBottom > obstacleTop && 
            robotTop < obstacleBottom
        ) {
            collision = true;
            break;
        }
    }
    
    // Update position if there's no collision
    if (!collision) {
        gameConfig.playerPosition.x = newX;
        gameConfig.playerPosition.y = newY;
        playerRobot.style.left = newX + 'px';
        playerRobot.style.top = newY + 'px';
        
        if (gameConfig.debug && (gameConfig.keyStates.w || gameConfig.keyStates.a || gameConfig.keyStates.s || gameConfig.keyStates.d)) {
            console.log("New position after update:", gameConfig.playerPosition);
        }
        
        // Update mini-map to reflect new player position
        updateMiniMap();
    }
    
    // Check for item collection
    document.querySelectorAll('.rescue-item').forEach(item => {
        if (!gameConfig.foundItems.includes(item.id)) {
            // Check if player is close enough to the item
            const itemRect = item.getBoundingClientRect();
            
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
}

// Toggle game pause
function togglePause() {
    gameConfig.gamePaused = !gameConfig.gamePaused;
    
    if (gameConfig.gamePaused) {
        // Pause the game
        clearInterval(gameConfig.timerInterval);
        
        // Show pause message
        const pauseMessage = document.createElement('div');
        pauseMessage.id = 'pause-message';
        pauseMessage.innerHTML = '<h2>GAME PAUSED</h2><p>Press P or ESC to resume</p>';
        document.getElementById('gameplay-screen').appendChild(pauseMessage);
    } else {
        // Remove pause message
        const pauseMessage = document.getElementById('pause-message');
        if (pauseMessage) pauseMessage.remove();
        
        // Resume timer
        startTimer();
    }
}

// Export functions to global scope
window.setupMovementControls = setupMovementControls;
window.handleKeyDown = handleKeyDown;
window.handleKeyUp = handleKeyUp;
window.movePlayer = movePlayer;
window.togglePause = togglePause;