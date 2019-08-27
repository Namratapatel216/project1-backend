const logger = require('pino')();
const moment = require('moment');

let errorFunction = (errorMessage, errorOrigin, errorLevel) => {

    let current_time = moment();

    let errorResponse = {
        timestamp : current_time,
        errorMessage : errorMessage,
        errorOrigin : errorOrigin,
        errorLevel : errorLevel
    }

    logger.error(errorResponse);
    return errorResponse;

}


let captureInfo = (message, origin, importance) => {

    let current_time = moment();

    let Infomessage = {
        timestamp : current_time,
        message : message,
        origin : origin,
        level : importance
    }

    //console.log(Infomessage);
    logger.info(Infomessage);
    return Infomessage;

}

module.exports = {
    error : errorFunction,
    Info : captureInfo
}