# HTTP to MQTT bridge

I needed a solution that connected IFTTT to Home Assistant and came across [http_to_mqtt](https://github.com/petkov/http_to_mqtt)

I wanted to host it locally along with my MQTT server so I made some modifications. If you want host this at [Heroku: Cloud Application Platform](https://www.heroku.com/home) then I suggest grabbing [http_to_mqtt](https://github.com/petkov/http_to_mqtt), otherwise feel free to use mine. I have only made some modifications to .env variables and how status is output to the console if testing via curl.

[@petkov](https://github.com/petkov) wrote the [HTTP to MQTT](https://github.com/petkov/http_to_mqtt) bridge using Node JS with [Express](https://expressjs.com/) for HTTP server and [MQTT.js](https://www.npmjs.com/package/mqtt) client and could be hosted on [Heroku: Cloud Application Platform](https://www.heroku.com/home).  

I preferred to host it locally.  

## The Ingredients

1. Configure Home Assistant [MQTT trigger](https://home-assistant.io/docs/automation/trigger/#mqtt-trigger).
1. Clone this repo to your host
1. Update the env variables in .env-sample and rename to .env
   * AUTH_KEY - can be any string eg.: makeitreallyrandom.
   * MQTT_HOST - the host of your MQTT broker (eg.: mqtt://<host>:<port>).
   * MQTT_USER
   * MQTT_PASS
1. Create IFTTT applet the same way as described in [BRUH Automation](https://youtu.be/087tQ7Ly7f4?t=265) video.
1. Configure [Maker Webhooks](https://ifttt.com/maker_webhooks) service with below parameters.
   * URL: https://<host>:<port>/post/
   * Method: POST
   * Content Type: application/json
   * Body: {"topic":"<mqtt_topic>","message":"<mqtt_message>","key":"<AUTH_KEY>"}
1. Make sure to enable any required port forwarding.

## Test HTTP to MQTT Bridge

Before attempting to connect IFTTT to your new Bridge I suggest testing to make sure your bridge is . You can use curl for this.

For example:

```
curl -X POST -H "Content-Type: application/json" -d '{"topic":"testing/dev/message","message":"Working!","key":"makeitreallyrandom"}' http://<host>:5000/post/
```
Then just subscribe to the topic you just sent your test message to:

```
mosquitto_sub -d -h <mqtt_server> -p <port> -t 'testing/#' -u <mqtt_user> -P <mqtt_pass>
```

Once you validated your bridge is working then you should be good to go on setting up your [Maker Webhooks](https://ifttt.com/maker_webhooks)

## Todo

* ~~Log to a file so data can be splunked.~~

## Thanks

I would not have been able to do this without inspiration and the work of others.

First, [@petkov](https://github.com/petkov) who did the initial work to create this HTTP to MQTT bridge. I am using his blood, sweat, and tears for my own benefit and do so with the greatest of thanks.

Now, I wouldn't even been working on this project if it wasn't for [Home Assistant](https://home-assistant.io/). Seriously, if you are not using this project in your Home Automation you are doing it wrong. And of course, to Ben from [BRUH Automation](http://www.bruhautomation.com) who I first came across when looking for Home Assistant configs to ~~copy~~ use for inspiration. Ben also does some awesome video tutorials on both Home Assistant and making your own IoT devices cheap. Check out Ben's [youtube](https://www.youtube.com/c/bruhautomation1).  
