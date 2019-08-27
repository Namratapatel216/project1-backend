const appConfing = {};

appConfing.port = "13.127.226.120";
appConfing.allowedCorsOrigin = "*";
appConfing.db = {
    uri : "mongodb://127.0.0.1:27017/Meeting-planning"
}
appConfing.env = "dev";
appConfing.apiVersion = "/api/v1";


module.exports = {
    port : appConfing.port,
    allowedCorsOrigin : appConfing.allowedCorsOrigin,
    environment : appConfing.env,
    apiVersion : appConfing.apiVersion,
    db : appConfing.db
}
