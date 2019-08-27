let response = require('./../libs/responseLibs');

let errorHandler = (err, req, res, next) => {
    
    console.log("application error hander is called");

    let appiresponse = response.generate(true, 'some error occured at global level',500,null);

    res.send(appiresponse);

}

let notFoundHandler = (req, res, next) => {

    console.log("Not Found error handler is called");

    let appiresponse = response.generate(true,'Route Not Found in the application',404,null);

    res.send(appiresponse);

}

module.exports = {

    errorHandler : errorHandler,
    notFoundHandler : notFoundHandler
}