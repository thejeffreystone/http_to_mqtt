var dotenv = require('dotenv');
dotenv.load();
var winston = require('winston');
winston.configure({
    transports: [
      new (winston.transports.File)({ filename: '/srv/ha/logs/http_to_mqtt.log' })
    ]
  });
var auth_key = process.env.AUTH_KEY || '';
var mqtt_host = process.env.MQTT_HOST || '';
var mqtt_user = process.env.MQTT_USER || '';
var mqtt_pass = process.env.MQTT_PASS || '';
var http_port = process.env.PORT || 5000;
var debug_mode = process.env.DEBUG_MODE || true;
var keep_alive_topic = process.env.KEEP_ALIVE_TOPIC || 'keep_alive';
var keep_alive_message = process.env.KEEP_ALIVE_MESSAGE || 'keep_alive';

var mqtt = require('mqtt');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

function logRequest(req) {
  var ip = req.headers['x-forwarded-for'] ||
           req.connection.remoteAddress;
  var message = 'Received request [' + req.originalUrl +
              '] from [' + ip + ']';
  if (debug_mode) {
    message += ' with payload [' + JSON.stringify(req.body) + '] /';
  } else {
    message += '.';
  }
  //console.log(message);
  winston.log('info',message);
}

var client  = mqtt.connect(mqtt_host, {
  clientId: 'httpmqtt',
  username: mqtt_user,
  password: mqtt_pass
});

app.set('port', http_port);
app.use(bodyParser.json());

app.get('/keep_alive/', function(req, res) {
  logRequest(req);
  client.publish(keep_alive_topic, keep_alive_message);
  res.send('ok\n');
});

app.post('/post/', function(req, res) {
  logRequest(req);
  if (!auth_key || req.body['key'] != auth_key) {
    //console.log('Request is not authorized.');
    message = 'Request is not authorized - key=' + req.body['key']',ip=' +ip;
    winston.log('warn', message);
    res.send();
    return;
  }

  if (req.body['topic']) {
    client.publish(req.body['topic'], req.body['message']);
    res.send('ok\n');
  } else {
    res.send('error\n');
  }
});

app.listen(app.get('port'), function() {
  //console.log('Node app is running on port', app.get('port'));
  winston.log('info', 'Node app is running on port ' + app.get('port'));
});
