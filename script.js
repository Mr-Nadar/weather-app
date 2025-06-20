const apiKey = "7becaecd74f3c1aea0ed0e4f6fbf3182"; // Replace this with your OpenWeatherMap API key

const weatherForm = document.getElementById('weatherForm');
const searchInput = document.getElementById('searchInput');
const weatherInfo = document.getElementById('weatherInfo');
const spinner = document.getElementById('spinner');
const mainContainer = document.getElementById('mainContainer');

weatherForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const city = searchInput.value.trim();
    if (!city) {
        weatherInfo.innerHTML = `<p style="color:#e74c3c;">Please enter a city name!</p>`;
        return;
    }
    spinner.style.display = "block";
    weatherInfo.innerHTML = "";
    try {
        const data = await getWeather(city);
        spinner.style.display = "none";
        updateWeatherUI(data);
        updateBackground(data.main.temp);
    } catch (err) {
        spinner.style.display = "none";
        weatherInfo.innerHTML = `<p style="color:#e74c3c;">${err.message}</p>`;
        updateBackground(null);
    }
});

async function getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("City not found");
    }
    return await response.json();
}

function updateWeatherUI(data) {
    const emoji = getWeatherEmoji(data.weather[0].main);
    weatherInfo.innerHTML = `
        <div class="weather-emoji">${emoji}</div>
        <div style="font-size:1.5rem;font-weight:bold;">${data.name}, ${data.sys.country}</div>
        <div style="margin:0.5rem 0;">
            <span style="font-size:2.5rem;font-weight:bold;">${Math.round(data.main.temp)}°C</span>
        </div>
        <div style="text-transform:capitalize;">${data.weather[0].description}</div>
        <div>Feels like: ${Math.round(data.main.feels_like)}°C</div>
        <div>Min: ${Math.round(data.main.temp_min)}°C | Max: ${Math.round(data.main.temp_max)}°C</div>
        <div>Humidity: ${data.main.humidity}%</div>
        <div>Wind: ${data.wind.speed} km/h</div>
    `;
}

function getWeatherEmoji(main) {
    switch(main.toLowerCase()) {
        case "clear": return "☀️";
        case "clouds": return "☁️";
        case "rain": return "🌧️";
        case "drizzle": return "🌦️";
        case "thunderstorm": return "⛈️";
        case "snow": return "❄️";
        case "mist":
        case "fog":
        case "haze": return "🌫️";
        default: return "🌡️";
    }
}

function updateBackground(temp) {
    if (typeof temp !== "number") {
        mainContainer.style.background = "linear-gradient(135deg, #8ee7ff 0%, #e0e7ef 100%)";
        return;
    }
    if (temp >= 30) {
        mainContainer.style.background = "linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)"; // hot
    } else if (temp >= 20) {
        mainContainer.style.background = "linear-gradient(135deg, #f9d423 0%, #ff4e50 100%)"; // warm
    } else if (temp >= 10) {
        mainContainer.style.background = "linear-gradient(135deg, #56ccf2 0%, #2f80ed 100%)"; // mild
    } else {
        mainContainer.style.background = "linear-gradient(135deg, #83a4d4 0%, #b6fbff 100%)"; // cold
    }
}

function updateDateTime() {
    const now = new Date();
    const dateTimeDiv = document.getElementById('dateTime');
    dateTimeDiv.textContent = now.toLocaleString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
updateDateTime();
setInterval(updateDateTime, 60000);