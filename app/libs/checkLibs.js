const express = require('express');

const app = express();

let trim = (x) => {

    let value = String(x);

    return value.replace(/^\s+|\s+$/gm,'');

}

let isEmpty = (value) => {

    if(value === undefined || value === null || value === '' || value.length === 0 || trim(value) === '')
    {
        return true;
    }
    else
    {
        return false;
    }

}

module.exports = {
    isEmpty : isEmpty
}
