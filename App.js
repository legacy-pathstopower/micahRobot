<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Robot Rescue Mission</title>
    <style>
        body {
            font-family: 'Arial Rounded MT Bold', 'Arial', sans-serif;
            background-color: #e6f7ff;
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
        }
        
        .game-container {
            max-width: 800px;
            width: 100%;
        }
        
        h1 {
            color: #0066cc;
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 20px;
        }
        
        h2 {
            text-align: center;
            font-size: 1.5rem;
            margin-bottom: 20px;
        }
        
        .robot-selection {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .robot-card {
            background-color: white;
            border-radius: 12px;
            padding: 15px;
            border: 4px solid #ccc;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .robot-card.selected {
            transform: scale(1.05);
        }
        
        .robot-color {
            height: 120px;
            border-radius: 8px;
            margin-bottom: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .robot-red { background-color: #ff4d4d; }
        .robot-blue { background-color: #4d94ff; }
        .robot-yellow { background-color: #ffcc00; }
        .robot-green { background-color: #4dff4d; }
        
        .robot-figure {
            width: 60px;
            height: 100px;
            background-color: #f0f0f0;
            border-radius: 10px;
            position: relative;
        }
        
        .robot-eyes {
            position: absolute;
            top: 20px;
            width: 100%;
            display: flex;
            justify-content: space-evenly;
        }
        
        .robot-eye {
            width: 12px;
            height: 12px;
            background-color: #0066cc;
            border-radius: 50%;
        }
        
        .robot-mouth {
            position: absolute;
            top: 45px;
            left: 50%;
            transform: translateX(-50%);
            width: 24px;
            height: 4px;
            background-color: #333;
        }
        
        .robot-body {
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            width: 40px;
            height: 30px;
            background-color: #ccc;
            border-radius: 4px;
        }
        
        .robot-name {
            font-weight: bold;
            font-size: 1.2rem;
            text-align: center;
            margin: 10px 0 5px;
        }
        
        .robot-power {
            text-align: center;
            font-size: 0.9rem;
        }
        
        .robot-power-desc {
            text-align: center;
            font-size: 0.8rem;
            color: #666;
        }
        
        .start-button {
            display: block;
            margin: 0 auto;
            padding: 15px 30px;
            font-size: 1.2rem;
            font-weight: bold;
            background-color: #00cc66;
            color: white;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        
        .start-button:hover {
            background-color: #00aa55;
        }
        
        .start-button:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
        }
        
        .game-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
        }
        
        .info-box {
            padding: 10px 15px;
            border-radius: 8px;
            font-weight: bold;
        }
        
        .robot-info { background-color: #cce6ff; }
        .timer-info { background-color: #ffcccc; }
        .score-info { background-color: #ccffcc; }
        
        .game-world {
            width: 100%;
            height: 400px;
            background-color: #e6e6e6;
            border: 3px solid #999;
            border-radius: 12px;
            position: relative;
            overflow: hidden;
            margin-bottom: 20px;
        }
        
        .obstacle {
            position: absolute;
            background-color: #999;
            border-radius: 8px;
        }
        
        .rescue-item {
            position: absolute;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: #ffcc00;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: all 0.3s;
        }
        
        .rescue-item.found {
            background-color: #99ff99;
        }
        
        .star-icon {
            color: #008800;
            font-size: 20px;
            display: none;
        }
        
        .rescue-item.found .star-icon {
            display: block;
        }
        
        .player-robot {
            position: absolute;
            width: 48px;
            height: 64px;
            border-radius: 8px;
            bottom: 20px;
            left: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .robot-face {
            width: 32px;
            height: 16px;
            background-color: white;
            border-radius: 8px;
            position: relative;
        }
        
        .robot-face:after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 24px;
            height: 4px;
            background-color: black;
        }
        
        .power-button {
            display: block;
            margin: 0 auto;
            padding: 10px 20px;
            font-weight: bold;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
        }
        
        .power-button:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
        }
        
        .instructions {
            background-color: #ffffcc;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            text-align: center;
        }
        
        .complete-message {
            background-color: #ffffcc;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 30px;
            text-align: center;
        }
        
        .complete-title {
            font-size: 1.5rem;
            margin-bottom: 10px;
        }
        
        .complete-score {
            font-size: 1.2rem;
            margin-bottom: 20px;
        }
        
        .perfect-score {
            background-color: #ccffcc;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: center;
            font-weight: bold;
        }
        
        .try-again {
            background-color: #cce6ff;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .game-screen {
            display: none;
        }
        
        #selection-screen {
            display: block;
        }
    </style>
</head>
<body>
    <div class="game-container">
        <!-- Robot Selection Screen -->
        <div id="selection-screen" class="game-screen">
            <h1>Robot Rescue Mission</h1>
            <h2>Choose your Robot, Micah!</h2>
            
            <div class="robot-selection">
                <div class="robot-card" data-robot="red" onclick="selectRobot('red')">
                    <div class="robot-color robot-red">
                        <div class="robot-figure">
                            <div class="robot-eyes">
                                <div class="robot-eye"></div>
                                <div class="robot-eye"></div>
                            </div>
                            <div class="robot-mouth"></div>
                            <div class="robot-body"></div>
                        </div>
                    </div>
                    <div class="robot-name">Blaze</div>
                    <div class="robot-power">Power: Flight</div>
                    <div class="robot-power-desc">Can fly over one obstacle</div>
                </div>
                
                <div class="robot-card" data-robot="blue" onclick="selectRobot('blue')">
                    <div class="robot-color robot-blue">
                        <div class="robot-figure">
                            <div class="robot-eyes">
                                <div class="robot-eye"></div>
                                <div class="robot-eye"></div>
                            </div>
                            <div class="robot-mouth"></div>
                            <div class="robot-body"></div>
                        </div>
                    </div>
                    <div class="robot-name">Sonar</div>
                    <div class="robot-power">Power: Scan</div>
                    <div class="robot-power-desc">Can detect a hidden item</div>
                </div>
                
                <div class="robot-card" data-robot="yellow" onclick="selectRobot('yellow')">
                    <div class="robot-color robot-yellow">
                        <div class="robot-figure">
                            <div class="robot-eyes">
                                <div class="robot-eye"></div>
                                <div class="robot-eye"></div>
                            </div>
                            <div class="robot-mouth"></div>
                            <div class="robot-body"></div>
                        </div>
                    </div>
                    <div class="robot-name">Bumble</div>
                    <div class="robot-power">Power: Shrink</div>
                    <div class="robot-power-desc">Can shrink to reach tight spaces</div>
                </div>
                
                <div class="robot-card" data-robot="green" onclick="selectRobot('green')">
                    <div class="robot-color robot-green">
                        <div class="robot-figure">
                            <div class="robot-eyes">
                                <div class="robot-eye"></div>
                                <div class="robot-eye"></div>
                            </div>
                            <div class="robot-mouth"></div>
                            <div class="robot-body"></div>
                        </div>
                    </div>
                    <div class="robot-name">Crusher</div>
                    <div class="robot-power">Power: Strength</div>
                    <div class="robot-power-desc">Can move one heavy obstacle</div>
                </div>
            </div>
            
            <button id="start-button" class="start-button" disabled onclick="startGame()">
                Start Rescue Mission!
            </button>
        </div>
        
        <!-- Gameplay Screen -->
        <div id="gameplay-screen" class="game-screen">
            <div class="game-header">
                <div class="info-box robot-info">
                    Robot: <span id="robot-name">-</span>
                </div>
                <div class="info-box timer-info">
                    Time: <span id="timer">30</span>s
                </div>
                <div class="info-box score-info">
                    Score: <span id="score">0</span>/5
                </div>
            </div>
            
            <div class="game-world" id="game-world">
                <!-- Obstacles -->
                <div class="obstacle" style="top: 40px; left: 40px; width: 80px; height: 80px;"></div>
                <div class="obstacle" style="bottom: 80px; right: 40px; width: 100px; height: 60px;"></div>
                <div class="obstacle" style="top: 160px; left: 160px; width: 60px; height: 60px;"></div>
                
                <!-- Items to be rescued -->
                <div class="rescue-item" id="item-1" style="top: 120px; left: 100px;" onclick="findItem('item-1')">
                    <span class="star-icon">★</span>
                </div>
                <div class="rescue-item" id="item-2" style="bottom: 80px; left: 150px;" onclick="findItem('item-2')">
                    <span class="star-icon">★</span>
                </div>
                <div class="rescue-item" id="item-3" style="top: 80px; right: 120px;" onclick="findItem('item-3')">
                    <span class="star-icon">★</span>
                </div>
                <div class="rescue-item" id="item-4" style="bottom: 120px; right: 200px;" onclick="findItem('item-4')">
                    <span class="star-icon">★</span>
                </div>
                <div class="rescue-item" id="item-5" style="top: 200px; right: 80px;" onclick="findItem('item-5')">
                    <span class="star-icon">★</span>
                </div>
                
                <!-- Player Robot -->
                <div class="player-robot" id="player-robot">
                    <div class="robot-face"></div>
                </div>
            </div>
            
            <button id="power-button" class="power-button" onclick="usePower()">
                Use Power!
            </button>
            
            <div class="instructions">
                Find all the items before time runs out! Click on the yellow dots to rescue them.
            </div>
        </div>
        
        <!-- Game Complete Screen -->
        <div id="complete-screen" class="game-screen">
            <h1>Mission Complete!</h1>
            
            <div class="complete-message">
                <h2 class="complete-title">Great job, Micah!</h2>
                <p class="complete-score">You rescued <span id="final-score">0</span> out of 5 items!</p>
                
                <div id="perfect-score-message" class="perfect-score" style="display: none;">
                    Perfect Score! You're a Rescue Hero!
                </div>
                
                <div id="try-again-message" class="try-again">
                    Try again to rescue all the items!
                </div>
            </div>
            
            <button class="start-button" onclick="resetGame()">
                Play Again
            </button>
        </div>
    </div>

    <script>
        // Game variables
        let selectedRobot = null;
        let score = 0;
        let timer = 30;
        let powerUsed = false;
        let timerInterval;
        let foundItems = [];
        
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
            
            // Update UI
            document.getElementById('robot-name').textContent = robots[selectedRobot].name;
            document.getElementById('score').textContent = score;
            document.getElementById('timer').textContent = timer;
            
            // Set player robot color
            const playerRobot = document.getElementById('player-robot');
            playerRobot.className = 'player-robot ' + robots[selectedRobot].color;
            
            // Set power button color and text
            const powerButton = document.getElementById('power-button');
            powerButton.textContent = `Use ${robots[selectedRobot].power} Power!`;
            if (selectedRobot === 'red') powerButton.style.backgroundColor = '#ff4d4d';
            if (selectedRobot === 'blue') powerButton.style.backgroundColor = '#4d94ff';
            if (selectedRobot === 'yellow') powerButton.style.backgroundColor = '#ffcc00';
            if (selectedRobot === 'green') powerButton.style.backgroundColor = '#4dff4d';
            powerButton.disabled = false;
            
            // Reset rescue items
            document.querySelectorAll('.rescue-item').forEach(item => {
                item.classList.remove('found');
            });
            
            // Start timer
            startTimer();
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
            if (foundItems.includes(itemId)) return;
            
            foundItems.push(itemId);
            score++;
            
            // Update UI
            document.getElementById('score').textContent = score;
            document.getElementById(itemId).classList.add('found');
            
            // Check if all items found
            if (score === 5) {
                clearInterval(timerInterval);
                setTimeout(endGame, 500);
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
    </script>
</body>
</html>