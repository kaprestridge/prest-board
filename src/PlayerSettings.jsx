import React from "react";
import useStore from "./store";

const PlayerSettings = () => {
  const {
    players,
    setPlayerName,
    setPlayerColor,
    togglePlayerEnabled,
    toggleSettings,
  } = useStore();

  // Available colors with their display names
  const colorOptions = [
    { name: "Red", value: "bg-red-500" },
    { name: "Blue", value: "bg-blue-500" },
    { name: "Green", value: "bg-green-500" },
    { name: "Purple", value: "bg-purple-500" },
    { name: "Yellow", value: "bg-yellow-500" },
    { name: "Pink", value: "bg-pink-500" },
    { name: "Orange", value: "bg-orange-500" },
    { name: "Teal", value: "bg-teal-500" },
  ];

  // Count enabled players
  const enabledCount = players.filter((player) => player.enabled).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Player Settings</h2>
          <button
            onClick={toggleSettings}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {players.map((player, index) => (
          <div
            key={index}
            className="mb-6 p-4 border rounded-lg"
            style={{ opacity: player.enabled ? 1 : 0.6 }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Player {index + 1}</h3>
              <div className="flex items-center">
                <span className="mr-2 text-sm text-gray-600">
                  {player.enabled ? "Enabled" : "Disabled"}
                </span>
                <button
                  onClick={() => {
                    // Only allow disabling if there will still be at least one enabled player
                    if (player.enabled && enabledCount <= 1) {
                      return;
                    }
                    togglePlayerEnabled(index);
                  }}
                  className={`w-10 h-6 ${
                    player.enabled ? "bg-green-500" : "bg-gray-300"
                  } rounded-full relative transition-colors ${
                    player.enabled && enabledCount <= 1
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                      player.enabled ? "left-5" : "left-1"
                    }`}
                  ></span>
                </button>
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={player.name}
                onChange={(e) => setPlayerName(index, e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={!player.enabled}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <select
                value={player.color}
                onChange={(e) => setPlayerColor(index, e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={!player.enabled}
              >
                {colorOptions.map((color) => (
                  <option key={color.value} value={color.value}>
                    {color.name}
                  </option>
                ))}
              </select>

              <div className="mt-2 flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() =>
                      player.enabled && setPlayerColor(index, color.value)
                    }
                    className={`w-6 h-6 rounded-full ${color.value} border-2 ${
                      player.color === color.value
                        ? "border-black"
                        : "border-transparent"
                    }`}
                    disabled={!player.enabled}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={toggleSettings}
          className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mt-2"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default PlayerSettings;
