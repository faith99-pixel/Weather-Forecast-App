import React from "react";

type TopBarProps = {
  location: string;
  setLocation: React.Dispatch<React.SetStateAction<string>>;
  fetchWeather: () => void;
};

const TopBar = ({ location, setLocation, fetchWeather }: TopBarProps) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      fetchWeather(); // Fetch weather only when Enter is pressed
    }
  };

  return (
    <div className="flex justify-center items-center">
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        onKeyDown={handleKeyDown} // Call the handler on key down
        className="px-4 py-2 rounded-md bg-gray-700 text-white"
        placeholder="Enter location..."
      />
    </div>
  );
};

export default TopBar;
