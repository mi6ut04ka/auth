require('dotenv').config();
const express = require('express');
const cors = require('cors')
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/authRouter')
const errorMiddleware = require('./middleware/errorMiddleware')

const PORT = process.env.PORT || 8000

const app = express();

app.use(express.json())
app.use(cookieParser());
app.use(cors({
    credentials:true,
    origin: process.env.CLIENT_URL
}));
app.use("/api", authRouter);
app.use(errorMiddleware);


const start = async () =>{
    try{
        app.listen(PORT, ()=> console.log(`server started on ${PORT} port`))
    }
    catch(e){
        console.log(e)
    }
}
start();