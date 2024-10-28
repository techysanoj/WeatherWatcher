document.addEventListener('DOMContentLoaded', function () {
    let country = "India";
    let apiKey = 'bdef1911fb8b0830a285d5e5de4185fa';
    var city = "";
    var state = "";
    var lat = "";
    var lon = "";

    // all element
    let mainWeatherPrv = document.getElementById('main-weather-prv');
    let weatherBtn = document.getElementById('weather-btn');
    let searchHereInput = document.getElementById('search-here');
    let searchIcon = document.getElementById('search-icon');
    let searchWthrBtn = document.querySelector('#search-weather-btn');
    // let iconShow = document.querySelector('#icon-txt');
    let tempDiv = document.querySelector('#temp-txt');
    let showAn = document.querySelector('#weather-animation');


    // all variable
    let cityName = document.getElementById('city-input');
    let stateName = document.getElementById('state-input');


    //function to get weather
    async function getWeather() {
        try{
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
            let response = await fetch(weatherUrl);
            let data = await response.json();

            // Log the full weather data
            console.log('Weather Data:', data);

            // Extract the needed weather data
            const temperature = data.main.temp;
            const feelsLike = data.main.feels_like;
            const humidity = data.main.humidity;
            const description = data.weather[0].description;
            const windSpeed = data.wind.speed;
            const pressure = data.main.pressure;
            const iconCode = data.weather[0].icon; // Get the weather icon code
            const countryCode = data.sys.country;
            const weatherCondition = data.weather[0].main.toLowerCase();

            // Now display this data including the icon
            displayWeather(temperature, feelsLike, humidity, description, windSpeed, pressure, iconCode, countryCode);
            showWeatherAnimation(weatherCondition.toLowerCase());
        }
        catch (error) {
            alert('Error fetching weather data: ' + error);
        }

    }


    // function to add details

    function displayWeather(temp, feelsLike, humidity, description, windSpeed, pressure, iconCode, countryCode) {
        const weatherContainer = document.getElementById('main-weather-prv');
        
        // Clear previous weather info
        weatherContainer.innerHTML = "";
    
        // OpenWeatherMap provides icons as png files, use the icon code to create the image URL
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

        const flagUrl = `https://flagcdn.com/48x36/${countryCode.toLowerCase()}.png`;
    
        // Create elements to display the weather data
        weatherContainer.innerHTML = `
            <div style="display: flex; flex-direction:row; justify-content: center; align-items: center; text-align: center; gap: 1rem;">
                <h1 id="weather-prv-heading">${city+", "+state}</h1>
                <img src="${flagUrl}" alt="Weather Icon" style="width: 30px; height: 30px;" />
            </div>
            
            <div id="weather-temp">
                <div id="icon-txt" style = "display: flex; flex-direction:column; justify-content: center; align-items: center">
                    <div id="weather-animation" style = "height: 150px; width: 150px"> </div>
                    <img src="${iconUrl}" alt="Weather Icon" style="width: 100px; height: 100px;" />
                    <h1>${description}</h1>
                </div>
                <h1 id="temp-txt">${temp}°C</h1>
            </div>
    
            <div id="weather-details">
                <div id="windspeed-txt" >
                    <h2>Wind Speed</h2>
                    <h2>${windSpeed} m/s</h2>
                </div>
    
                <div id="humidity-txt">
                    <h2>Humidity</h2>
                    <h2>${humidity}%</h2>
                </div>
    
                <div id="pressure-txt">
                    <h2>Pressure</h2>
                    <h2>${pressure} hPa</h2>
                </div>
            </div>
        `;

        removeHiddenItems();
    }

    function showWeatherAnimation(weatherCondition) {
        // Clear previous animation (if any)
        const animationContainer = document.getElementById('weather-animation');
        animationContainer.innerHTML = ''; // Clear existing animation
        console.log(weatherCondition);
        // Map weather condition to Lottie animation file paths
        const weatherAnimations = {
            haze: 'animations/haze_animation.json',  // Example URL
            rain: 'animations/rain_animation.json',  // Replace with actual URLs
            clear: 'animations/clear_animation.json',
            clouds: 'animations/clouds_animation.json',
            sunny: 'animations/sunny_animation.json',
            fog: 'animations/fog.json',
            snow: 'animations/snow.json',
            thunderstorm: 'animations/thunderstorm.json',
            wind: 'animations/wind.json',
            mist: 'animations/mist.json'
        };
    
        // Get the animation path for the specified weather condition or a default animation
        const animationPath = weatherAnimations[weatherCondition] || 'animations/mist.json';
        
        // Load the animation using the Lottie library
        lottie.loadAnimation({
            container: animationContainer, // Required: the DOM element where animation will be rendered
            renderer: 'svg',               // Renderer type
            loop: true,                    // Whether to loop the animation
            autoplay: true,                // Autoplay when loaded
            path: animationPath            // Path to the animation JSON
        });
    }
    // showWeatherAnimation('rain');
    // removing hidden items
    function removeHiddenItems() {
        mainWeatherPrv.classList.remove('hidden-items');
        weatherBtn.classList.remove('hidden-items');
        searchHereInput.style.display = 'none';
        showAn.classList.remove('hidden-items');
    }


    // adding hidden class
    function addHiddenItems() {
        mainWeatherPrv.classList.add('hidden-items');
        weatherBtn.classList.add('hidden-items');
        showAn.classList.add('hidden-items');
        searchHereInput.style.display = 'flex';

    }

    // latitude and longitude function
    async function getLatLon() {
        try {
            const apiUrl = `https://nominatim.openstreetmap.org/search?q=${city}+${state}+${country}&format=json`;
            let response = await fetch(apiUrl);
            let data = await response.json();

            // Log the data for debugging
            console.log('Nominatim Data:', data);

            // Check if location data is found
            if (data.length > 0) {
                lat = data[0].lat;
                lon = data[0].lon;
                console.log(`Latitude: ${lat}, Longitude: ${lon}`);

                // Now call the weather function after getting the coordinates
                getWeather();
            } else {
                alert('You have write wrong information');
            }
        } catch (error) {
            console.error("Error fetching location data: ", error);
        }
    }


    // adding city and state
    function addCityState() {
        city = cityName.value;
        state = stateName.value;
        console.log(city + " : " + state);
        if(city == "" || state == "") {
            alert('May be you have missed something !! SAD :(');
        }
        else {
            getLatLon();
        }
    }

    function reverseGeocode(lat, lon) {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.address) {
                    // Try to extract city or fallback to town, village, or other fields
                    city = data.address.city || data.address.town || data.address.village || data.address.county || 'Unknown City';
                    state = data.address.state || 'Unknown State';
                    console.log(`City: ${city}, State: ${state}`);
                    
                    // Now call getWeather after city and state have been updated
                    getWeather();
                } else {
                    console.error("No address found for these coordinates.");
                    alert("Could not find city and state for the given coordinates.");
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error fetching reverse geocoding data.');
            });
    }
    

    function askLocation() {
        const loader = document.getElementById('loader');
        loader.style.display = 'block';
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
          } else {
            weatherInfo.innerHTML = "Geolocation is not supported by this browser.";
            loader.style.display = 'none'; // Hide loader
          }
        function showPosition(position) {
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            reverseGeocode(lat, lon);
            loader.style.display = 'none';
            
        }
        
        function showError(error) {
            loader.style.display = 'none'; // Hide loader
            switch(error.code) {
              case error.PERMISSION_DENIED:
                weatherInfo.innerHTML = "User denied the request for Geolocation.";
                break;
              case error.POSITION_UNAVAILABLE:
                weatherInfo.innerHTML = "Location information is unavailable.";
                break;
              case error.TIMEOUT:
                weatherInfo.innerHTML = "The request to get user location timed out.";
                break;
              case error.UNKNOWN_ERROR:
                weatherInfo.innerHTML = "An unknown error occurred.";
                break;

            }            
        }

    }

    searchWthrBtn.addEventListener('click', addHiddenItems);
    searchIcon.addEventListener('click', addCityState);

    weatherBtn.addEventListener('click', askLocation);
});

