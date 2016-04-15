var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

// You MUST change these values, consult the Messenger Platform Getting Started guide
var verify_token = 'pass_phrase';
var token = "EAAYwOthWMSsBAFx98syW8ZCqLmuq54IOjyJDd35CaZCSKSbHNlCZAbsvf7Qn5ZAScxD61Ihvrshy6k1IbIlDR52eZCOrFAh5PsMWZBmZCJomKkGmbKc2Ep7QxjJLn7IJyfL4faGoT8T1eE6u1ilJAVAm7T7xSBizcM5SISfFGLezgZDZD";

app.use(bodyParser.json());

app.get('/', function (req, res) {

    res.send('Hello World! This is the bot\'s root endpoint!');

});

app.get('/webhook/', function (req, res) {

    if (req.query['hub.verify_token'] === verify_token) {
        res.send(req.query['hub.challenge']);
    }

    res.send('Error, wrong validation token');

});

app.post('/webhook/', function (req, res) {

    var messaging_events = req.body.entry[0].messaging;

    for (var i = 0; i < messaging_events.length; i++) {

        var event = req.body.entry[0].messaging[i];
        var sender = event.sender.id;

        if (event.message && event.message.text) {
            var text = event.message.text;

            sendTextMessage(sender, "Echo: " + text.substring(0, 200));
        }
    }

    res.sendStatus(200);

});

app.listen(1337, function () {

    console.log('Facebook Messenger echoing bot started on port 1337!');

});

function sendTextMessage(sender, text) {

    var messageData = {
        text: text
    };

    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: token},
        method: 'POST',
        json: {
            recipient: {id: sender},
            message: messageData
        }
    }, function (error, response) {

        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }

    });

}