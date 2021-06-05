'use strict';
//MQTT 클라이언트
const env = require('./env/env.json');
const db = require('./dbmodel');
const mqtt = require('mqtt');
let client;
const self = {};

const registTopic = 'regist';
const stateTopic = 'state';

self.start = function () {
  client = mqtt.connect('mqtt://localhost');

  client.subscribe(registTopic);
  client.subscribe(stateTopic);

  client.on('message', async function (topic, message) {
    if (topic === registTopic) {
      //등록처리 토픽
      let info = JSON.parse(message);
      await db.setDevice(info);
    }
  });
};

self.getClientRef = function () {
  return client;
};

module.exports = self;
