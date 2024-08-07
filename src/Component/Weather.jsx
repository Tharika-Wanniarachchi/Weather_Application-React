import React, { useEffect, useRef, useState } from 'react'
import './Weather.css'
import { BsSearch } from 'react-icons/bs'
import humidity from '../assets/humidity.png'
import wind from '../assets/wind.png'
import Login from './Login'
import { FaArrowRight } from 'react-icons/fa'
import { FaLocationDot, FaLocationPin } from 'react-icons/fa6'

const Weather = () => {

    const cityInputRef = useRef();
    const latInputRef = useRef();
    const lonInputRef = useRef();
    const [loggedIn, setLoggedIn] = useState(false);
    const [weatherData ,setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState([]);
    const [fullForecast, setFullForecast] = useState([]);
    const [showFullForecast, setShowFullForecast] = useState(false);



    const allWeatherIcon ={
        "01d" : 'https://openweathermap.org/img/wn/01d@2x.png',
        "02d" : 'https://openweathermap.org/img/wn/02d@2x.png',
        "03d" : 'https://openweathermap.org/img/wn/03d@2x.png',        
        "04d" : 'https://openweathermap.org/img/wn/04d@2x.png',
        "09d" : 'https://openweathermap.org/img/wn/09d@2x.png',
        "10d" : 'https://openweathermap.org/img/wn/10d@2x.png',
        "11d" : 'https://openweathermap.org/img/wn/11d@2x.png',
        "13d" : 'https://openweathermap.org/img/wn/13d@2x.png',
        "50d" : 'https://openweathermap.org/img/wn/50d@2x.png',
        "01n" : 'https://openweathermap.org/img/wn/01n@2x.png',
        "02n" : 'https://openweathermap.org/img/wn/02n@2x.png',
        "03n" : 'https://openweathermap.org/img/wn/03n@2x.png',        
        "04n" : 'https://openweathermap.org/img/wn/04n@2x.png',
        "09n" : 'https://openweathermap.org/img/wn/09n@2x.png',
        "10n" : 'https://openweathermap.org/img/wn/10n@2x.png',
        "11n" : 'https://openweathermap.org/img/wn/11n@2x.png',
        "13n" : 'https://openweathermap.org/img/wn/13n@2x.png',
        "50n" : 'https://openweathermap.org/img/wn/50n@2x.png',

    }

    // Function to fetch weather and forecast data based on latitude and longitude
    const fetchWeather = async (lat, lon) => {
        try {
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${import.meta.env.VITE_API_KEY}`;
            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${import.meta.env.VITE_API_KEY}`;
            
            const weatherResponse = await fetch(weatherUrl);
            const weatherData = await weatherResponse.json();
        
            const forecastResponse = await fetch(forecastUrl);
            const forecastData = await forecastResponse.json();
        
            if (!weatherResponse.ok || !forecastResponse.ok) {
                alert(weatherData.message || forecastData.message);
                return;
            }

            // Set the weather data
            const icon = allWeatherIcon[weatherData.weather[0].icon] || 'https://openweathermap.org/img/wn/01d@2x.png';
            setWeatherData({
                humidity: weatherData.main.humidity,
                windSpeed: weatherData.wind.speed,
                temperature: Math.floor(weatherData.main.temp),
                location: weatherData.name,
                icon: icon,
                description: weatherData.weather[0].description,
            });

            // Process the forecast data for the next 3 days
            const dailyForecast = forecastData.list.filter((entry, index) => index % 8 === 0).slice(2, 5).map(entry => ({
                date: entry.dt_txt,
                temperature: Math.floor(entry.main.temp),
                icon: allWeatherIcon[entry.weather[0].icon] || 'https://openweathermap.org/img/wn/01d@2x.png',
                description: entry.weather[0].description,
            }));
        
            setForecastData(dailyForecast);

            // Process the forecast data for the full week
            const fullForecastData = forecastData.list.filter((entry, index) => index % 8 === 0).slice(1, 8).map(entry => ({
                date: entry.dt_txt,
                temperature: Math.floor(entry.main.temp),
                icon: allWeatherIcon[entry.weather[0].icon] || 'https://openweathermap.org/img/wn/01d@2x.png',
                description: entry.weather[0].description,
            }));
        
            setFullForecast(fullForecastData);

        } catch (error) {
            setWeatherData(null);
            console.error("Error in fetching data:", error);
        }
    };

    const search = async (city) => {
        if (city === "") {
          alert("Enter City Name");
          return;
        }
        try {
          const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_API_KEY}`;
          const response = await fetch(url);
          const data = await response.json();
          console.log(data);
    
          if (!response.ok) {
            alert(data.message);
            return;
          }
    
          fetchWeather(data.coord.lat, data.coord.lon);
        } catch (error) {
          setWeatherData(false);
          console.error("Error in fetching data:", error);
        }
      };
    
      const searchByCoordinates = async (lat, lon) => {
        if (lat === "" || lon === "") {
          alert("Enter both Latitude and Longitude");
          return;
        }
        fetchWeather(lat, lon);
      };
    
      useEffect(() => {
        if (loggedIn) {
            search("Colombo");
            fetchWeather(6.9271, 79.8612);
        }
      }, [loggedIn]);



  return (
    <div className='page_container'>
         {!loggedIn ? (
            <Login onLogin={setLoggedIn} />
        ) : (
            <>
                <div className="checkWeather">
                    <div className="card_style">

                        <div className="search">
                            <input type="text" ref={cityInputRef} placeholder="Enter City Name"/>
                            <button className="search_btn" onClick={()=>search(cityInputRef.current.value)}><BsSearch/></button>
                        </div>

                        <h4 className='topic'>Search by Coordinates</h4>
                        <div className="cod_search">
                            <input type="text" ref={latInputRef} placeholder="Latitude"/>
                            <input type="text" ref={lonInputRef} placeholder="Longitude"/>
                            <button className="search_btn" onClick={()=>searchByCoordinates(latInputRef.current.value,lonInputRef.current.value)}><BsSearch/></button>
                        </div>

                        {weatherData?<>

                            <div className="weather">
                            <div className=''>
                                    <img src={weatherData.icon}alt="rain" className="weather-icon"/>
                                    <h3 className='desc'>{weatherData.description}</h3>
                            </div>
                            <div>
                                    <h1 className="temp">{weatherData.temperature}°C</h1>
                                    <h2 className="city"><FaLocationDot/>{weatherData.location}</h2>
                            </div>
                            </div>
                            <div className="deatails">
                                <div className="col">
                                    <img src={humidity} alt="humidity"/>
                                    <div>
                                        <p className="humidity">{weatherData.humidity}%</p>
                                        <p>Humidity</p>
                                    </div>
                                </div>
                            
                                <div className="col">
                                    <img src={wind} alt=""/>
                                    <div>
                                        <p className="wind">{weatherData.windSpeed} km/h</p>
                                        <p>Wind Speed</p>
                                    </div>
                                </div>
                            </div>
                        </>: <></>}
                    </div>
                    <div className='daySummery'>
                        {forecastData.length > 0? <>
                            <div className="forecast">
                                <h2 className='sumTopic'>{showFullForecast ? '7-Day Forecast' : '3-Day Forecast'}</h2>
                                <h2 className="citySum"><FaLocationDot/>{weatherData.location}</h2>
                                <div className="forecast-container">
                                {(showFullForecast ? fullForecast : forecastData).map((day, index) => (
                                    <div key={index} className="forecast-day">
                                        <div className="dayDetails">
                                            <p>{new Date(day.date).toLocaleDateString()}</p>
                                            <p className='temps'>{day.temperature}°C</p>
                                            <p>{day.description}</p>
                                        </div>
                                        <img src={day.icon} alt="weather-icon" />
                                    </div>
                                ))}
                                </div>
                                <button onClick={() => setShowFullForecast(!showFullForecast)} className='viewBtn'>
                                    <div className="buttonContent">
                                        {showFullForecast ? 'View Less' : 'View More'}<FaArrowRight className="icon"/>
                                    </div>
                                </button>
                            </div>
                        </>: <></>}
                    </div>
                </div>
            </>
        )}
    </div>

    
  )
}

export default Weather
