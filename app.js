const express = require('express');

const app = express();

const appConfig = require('./config/config');

const fs = require('fs');

const mongoose = require('mongoose');

const cookieParser = require('cookie-parser');

const bodyParser = require('body-parser');

const http = require('http');

const path = require('path');

const routeLogger = require('./app/middleware/routeLogger');

const globalErrorHandler = require('./app/middleware/appErrorHandler');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(routeLogger.logIp);
app.use(globalErrorHandler.errorHandler);

app.use(express.static(path.join(__dirname, 'client')));


app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    next();
});

let  modelsPath = './app/models';
fs.readdirSync(modelsPath).forEach(function(file){
    if(~file.indexOf('.js'))
    {
        require(modelsPath + '/' + file);
    }
});

let routesPath = './app/routes';
fs.readdirSync(routesPath).forEach(function(file){

    if(~file.indexOf('.js'))
    {
        console.log(routesPath + '/' + file);
        let routes = require(routesPath + '/' + file);
        routes.setRouter(app);
    }

});


app.use(globalErrorHandler.notFoundHandler);

//const server = http.createServer(app);

let server = app.listen(appConfig.port, () => {

    console.log(`Example app listening on port ${appConfig.port}!`);

    //creating mongo db connection here
    let db = mongoose.connect(appConfig.db.uri, {useNewUrlParser: true});
    console.log(db);

});

// socket io connection handler 
const socketLib = require("./app/libs/socketLib");
const socketServer = socketLib.setServer(server);

mongoose.set('useCreateIndex', true);


mongoose.connection.on('error', function(err) {
    console.log("database connection error");
    console.log(err);
});

mongoose.connection.on('open',function(err){
    if(err)
    {
        console.log("database error");
        console.log(err);
    }
    else
    {
        console.log("database connection open success");
    }
});