const express = require("express");
const cors = require("cors");
const axios = require("axios"); 
require("dotenv").config();

const app = express();
const port = 3000;

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173'
}));

app.get("/weather", async (req, res) => {
    try {
        const location = req.query.city;
        const apiKey = process.env.WEATHER_API_KEY;

        const { data } = await axios.get(
            `http://api.weatherapi.com/v1/forecast.json`,
            {
                params: {
                    key: apiKey,
                    q: location,
                    days: 7,
                    aqi: 'no',
                    alerts: 'no'
                }
            }
        );

        if (data.error) {
            return res.status(400).json({ error: data.error.message });
        }

        const currentWeather = {
            city: data.location.name,
            region: data.location.region,
            country: data.location.country,
            condition: data.current.condition.text,
            icon: data.current.condition.icon
        };

        const weeklyForecast = data.forecast.forecastday.map(day => ({
            day: new Date(day.date).toLocaleDateString("en-US", { weekday: "short" }),
            temp: day.day.avgtemp_c,
            condition: day.day.condition.text,
            icon: day.day.condition.icon
        }));

        res.json({
            current: currentWeather,
            weekly: weeklyForecast
        });

    } catch (err) {
        console.error("There's an error!", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});
