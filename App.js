var express = require ('express')

var path = require('path')

var mongoose= require('mongoose')

var cors = require('cors')

var bodyparser= require('body-parser')
var app=express();

const route = require('./Routes');

mongoose.connect("mongodb://localhost:27017/InstagramDb2",{useCreateIndex: true,useNewUrlParser: true,useUnifiedTopology: true})
.then(

    ()=>{console.log('Database connected')},
    err=>{console.log('Database not connected')},
)

app.use(bodyparser.json());

app.use(cors());

app.use('/api',route)

app.use(express.static(path.join(__dirname,'public')))

mongoose.connection.on("error",(err)=>{

    if(err){
    console.log("Database Not Connected"+err)}

});

    const port = 3000;

     app.get('/', (req,res)=>{

        res.send("App is Running... 🚀 ")
        });


    app.listen(port,()=>{
        console.log('Server is running at : '+port);
        })
