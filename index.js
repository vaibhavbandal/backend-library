const express = require("express")
const app = express()
const dotenv = require("dotenv");
dotenv.config();

const database = require("./configuration/databaseConfig");
const corsOptions = {
    exposedHeaders: 'Authorization',
  };
const cors=require('cors');


//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));

//Routes
app.use('/api/v1/admin',require('./routes/admin'));
app.use('/api/v1/librarian',require('./routes/librarian'));
app.use('/api/v1/student',require('./routes/student'));
app.use('/api/v1/common',require('./routes/common'));

app.get('/test',(req,res)=>{
    res.send('testing done!');
})

database()
    .then(()=>console.log("Connected To Database"))
    .catch(()=>console.log("Connection To Database Failed"));



const PORT = process.env.PORT || 8000;
app.listen(PORT , ()=> console.log(`Library Server Started At PORT ${PORT}`));


