import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useStore = create(
  persist(
    (set) => ({
      players: [
        { name: "Player 1", score: 0, color: "bg-red-500", enabled: true },
        { name: "Player 2", score: 0, color: "bg-blue-500", enabled: true },
        { name: "Player 3", score: 0, color: "bg-green-500", enabled: true },
      ],
      currentPlayerIndex: 0,
      undoStack: [],
      isSettingsOpen: false,

      // Function to update player score
      setScore: (playerIndex, score) =>
        set((state) => {
          // Create a deep copy of the current players array for the undo stack
          const previousPlayers = state.players.map((player) => ({
            ...player,
          }));

          // Add current state to undo stack before updating score
          const playersState = {
            players: previousPlayers,
            currentPlayerIndex: state.currentPlayerIndex,
          };

          // Update the player score
          const updatedPlayers = [...state.players];
          updatedPlayers[playerIndex].score = score;

          // Return the updated state along with the updated undo stack
          return {
            players: updatedPlayers,
            undoStack: [...state.undoStack, playersState],
          };
        }),

      // Function to set the current player index
      setCurrentPlayer: (index) =>
        set((state) => {
          // Make sure we're setting to an enabled player
          if (!state.players[index].enabled) {
            // Find the first enabled player
            const enabledIndex = state.players.findIndex(
              (player) => player.enabled
            );
            if (enabledIndex !== -1) {
              index = enabledIndex;
            }
          }
          return {
            currentPlayerIndex: index,
          };
        }),

      // Function to undo the last action and revert to previous state
      undo: () =>
        set((state) => {
          if (state.undoStack.length === 0) return state;

          const previousState = state.undoStack[state.undoStack.length - 1];

          return {
            players: previousState.players,
            currentPlayerIndex: previousState.currentPlayerIndex,
            undoStack: state.undoStack.slice(0, -1),
          };
        }),

      // Function to reset the game
      resetGame: () =>
        set((state) => ({
          players: state.players.map((player) => ({
            ...player,
            score: 0,
          })),
          currentPlayerIndex: 0,
          undoStack: [],
        })),

      // Function to update player name
      setPlayerName: (playerIndex, name) =>
        set((state) => {
          const updatedPlayers = [...state.players];
          updatedPlayers[playerIndex] = {
            ...updatedPlayers[playerIndex],
            name,
          };
          return { players: updatedPlayers };
        }),

      // Function to update player color
      setPlayerColor: (playerIndex, color) =>
        set((state) => {
          const updatedPlayers = [...state.players];
          updatedPlayers[playerIndex] = {
            ...updatedPlayers[playerIndex],
            color,
          };
          return { players: updatedPlayers };
        }),

      // Function to toggle player enabled status
      togglePlayerEnabled: (playerIndex) =>
        set((state) => {
          // Check how many players are currently enabled
          const enabledCount = state.players.filter(
            (player) => player.enabled
          ).length;

          // Don't disable if this is the last enabled player
          if (state.players[playerIndex].enabled && enabledCount <= 1) {
            return state;
          }

          const updatedPlayers = [...state.players];
          updatedPlayers[playerIndex] = {
            ...updatedPlayers[playerIndex],
            enabled: !updatedPlayers[playerIndex].enabled,
          };

          // If we're disabling the current player, switch to another enabled one
          let newCurrentIndex = state.currentPlayerIndex;
          if (
            playerIndex === state.currentPlayerIndex &&
            !updatedPlayers[playerIndex].enabled
          ) {
            const enabledIndex = updatedPlayers.findIndex(
              (p, idx) => p.enabled && idx !== playerIndex
            );
            if (enabledIndex !== -1) {
              newCurrentIndex = enabledIndex;
            }
          }

          return {
            players: updatedPlayers,
            currentPlayerIndex: newCurrentIndex,
          };
        }),

      // Toggle settings panel
      toggleSettings: () =>
        set((state) => ({
          isSettingsOpen: !state.isSettingsOpen,
        })),
    }),
    {
      name: "game-score-storage", // unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // explicitly using JSON storage

      // Include the undo stack but exclude isSettingsOpen
      partialize: (state) => ({
        players: state.players,
        currentPlayerIndex: state.currentPlayerIndex,
        undoStack: state.undoStack,
      }),

      // Debug option to help troubleshoot
      version: 1, // increment this when you make breaking changes
    }
  )
);

export default useStore;
