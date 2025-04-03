import React, { useState, useEffect } from 'react';
import { Play, Star, RefreshCw } from 'lucide-react';

const RobotRescueGame = () => {
  const [gameState, setGameState] = useState('selection'); // selection, playing, complete
  const [selectedRobot, setSelectedRobot] = useState(null);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [powerUsed, setPowerUsed] = useState(false);
  const [foundItems, setFoundItems] = useState([]);
  
  const robots = [
    { 
      id: 'red', 
      name: 'Blaze', 
      color: 'bg-red-500', 
      power: 'Flight', 
      powerDescription: 'Can fly over one obstacle'
    },
    { 
      id: 'blue', 
      name: 'Sonar', 
      color: 'bg-blue-500', 
      power: 'Scan', 
      powerDescription: 'Can detect a hidden item'
    },
    { 
      id: 'yellow', 
      name: 'Bumble', 
      color: 'bg-yellow-500', 
      power: 'Shrink', 
      powerDescription: 'Can shrink to reach tight spaces'
    },
    { 
      id: 'green', 
      name: 'Crusher', 
      color: 'bg-green-500', 
      power: 'Strength', 
      powerDescription: 'Can move one heavy obstacle'
    }
  ];
  
  const rescueItems = [
    { id: 'teddy', name: 'Teddy Bear', found: false, position: 'top-32 left-24' },
    { id: 'car', name: 'Toy Car', found: false, position: 'bottom-20 right-24' },
    { id: 'ball', name: 'Bouncy Ball', found: false, position: 'top-20 right-32' },
    { id: 'blocks', name: 'Building Blocks', found: false, position: 'bottom-32 left-32' },
    { id: 'book', name: 'Story Book', found: false, position: 'top-40 left-40' }
  ];
  
  // Timer effect
  useEffect(() => {
    let interval = null;
    
    if (gameState === 'playing' && timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setGameState('complete');
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [gameState, timer]);
  
  const startGame = () => {
    if (!selectedRobot) return;
    
    setGameState('playing');
    setScore(0);
    setTimer(30);
    setPowerUsed(false);
    setFoundItems([]);
  };
  
  const findItem = (item) => {
    if (!foundItems.includes(item.id)) {
      setFoundItems(prev => [...prev, item.id]);
      setScore(prev => prev + 1);
    }
  };
  
  const usePower = () => {
    // Special power effect based on robot
    if (powerUsed) return;
    
    // Visual feedback for power use
    setPowerUsed(true);
    
    // For the blue robot (Sonar), reveal a hint to an unfound item
    if (selectedRobot.id === 'blue') {
      const unfoundItems = rescueItems.filter(item => !foundItems.includes(item.id));
      if (unfoundItems.length > 0) {
        // Visual hint effect would go here in a full game
        setTimeout(() => {
          alert(`Sonar detected ${unfoundItems[0].name} nearby!`);
        }, 500);
      }
    }
  };
  
  const resetGame = () => {
    setGameState('selection');
    setSelectedRobot(null);
  };
  
  // Robot selection screen
  if (gameState === 'selection') {
    return (
      <div className="flex flex-col items-center p-6 bg-blue-50 rounded-lg max-w-4xl mx-auto min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-blue-800">Robot Rescue Mission</h1>
        <h2 className="text-xl mb-6">Choose your Robot, Micah!</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          {robots.map(robot => (
            <div 
              key={robot.id}
              className={`p-4 rounded-lg border-4 cursor-pointer transition-all duration-300 ${
                selectedRobot && selectedRobot.id === robot.id 
                  ? `border-${robot.color.split('-')[1]}-700` 
                  : 'border-gray-300'
              }`}
              onClick={() => setSelectedRobot(robot)}
            >
              <div className={`${robot.color} rounded-lg p-4 mb-2 flex justify-center`}>
                <div className="w-16 h-24 bg-gray-100 rounded-lg relative flex flex-col items-center justify-center">
                  {/* Simple robot face */}
                  <div className="absolute top-4 w-12 h-6 flex justify-between">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  </div>
                  <div className="absolute top-12 w-6 h-1 bg-gray-700"></div>
                  {/* Robot body */}
                  <div className="absolute bottom-2 w-10 h-6 bg-gray-300 rounded-sm"></div>
                </div>
              </div>
              <h3 className="font-bold text-lg text-center">{robot.name}</h3>
              <p className="text-center text-sm">Power: {robot.power}</p>
              <p className="text-center text-xs text-gray-500">{robot.powerDescription}</p>
            </div>
          ))}
        </div>
        
        <button
          className={`px-6 py-3 rounded-full flex items-center gap-2 text-white font-bold ${
            selectedRobot ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400'
          }`}
          onClick={startGame}
          disabled={!selectedRobot}
        >
          <Play size={20} />
          Start Rescue Mission!
        </button>
      </div>
    );
  }
  
  // Gameplay screen
  if (gameState === 'playing') {
    return (
      <div className="flex flex-col items-center p-6 bg-blue-50 rounded-lg max-w-4xl mx-auto min-h-screen">
        <div className="w-full flex justify-between items-center mb-4">
          <div className="bg-blue-100 rounded-lg p-2">
            <p className="font-bold">Robot: {selectedRobot.name}</p>
          </div>
          <div className="bg-red-100 rounded-lg p-2">
            <p className="font-bold">Time: {timer}s</p>
          </div>
          <div className="bg-green-100 rounded-lg p-2">
            <p className="font-bold">Score: {score}/{rescueItems.length}</p>
          </div>
        </div>
        
        <div className="relative w-full h-96 bg-gray-200 rounded-lg border-2 border-gray-400 overflow-hidden mb-4">
          {/* Game world */}
          {/* Obstacles */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-gray-400 rounded"></div>
          <div className="absolute bottom-20 right-10 w-24 h-16 bg-gray-400 rounded"></div>
          <div className="absolute top-40 left-40 w-16 h-16 bg-gray-400 rounded"></div>
          
          {/* Items to rescue */}
          {rescueItems.map(item => (
            <div 
              key={item.id}
              className={`absolute ${item.position} w-10 h-10 rounded-full ${
                foundItems.includes(item.id) ? 'bg-green-300' : 'bg-yellow-300'
              } flex items-center justify-center cursor-pointer transition-all`}
              onClick={() => findItem(item)}
            >
              {foundItems.includes(item.id) && <Star size={16} className="text-green-700" />}
            </div>
          ))}
          
          {/* Player robot */}
          <div className={`absolute bottom-4 left-4 w-12 h-16 ${selectedRobot.color} rounded-lg flex items-center justify-center`}>
            <div className="w-8 h-4 bg-white rounded-lg relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-1 bg-black"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button
            className={`px-4 py-2 rounded-lg ${
              powerUsed ? 'bg-gray-400' : `bg-${selectedRobot.color.split('-')[1]}-500 hover:bg-${selectedRobot.color.split('-')[1]}-600`
            } text-white font-bold`}
            onClick={usePower}
            disabled={powerUsed}
          >
            Use {selectedRobot.power} Power!
          </button>
        </div>
        
        <div className="mt-4 bg-yellow-100 p-3 rounded-lg">
          <p className="text-center">
            Find all the items before time runs out! Click on the yellow dots to rescue them.
          </p>
        </div>
      </div>
    );
  }
  
  // Game complete screen
  if (gameState === 'complete') {
    return (
      <div className="flex flex-col items-center p-6 bg-blue-50 rounded-lg max-w-4xl mx-auto min-h-screen">
        <h1 className="text-3xl font-bold mb-4 text-blue-800">Mission Complete!</h1>
        
        <div className="bg-yellow-100 rounded-lg p-6 mb-6">
          <h2 className="text-2xl mb-2">Great job, Micah!</h2>
          <p className="text-xl mb-4">You rescued {score} out of {rescueItems.length} items!</p>
          
          {score === rescueItems.length ? (
            <div className="bg-green-100 p-3 rounded-lg mb-4">
              <p className="text-center font-bold">Perfect Score! You're a Rescue Hero!</p>
            </div>
          ) : (
            <div className="bg-blue-100 p-3 rounded-lg mb-4">
              <p className="text-center">Try again to rescue all the items!</p>
            </div>
          )}
        </div>
        
        <div className="flex gap-4">
          <button 
            className="px-6 py-3 rounded-full bg-green-600 hover:bg-green-700 text-white font-bold flex items-center gap-2"
            onClick={() => {
              setSelectedRobot(null);
              resetGame();
            }}
          >
            <RefreshCw size={20} />
            Play Again
          </button>
        </div>
      </div>
    );
  }
};

export default RobotRescueGame;