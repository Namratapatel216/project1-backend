const express = require('express');

const router = express.Router();

const app = express();

const appConfig = require('./../../config/config');

const eventController = require('./../controllers/eventController');


module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/meetings`;

    app.post(`${baseUrl}/Perticular-User-meeting`,eventController.particular_User_meetings),

    app.post(`${baseUrl}/every-minute-data`,eventController.Every_min_data)
    
} 