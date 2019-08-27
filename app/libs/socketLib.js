const socketio = require('socket.io');

const mongoose = require('mongoose');

const shortid = require('shortid');

const logger = require('./loggerLibs');

const events = require('events');

const eventEmitter = new events.EventEmitter();

var nodemailer = require('nodemailer');

const UserModel = mongoose.model('User');

var EmailLib = require('./emailLibs');

var smtpTransport = require('nodemailer-smtp-transport');

var mailAccountUser = 'plannermeeting65@gmail.com';
var mailAccountPassword = 'Namrata21';

var transport = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    secure: false, // use SSL
    port: 25, // port for secure SMTP
    auth: {
        user: mailAccountUser,
        pass: mailAccountPassword
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false
    }
}));

const tokenLib = require('./tokenLibs');
const check = require('./checkLibs');
const response = require('./responseLibs');

const eventModel = mongoose.model('event');

const redisLibs = require('./RedisLibs');

let setServer = (server) => {

    console.log("server " + server);
    
    let io = socketio.listen(server);
    
    let myio = io.of('/');

    let allOnlineUsers = [];

    let events_data = [];

    myio.on('connection', (socket) => {

        socket.emit("VerifyUser","");

        //start of set user
        socket.on('set-User', (authToken) => {

            console.log(authToken);
            tokenLib.verifyClaimwithoutSecret(authToken, (err,data) => {
                if(err)
                {
                    console.log("err");

                    socket.emit('auth-error',{ status: 500, error: 'Please provide correct auth token' });
                }
                else
                {

                    let CurrentUser = data.data;

                    socket.userId = CurrentUser.userId;
                    let fullname = `${CurrentUser.firstName} ${CurrentUser.lastName}`;

                    let key = CurrentUser.userId;
                    let value = fullname;

                    let setUserOnline = redisLibs.setNewOnlineUSerInHash("onlineUsers",key, value, (err,result) => {
                            if(err)
                            {
                                console.log('some erro occured');
                            }
                            else
                            {
                                redisLibs.getAllUsersInHash('onlineUsers', (err, result) => {
                                    console.log(`all online users function`)
                                    if(err)
                                    {
                                        console.log(err)
                                    }
                                    else
                                    {
                                        console.log(`${fullname} is online`);

                                        socket.room = 'meetingplanner';
                                        socket.join(socket.room);
                                        socket.to(socket.room).broadcast.emit('online-user-list',result);
                                    }
                                })
                            }
                    });


                    socket.emit(CurrentUser.userId,"You are ONline");

                   
                    //let userObj = {userId : CurrentUser.userId, fullname : fullname};
                   
                   // allOnlineUsers.push(userObj); 
                }

                console.log(allOnlineUsers);
            });

            myio.emit('online-user-list',allOnlineUsers);
        }); // end of set user function 

       
        myio.emit('online-user-list',allOnlineUsers);

       
        
        socket.on('create-meeting',(data) => {

            console.log('create-meeting is called');
            data['eventId'] = shortid.generate();
            data['action'] = "create";
            console.log(data);

            setTimeout(function() {
                eventEmitter.emit('save-meeting',data);
            },2000);

            myio.emit(data.meeting_created_for,data);

        });


        socket.on('update-meeting',(data) => {

            console.log('update-meeting is called');
            data['action'] = "update";

            setTimeout(function() {
                eventEmitter.emit('save-updated-meeting',data);
            },2000);

            myio.emit(data.meeting_created_for,data);

        });

        socket.on('delete-meeting',(data) => {

            console.log('delete-meeting is called');
            data['action'] = "delete";

            setTimeout(function() {
                eventEmitter.emit('meeting-to-delete',data);
            },2000);

            myio.emit(data.meeting_created_for,data);

        });
        

        socket.on('Reminder',(data) => {

            console.log("reminder is called");
            data['action'] = "reminder";

            myio.emit(data.meeting_created_for,data);

        });

       socket.on('disconnect', () => {
            // disconnect the user from socket
            // remove the user from online list
            // unsubscribe the user from his own channel

            console.log("user is disconnected");
            // console.log(socket.connectorName);
            console.log(socket.userId);
           /*  var removeIndex = allOnlineUsers.map(function(user) { return user.userId; }).indexOf(socket.userId);
            allOnlineUsers.splice(removeIndex,1)
            console.log(allOnlineUsers); */

            if(socket.userId)
            {
                redisLibs.deleteUserFromHash('onlineUsers',socket.userId);
                redisLibs.getAllUsersInHash('onlineUsers',(err, result) => {
                    if(err)
                    {
                        console.log(err);

                    }
                    else
                    {
                        socket.leave(socket.room);
                        socket.to(socket.room).broadcast.emit('online-user-list',result)
                    }
                })
            }

            //myio.emit('online-user-list',allOnlineUsers);


        });

       

    });

}

