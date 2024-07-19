import { useEffect, useState } from "react";
import Search from "../search";

export default function Weather() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");

  const apiKey = process.env.REACT_APP_API_KEY;

  async function fetchWeatherData(param) {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${param}&appid=${apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();

      if (data) {
        setWeatherData(data);
        setSearch("");
        setLoading(false);
        setError("");
      }
    } catch (error) {
      setLoading(false);
      setError(error.message);
      setSearch("");
    }
  }

  function handleSearch() {
    fetchWeatherData(search);
  }

  function getCurrentDate() {
    return new Date().toLocaleDateString(`en-us`, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  useEffect(() => {
    fetchWeatherData("London");
  }, []);

  return (
    <div>
      <Search
        search={search}
        setSearch={setSearch}
        handleSearch={handleSearch}
      />
      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error-message">
          <p>Country not found, please try again.</p>
        </div>
      ) : (
        <div>
          <div className="city-name">
            {" "}
            <h2>
              {weatherData?.name}, <span>{weatherData?.sys?.country}</span>
            </h2>
          </div>
          <div className="date">
            {" "}
            <span>{getCurrentDate()}</span>{" "}
          </div>
          <div className="temp">{Math.floor(weatherData?.main?.temp)}°C</div>
          <p className="weather-description">
            {weatherData && weatherData.weather && weatherData.weather[0]
              ? weatherData.weather[0].description
              : ""}
          </p>
          <div className="weather-info">
            <div className="column">
              <div>
                <p className="wind">
                  {Math.floor(weatherData?.wind?.speed)}km/h
                </p>
                <p>Wind speed</p>
              </div>
            </div>
            <div className="column">
              <div>
                <p className="humidity">{weatherData?.main?.humidity}%</p>
                <p>Humidity</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
