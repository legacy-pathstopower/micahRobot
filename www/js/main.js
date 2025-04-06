// Main entry point for the game

// Initialize the game when the document is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Robot Rescue Mission initializing...');
    
    // Wait a moment to ensure all scripts are loaded
    setTimeout(() => {
        // Show the selection screen by default
        document.getElementById('selection-screen').style.display = 'block';
        document.getElementById('gameplay-screen').style.display = 'none';
        document.getElementById('complete-screen').style.display = 'none';
        
        console.log('Robot Rescue Mission initialized and ready!');
    }, 100);
});

// Function to handle script loading errors
function handleScriptError(scriptName) {
    console.error(`Failed to load script: ${scriptName}`);
    alert(`Error loading game module: ${scriptName}. Please refresh the page or contact support.`);
}