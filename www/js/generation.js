// Game World and Item Generation

// Generate random obstacles
function generateObstacles(multiplier = 1.0) {
    const gameWorld = document.getElementById('game-world');
    const worldWidth = gameWorld.offsetWidth;
    const worldHeight = gameWorld.offsetHeight;
    
    // Clear any existing obstacles
    document.querySelectorAll('.obstacle').forEach(obs => obs.remove());
    gameConfig.obstacles = [];
    
    // Determine number of obstacles based on game world size and difficulty
    const areaFactor = (worldWidth * worldHeight) / 500000;
    const baseObstacles = Math.floor(Math.random() * 10) + Math.floor(areaFactor * 10) + 5;
    const numObstacles = Math.floor(baseObstacles * multiplier);
    
    for (let i = 0; i < numObstacles; i++) {
        // Random size for each obstacle (reasonable constraints)
        const width = Math.floor(Math.random() * 150) + 50;
        const height = Math.floor(Math.random() * 150) + 50;
        
        // Random position (with boundary padding)
        const left = Math.floor(Math.random() * (worldWidth - width - 40)) + 20;
        const top = Math.floor(Math.random() * (worldHeight - height - 40)) + 20;
        
        // Add to obstacles array
        gameConfig.obstacles.push({
            left: left,
            top: top,
            width: width,
            height: height
        });
        
        // Create obstacle element
        const obstacle = document.createElement('div');
        obstacle.className = 'obstacle';
        obstacle.style.left = left + 'px';
        obstacle.style.top = top + 'px';
        obstacle.style.width = width + 'px';
        obstacle.style.height = height + 'px';
        
        gameWorld.appendChild(obstacle);
    }
    
    if (gameConfig.debug) console.log(`Generated ${numObstacles} random obstacles`);
}

// Generate rescue items
function generateItems(itemCount = { min: 4, max: 10 }) {
    const gameWorld = document.getElementById('game-world');
    
    // Clear any existing items
    document.querySelectorAll('.rescue-item').forEach(item => item.remove());
    
    // Random number of items to rescue based on difficulty
    gameConfig.totalItems = Math.floor(Math.random() * (itemCount.max - itemCount.min + 1)) + itemCount.min;
    
    // Update UI with total items
    document.getElementById('total-items').textContent = gameConfig.totalItems;
    document.getElementById('final-total').textContent = gameConfig.totalItems;
    
    for (let i = 1; i <= gameConfig.totalItems; i++) {
        // Create rescue item
        const item = document.createElement('div');
        item.className = 'rescue-item';
        item.id = `item-${i}`;
        
        // Add star icon
        const star = document.createElement('span');
        star.className = 'star-icon';
        star.textContent = '★';
        item.appendChild(star);
        
        // Randomize position
        randomizePosition(item);
        
        gameWorld.appendChild(item);
    }
    
    if (gameConfig.debug) console.log(`Generated ${gameConfig.totalItems} random rescue items`);
}

// Function to randomize position without overlapping obstacles
function randomizePosition(element) {
    const gameWorld = document.getElementById('game-world');
    const worldWidth = gameWorld.offsetWidth;
    const worldHeight = gameWorld.offsetHeight;
    const itemSize = 40; // Size of rescue item
    
    // Try to find a position that doesn't overlap with obstacles
    let validPosition = false;
    let left, top;
    let attempts = 0;
    
    while (!validPosition && attempts < 100) {
        attempts++;
        
        // Generate random position
        left = Math.floor(Math.random() * (worldWidth - itemSize - 40)) + 20;
        top = Math.floor(Math.random() * (worldHeight - itemSize - 40)) + 20;
        
        // Check if position overlaps with any obstacle
        validPosition = true;
        const padding = 20; // Extra space around obstacles
        
        for (const obstacle of gameConfig.obstacles) {
            if (
                left < obstacle.left + obstacle.width + padding && 
                left + itemSize > obstacle.left - padding && 
                top < obstacle.top + obstacle.height + padding && 
                top + itemSize > obstacle.top - padding
            ) {
                validPosition = false;
                break;
            }
        }
        
        // Also check if the position is too close to the player's starting position
        const distanceToPlayer = Math.sqrt(
            Math.pow(left - gameConfig.playerPosition.x, 2) + 
            Math.pow(top - gameConfig.playerPosition.y, 2)
        );
        
        if (distanceToPlayer < 100) {
            validPosition = false;
        }
    }
    
    // Apply position
    element.style.left = left + 'px';
    element.style.top = top + 'px';
}

