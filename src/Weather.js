import React, { useEffect, useRef, useState } from "react";
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
  const [currentDate, setCurrentDate] = useState(getDate());
  const [currentTime, setCurrentTime] = useState(getTime());
  
  

  //BEGIN
  const maxNrOfResizes = 500;
  const resizeObserverTimeout = useRef(null);
  let container = useRef(null);

  useEffect(() => {
    adjustFontSize();

    const ro = new ResizeObserver(() => {
      clearTimeout(resizeObserverTimeout.current);

      resizeObserverTimeout.current = setTimeout(() => {
        console.log("from use effect");
        adjustFontSize();
      }, 1000);
    });
    if (container.current) {
      console.log("added");
      ro.observe(container.current);
    }

    // Cleanup the ResizeObserver on unmount
    return () => {
      if (container.current) {
        console.log("removed");
        ro.unobserve(container.current);
      }
    };
  }, [weather]);
  const adjustFontSize = () => {
    if (container.current && container.current && weather) {
      let internalFontSize = parseFloat(
        getComputedStyle(container.current).fontSize
      );
      container.current.style.fontSize = internalFontSize + "px";

      console.log(
        internalFontSize + "px",
        container.current.clientHeight,
        container.current.scrollHeight
      );

      // Use requestAnimationFrame to optimize performance
      requestAnimationFrame(() => {
        let iterations = 0;
        while (
          container.current.clientWidth >= container.current.scrollWidth &&
          container.current.clientHeight >= container.current.scrollHeight
        ) {
          internalFontSize++;
          container.current.style.fontSize = internalFontSize + "px";

          console.log("+");
          iterations++;
          if (iterations > maxNrOfResizes) {
            clearTimeout(resizeObserverTimeout.current);

            resizeObserverTimeout.current = setTimeout(() => {
              adjustFontSize();
            }, 1000);
            return;
          }
        }
        while (
          container.current.clientWidth < container.current.scrollWidth ||
          container.current.clientHeight < container.current.scrollHeight
        ) {
          internalFontSize--;
          container.current.style.fontSize = internalFontSize + "px";

          console.log("-");

          iterations++;

          if (iterations > maxNrOfResizes) {
            clearTimeout(resizeObserverTimeout.current);

            resizeObserverTimeout.current = setTimeout(() => {
              adjustFontSize();
            }, 1000);
            return;
          }
        }
      });
    }
  };

  // END

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

    const fiveMinuteInterval = setInterval(fetchWeather, 300000); 

    const dateCheckInterval = setInterval(() => {
      const newDate = getDate();
      const newTime = getTime();
      if (newDate !== currentDate) {
        setCurrentDate(newDate);
        fetchWeather();
      }
      setCurrentTime(newTime); 
    }, 10000);
    return () => {
      clearInterval(fiveMinuteInterval);
      clearInterval(dateCheckInterval);
    };
  }, [currentDate, lat, lon]);

  if (loading) return <p>Se incarca...</p>;
  if (!weather) return <p>Nicio informatie disponibila</p>;

  const iconCode = weather.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  const condition = weather.weather[0].description;
  const translatedCondition = weatherTranslations[condition] || condition;

  function getDate() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    return `${date}/${month}/${year}`;
  }
  function getTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }
  

  return (
    <div className="wCW">
    <div className="weather-container" ref={container}>

      <div className="icon-div">
        <img src={iconUrl} alt="Weather Icon" className="weather-icon" />
        <div className="cityWrapper">
          <h5 className="city">{weather.name}</h5>
          <h6 className="city">{currentDate}</h6>
          <h6 className="city">{currentTime}</h6>
        </div>
      </div>
 

      <div className="weather-details">
        <p>
          <strong>Temperatură:</strong>{" "}
          {parseFloat(weather.main.temp).toFixed(1)}°C
        </p>
        <p>
          <strong>Resimțită:</strong>{" "}
          {parseFloat(weather.main.feels_like).toFixed(1)}°C
        </p>
        <p>
          <strong>Umiditate:</strong> {weather.main.humidity}%
        </p>
        <p>
          <strong>Vânt:</strong>{" "}
          {parseFloat(weather.wind.speed * 3.6).toFixed(1)} km/h
        </p>
        <p>
          <strong>Condiție:</strong> {translatedCondition}
        </p>
      </div>
    </div>
    </div>
  );
};

export default Weather;
