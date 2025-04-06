// Touch Controls Implementation for Robot Rescue Mission

// Add this to your main.js or create a new file called touch-controls.js
// If creating a new file, remember to add it to your index.html

// Create and inject touch control buttons
function setupTouchControls() {
    if (gameConfig.debug) console.log("Setting up touch controls...");
    
    // Check if touch controls already exist
    if (document.querySelector('.touch-controls')) {
        return;
    }
    
    // Create touch controls container
    const touchControls = document.createElement('div');
    touchControls.className = 'touch-controls';
    
    // Create direction pad
    const directionPad = document.createElement('div');
    directionPad.className = 'direction-pad';
    
    // Create individual direction buttons
    const upBtn = document.createElement('button');
    upBtn.className = 'up-btn';
    upBtn.innerHTML = '&uarr;';
    upBtn.setAttribute('aria-label', 'Move Up');
    
    const leftBtn = document.createElement('button');
    leftBtn.className = 'left-btn';
    leftBtn.innerHTML = '&larr;';
    leftBtn.setAttribute('aria-label', 'Move Left');
    
    const rightBtn = document.createElement('button');
    rightBtn.className = 'right-btn';
    rightBtn.innerHTML = '&rarr;';
    rightBtn.setAttribute('aria-label', 'Move Right');
    
    const downBtn = document.createElement('button');
    downBtn.className = 'down-btn';
    downBtn.innerHTML = '&darr;';
    downBtn.setAttribute('aria-label', 'Move Down');
    
    // Add buttons to direction pad
    directionPad.appendChild(upBtn);
    directionPad.appendChild(leftBtn);
    directionPad.appendChild(rightBtn);
    directionPad.appendChild(downBtn);
    
    // Create power button
    const powerBtn = document.createElement('button');
    powerBtn.className = 'power-btn';
    powerBtn.textContent = 'POWER';
    powerBtn.setAttribute('aria-label', 'Use Power');
    
    // Add elements to touch controls container
    touchControls.appendChild(directionPad);
    touchControls.appendChild(powerBtn);
    
    // Add touch controls to the document
    document.body.appendChild(touchControls);
    
    // Add event listeners for touch controls
    addTouchControlListeners();
    
    if (gameConfig.debug) console.log("Touch controls set up successfully");
}

// Add event listeners for the touch controls
function addTouchControlListeners() {
    const upBtn = document.querySelector('.up-btn');
    const leftBtn = document.querySelector('.left-btn');
    const rightBtn = document.querySelector('.right-btn');
    const downBtn = document.querySelector('.down-btn');
    const powerBtn = document.querySelector('.power-btn');
    
    // Helper function for touch start and end
    function setupTouchButton(button, key) {
        button.addEventListener('touchstart', function(e) {
            e.preventDefault(); // Prevent default touch behavior like scrolling
            gameConfig.keyStates[key] = true;
            if (gameConfig.debug) console.log(`Touch ${key} pressed, state:`, gameConfig.keyStates[key]);
        });
        
        button.addEventListener('touchend', function(e) {
            e.preventDefault();
            gameConfig.keyStates[key] = false;
            if (gameConfig.debug) console.log(`Touch ${key} released, state:`, gameConfig.keyStates[key]);
        });
        
        // Also handle mouse events for hybrid devices
        button.addEventListener('mousedown', function(e) {
            e.preventDefault();
            gameConfig.keyStates[key] = true;
        });
        
        button.addEventListener('mouseup', function(e) {
            e.preventDefault();
            gameConfig.keyStates[key] = false;
        });
        
        // Handle mouse leaving the button while pressed
        button.addEventListener('mouseleave', function(e) {
            gameConfig.keyStates[key] = false;
        });
    }
    
    // Setup movement buttons
    setupTouchButton(upBtn, 'w');
    setupTouchButton(leftBtn, 'a');
    setupTouchButton(downBtn, 's');
    setupTouchButton(rightBtn, 'd');
    
    // Setup power button
    powerBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        if (document.getElementById('gameplay-screen').style.display === 'block') {
            usePower();
        }
    });
    
    powerBtn.addEventListener('mousedown', function(e) {
        e.preventDefault();
        if (document.getElementById('gameplay-screen').style.display === 'block') {
            usePower();
        }
    });
    
    // Add pause button to touch controls
    const pauseBtn = document.createElement('button');
    pauseBtn.className = 'pause-btn';
    pauseBtn.textContent = 'II';
    pauseBtn.setAttribute('aria-label', 'Pause Game');
    pauseBtn.style.position = 'fixed';
    pauseBtn.style.top = '20px';
    pauseBtn.style.right = '20px';
    pauseBtn.style.width = '50px';
    pauseBtn.style.height = '50px';
    pauseBtn.style.borderRadius = '50%';
    pauseBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    pauseBtn.style.border = '2px solid #0066cc';
    pauseBtn.style.zIndex = '100';
    pauseBtn.style.display = 'none';
    document.body.appendChild(pauseBtn);
    
    pauseBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        if (document.getElementById('gameplay-screen').style.display === 'block') {
            togglePause();
        }
    });
    
    pauseBtn.addEventListener('mousedown', function(e) {
        e.preventDefault();
        if (document.getElementById('gameplay-screen').style.display === 'block') {
            togglePause();
        }
    });
    
    // Show pause button when gameplay screen is active
    const gameplayScreenObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.target.style.display === 'block') {
                pauseBtn.style.display = 'block';
            } else {
                pauseBtn.style.display = 'none';
            }
        });
    });
    
    gameplayScreenObserver.observe(document.getElementById('gameplay-screen'), { 
        attributes: true, 
        attributeFilter: ['style'] 
    });
}

// Function to detect if the device supports touch
function isTouchDevice() {
    return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0));
}

// Function to initiate touch controls if device supports touch
function initTouchControls() {
    if (isTouchDevice()) {
        setupTouchControls();
        
        // Add touch instructions to the instructions div
        const instructionsDiv = document.querySelector('.instructions');
        if (instructionsDiv) {
            const touchInstructions = document.createElement('p');
            touchInstructions.textContent = 'Use on-screen controls on touch devices';
            instructionsDiv.appendChild(touchInstructions);
        }
        
        if (gameConfig.debug) console.log("Touch controls initialized");
    } else {
        if (gameConfig.debug) console.log("Device does not support touch, skipping touch controls");
    }
}

// Call this function when game starts
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initTouchControls();
    }, 200);
});

// Make the functions available globally
window.setupTouchControls = setupTouchControls;
window.addTouchControlListeners = addTouchControlListeners;
window.isTouchDevice = isTouchDevice;
window.initTouchControls = initTouchControls;