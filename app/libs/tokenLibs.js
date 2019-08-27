const jwt = require('jsonwebtoken');

const shortid = require('shortid');

const secretKey = "RandomkeyThatCanNotguessAnybody";

let generateToken = (data, cb) => {

    try{
        let claims = {
            jwtid : shortid.generate(),
            iat : Date.now(),
            exp : Math.floor(Date.now() / 100 ) + (60 * 60 * 24),
            sub : 'authToken',
            iss : 'edchat',
            data : data
        }

        let tokenDetails = {
            token : jwt.sign(claims,secretKey),
            tokensecret : secretKey
        }

        cb(null,tokenDetails);
    }
    catch(err)
    {
        console.log(err);
        cb(err,null);
    }

}


//verify claim
let verifyClaim = (token, secretKey, cb) => {

    jwt.verify(token, secretKey, function(err, decoded){

        if(err)
        {
            console.log(err);
            cb(err,null);
        }
        else
        {
            cb(null,decoded);
        }

    });

}

//verify claim without secret

let verifyClaimwithoutSecret = (token, cb) => {

    jwt.verify(token, secretKey, function(err,decoded){

        if(err)
        {
            console.log("err" + err);
            cb(err,null);
        }
        else
        {
            console.log("decoded" + decoded);
            cb(null,decoded);
        }

    });

}

module.exports = {
    generateToken : generateToken,
    verifyToken : verifyClaim,
    verifyClaimwithoutSecret : verifyClaimwithoutSecret
}