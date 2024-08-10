const express = require('express');
const connectDB = require('./db/connect');
const app = express();
require('dotenv').config();

app.use(express.json())

app.get('/',(req,res)=>{
    res.send("crud operations")

})

//app.listen(3000);

//routers 
const authRouter = require('./routes/auth')
const booksrouter = require('./routes/cru')

app.use('/api/v1/auth',authRouter)
app.use('/api/v1/books',booksrouter)

const port = process.env.PORT || 8000;

const start = async() => {
    try{
        await connectDB(process.env.MONGO_URI)
        app.listen(port,() =>
                console.log(`server is listening to port ${port}...`)

        );

    } 
    catch(error){
        console.log(error)

    }
};

start();