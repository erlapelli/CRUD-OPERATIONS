const express = require('express');
const connectDB = require('./db/connect');
const dotenv = require('dotenv');
const axios = require("axios");
const app = express();
require('dotenv').config();

app.use(express.json()) 


const API_KEY = process.env.WEATHERSTACK_API_KEY;

const BASE_URL = 'http://api.weatherstack.com/current';

const authRouter = require('./routes/auth')

app.use('/api/v1/auth',authRouter)

app.get('/',(req,res)=>{
    res.send("weather operations")

})

app.get('/weather',async(req,res)=>{
    const city = req.query.city;

    if(!city){
        return res.status(400).send({error:'City is required'});
    }

    // console.log(`Fetching weather for city:${city}`);

    try {
         
        const response = await axios.get(BASE_URL,{
            params:{
                access_key: API_KEY,
                query : city
            }
        });

        const data = response.data;
        if(data.error){
            return res.status(400).send({error:data.error.info});
        }

        // console.log('Weather data:',data);

        const weatherDescription = data.current.weather_descriptions && data.current.weather_descriptions[0] ? data.current.weather_descriptions[0] : 'No description available';

        res.send({
            location:data.location.name,
            country:data.location.country,
            temperature:data.current.temperature,
            weather_descriptions:weatherDescription,
            humidity:data.current.humidity,
            wind_speed:data.current.wind_speed

        });
    }
    catch(error){
        // console.error('Error fetching weather data:',error.response ? error.response.data:error.message);
        res.status(500).send({error:'An error occurred while fetching weather data'});
    }
})



const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});