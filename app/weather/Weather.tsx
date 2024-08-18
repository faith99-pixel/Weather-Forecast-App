"use client";
import React, { useState, useEffect } from "react";
import TopBar from "../components/TopBar";

type Props = {};

const Weather = (props: Props) => {
  // State to hold the user's input locationx
  const [location, setLocation] = useState("");

  // State to hold the fetched weather data
  const [weatherData, setWeatherData] = useState<any>(null);

  // State to hold any error message
  const [error, setError] = useState("");

  // State to manage the loading state while fetching data
  const [isLoading, setIsLoading] = useState(false);

  // State to hold the selected unit for temperature (metric or imperial)
  const [unit, setUnit] = useState("metric");

  // State to track if location permission was denied by the user
  const [locationPermissionDenied, setLocationPermissionDenied] =
    useState(false);

  // API configuration object
  const api = {
    key: process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || "", // API key from environment variables
    base: "https://api.openweathermap.org/data/2.5/", // Base URL for the API
  };

  // Function to format a given date into a readable string
  const dateBuilder = (d: Date) => {
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();
    return `${day} ${date} ${month} ${year}`; // Returns formatted date string
  };

  // Function to fetch weather data based on the location
  const fetchWeather = async () => {
    try {
      if (location) {
        setIsLoading(true); // Set loading state to true
        const response = await fetch(
          `${api.base}weather?q=${location}&units=${unit}&APPID=${api.key}`
        );
        if (!response.ok) {
          throw new Error("City not found"); // Throw an error if city is not found
        }
        const data = await response.json(); // Parse the response data
        setWeatherData(data); // Set the weather data state
        setError(""); // Clear any previous errors
        localStorage.setItem("lastLocation", location); // Store the last searched location in local storage
      }
    } catch (err: any) {
      setError(err.message); // Set error message state
      setWeatherData(null); // Clear weather data state in case of error
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  // useEffect to fetch weather data based on the user's current location or last searched location
  useEffect(() => {
    const fetchLocationWeather = (lat: number, lon: number) => {
      setIsLoading(true); // Set loading state to true
      fetch(
        `${api.base}weather?lat=${lat}&lon=${lon}&units=${unit}&APPID=${api.key}`
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error("Unable to fetch weather data."); // Throw an error if unable to fetch data
          }
          return res.json(); // Parse the response data
        })
        .then((data) => {
          setWeatherData(data); // Set the weather data state
          setLocation(`${data.name}`); // Set the location state
          setError(""); // Clear any previous errors
        })
        .catch((error) => {
          // setError(""); // Set error message state
          setWeatherData(null); // Clear weather data state in case of error
        })
        .finally(() => {
          setIsLoading(false); // Set loading state to false
        });
    };

    // Check if the browser supports geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchLocationWeather(
            position.coords.latitude,
            position.coords.longitude
          ); // Fetch weather data based on user's current location
        },
        () => {
          setError("Geolocation permission denied."); // Set error message if permission is denied
          setLocationPermissionDenied(true); // Set location permission denied state
          const lastLocation = localStorage.getItem("lastLocation");
          if (lastLocation) {
            setLocation(lastLocation); // Set the last searched location if available
          }
        }
      );
    } else {
      setError("Geolocation is not supported by this browser."); // Set error message if geolocation is not supported
      const lastLocation = localStorage.getItem("lastLocation");
      if (lastLocation) {
        setLocation(lastLocation); // Set the last searched location if available
      }
    }
  }, [unit]); // Dependency array includes unit, so this effect runs when unit changes

  return (
    <div
      className="w-[80%] h-[550px] m-auto rounded-xl bg-cover bg-center mt-4 shadow-lg p-4 text-white"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1561553543-e4c7b608b98d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      }} // Inline style to set the background image
    >
      <TopBar
        location={location} // Pass the location state to TopBar component
        setLocation={setLocation} // Pass the setLocation function to TopBar component
        fetchWeather={fetchWeather} // Pass fetchWeather function to TopBar component
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>{" "}
          {/* Loader animation */}
        </div>
      ) : (
        <div className="flex flex-col items-center mt-10">
          {error && (
            <p className="text-red-500 text-center">City not found</p> // Display error message if any
          )}
          {weatherData && (
            <div className="">
              <p className="text-center text-lg">{dateBuilder(new Date())}</p>{" "}
              {/* Display the current date */}
              <div className="text-center text-3xl font-semibold mt-4">
                {weatherData.name}, {weatherData.sys.country}{" "}
                {/* Display the city and country name */}
              </div>
              <div className="flex items-center justify-center gap-5 p-8">
                <img
                  src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                  alt={weatherData.weather[0].description}
                  className="w-24 h-24"
                />{" "}
                {/* Display weather icon */}
                <h1 className="font-bold text-6xl">
                  {weatherData.main.temp.toFixed(0)}°
                  {unit === "metric" ? "C" : "F"}{" "}
                  {/* Display the temperature with the correct unit */}
                </h1>
              </div>
              <h2 className="font-bold text-2xl leading-3 text-center capitalize">
                {weatherData.weather[0].description}{" "}
                {/* Display the weather description */}
              </h2>
              <div className="flex items-center justify-center gap-6 mt-8">
                <div className="text-center">
                  <h3 className="font-semibold">Humidity</h3>
                  <p>{weatherData.main.humidity}%</p>{" "}
                  {/* Display the humidity */}
                </div>
                <div className="text-center">
                  <h3 className="font-semibold">Wind Speed</h3>
                  <p>
                    {unit === "metric"
                      ? `${weatherData.wind.speed} m/s`
                      : `${(weatherData.wind.speed * 2.237).toFixed(
                          2
                        )} mph`}{" "}
                    {/* Display the wind speed based on the selected unit */}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Weather;
