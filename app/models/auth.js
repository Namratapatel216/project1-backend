const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const time = require('./../libs/timeLibs');

const auth = new Schema({

    userId : {
        type : String
    },
    authToken : {
        type : String
    },
    tokensecret : {
        type : String
    },
    tokengenerationTime : {
        type : Date,
        default : time.now()
    }

});

module.exports = mongoose.model('auth',auth);