// Function to set a safe starting position for the robot away from obstacles
function setSafeStartingPosition() {
    const gameWorld = document.getElementById('game-world');
    const worldWidth = gameWorld.offsetWidth;
    const worldHeight = gameWorld.offsetHeight;
    
    // Try to find a position that doesn't overlap with obstacles
    let validPosition = false;
    let attempts = 0;
    
    // Robot dimensions
    const robotWidth = 60;
    const robotHeight = 80;
    
    while (!validPosition && attempts < 100) {
        attempts++;
        
        // Generate random position
        const x = Math.floor(Math.random() * (worldWidth - robotWidth - 40)) + 20;
        const y = Math.floor(Math.random() * (worldHeight - robotHeight - 40)) + 20;
        
        // Check if position overlaps with any obstacle
        validPosition = true;
        const padding = 30; // Extra space around obstacles
        
        for (const obstacle of gameConfig.obstacles) {
            if (
                x < obstacle.left + obstacle.width + padding && 
                x + robotWidth > obstacle.left - padding && 
                y < obstacle.top + obstacle.height + padding && 
                y + robotHeight > obstacle.top - padding
            ) {
                validPosition = false;
                break;
            }
        }
        
        if (validPosition) {
            gameConfig.playerPosition.x = x;
            gameConfig.playerPosition.y = y;
        }
    }
    
    // If we couldn't find a valid position after many attempts, use a fallback position
    if (!validPosition) {
        gameConfig.playerPosition.x = 30;
        gameConfig.playerPosition.y = 30;
        if (gameConfig.debug) console.log("Using fallback position");
    }
    
    if (gameConfig.debug) console.log("Robot starting position set:", gameConfig.playerPosition);
}

// Update mini-map function
function updateMiniMap() {
    const miniMap = document.getElementById('mini-map');
    const gameWorld = document.getElementById('game-world');
    
    // Clear the mini-map
    miniMap.innerHTML = '';
    
    // Get game world dimensions
    const worldWidth = gameWorld.offsetWidth;
    const worldHeight = gameWorld.offsetHeight;
    
    // Scale factor for mini-map
    const scaleX = 150 / worldWidth;
    const scaleY = 150 / worldHeight;
    
    // Add player marker to mini-map
    const playerMarker = document.createElement('div');
    playerMarker.className = 'mini-map-player';
    playerMarker.style.left = (gameConfig.playerPosition.x * scaleX) + 'px';
    playerMarker.style.top = (gameConfig.playerPosition.y * scaleY) + 'px';
    miniMap.appendChild(playerMarker);
    
    // Add obstacles to mini-map
    document.querySelectorAll('.obstacle').forEach(obstacle => {
        const miniObstacle = document.createElement('div');
        miniObstacle.className = 'mini-map-obstacle';
        
        // Get obstacle position and size
        const obsLeft = parseInt(obstacle.style.left);
        const obsTop = parseInt(obstacle.style.top);
        const obsWidth = parseInt(obstacle.style.width);
        const obsHeight = parseInt(obstacle.style.height);
        
        // Scale for mini-map
        miniObstacle.style.left = (obsLeft * scaleX) + 'px';
        miniObstacle.style.top = (obsTop * scaleY) + 'px';
        miniObstacle.style.width = (obsWidth * scaleX) + 'px';
        miniObstacle.style.height = (obsHeight * scaleY) + 'px';
        
        miniMap.appendChild(miniObstacle);
    });
    
    // Add rescue items to mini-map
    document.querySelectorAll('.rescue-item').forEach(item => {
        if (!gameConfig.foundItems.includes(item.id)) {
            const miniItem = document.createElement('div');
            miniItem.className = 'mini-map-item';
            
            // Get item position
            const itemLeft = parseInt(item.style.left);
            const itemTop = parseInt(item.style.top);
            
            // Scale for mini-map
            miniItem.style.left = (itemLeft * scaleX) + 'px';
            miniItem.style.top = (itemTop * scaleY) + 'px';
            
            miniMap.appendChild(miniItem);
        }
    });
}

// Export functions to global scope
window.generateObstacles = generateObstacles;
window.generateItems = generateItems;
window.randomizePosition = randomizePosition;
window.setSafeStartingPosition = setSafeStartingPosition;
window.updateMiniMap = updateMiniMap;