const admin = require('firebase-admin');

// Parse the JSON string from environment variable
const serviceAccountJson = JSON.parse(process.env.FIREBASE_ADMIN_SDK);

// Fix the private key by replacing escaped newlines with actual newlines
const serviceAccount = {
  ...serviceAccountJson,
  private_key: serviceAccountJson.private_key.replace(/\\n/g, '\n')
};

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Add your database URL if using Realtime Database
  // databaseURL: "https://your-project-id.firebaseio.com"
});

module.exports = admin;