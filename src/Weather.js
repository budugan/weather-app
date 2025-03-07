import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_KEY = "53140cc1b870b88e3ec6f24d476ba4c1";
const weatherTranslations = {
  "clear sky": "cer senin",
  "few clouds": "câțiva nori",
  "scattered clouds": "nori răzleți",
  "broken clouds": "nori fragmentați",
  "overcast clouds": "cer acoperit",
  "shower rain": "averse de ploaie",
  "light rain": "ploaie ușoară",
  "moderate rain": "ploaie moderată",
  "heavy intensity rain": "ploaie puternică",
  "very heavy rain": "ploaie foarte puternică",
  "extreme rain": "ploaie extremă",
  "freezing rain": "ploaie înghețată",
  "light snow": "ninsoare ușoară",
  snow: "ninsoare",
  "heavy snow": "ninsoare puternică",
  sleet: "lapoviță",
  mist: "ceață",
  smoke: "fum",
  haze: "ceață ușoară",
  "sand/dust whirls": "vârtejuri de praf",
  fog: "ceață densă",
  sand: "nisip",
  dust: "praf",
  "volcanic ash": "cenușă vulcanică",
  squalls: "rafale de vânt",
  tornado: "tornadă",
  thunderstorm: "furtună",
  "thunderstorm with light rain": "furtună cu ploaie ușoară",
  "thunderstorm with rain": "furtună cu ploaie",
  "thunderstorm with heavy rain": "furtună cu ploaie puternică",
  "thunderstorm with light drizzle": "furtună cu burniță ușoară",
  "thunderstorm with drizzle": "furtună cu burniță",
  "thunderstorm with heavy drizzle": "furtună cu burniță puternică",
};

const Weather = () => {
  const { lat, lon } = useParams();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWeather = () => {
    if (lat && lon) {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      )
        .then((response) => response.json())
        .then((data) => {
          setWeather(data);
          setLoading(false);
        })
        .catch((error) => console.error("Error fetching", error));
    }
  };

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 300000);
    return () => clearInterval(interval);
  }, [lat, lon,]);

  if (loading) return <p>Se incarca...</p>;
  if (!weather) return <p>Nicio informatie disponibila</p>;

  const iconCode = weather.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  const condition = weather.weather[0].description;
  const translatedCondition = weatherTranslations[condition] || condition;

  return (
    <div className="weather-container">
      <h2 className="city">Vremea în {weather.name}</h2>
      <img src={iconUrl} alt="Weather Icon" className="weather-icon" />
      <div className="weather-details">
        <p>
          <strong>Temperatură:</strong> {parseFloat(weather.main.temp).toFixed(1)}°C
        </p>
        <p>
          <strong>Resimțită:</strong> {parseFloat(weather.main.feels_like).toFixed(1)}°C
        </p>
        <p>
          <strong>Umiditate:</strong> {weather.main.humidity}%
        </p>
        <p>
          <strong>Vânt:</strong> {parseFloat(weather.wind.speed * 3.6).toFixed(1)} km/h
        </p>
        <p>
          <strong>Condiție:</strong> {translatedCondition}
        </p>
      </div>
    </div>
  );
};

export default Weather;
