"use strict";

const accessService = require("../services/access.service");

const { OK, CREATED } = require("../core/success.response");

class AccessController {
  logout = async (req, res, next) => {
    new SuccessResponse({
      message: "Logout success!",
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };

  signUp = async (req, res, next) => {
    new CREATED({
      message: "Registered OK!",
      metadata: await accessService.signUp(req.body),
      options: {
        limit: 10,
      },
    }).send(res);
  };
}

module.exports = new AccessController();
