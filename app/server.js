const express = require('express');
const path = require('path');
const fs = require('fs');
const { MongoClient } = require('mongodb')
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get('/profile-picture', function (req, res) {
  const img = fs.readFileSync(path.join(__dirname, "assets/profile-picture.jpg"));
  res.writeHead(200, { 'Content-Type': 'image/jpg' });
  res.end(img, 'binary');
});

const isLocal = true;
const isDocker = true;

// use when starting application locally
const mongoUrlLocal = "mongodb://admin:password@localhost:27017";

// use when starting application as docker container
const mongoUrlDocker = "mongodb://admin:password@mongodb";

const mongoUrl = isLocal ? mongoUrlLocal : mongoUrlDocker;

// pass these options to mongo client connect request to avoid DeprecationWarning for current Server Discovery and Monitoring engine
const mongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };

// "user-account" in demo with docker. "my-db" in demo with docker-compose
const databaseName = isDocker ? "user-account" : "my-db";

app.post('/update-profile', (req, res) => {
  const userObj = req.body;

  const client = new MongoClient(mongoUrl, mongoClientOptions);
  client.connect()
  .then(() => {
    const db = client.db(databaseName);
    userObj['userid'] = 1;

    const myquery = { userid: 1 };
    const newvalues = { $set: userObj };

    return db.collection("users").updateOne(myquery, newvalues, { upsert: true });
  })
  .then((result) => {
    console.log("Updated " + result.modifiedCount + " record(s)");
    res.send(userObj);
    client.close();
  })
    .catch((error) => {
      console.error('Unable to update profile: ', error)
      res.status(500).send(error)
    });
});

app.get('/get-profile', (req, res) => {
  const response = {};
  const client = new MongoClient(mongoUrl, mongoClientOptions);
  client.connect()
  .then(() => {
    const db = client.db(databaseName);
    const myquery = { userid: 1 };
    return db.collection("users").findOne(myquery);
  })
  .then((result) => {
    response['result'] = result;
    res.send(response);
    client.close();
  })
  .catch((error) => {
    console.error('Unable to get profile: ', error)
    res.status(204).send(error)
  });
});

app.listen(3000, () => {
  console.log("app listening on port 3000!");
});

