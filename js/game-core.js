// Core Game Logic

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
    gameConfig.selectedRobot = robotId;
    
    // Enable start button
    document.getElementById('start-button').disabled = false;
}

// Start game function
function startGame() {
    if (!gameConfig.selectedRobot) return;
    
    // Get game settings
    const difficulty = document.getElementById('difficulty').value;
    const gameTime = parseInt(document.getElementById('game-time').value);
    
    // Hide selection screen, show gameplay screen
    document.getElementById('selection-screen').style.display = 'none';
    document.getElementById('gameplay-screen').style.display = 'block';
    
    // Reset game state
    gameConfig.score = 0;
    gameConfig.timer = gameTime;
    gameConfig.powerUsed = false;
    gameConfig.foundItems = [];
    gameConfig.gamePaused = false;
    
    // Remove any pause message if it exists
    const pauseMessage = document.getElementById('pause-message');
    if (pauseMessage) pauseMessage.remove();
    
    // Apply difficulty settings
    let itemCount, obstacleMultiplier, moveSpeedModifier;
    
    switch(difficulty) {
        case 'easy':
            itemCount = { min: 3, max: 6 };
            obstacleMultiplier = 0.7;
            moveSpeedModifier = 1.3;
            break;
        case 'hard':
            itemCount = { min: 6, max: 12 };
            obstacleMultiplier = 1.5;
            moveSpeedModifier = 0.8;
            break;
        case 'medium':
        default:
            itemCount = { min: 4, max: 10 };
            obstacleMultiplier = 1.0;
            moveSpeedModifier = 1.0;
            break;
    }
    
    // Store game settings as global variables
    window.gameSettings = {
        itemCount: itemCount,
        obstacleMultiplier: obstacleMultiplier,
        moveSpeedModifier: moveSpeedModifier
    };
    
    // Generate game elements with difficulty settings
    generateObstacles(obstacleMultiplier);
    setSafeStartingPosition();
    generateItems(itemCount);
    
    // Update UI
    document.getElementById('robot-name').textContent = gameConfig.robots[gameConfig.selectedRobot].name;
    document.getElementById('score').textContent = gameConfig.score;
    document.getElementById('timer').textContent = gameConfig.timer;
    
    // Set player robot color and position
    const playerRobot = document.getElementById('player-robot');
    playerRobot.className = 'player-robot ' + gameConfig.robots[gameConfig.selectedRobot].color;
    playerRobot.style.left = gameConfig.playerPosition.x + 'px';
    playerRobot.style.top = gameConfig.playerPosition.y + 'px';
    
    if (gameConfig.debug) {
        console.log("Setting player position:", gameConfig.playerPosition);
        console.log("Robot element:", playerRobot);
        console.log("Applied style:", playerRobot.style.left, playerRobot.style.top);
    }
    
    // Set power button color and text
    const powerButton = document.getElementById('power-button');
    powerButton.textContent = `Use ${gameConfig.robots[gameConfig.selectedRobot].power} Power!`;
    if (gameConfig.selectedRobot === 'red') powerButton.style.backgroundColor = '#ff4d4d';
    if (gameConfig.selectedRobot === 'blue') powerButton.style.backgroundColor = '#4d94ff';
    if (gameConfig.selectedRobot === 'yellow') powerButton.style.backgroundColor = '#ffcc00';
    if (gameConfig.selectedRobot === 'green') powerButton.style.backgroundColor = '#4dff4d';
    powerButton.disabled = false;
    
    // Initialize mini-map
    updateMiniMap();
    
    // Start timer and movement
    startTimer();
    setupMovementControls();
    
    if (gameConfig.debug) console.log("Game started with robot:", gameConfig.robots[gameConfig.selectedRobot].name);
}

// Timer function
function startTimer() {
    clearInterval(gameConfig.timerInterval);
    gameConfig.timerInterval = setInterval(() => {
        // Only decrement if not paused
        if (!gameConfig.gamePaused) {
            gameConfig.timer--;
            document.getElementById('timer').textContent = gameConfig.timer;
            
            if (gameConfig.timer <= 0) {
                clearInterval(gameConfig.timerInterval);
                endGame();
            }
        }
    }, 1000);
}

// Find item function
function findItem(itemId) {
    const item = document.getElementById(itemId);
    if (gameConfig.foundItems.includes(itemId)) return;
    
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
        gameConfig.foundItems.push(itemId);
        gameConfig.score++;
        
        // Update UI
        document.getElementById('score').textContent = gameConfig.score;
        item.classList.add('found');
        
        // Update mini-map to remove collected item
        updateMiniMap();
        
        // Show collection animation
        const collectEffect = document.createElement('div');
        collectEffect.className = 'collect-effect';
        collectEffect.style.left = item.style.left;
        collectEffect.style.top = item.style.top;
        document.getElementById('game-world').appendChild(collectEffect);
        
        // Remove effect after animation completes
        setTimeout(() => {
            collectEffect.remove();
        }, 1000);
        
        // Check if all items found
        if (gameConfig.score === gameConfig.totalItems) {
            clearInterval(gameConfig.timerInterval);
            setTimeout(endGame, 500);
        }
    }
}

