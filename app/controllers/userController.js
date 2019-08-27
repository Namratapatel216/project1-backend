const express = require('express');

const app = express();

const appConfig = require('./../../config/config');

const mongoose = require('mongoose');

const UserModel = mongoose.model('User');

const shortid = require('shortid');

const Logger = require('./../libs/loggerLibs');

const Response = require('./../libs/responseLibs');

const Check = require('./../libs/checkLibs');

const validateInput = require('./../libs/validateInput');

const timeLib = require('./../libs/timeLibs');

const passwordLib = require('./../libs/passwordLibs'); 

const TokenLib = require('./../libs/tokenLibs');

const AuthModel = mongoose.model('auth');

const Verifier = require("email-verifier");

var nodemailer = require('nodemailer');

const jwt = require('jsonwebtoken');

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

const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

const EmailLibs = require('./../libs/emailLibs');

function encrypt(text) {
 let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
 let encrypted = cipher.update(text);
 encrypted = Buffer.concat([encrypted, cipher.final()]);
 return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

function decrypt(text) {
 let iv = Buffer.from(text.iv, 'hex');
 let encryptedText = Buffer.from(text.encryptedData, 'hex');
 let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
 let decrypted = decipher.update(encryptedText);
 decrypted = Buffer.concat([decrypted, decipher.final()]);
 return decrypted.toString();
}


//function to get all user details
let allUsers = (req, res) => {

    //console.log("test");

    UserModel.find({is_verified : true, is_admin : false})
    .lean()
    .select('-__v -_id')
    .exec((error, result) => {

        if(error)
        {
            Logger.error(error.message,"User Controller : allUSers()",10);
            let apiResponse = Response.generate(true,"Failed To Load ALL Users",500,null);
            res.send(apiResponse);
        }
        else if(Check.isEmpty(result))
        {
            Logger.Info("No User Found","User Controller : allUSers()",10);
            let apiResponse = Response.generate(true,"No USer Found",404,null);
            res.send(apiResponse);
        }
        else
        {
            let apiResponse = Response.generate(false,"USer Listed",200,result);
            res.send(apiResponse);
        }

    });


}//end of function for getting all the user details


//function to get single usre
let SingleUser = (req, res) => {

    UserModel.findOne({userId : req.params.userId })
    .lean()
    .select('-__V -_id')
    .exec((err, result) => {

        if(err)
        {
            Logger.error(err.message,"USer Controller : Single USer()",10);
            let apiResponse = Response.generate(true,"Failed To Load Single USer",500,null);
            res.send(apiResponse);
        }
        else if(Check.isEmpty(result))
        {
            Logger.Info("No User Found","User Controller : Single User()",10);
            let apiResponse = Response.generate(true,"No USer Found",404,null);
            res.send(apiResponse);
        }
        else
        {
            let apiResponse = Response.generate(false,"User Details Found",200,result);
            res.send(apiResponse);
        }

    });

}//end of function for getting single user


//function to delete user
let deleteUser = (req, res) => {

    UserModel.findOneAndRemove({userId : req.params.userId })
    .exec((err, result) => {
        if(err)
        {
            Logger.error(err.message,"User Controller : delete User()",10);
            let apiResponse = Response.generate(true,"Failed to delete particular user",500,null);
            res.send(apiResponse);
        }
        else if(Check.isEmpty(result))
        {
            Logger.Info("No USer Found","User Controller : delete User()",10);
            let apiResponse = Response.generate(true,"No USer Found",404,null);
            res.send(apiResponse);
        }
        else
        {
            let apiResponse = Response.generate(false,"User Deleted Successfully",200,result);
            res.send(apiResponse);
        }
    });

}//end of function to delete particular user


//function to edit particular user details
let editProfile = (req,res) => {

    if(req.body.email)
    {
        if(!validateInput.Email(req.body.email))
        {
            Logger.Info("Incorrect Email Address","User Contoller : Validate USer Input()",10);
            let apiResponse = Response.generate(true,"Incorrect email",500,null);
            res.send(apiResponse);
        }
        else
        {
            let options = req.body;

            UserModel.updateOne({userId : req.params.userId}, req.body)
            .exec((err, result) => {

                if(err)
                {
                    Logger.error(err.message,"USer Controller : UpdateUSer()",10);
                    let apiResponse = Response.generate(true,"Failed To Edit USer Profile",500,null);
                    res.send(apiResponse);
                }
                else if(Check.isEmpty(result))
                {
                    Logger.Info("No User Found","USer Controller : UpdateUser()",10);
                    let apiResponse = Response.generate(true,"No User Found",404,null);
                    res.send(apiResponse);
                }
                else
                {
                    let apiResponse = Response.generate(false,"User Details Updated Successfully",200,result);
                    res.send(apiResponse);
                }

            });
        }   
    }
    else
    {
        let options = req.body;

        UserModel.updateOne({userId : req.params.userId}, req.body)
        .exec((err, result) => {

            if(err)
            {
                Logger.error(err.message,"USer Controller : UpdateUSer()",10);
                let apiResponse = Response.generate(true,"Failed To Edit USer Profile",500,null);
                res.send(apiResponse);
            }
            else if(Check.isEmpty(result))
            {
                Logger.Info("No User Found","USer Controller : UpdateUser()",10);
                let apiResponse = Response.generate(true,"No User Found",404,null);
                res.send(apiResponse);
            }
            else
            {
                let apiResponse = Response.generate(false,"User Details Updated Successfully",200,result);
                res.send(apiResponse);
            }

        });
    }
    

}//end of function to edit particular user details

//function for signup
let SignUpFunction = (req, res) => {

    console.log("signup called");

    //function to validate email and password
    let validateUserInput = () => {

        return new Promise((resolve, reject) => {

            if(req.body.email)
            {
                if(!validateInput.Email(req.body.email))
                {
                    Logger.Info("Incorrect Email Address","User Contoller : Validate USer Input()",10);
                    let apiResponse = Response.generate(true,"Incorrect email",500,null);
                    reject(apiResponse);
                }
                else if(!validateInput.Password(req.body.password))
                {
                    Logger.Info("Password Does Not met Requirements","USer Controller : Validate USer Input()",10);
                    let apiResponse = Response.generate(true,"Password does not met requirement",500,null);
                    reject(apiResponse);
                }
                else
                {
                    //resolve(req);
                    let verifier = new Verifier("at_OOVsxldsunAQkJVskHFKr3Xueq4y1");
                    verifier.verify(req.body.email, (err, data) => {
                        if (err)
                        {
                            //console.log(err);
                            Logger.Info("Email address is invalid or not exist","USer Controller : Validate USer Input()",10);
                            let apiResponse = Response.generate(true,"Email address is invalid or not exist",500,null);
                            reject(apiResponse);
                        } 
                        else
                        {
                            //console.log(data);
                            if(data['smtpCheck'] === 'false')
                            {
                                console.log(data['smtpCheck']);
                                Logger.Info("Email address is invalid or not exist","USer Controller : Validate USer Input()",10);
                                let apiResponse = Response.generate(true,"Email address is invalid or not exist",500,null);
                                reject(apiResponse);
                            }
                            else
                            {
                                resolve(req);
                            }
                        }
                        //console.log(data);
                    });

                }
            }
            else
            {
                Logger.Info("Please enter email address","USer Controller : Validate user input()",10);
                let apiResponse = Response.generate(true,"Please enter email address",500,null);
                reject(apiResponse);
            }

        });

    }//end of function to validate email and password


    //function to create user
    let CreateUSer = () => {

        return new Promise((resolve, reject) => {
           
            UserModel.findOne({'email' : req.body.email, is_verified : true})
            .exec((err,result) => {
                
                if(err)
                {
                    Logger.error(err.message,"User Controller : Create USer()",10);
                    let apiResponse = Response.generate(true,"Failed To create user",500,null);
                    reject(apiResponse);
                }
                else if(Check.isEmpty(result))
                {

                    let check_admin = false;
                    let full_username = req.body.firstName + " " + req.body.lastName;
                    let last_five_char_of_user = full_username.substr(full_username.length - 5);
                    if(last_five_char_of_user.toLowerCase() == 'admin')
                    {
                        check_admin = true;
                    }
                    else
                    {
                        check_admin = false;
                    }

                    let newUser = new UserModel({
                        userId : shortid.generate(),
                        firstName : req.body.firstName,
                        lastName : req.body.lastName,
                        email : req.body.email,
                        password : passwordLib.hashPassword(req.body.password),
                        mobileNumber : req.body.mobileNumber,
                        country_code : req.body.country_code,
                        country_name : req.body.country_name,
                        createdOn : timeLib.now(),
                        is_verified : false,
                        is_admin : check_admin

                    });

                    newUser.save((err, newUser) => {
                        if(err)
                        {
                            Logger.error(err.message,"User Controller : Cretae USer()",10);
                            let apiResponse = Response.generate(true,"Failed To create USer",500,null);
                            reject(apiResponse);
                        }
                        else
                        {
                            let newUSerObj = newUser.toObject();
                            resolve(newUSerObj);
                        }
                    });

                }
                else
                {
                    Logger.Info("email is already exist","User Controller : Create USer()",10);
                    let apiResponse = Response.generate(true,"email is already exist",500,null);
                    reject(apiResponse);
                }
            })

        });

    }//end of create user function

    validateUserInput(req, res)
    .then(CreateUSer)
    .then((resolve) => {
        delete resolve.password;

        const emailToken = jwt.sign(
            {
                email : resolve.email
            },'secret', { expiresIn: '365d' }
        );


        var fromEmailAddress = 'namratafaldu21@gmail.com';
        var toEmailAddress = resolve.email;
        var mail = {
            from: fromEmailAddress,
            to: toEmailAddress,
            subject: 'Action Required : Please verify your email address',
            text: "Hello!",
            html: EmailLibs.verify_email_mail_content(`http://npatelproject.site/Verify-User/${emailToken}`)
        }

        transport.sendMail(mail, function(error, response){
            if(error){
                Logger.Info(error.message,"User Controller : Forgot pwd()",10);
                let apiResponse = Response.generate(true,error.message,404,null);
                res.send(apiResponse);
            }else{
                let apiResponse = Response.generate(false,"USer registered Successfully and we have sent you confirmation link",200,resolve);
                res.send(apiResponse);
            }
        
            transport.close();
        });

        
    })
    .catch((err) => {

        console.log(err);
        res.send(err);

    });

}//end of signup fucntion


//function to login particular user
let LoginFunction = (req,res) => {

    //function to find user
    let findUser = (req,res) => {

        return new Promise((resolve, reject) => {

            if(req.body.email)
            {
                UserModel.findOne({email : req.body.email})
                .lean()
                .select('-__V -_id')
                .exec((err, retrivedUserDetails) => {

                    if(err)
                    {
                        Logger.error(err.message,"User Controller : Find User()",10);
                        let apiResponse = Response.generate(true,"Failed to retrieve user details",500,null);
                        reject(apiResponse);
                    }
                    else if(Check.isEmpty(retrivedUserDetails))
                    {
                        Logger.Info("User Not Found","USer Controller : Find User()",10);
                        let apiResponse = Response.generate(true,"User Not Found",404,null);
                        reject(apiResponse);
                    }
                    else
                    {
                        if(retrivedUserDetails.is_verified === false)
                        {
                            Logger.Info("Please verify your Account First from your mail and then you will login into the system","USer Controller : Find User()",10);
                            let apiResponse = Response.generate(true,"Please verify your Account First from your mail and then you will login into the system",404,null);
                            reject(apiResponse);
                        }
                        else
                        {
                            resolve(retrivedUserDetails);
                        }
                    }

                });
            }
            else
            {
                Logger.Info("Please enter email address","USer Controller : Find USer()",10);
                let apiResponse = Response.generate(true,"Please enter email address",500,null);
                reject(apiResponse);
            }

        });

    }//end of function for finding the user


    //function to validate password
    let ValidatePwd = (userDetails) => {


        return new Promise((resolve, reject) => {

            passwordLib.ComparePassword(req.body.password, userDetails.password, (error, isMatch) => {

                if(error)
                {
                    console.log("if");
                    Logger.error(error.message,"User Controller : Compare PAssword()",10);
                    let apiResponse = Response.generate(true,"Incorrect Password",500,null);
                    reject(apiResponse);
                }
                else if(isMatch)
                {
                    let userDetailsobj = userDetails;
                    delete userDetailsobj.password;
                    delete userDetailsobj.createdOn;
                    delete userDetailsobj.__v;
                    delete userDetailsobj._id;
                    resolve(userDetailsobj);
                }
                else 
                {
                    console.log("else");
                    Logger.Info("Invalid Password","User Controller : Compare PAssword()",10);
                    let apiResponse = Response.generate(true,"Invalid Password",500,null);
                    reject(apiResponse);
                }

            });

        });

    }//end of function for validating the password

    //function to generate token
    let generateToken = (userDEtails) => {

        return new Promise((resolve, reject) => {

            TokenLib.generateToken(userDEtails, (err, tokenDetails) => {
                if(err)
                {
                    Logger.error(err.message,"USer Controller : generate Token()",10);
                    let apiResponse = Response.generate(true,"Failed To Generate Token",500,null);
                    reject(apiResponse);
                }
                else
                {
                    tokenDetails.userId = userDEtails.userId;
                    tokenDetails.userDetails = userDEtails;
                    resolve(tokenDetails);
                }
            });

        });

    }//end of generate toke function

    //function to save particular token
    let saveToken = (tokenDetails) => {

        
        return new Promise((resolve, reject) => {

            AuthModel.findOne({userId : tokenDetails.userId})
            .exec((err,retrievedDetails) => {
                console.log("token details " + tokenDetails);
                if(err)
                {
                    Logger.error(err.message,"User Controller : Save Token()",10);
                    let apiResponse = Response.generate(true,"Failed To save Token",500,null);
                    reject(apiResponse);
                }
                else if(Check.isEmpty(retrievedDetails))
                {
                    let newToken_data = new AuthModel({

                        userId : tokenDetails.userId,
                        authToken : tokenDetails.token,
                        tokensecret : tokenDetails.tokensecret,
                        tokengenerationTime : timeLib.now()

                    });

                    newToken_data.save((err, newtokendeetails) => {
                        if(err)
                        {
                            console.log(err);
                            logger.error(err.message,'User controller : aveToken()',10);
                            let apiResponse = response.generate(tru,'Failed To generate Token',500,null);
                            reject(apiResponse);
                        }
                        else
                        {
                            let responseBody = {
                                authToken : newtokendeetails.authToken,
                                userDetails : tokenDetails.userDetails
                            }
                            console.log(responseBody);
                            resolve(responseBody);
                        }
                    })
                }
                else
                {
                   retrievedDetails.authToken = tokenDetails.token;
                   retrievedDetails.tokensecret = tokenDetails.tokensecret;
                   retrievedDetails.tokengenerationTime = timeLib.now();

                   retrievedDetails.save((err, newTokenDetails) => {

                        if(err)
                        {
                            console.log(err);
                            logger.error(err.message,'User controller : saveToken()',10);
                            let apiResponse = response.generate(tru,'Failed To generate Token',500,null);
                            reject(apiResponse);
                        }
                        else
                        {
                            let responseBody = {
                                authToken : newTokenDetails.authToken,
                                userDetails : tokenDetails.userDetails
                            }
                            console.log(responseBody);
                            resolve(responseBody);
                        }

                   });
                }

            });

        });

    }//end of save token funtion

    findUser(req,res)
    .then(ValidatePwd)
    .then(generateToken)
    .then(saveToken)
    .then((resolve) => {
        let apiResponse = Response.generate(false,"Logged in successfully",200,resolve);
        res.send(apiResponse);
    })
    .catch((err) => {

        res.send(err);

    });


}//end of login function

//function to logout the user
let Logout = (req,res) => {
    
    AuthModel.findOneAndRemove({userId:req.body.userId})
    .exec((err,result) => {

        if(err)
        {
            Logger.error(err.message,"User Controller : Logout()",10);
            let apiResponse = Response.generate(true,"Failed to fetch authtoken",500,null);
            res.send(apiResponse);
        }
        else if(Check.isEmpty(result))
        {
            Logger.Info("Invalid User OR Already Logged Out","USer Controller : Logout()",10);
            let apiResponse = Response.generate(true,"Invalid USer Or Already Logged Out",404,null);
            res.send(apiResponse);
        }
        else
        {
            let apiResponse = Response.generate(false,"User Logged Out Successfully",200,result);
            res.send(apiResponse);
        }

    });

}//end of logout function


//forgot password function
let forgotpwd = (req,res) => {

    if(req.body.email)
    {
        UserModel.findOne({email : req.body.email, is_verified : true})
        .exec((error, result) => {

            if(error)
            {
                Logger.error(error.message,"User Controller : Forgot Pwd()",10);
                let apiResponse = Response.generate(true,"Error Occued",500,null);
                res.send(apiResponse)
            }
            else if(Check.isEmpty(result))
            {
                Logger.Info("You have not registered into the system Or not verified your account from your registered gmail account","User Controller : Forgot pwd()",10);
                let apiResponse = Response.generate(true,"You have not registered into the system Or not verified your account from your registered gmail account",404,null);
                res.send(apiResponse);
            }
            else
            {
                
                const emailToken = jwt.sign(
                {
                    email : req.body.email
                },'secret', { expiresIn: '24h' }
                );

                var fromEmailAddress = 'namratafaldu21@gmail.com';
                var toEmailAddress = req.body.email;


                var encrypted_email = encrypt(req.body.email);
                console.log(encrypted_email);
                var mail = {
                    from: fromEmailAddress,
                    to: toEmailAddress,
                    subject: 'password Recovery Link',
                    text: "Hello!",
                    html: EmailLibs.passwordRecovery_Link_content(`http://npatelproject.site/recover-password/${emailToken}`)
                }

                console.log(mail);
                transport.sendMail(mail, function(error, response){
                    if(error){
                        Logger.Info(error.message,"User Controller : Forgot pwd()",10);
                        let apiResponse = Response.generate(true,error.message,404,null);
                        res.send(apiResponse);
                    }else{
                        let apiResponse = Response.generate(false,"WE have sent you passworrd recovery link to you email so please check your email account",200,result);
                        res.send(apiResponse);
                    }
                
                    transport.close();
                });
            }

        });
    }
    else
    {
        Logger.Info("Please enter email address");
        let apiResponse = Response.generate(true,"Please enter email address",500,null);
        res.send(apiResponse);
    }

}//end of forgot password function


//recover password function 
let RecoverPassword = (req,res) => {

        if(req.body.password)
        {
            if(!validateInput.Password(req.body.password))
            {
                Logger.error("password does not met reequirements","User Controller:Verify User()",10);
                let apiResponse = Response.generate(true,"password does not met reequirements",500,null);
                res.send(apiResponse);
            }
            else if(!validateInput.Email(req.body.email))
            {
                Logger.error("User(email) Not Found","User Controller:Verify User()",10);
                let apiResponse = Response.generate(true,"User Not Found",500,null);
                res.send(apiResponse);
            }
            else
            {
                let ch_email = req.body.email;
                let hashPassword_enc = passwordLib.hashPassword(req.body.password);
                let password_data = { password : hashPassword_enc}
                UserModel.findOneAndUpdate({email : ch_email,is_verified : true}, password_data)
                .exec((err,result) => {
                    if(err)
                    {
                        Logger.error(err.message,"User Controller:Verify User()",10);
                        let apiResponse = Response.generate(true,err.message,500,null);
                        res.send(apiResponse);
                    }
                    else if(Check.isEmpty(result))
                    {
                        Logger.error("User Not Found(empty) Or you have not verified your account from your registerd email id","User Controller:Verify User()",10);
                        let apiResponse = Response.generate(true,"User Not Found Or you have not verified your account from your registerd email id",500,null);
                        res.send(apiResponse);
                    }
                    else
                    {
                        console.log(result);
                        let apiResponse = Response.generate(false,"Password changed successfully",200,result);
                        res.send(apiResponse);
                    }
                })
            }
        }   
        else
        {
            Logger.error("Please enter password","User Controller:Verify User()",10);
            let apiResponse = Response.generate(true,"please enter password",500,null);
            res.send(apiResponse);
        }

}//end of recover password function

//get email address from token
let getEmail = (req,res) => {

    console.log("token" + req.body.Token);
    jwt.verify(req.body.Token, 'secret', (err, authData) => {
        if(err)
        {
            Logger.error(err.message,"User Controller:Verify User()",10);
            let apiResponse = Response.generate(true,err.message,500,null);
            res.send(apiResponse);
        }
        else
        {
            let apiResponse  = Response.generate(true,"email Found",200,authData);
            res.send(apiResponse)
        }
    });

}//end of get email function


//verify user function
let VerifyUSer = (req, res) => {

    console.log(req.body.Token);

    jwt.verify(req.body.Token, 'secret', (err, authData) => {
        if(err)
        {
            Logger.error(err.message,"User Controller:Verify User()",10);
            let apiResponse = Response.generate(true,err.message,500,null);
            res.send(apiResponse);
        }
        else
        {
            let options = { is_verified : true };
            UserModel.updateOne({email : authData.email},options)
            .exec((error, result) => {
                if(error)
                {
                    Logger.error(error.message,"USer Controller : verify User()",10);
                    let apiResponse = Response.generate(true,"Error Occured while verifying user",500,null);
                    res.send(apiResponse);
                }
                else if(Check.isEmpty(result))
                {
                    Logger.Info("User Nott Found","User Controller : Verify User()",10);
                    let apiResponse = Response.generate(true,"User Not Found",404,null);
                    res.send(apiResponse);
                }
                else
                {
                    let apiResponse = Response.generate(false,"User is verified successfully",200,result);
                    res.send(apiResponse);
                }
            });
            //res.send(authData);
        }
    });

}//end of verify user function

//function to change password
let ChangePwd = (req,res) => {


    let Get_user_data = (req,res) => {

        return new Promise((resolve, reject) => {

            console.log("userId  :" + req.body.userId);
            UserModel.findOne({userId : req.body.userId})
            .exec((err, retrivedUserDetails) => {
        
                if(err)
                {
                    Logger.error(err.message,"User Controller : change password()",10);
                    let apiResponse = Response.generate(false,err.message,500,null);
                    reject(apiResponse);
                }
                else if(Check.isEmpty(retrivedUserDetails))
                {
                    Logger.Info("User Not Found()","User Controller : change password()",10);
                    let apiResponse = Response.generate(false,"Useer Not Found",404,null);
                    reject(apiResponse);
                }
                else
                {
                    resolve(retrivedUserDetails);
                }
        
            });

        });
    }

    //function to validate password
    let ValidatePwd = (userDetails) => {

        return new Promise((resolve, reject) => {

            passwordLib.ComparePassword(req.body.old_password, userDetails.password, (error, isMatch) => {

                if(error)
                {
                    console.log("if");
                    Logger.error(error.message,"User Controller : Chnage PAssword()",10);
                    let apiResponse = Response.generate(true,"Incorrect Password",500,null);
                    reject(apiResponse);
                }
                else if(isMatch)
                {
                    if(!validateInput.Password(req.body.new_password))
                    {
                        Logger.Info("Password Does Not met Requirements","USer Controller : Change Passowrd()",10);
                        let apiResponse = Response.generate(true,"Password does not met requirement",500,null);
                        reject(apiResponse);
                    }
                    else
                    {
                        let new_password = passwordLib.hashPassword(req.body.new_password);
                        let n_pwd = { password : new_password};
                        console.log("new Password : " + new_password)
                        UserModel.findOneAndUpdate({userId : userDetails.userId},n_pwd)
                        .exec((error, result) => {

                            if(error)
                            {
                                Logger.error(error.message,"User Controller : change password()",10);
                                let apiResponse = response.generate(false,error.message,500,null);
                                reject(apiResponse);
                            }
                            else if(Check.isEmpty(result))
                            {
                                Logger.Info("USer Not Found","User Controller : Change Password()",10);
                                let apiResponse = Response.generate(true,"User Not Found",404,null);
                                reject(apiResponse);
                            }
                            else
                            {
                                resolve(result);
                            }

                        });
                    }
                }
                else 
                {
                    console.log("else");
                    Logger.Info("You have inputed wrong password","User Controller : Compare PAssword()",10);
                    let apiResponse = Response.generate(true,"You have inputed wrong password",500,null);
                    reject(apiResponse);
                }

            });

        });
    }

    

    Get_user_data(req,res)
    .then(ValidatePwd)
    .then((resolve) => {
            let apiResponse = Response.generate(false,"Password Changed Successfully",200,resolve);
            res.send(apiResponse);
    })
    .catch((err) => {
        console.log(err);
        res.send(err);
    })

  

}//end of change password function


module.exports = {

    allUsers : allUsers,
    SingleUser : SingleUser,
    deleteUser : deleteUser,
    editProfile : editProfile,
    SignUpFunction : SignUpFunction,
    LoginFunction : LoginFunction,
    Logout : Logout,
    forgotpwd : forgotpwd,
    RecoverPassword : RecoverPassword,
    VerifyUSer : VerifyUSer,
    getEmail : getEmail,
    ChangePwd : ChangePwd

}

