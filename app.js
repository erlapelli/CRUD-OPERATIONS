const express = require('express');
const connectDB = require('./db/connect');
const dotenv = require('dotenv');
const axios = require("axios");
const app = express();
require('dotenv').config();
const cors = require('cors');

app.use(express.json()) 
app.use(cors())


const API_KEY = process.env.WEATHERSTACK_API_KEY;

const BASE_URL = 'http://api.weatherstack.com/current';

const authRouter = require('./routes/auth')
const productRouter = require('./routes/ProductRouter')
const cartRouter = require('./routes/cartRouter')

const authenticateUser = require('./middleware/authentication')

app.use('/api/v1/auth',authRouter)
app.use('/api/v1/product',authenticateUser,productRouter)
app.use('/api/v1/Cart',authenticateUser,cartRouter)

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

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    console.log("connected")
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();