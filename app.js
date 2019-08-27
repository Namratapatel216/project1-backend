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

app.listen(appConfig.port, () => {

    console.log(`Example app listening on port ${appConfig.port}!`);

    //creating mongo db connection here
    let db = mongoose.connect(appConfig.db.uri, {useNewUrlParser: true});
    console.log(db);

});

const server = http.createServer(app);
// start listening to http server
console.log(appConfig);
server.listen(appConfig.port);
server.on('error', onError);
server.on('listening', onListening);

// end server listening code


// socket io connection handler 
const socketLib = require("./app/libs/socketLib");
const socketServer = socketLib.setServer(server);


// end socketio connection handler



/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    logger.error(error.code + ' not equal listen', 'serverOnErrorHandler', 10)
    throw error;
  }


  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(error.code + ':elavated privileges required', 'serverOnErrorHandler', 10);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(error.code + ':port is already in use.', 'serverOnErrorHandler', 10);
      process.exit(1);
      break;
    default:
      logger.error(error.code + ':some unknown error occured', 'serverOnErrorHandler', 10);
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  ('Listening on ' + bind);
  logger.info('server listening on port' + addr.port, 'serverOnListeningHandler', 10);
  let db = mongoose.connect(appConfig.db.uri,{ useMongoClient: true });
}

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});


/**
 * database connection settings
 */
mongoose.connection.on('error', function (err) {
  console.log('database connection error');
  console.log(err)
  logger.error(err,
    'mongoose connection on error handler', 10)
  //process.exit(1)
}); // end mongoose connection error

mongoose.connection.on('open', function (err) {
  if (err) {
    console.log("database error");
    console.log(err);
    logger.error(err, 'mongoose connection open handler', 10)
  } else {
    console.log("database connection open success");
    logger.info("database connection open",
      'database connection open handler', 10)
  }
  //process.exit(1)
}); // enr mongoose connection open handler



module.exports = app;
