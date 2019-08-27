const express = require('express');

const app = express();

let Email = (inputted_email) => {

    let emailregx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if(emailregx.test(inputted_email))
    {
        return inputted_email;
    }
    else 
    {
        return false;
    }

}

let Password = (inputted_pwd) => {

    //console.log(inputted_pwd);

    let pwdregexp = /^[A-Za-z]\w{7,14}$/;

    if(pwdregexp.test(inputted_pwd))
    {
        return inputted_pwd;
    }
    else
    {
        return false;
    }

}

module.exports = {
    Email : Email,
    Password : Password
}