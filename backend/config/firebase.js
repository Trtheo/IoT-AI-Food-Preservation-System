const admin = require("firebase-admin");
require("dotenv").config();

if (!admin.apps.length) {
  const credential = process.env.FIREBASE_SERVICE_ACCOUNT
    ? admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
    : admin.credential.cert(require("../serviceAccountKey.json"));

  admin.initializeApp({
    credential,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

const db = admin.database();
module.exports = db;
