const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let EventSchema = new Schema({

    eventId:{
        type:String,
        default:'',
        index:true,
        unique:true
    },
    meeting_created_by : { 

        type:String,
        default : ''

    },
    meeting_created_for : {
        type : String,
        default : ''
    },
    meeting_purpose : {
        type : String,
        default : ''
    },
    meeting_place : {
        type : String,
        default : ''
    },
    meeting_start_date : {
        type : Date,
        default : ''
    },
    meeting_end_date : {
        type : Date,
        default : ''
    },
    createdOn:{
        type:Date,
        default:''
    },
    modifiedOn : {
        type : Date,
        default : ''
    }

});

module.exports = mongoose.model('event',EventSchema);