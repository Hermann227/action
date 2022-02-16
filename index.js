const express = require('express');
const app = express();
const PORT = process.env.PORT || 9090;
const request = require('request');
var cors = require('cors');

const nodemailer = require('nodemailer');

let userlogin = 'test';

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Ermitteln des akteullen User
app.post('/get/user', (req, res) => {
  // Anzeige der Werte als JSON response: {"response":{"user_login":"holzh", "user_vorname":"Hermann", "user_nachname":"Holz"}}
  var objToJsonResponse = {};
  var objToJsonValue = {};
  objToJsonValue.user_login = 'test';
  objToJsonValue.user_vorname = 'Test';
  objToJsonValue.user_nachname = 'Test';
  objToJsonValue.user_telefon = '12345';
  objToJsonValue.user_mail = 'test.test@test.de';
  objToJsonResponse.response = objToJsonValue;
  console.log(JSON.stringify(objToJsonResponse));
  res.send(JSON.stringify(objToJsonResponse));
});

// Ermitteln der Speisekarte
app.post('/get/canteen_menu', (req, res) => {
  // Anzeige der Werte als JSON response: {"response":{"canteen_menu":"blablabla"}}
  var objToJsonResponse = {};
  var objToJsonValue = {};
  objToJsonValue.canteen_menu = 'Rinderstreifen Stroganoff Art mit Essiggurke, Pilzen und rote Bete, dazu Reis und Schmand';
  objToJsonResponse.response = objToJsonValue;
  console.log(JSON.stringify(objToJsonResponse));
  res.send(JSON.stringify(objToJsonResponse));
});

// Ermitteln der aktuellen Temperatur
app.post('/get/temperature', (req, res) => {
  request('http://localhost:8087/get/temperature', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body); // Print the response
      const jsonObject = JSON.parse(body);
      // Anzeige der Werte als JSON response: {"response":{"temperature":"5.25°"}}
      var objToJsonResponse = {};
      var objToJsonValue = {};
      objToJsonValue.temperature = jsonObject.val + '°';
      objToJsonResponse.response = objToJsonValue;
      console.log(JSON.stringify(objToJsonResponse));
      res.send(JSON.stringify(objToJsonResponse));
    }
    else {
      console.log(error) // Print the response
      res.sendStatus(500);
    }
  })
});

// Ermitteln der aktuellen Luftfeuchtigkeit
app.post('/get/humidity', (req, res) => {
  request('http://localhost:8087/get/humidity', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body) // Print the response
      const jsonObject = JSON.parse(body);
      // Anzeige der Werte als JSON response: {"response":{"humidity":"92.5%"}}
      var objToJsonResponse = {};
      var objToJsonValue = {};
      objToJsonValue.humidity = jsonObject.val + '%';
      objToJsonResponse.response = objToJsonValue;
      console.log(JSON.stringify(objToJsonResponse));
      res.send(JSON.stringify(objToJsonResponse));
    }
    else {
      console.log(error) // Print the response
      res.sendStatus(500);
    }
  })
});


// Email versenden
app.post('/set/sendmail', (req, res) => {
  let recipient = req.body.recipient;
  let subject = req.body.subject;
  let bodytext = req.body.bodytext;

  let transport = nodemailer.createTransport({
    host: 'localhost',
    port: 1025
    // auth: {
    //    user: 'put_your_username_here',
    //    pass: 'put_your_password_here'
    // }
  });

  const message = {
    from: 'test@test.com', // Sender address
    to: recipient,         // List of recipients
    subject: subject, // Subject line
    text: bodytext // Plain text body
  };
  console.log(message)
  transport.sendMail(message, function(err, info) {
      if (err) {
        res.sendStatus(500);
      } else {
        res.send('{"status": "OK"}');
      }
  });
});

app.listen(PORT, () => {
  console.log(`Bot Api app listening at port: ${PORT}`)
});

