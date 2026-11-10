/* =========================
   BLOOM - DIGITAL GARDEN
========================= */

// Open-Meteo weather API
const API =
    "https://api.open-meteo.com/v1/forecast" +
    "?latitude=43.65&longitude=-79.38" +
    "&current=temperature_2m,precipitation," +
    "wind_speed_10m,cloud_cover,snowfall" +
    "&daily=sunrise,sunset" +
    "&timezone=America%2FToronto";

let sunriseTime;
let sunsetTime;


// Flower options
const flowerTypes = [
    "🌷",
    "🌻",
    "🌼",
    "🌸",
    "🌺",
    "🌹",
    "🪻"
];


// =========================
// 1. GET LIVE WEATHER DATA
// =========================

async function getWeather() {

    const message = document.getElementById("gardenMessage");

    try {

        message.textContent = "Checking the weather for your garden...";

        const response = await fetch(API);

        if (!response.ok) {
            throw new Error("Weather data unavailable");
        }

        const data = await response.json();

        // Get today's sunrise and sunset
        sunriseTime = new Date(data.daily.sunrise[0]);
        sunsetTime = new Date(data.daily.sunset[0]);

        // Extract weather information
        const weather = data.current;

        const temperature = weather.temperature_2m;
        const wind = weather.wind_speed_10m;
        const rain = weather.precipitation;
        const clouds = weather.cloud_cover;
        const snow = weather.snowfall;

        // Display weather information
        document.getElementById("temperature").textContent =
            temperature + " °C";

        document.getElementById("wind").textContent =
            wind + " km/h";

        document.getElementById("rainfall").textContent =
            rain + " mm";

        document.getElementById("cloudCover").textContent =
            clouds + "%";

        // Update garden
        updateGarden(temperature, wind, rain, clouds, snow);

    }

    catch (error) {

        console.error("Weather error:", error);

        message.textContent =
            "Unable to retrieve weather. Please try again.";

    }

}


// =========================
// 2. UPDATE THE GARDEN
// =========================

function updateGarden(temp, wind, rain, clouds, snow) {

    const garden = document.querySelector(".garden-container");
    const flowers = document.querySelectorAll(".flower");
    const message = document.getElementById("gardenMessage");


    // SNOW ANIMATION

    const snowContainer = document.getElementById("snow");

    if (snow > 0) {

        snowContainer.innerHTML = "";

        for (let i = 0; i < 40; i++) {

            const flake = document.createElement("span");

            flake.classList.add("snowflake");
            flake.textContent = "❄";

            flake.style.left = Math.random() * 100 + "%";
            flake.style.animationDelay = Math.random() * 5 + "s";
            flake.style.animationDuration =
                (3 + Math.random() * 4) + "s";

            snowContainer.appendChild(flake);
        }

    } else {

        snowContainer.innerHTML = "";

    }


    // RAIN ANIMATION

    const rainContainer = document.getElementById("rainAnimation");

    if (rain > 0 && snow <= 0) {

        rainContainer.innerHTML = "";

        for (let i = 0; i < 40; i++) {

            const drop = document.createElement("span");

            drop.classList.add("raindrop");
            drop.textContent = "💧";

            drop.style.left = Math.random() * 100 + "%";
            drop.style.animationDelay = Math.random() * 2 + "s";
            drop.style.animationDuration =
                (0.5 + Math.random()) + "s";

            rainContainer.appendChild(drop);
        }

    } else {

        rainContainer.innerHTML = "";

    }


    // CLOUD EMOJIS

    const cloudContainer = document.getElementById("clouds");

    if (clouds > 50) {

        cloudContainer.innerHTML = `
            <span class="cloud">☁️</span>
            <span class="cloud">☁️</span>
            <span class="cloud">☁️</span>
        `;

    } else {

        cloudContainer.innerHTML = "";

    }


    // WIND: FLOWER ANIMATION SPEED

    let animationSpeed = 3;

    if (wind > 30) {
        animationSpeed = 0.7;
    }

    else if (wind > 15) {
        animationSpeed = 1.5;
    }

    flowers.forEach(flower => {
        flower.style.animationDuration = animationSpeed + "s";
    });


    // RAIN: GARDEN APPEARANCE

    if (rain > 0) {
        garden.style.filter = "saturate(0.8)";
    }

    else {
        garden.style.filter = "none";
    }


    // DYNAMIC GARDEN MESSAGE

    if (snow > 0) {

        message.textContent =
            "❄️ It's snowing! Your garden is covered in snow.";

    }

    else if (rain > 0) {

        message.textContent =
            "🌧️ It's raining! Your garden is getting a drink.";

    }

    else if (wind > 30) {

        message.textContent =
            "💨 It's windy! Your flowers are dancing.";

    }

    else if (temp < 10) {

        message.textContent =
            "❄️ It's chilly outside. Your garden is resting.";

    }

    else if (temp >= 20) {

        message.textContent =
            "☀️ It's a lovely warm day! Your garden is blooming.";

    }

    else if (clouds > 70) {

        message.textContent =
            "☁️ A cloudy day in the garden. Time for a little rest.";

    }

    else {

        message.textContent =
            "🌷 Perfect weather for a peaceful garden!";

    }


    // UPDATE SKY AFTER WEATHER
    updateSky();

}


