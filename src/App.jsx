import React, { useState, useRef } from "react";
import { motion } from "framer-motion";  // eslint-disable-line no-unused-vars
import useStore from "./store";
import PlayerSettings from "./PlayerSettings";

function App() {
  const {
    players,
    setScore,
    undo,
    resetGame,
    currentPlayerIndex,
    setCurrentPlayer,
    isSettingsOpen,
    toggleSettings,
  } = useStore();

  // State to track which player's score is being modified
  const [activePlayer, setActivePlayer] = useState(null);

  // State to track points to add during dragging
  const [pointsToAdd, setPointsToAdd] = useState(0);

  // Ref for tracking the initial Y position
  const initialYRef = useRef(0);

  // Constants for the drag sensitivity
  const DRAG_SENSITIVITY = 15; // pixels per point

  // Maximum score for cribbage (typically 121)
  const MAX_SCORE = 121;

  const handleDragStart = (e, playerIndex) => {
    if (!players[playerIndex].enabled) return;

    setActivePlayer(playerIndex);
    setCurrentPlayer(playerIndex);
    initialYRef.current = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    setPointsToAdd(0);
  };

  const handleDrag = (e, playerIndex) => {
    if (activePlayer !== playerIndex || !players[playerIndex].enabled) return;

    const currentY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    const yDifference = initialYRef.current - currentY;

    // Calculate points based on drag distance
    const calculatedPoints = Math.floor(yDifference / DRAG_SENSITIVITY);

    if (calculatedPoints !== pointsToAdd) {
      setPointsToAdd(Math.max(0, calculatedPoints)); // Ensure points are not negative
    }
  };

  const handleDragEnd = (playerIndex) => {
    if (activePlayer !== playerIndex || !players[playerIndex].enabled) return;

    // Only add points if positive (dragging upward)
    if (pointsToAdd > 0) {
      const newScore = Math.min(
        players[playerIndex].score + pointsToAdd,
        MAX_SCORE
      );
      setScore(playerIndex, newScore);
    }

    // Reset states
    setActivePlayer(null);
    setPointsToAdd(0);
  };

  // Get CSS color without the bg- prefix for use in SVG
  const getColorValue = (bgColor) => {
    const colorMap = {
      "bg-red-500": "#ef4444",
      "bg-blue-500": "#3b82f6",
      "bg-green-500": "#22c55e",
      "bg-purple-500": "#a855f7",
      "bg-yellow-500": "#eab308",
      "bg-pink-500": "#ec4899",
      "bg-orange-500": "#f97316",
      "bg-teal-500": "#14b8a6",
    };
    return colorMap[bgColor] || "#4b5563"; // Default gray if not found
  };

  // Filter to get only enabled players
  const enabledPlayers = players.filter((player) => player.enabled);

  // Check if any player has won (reached or exceeded MAX_SCORE)
  const winner = enabledPlayers.find((player) => player.score >= MAX_SCORE);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-2">Prest-board</h1>

      {/* Settings button */}
      <button
        onClick={toggleSettings}
        className="absolute top-4 right-4 p-2 bg-gray-200 hover:bg-gray-300 rounded-full"
        aria-label="Settings"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>
      <div className="h-full">
        {/* Cribbage Board Visualization */}
        <div className="w-full max-w-2xl h-[80vh] bg-gray-200 rounded-lg p-4 shadow-lg mb-6 overflow-hidden relative">
          {/* SVG for the cribbage board tracks */}
          <svg width="100%" height="100%" viewBox="0 0 300 600">
            {/* Cribbage board base */}
            <rect
              x="25"
              y="50"
              width="250"
              height="500"
              rx="30"
              fill="#8B4513"
            />
            <rect
              x="35"
              y="60"
              width="230"
              height="480"
              rx="20"
              fill="#A0522D"
            />

            {/* Main track background */}
            <path
              d="M 75,480
             L 75,100
             C 75,80 225,80 225,100
             L 225,480
             C 225,500 150,500 150,480
             L 150,130"
              fill="none"
              stroke="#D2B48C"
              strokeWidth="40"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Player progress tracks - with improved curve separation */}
            {players.map((player, index) => {
              if (!player.enabled) return null;

              // Calculate player's position in the enabled players array
              const enabledIndex = enabledPlayers.findIndex(
                (p) => p.name === player.name
              );
              const totalEnabled = enabledPlayers.length;

              // Calculate offsets based on number of enabled players
              const offsetMultiplier =
                totalEnabled === 1
                  ? 0
                  : (enabledIndex / (totalEnabled - 1)) * 2 - 1;
              const offset = 10 * offsetMultiplier;

              // Using offset for horizontal offset on straight lines
              const leftOffset = offset;
              const rightOffset = -offset;
              const centerOffset = offset;

              // Vertical offsets for curves
              const topCurveOffset = offset;
              const bottomCurveOffset = offset;

              // Pre-calculate the positions to avoid string concatenation issues
              const leftY = 100 + topCurveOffset;
              const leftControlY = 80 + topCurveOffset;
              const rightControlY = 80 + topCurveOffset;
              const rightY = 100 + topCurveOffset;

              const rightBottomY = 480 - bottomCurveOffset;
              const rightBottomControlY = 500 - bottomCurveOffset;
              const centerBottomControlY = 500 - bottomCurveOffset;
              const centerBottomY = 480 - bottomCurveOffset;

              return (
                <motion.path
                  key={`progress-${index}`}
                  d={`M ${75 + leftOffset},480
              L ${75 + leftOffset},${leftY}
              C ${75 + leftOffset - 5},${leftControlY} ${
                    225 + rightOffset + 5
                  },${rightControlY} ${225 + rightOffset},${rightY}
              L ${225 + rightOffset},${rightBottomY}
              C ${225 + rightOffset - 5},${rightBottomControlY} ${
                    150 + centerOffset + 5
                  },${centerBottomControlY} ${
                    150 + centerOffset
                  },${centerBottomY}
              L ${150 + centerOffset},130`}
                  fill="none"
                  stroke={getColorValue(player.color)}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{
                    pathLength: Math.min(player.score / MAX_SCORE, 1),
                  }}
                  transition={{ type: "spring", stiffness: 60 }}
                />
              );
            })}

            {/* Finish line */}
            <circle
              cx="150"
              cy="130"
              r="10"
              fill="#DAA520"
              stroke="#8B4513"
              strokeWidth="2"
            />

            {/* Start markers - horizontally spaced */}
            {players.map((player, index) => {
              if (!player.enabled) return null;

              // Calculate position among enabled players
              const enabledIndex = enabledPlayers.findIndex(
                (p) => p.name === player.name
              );
              const totalEnabled = enabledPlayers.length;

              // Calculate offset
              const offsetMultiplier =
                totalEnabled === 1
                  ? 0
                  : (enabledIndex / (totalEnabled - 1)) * 2 - 1;
              const offset = 10 * offsetMultiplier;

              return (
                <circle
                  key={`start-${index}`}
                  cx={75 + offset}
                  cy="480"
                  r="5"
                  fill={getColorValue(player.color)}
                />
              );
            })}
          </svg>

          {/* Winner display overlay */}
          {winner && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded p-2">
              <div className="p-2 bg-yellow-300 text-yellow-800 rounded-lg font-bold text-2xl text-center">
                {winner.name} wins!
              </div>
            </div>
          )}
        </div>

        {/* Bottom Controls Bar */}
        <div className="w-full max-w-2xl p-3 bg-gray-800 rounded-lg flex justify-between items-center mb-4">
          {/* Player Control Buttons */}
          <div className="flex gap-2">
            {players.map(
              (player, index) =>
                player.enabled && (
                  <motion.div
                    key={index}
                    className={`flex-1 px-4 py-3 rounded-lg ${player.color} text-white flex flex-col items-center`}
                    whileTap={{ scale: 0.95 }}
                    onMouseDown={(e) => handleDragStart(e, index)}
                    onMouseMove={(e) => handleDrag(e, index)}
                    onMouseUp={() => handleDragEnd(index)}
                    onMouseLeave={() =>
                      activePlayer === index && handleDragEnd(index)
                    }
                    onTouchStart={(e) => handleDragStart(e, index)}
                    onTouchMove={(e) => handleDrag(e, index)}
                    onTouchEnd={() => handleDragEnd(index)}
                    style={{
                      touchAction: "none",
                      cursor: "grab",
                      border:
                        currentPlayerIndex === index
                          ? "2px solid white"
                          : "none",
                    }}
                  >
                    <span className="text-sm font-semibold pb-5">
                      {player.name}
                    </span>
                    <div className="relative my-1">
                      <span className="text-lg font-bold">{player.score}</span>
                      {activePlayer === index && pointsToAdd > 0 && (
                        <div className="absolute -top-6 left-0 right-0 text-center text-white font-bold">
                          +{pointsToAdd}
                        </div>
                      )}
                    </div>
                    <div className="text-xs">↑↑</div>
                  </motion.div>
                )
            )}
          </div>

          {/* Game Controls */}
          <div className="flex flex-col gap-2">
            <button
              onClick={undo}
              className="py-2 px-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Undo
            </button>
            <button
              onClick={resetGame}
              className="py-2 px-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          Made by Kathryn for Dad, Lachlan and Aaron 2025
        </div>
      </div>

      {/* Player Settings Modal */}
      {isSettingsOpen && <PlayerSettings />}
    </div>
  );
}

export default App;