//save the chat
eventEmitter.on('save-meeting',(data) => {

    let newMeeting = new eventModel({
        eventId: data.eventId,
        meeting_created_by: data.meeting_created_by,
        meeting_created_for: data.meeting_created_for,
        meeting_purpose: data.meeting_purpose,
        meeting_place: data.meeting_place,
        meeting_start_date: data.meeting_start_date,
        meeting_end_date : data.meeting_end_date,
        createdOn: data.createdOn
    });

    newMeeting.save((err, result) => {

        if(err)
        {
            console.log(`error occured ${err}`);
        }
        else if(check.isEmpty(result))
        {
            console.log('Meeting is saved');
        }
        else
        {
            console.log('Meeting Saved');
            console.log(result);

            console.log("meeting create dfor " + result.meeting_created_for)

            UserModel.findOne({userId : result.meeting_created_for})
            .exec((error,user_data) => 
            {
                    if(error)
                    {
                        console.log("error " + error);
                    }
                    else if(check.isEmpty(user_data))
                    {
                        console.log("USer not found");
                    }
                    else
                    {
                        var fromEmailAddress = 'plannermeeting65@gmail.com';
                        var toEmailAddress = user_data.email;
                        var mail = {
                            from: fromEmailAddress,
                            to: toEmailAddress,
                            subject: 'Meeting Scheduled',
                            text: "Hello!",
                            html: EmailLib.Meeting_creation_data(result.meeting_purpose,result.meeting_place,result.meeting_start_date,result.meeting_end_date)
                        }
            
                        transport.sendMail(mail, function(error, response){
                            if(error){
                                //Logger.Info(error.message,"User Controller : Forgot pwd()",10);
                                //let apiResponse = Response.generate(true,error.message,404,null);
                                console.log("error" + error.message);
                            }else{
                                //let apiResponse = Response.generate(false,"Mail sent",200,resolve);
                                console.log("Mail sent");
                            }
                        
                            transport.close();
                        });
                    
                    }
            });
        }

    });

}); //end of saving the chat

eventEmitter.on('save-updated-meeting',(data) => {

    let data_to_update = {
        meeting_purpose: data.meeting_purpose,
        meeting_place: data.meeting_place,
        meeting_start_date: data.meeting_start_date,
        meeting_end_date : data.meeting_end_date,
    }
    eventModel.findOneAndUpdate({eventId : data.eventId},data_to_update)
    .exec((err, result) => {
        if(err)
        {
            console.log("err" + err);
        }
        else if(check.isEmpty(result))
        {
            console.log("No result Found");
        }
        else
        {
            console.log("meeting ios updated");

            console.log(result);

            UserModel.findOne({userId : result.meeting_created_for})
            .exec((error,user_data) => 
            {
                console.log(user_data);
                    if(error)
                    {
                        console.log("error " + error);
                    }
                    else if(check.isEmpty(user_data))
                    {
                        console.log("USer not found");
                    }
                    else
                    {
                        var fromEmailAddress = 'plannermeeting65@gmail.com';
                        var toEmailAddress = user_data.email;
                        var mail = {
                            from: fromEmailAddress,
                            to: toEmailAddress,
                            subject: 'Meeting Schedule changed',
                            text: "Hello!",
                            html: EmailLib.Meeting_schedule_update_content_data(data.meeting_purpose,data.meeting_place,data.meeting_start_date,data.meeting_end_date)
                        }
            
                        transport.sendMail(mail, function(error, response){
                            if(error){
                                //Logger.Info(error.message,"User Controller : Forgot pwd()",10);
                                //let apiResponse = Response.generate(true,error.message,404,null);
                                console.log("error" + error.message);
                            }else{
                                //let apiResponse = Response.generate(false,"Mail sent",200,resolve);
                                console.log("Mail sent");
                            }
                        
                            transport.close();
                        });
                    
                    }
            });
        }
    })

});

eventEmitter.on('meeting-to-delete',(data) => {

    let data_to_update = {
        eventId : data.eventId
    }
    eventModel.findOneAndRemove({eventId : data.eventId})
    .exec((err, result) => {
        if(err)
        {
            console.log("err" + err);
        }
        else if(check.isEmpty(result))
        {
            console.log("No result Found");
        }
        else
        {
            console.log("meeting is deleted");
        }
    })

});


module.exports = {
    setServer : setServer
}
