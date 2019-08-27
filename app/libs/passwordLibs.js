var bcrypt = require('bcryptjs');
var saltRounds = 10;

let Logger = require('./../libs/loggerLibs');

let hashPassword = (inputted_pwd) => {

    var salt = bcrypt.genSaltSync(saltRounds);
    var hash = bcrypt.hashSync(inputted_pwd, salt);

    return hash;

}

let comparePassword = (password, hash_pwd, cb)  => {

    bcrypt.compare(password,hash_pwd, (err, res) => {

        if(err)
        {
            Logger.error(err.message,"User Controller : Compare pwd()",10);
            cb(err,null);
        }
        else
        {
            cb(null,res);
        }

    });

}

let comparepwdSync = (plainTextpwd, sync) => {

    return bcrypt.compareSync(plainTextpwd,sync);

}

module.exports = {
    hashPassword : hashPassword,
    ComparePassword : comparePassword,
    comparepwdSync : comparepwdSync
}