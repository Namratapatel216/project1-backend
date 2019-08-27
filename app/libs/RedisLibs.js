const Check = require('./checkLibs');
const redis = require('redis');
let client = redis.createClient();


client.on('connect', () => {

    console.log('Redis connection successfully opened');

});

let getAllUsersInHash = (hashName, callback) => {

    client.HGETALL(hashName, (err, result) => {
        console.log(`Getting all online users for hassh ${hashName}`);

        if(err)
        {
            console.log(err);
            callback(err, null);
        }
        else if(Check.isEmpty(result))
        {
            console.log('online user list is empty');
            console.log(result);

            callback(null, {});
        }
        else
        {
            console.log(result);
            callback(null, result);
        }

    })

}//end get all users in hash

let setNewOnlineUSerInHash = (hashName, key, value, callback) => {

    console.log(`setting user ${key} with value ${value} in hash ${hashName}`);

    client.HMSET(hashName, [
        key,value
    ], (err, result) => {

        if(err)
        {
            console.log(err);
            callback(err,null);
        }
        else
        {
            console.log("user has been set in hash map");
            console.log(result);
            callback(null,result);
        }

    });

}//end set a new online user in hash

let deleteUserFromHash = (hashName, key) => {

    client.HDEL(hashName,key);
    return true;

}//end of delete user from hash

module.exports = {
    getAllUsersInHash : getAllUsersInHash,
    setNewOnlineUSerInHash : setNewOnlineUSerInHash,
    deleteUserFromHash : deleteUserFromHash
}