// Use power function
function usePower() {
    if (gameConfig.powerUsed) return;
    
    gameConfig.powerUsed = true;
    document.getElementById('power-button').disabled = true;
    document.getElementById('power-button').style.backgroundColor = '#cccccc';
    
    // Special power effect based on robot
    if (gameConfig.selectedRobot === 'red') {
        // Flight - temporary immunity to obstacles
        const playerRobot = document.getElementById('player-robot');
        playerRobot.style.boxShadow = '0 0 20px 10px rgba(255, 0, 0, 0.7)';
        playerRobot.style.zIndex = '100';
        
        // Add a flying effect
        playerRobot.style.transform = 'scale(1.2)';
        setTimeout(() => {
            playerRobot.style.transform = 'scale(1)';
            playerRobot.style.boxShadow = 'none';
            playerRobot.style.zIndex = '10';
        }, 3000);
        
    } else if (gameConfig.selectedRobot === 'blue') {
        // Scan - find an unfound item
        const allItems = [];
        for (let i = 1; i <= gameConfig.totalItems; i++) {
            allItems.push(`item-${i}`);
        }
        const unfoundItems = allItems.filter(item => !gameConfig.foundItems.includes(item));
        
        if (unfoundItems.length > 0) {
            const itemToHint = unfoundItems[Math.floor(Math.random() * unfoundItems.length)];
            const item = document.getElementById(itemToHint);
            
            // Visual hint
            item.style.boxShadow = '0 0 20px 10px rgba(0, 100, 255, 0.7)';
            setTimeout(() => {
                item.style.boxShadow = 'none';
            }, 5000);
        }
        
    } else if (gameConfig.selectedRobot === 'yellow') {
        // Shrink - reduce robot size temporarily to pass through tight spaces
        const playerRobot = document.getElementById('player-robot');
        playerRobot.style.transform = 'scale(0.5)';
        playerRobot.style.opacity = '0.8';
        
        setTimeout(() => {
            playerRobot.style.transform = 'scale(1)';
            playerRobot.style.opacity = '1';
        }, 5000);
        
    } else if (gameConfig.selectedRobot === 'green') {
        // Strength - remove a nearby obstacle
        const playerRobot = document.getElementById('player-robot');
        const robotRect = playerRobot.getBoundingClientRect();
        const obstacleElements = document.querySelectorAll('.obstacle');
        
        // Find the closest obstacle
        let closestObstacle = null;
        let minDistance = Infinity;
        
        obstacleElements.forEach(obstacle => {
            const obstacleRect = obstacle.getBoundingClientRect();
            
            // Calculate centers
            const robotCenter = {
                x: robotRect.left + robotRect.width / 2,
                y: robotRect.top + robotRect.height / 2
            };
            
            const obstacleCenter = {
                x: obstacleRect.left + obstacleRect.width / 2,
                y: obstacleRect.top + obstacleRect.height / 2
            };
            
            // Calculate distance
            const distance = Math.sqrt(
                Math.pow(robotCenter.x - obstacleCenter.x, 2) + 
                Math.pow(robotCenter.y - obstacleCenter.y, 2)
            );
            
            if (distance < minDistance) {
                minDistance = distance;
                closestObstacle = obstacle;
            }
        });
        
        // If there's a close obstacle and it's within range, remove it
        if (closestObstacle && minDistance < 200) {
            // Visual effect
            closestObstacle.style.transform = 'scale(1.2)';
            closestObstacle.style.opacity = '0.5';
            
            // Remove after animation
            setTimeout(() => {
                closestObstacle.remove();
            }, 500);
        }
    }
}

// End game function
function endGame() {
    // Stop movement interval
    clearInterval(gameConfig.moveInterval);
    
    // Remove event listeners
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
    
    // Hide gameplay screen, show complete screen
    document.getElementById('gameplay-screen').style.display = 'none';
    document.getElementById('complete-screen').style.display = 'block';
    
    // Update final score
    document.getElementById('final-score').textContent = gameConfig.score;
    document.getElementById('final-total').textContent = gameConfig.totalItems;
    
    // Show appropriate message
    if (gameConfig.score === gameConfig.totalItems) {
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
    gameConfig.selectedRobot = null;
    document.querySelectorAll('.robot-card').forEach(card => {
        card.classList.remove('selected');
        card.style.borderColor = '#ccc';
    });
    
    // Disable start button
    document.getElementById('start-button').disabled = true;
}

// Export functions to global scope
window.selectRobot = selectRobot;
window.startGame = startGame;
window.startTimer = startTimer;
window.findItem = findItem;
window.usePower = usePower;
window.endGame = endGame;
window.resetGame = resetGame;