// =========================
// 3. PLANT A NEW FLOWER
// =========================

const plantButton = document.getElementById("plantButton");

plantButton.addEventListener("click", function() {

    const flowerContainer = document.getElementById("flowers");

    const randomFlower =
        flowerTypes[Math.floor(Math.random() * flowerTypes.length)];

    const newFlower = document.createElement("span");

    newFlower.classList.add("flower");
    newFlower.textContent = randomFlower;

    flowerContainer.appendChild(newFlower);

});


// =========================
// 4. FLOWER GROWTH
// =========================

const growButton = document.getElementById("growButton");

growButton.addEventListener("click", function() {

    const flowers = document.querySelectorAll(".flower");

    flowers.forEach(flower => {

        if (!flower.classList.contains("bloomed")) {

            flower.classList.add("bloomed");

        }

        else if (!flower.classList.contains("fully-grown")) {

            flower.classList.add("fully-grown");

        }

    });

});


// =========================
// 5. RESTART GARDEN
// =========================

const restartButton = document.getElementById("restartButton");

restartButton.addEventListener("click", function() {

    const flowerContainer = document.getElementById("flowers");

    flowerContainer.innerHTML = `
        <span class="flower">🌷</span>
        <span class="flower">🌻</span>
        <span class="flower">🌼</span>
        <span class="flower">🌸</span>
        <span class="flower">🌺</span>
    `;

    updateSky();

});


// =========================
// 6. SKY CHANGES WITH TIME
// =========================

function updateSky() {

    if (!sunriseTime || !sunsetTime) return;

    const now = new Date();

    const currentTime =
        now.getHours() * 60 + now.getMinutes();

    const sunrise =
        sunriseTime.getHours() * 60 +
        sunriseTime.getMinutes();

    const sunset =
        sunsetTime.getHours() * 60 +
        sunsetTime.getMinutes();

    const garden = document.querySelector(".garden-container");
    const cloudContainer = document.getElementById("clouds");


    // NIGHT

    if (
        currentTime < sunrise - 60 ||
        currentTime >= sunset + 60
    ) {

        garden.style.background =
            "radial-gradient(2px 2px at 15% 20%, white 50%, transparent 55%)," +
            "radial-gradient(2px 2px at 45% 35%, white 50%, transparent 55%)," +
            "radial-gradient(2px 2px at 75% 15%, white 50%, transparent 55%)," +
            "radial-gradient(2px 2px at 85% 45%, white 50%, transparent 55%)," +
            "linear-gradient(to bottom, #101b3a, #29345a 65%, #52634d)";

        cloudContainer.style.filter = "brightness(0.65)";

    }


    // SUNRISE

    else if (currentTime < sunrise + 60) {

        garden.style.background =
            "linear-gradient(to bottom, #f7a7a0, #f8c7a1 60%, #a6bd8c)";

        cloudContainer.style.filter = "brightness(1)";

    }


    // DAYTIME

    else if (currentTime < sunset - 60) {

        garden.style.background =
            "linear-gradient(to bottom, #8ecff0, #d9eff5 65%, #a2c47c)";

        cloudContainer.style.filter = "brightness(1)";

    }


    // SUNSET

    else {

        garden.style.background =
            "linear-gradient(to bottom, #ef927d, #c18ab4 60%, #8d9c6e)";

        cloudContainer.style.filter = "brightness(1)";

    }

}


// =========================
// 7. AUTOMATIC UPDATES
// =========================

// Get weather when website opens
getWeather();

// Refresh weather every 60 seconds
setInterval(getWeather, 60000);

// Update sky every minute
setInterval(updateSky, 60000);