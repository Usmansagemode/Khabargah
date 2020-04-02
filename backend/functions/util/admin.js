const admin = require('firebase-admin');
var fs = require("fs");
var servicee = fs.readFileSync("sage-mode-firebase-adminsdk-kzyez-2a58bb9654.json");
var serviceAccount = JSON.parse(servicee);
//sage-mode-firebase-adminsdk-kzyez-2a58bb9654
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sage-mode.firebaseio.com",
  storageBucket: "sage-mode.appspot.com",
});

const db = admin.firestore();

module.exports = {admin,db};