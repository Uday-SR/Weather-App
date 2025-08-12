import { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [weekly, setWeekly] = useState([]);

  const getData = async () => {
    const response = await fetch(`http://localhost:3000/weather?city=${city}`);
    const data = await response.json();

    setWeather(data.current); // current weather
    setWeekly(data.weekly); // array of weekly weather
  };

  return (
    <div className="app-container">
      <h1 className="heading">🌤 Weather App</h1>

      <div className="search-box">
        <input
          value={city}
          placeholder="Enter the city"
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={getData}>Get Weather</button>
      </div>

      {weather && (
        <div className="weather-box">
          <h2>{weather.city}</h2>
          <p>Region: {weather.region}</p>
          <p>Country: {weather.country}</p>
          <p>Condition: {weather.condition}</p>
          <img src={weather.icon} alt="weather icon" />
        </div>
      )}

      {weekly.length > 0 && (
        <div className="weekly-forecast">
          {weekly.map((day, index) => (
            <div key={index} className="day-box">
              <p>{day.day}</p>
              <img src={day.icon} alt={day.condition} />
              <p>{day.condition}</p>
              <p>{day.temp}°C</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
