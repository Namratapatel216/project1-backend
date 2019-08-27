const express = require('express');

const app = express();

const appConfig = require('./../../config/config');

const mongoose = require('mongoose');

const EventModel = mongoose.model('event');

const shortid = require('shortid');

const Logger = require('./../libs/loggerLibs');

const Response = require('./../libs/responseLibs');

const Check = require('./../libs/checkLibs');

const validateInput = require('./../libs/validateInput');

const timeLib = require('./../libs/timeLibs');

const passwordLib = require('./../libs/passwordLibs'); 

const TokenLib = require('./../libs/tokenLibs');

const AuthModel = mongoose.model('auth');


let getDaysInMonth = function(month,year) {
    // Here January is 1 based
    //Day 0 is the last day in the previous month
   return new Date(year, month, 0).getDate();
  // Here January is 0 based
  // return new Date(year, month+1, 0).getDate();
  };

let particular_User_meetings = (req,res) => {

    console.log("month = " + req.body.month);

    let total_days = getDaysInMonth(req.body.month, req.body.year);
    
    let todayDate = new Date(req.body.year,req.body.month,1);
    let beforeDate = new Date(req.body.year,req.body.month,total_days);

    let findQuery = {};

    if(req.body.meeting_created_by)
    {
        findQuery = {$match : {
                
            "meeting_created_for" : req.body.meeting_created_for,
            "meeting_created_by" : req.body.meeting_created_by,
            "meeting_start_date":
            {
                "$lte": beforeDate,
                "$gte": todayDate
            }
        } };
    }
    else
    {
        findQuery = {$match : {
                
            "meeting_created_for" : req.body.meeting_created_for,
            "meeting_start_date":
            {
                "$lte": beforeDate,
                "$gte": todayDate
            }
        } };
        
    }

    //EventModel.find(req.body)
    EventModel.aggregate(
        [
            findQuery
        ]
     )
    .exec((err,result) => {

        if(err)
        {
            Logger.error(err.message,"Meeting Controller : Perticular user meeting()",10);
            let apiResponse = Response.generate(true,err.message,500,null);
            res.send(apiResponse);
        }
        else if(Check.isEmpty(result))
        {
            Logger.Info("Mettings not found for particular user","Meeting Controller : Perticular user meeting()",10);
            let apiResponse = Response.generate(true,"Mettings not found for particular user",404,null);
            res.send(apiResponse);
        }
        else
        {
            let apiResponse = Response.generate(false,"meeting listed",200,result);
            console.log(apiResponse);
            res.send(apiResponse);
        }

    });


}

//get every minute data for notification
let Every_min_data = (req, res) => {

    let findQuery = {}

    let todayDate = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate() - 1);
    console.log("today date" + todayDate);
    let beforeDate = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate() + 1);
    console.log("before date" + beforeDate);

    if(req.body.meeting_created_by)
    {
        findQuery = {$match : {
                
            "meeting_created_for" : req.body.meeting_created_for,
            "meeting_created_by" : req.body.meeting_created_by,
            "meeting_start_date":
            {
                "$lt": beforeDate,
                "$gt": todayDate
            }
        } };
    }
    else
    {
        findQuery = {$match : {
                
            "meeting_created_for" : req.body.meeting_created_for,
            "meeting_start_date":
            {
                "$lt": beforeDate,
                "$gt": todayDate
            }
        } };
        
    }

    EventModel.aggregate([findQuery])
    .exec((err, result) => {
        //console.log("result" + result);
        if(err)
        {
            Logger.error(err.message,"Meeting Controller : Perticular Every Minute Data()",10);
            let apiResponse = Response.generate(true,err.message,500,null);
            res.send(apiResponse);
        }
        else if(Check.isEmpty(result))
        {
            Logger.Info("Mettings not found for particular user","Meeting Controller : Perticular user meeting()",10);
            let apiResponse = Response.generate(true,"Mettings not found for particular user",404,null);
            res.send(apiResponse);
        }
        else
        {
            let apiResponse = Response.generate(false,"Data Found",200,result);
            res.send(apiResponse);
        }
    })
}


module.exports = {

    particular_User_meetings : particular_User_meetings,
    Every_min_data : Every_min_data

}