"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getIntoData: getInfoData } = require("../utils");
const {
  BadRequestError,
  ErrorResponse,
  AuthFailureError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {

  static logout = async ({keyStore})=> {
    return delKey = await KeyTokenService.removeKeyById(keyStore._id)
    console.log({delKey})
    return delKey
  }
  
  static login = async ({ email, password, refreshToken = null }) => {
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError("Shop not registered");

    const match = bcrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError("Authentication error");

    // 3. created privateKey, publicKey
    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "pkcs1", // Public key CryptoGraphy Standard //pkcs8
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs1", // Public key CryptoGraphy Standard
        format: "pem",
      },
    });
    const tokens = await createTokenPair(
      { userId: newShop._id, email },
      publicKey,
      privateKey
    );
    console.log(`Created Token Success:: ${tokens}`);

    await KeyTokenService.createKeyToken({
      
    })
  };

  static signUp = async ({ name, email, password }) => {
    // try {
    // step1: check email exists?

    const holderShop = await shopModel.findOne({ email });
    if (holderShop) {
      throw new BadRequestError("Error: Shop already registered!");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });

    if (newShop) {
      // created privateKey => sign token
      // created publicKey => to verify token
      const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: "pkcs1", // Public key CryptoGraphy Standard //pkcs8
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs1", // Public key CryptoGraphy Standard
          format: "pem",
        },
      });
      const publicKeyString = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey: publicKey,
      });

      if (!publicKeyString) {
        return {
          code: "xxx",
          message: "publicKeyString error",
        };
      }

      const publicKeyObject = crypto.createPublicKey(publicKeyString);
      console.log(`publicKeyObject::`, publicKeyObject);

      // create token pair
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKeyObject,
        privateKey
      );
      console.log(`Created Token Success:: ${tokens}`);

      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fields: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }
    return {
      code: 200,
      metadata: null,
    };
  };
}

module.exports = AccessService;
