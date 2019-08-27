const express = require('express');

const router = express.Router();

const app = express();

const appConfig = require('./../../config/config');

const userController = require('./../controllers/userController');

//const auth = require('./../middleware/auth');

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/users`;

    app.get(`${baseUrl}/view/all`,userController.allUsers),

    app.post(`${baseUrl}/signUp`,userController.SignUpFunction),

    app.get(`${baseUrl}/:userId/singleUSer`,userController.SingleUser),

    app.put(`${baseUrl}/:userId/edit-profile`,userController.editProfile),

    app.post(`${baseUrl}/:userId/delete`,userController.deleteUser),

    app.post(`${baseUrl}/login`,userController.LoginFunction),

    app.post(`${baseUrl}/logOut`,userController.Logout),

    app.post(`${baseUrl}/forgot-password`,userController.forgotpwd),

    app.post(`${baseUrl}/recover-password`,userController.RecoverPassword),

    app.post(`${baseUrl}/get-email`,userController.getEmail),

    app.post(`${baseUrl}/Verify-User`,userController.VerifyUSer),

    app.post(`${baseUrl}/change-password`,userController.ChangePwd)

} 