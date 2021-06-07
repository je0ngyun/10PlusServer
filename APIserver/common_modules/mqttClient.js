'use strict';
//MQTT 클라이언트
const env = require('./env/env.json');
const db = require('./dbmodel');
const mqtt = require('mqtt');
const self = {};
let client;

const registTopic = 'regist';
const stateTopic = 'state';

self.start = function () {
  client = mqtt.connect('mqtt://localhost');

  client.subscribe(registTopic);
  client.subscribe(stateTopic);

  client.on('message', async function (topic, message) {
    console.log(topic);
    if (topic === registTopic) {
      //등록처리 토픽
      let info = JSON.parse(message);
      await db.setDevice(info);
    }
    if (topic === stateTopic) {
      //상태처리 토픽
      let info = JSON.parse(message);
      let computed = { host: '', name: '', state: '' };
      computed.host = info.device_host;
      computed.name = await db.getDeviceName({ host: info.device_host + '' });

      //DB에 문자열로 저장하기 위해 2진수를 평문으로 변환
      // 11 -> false,false
      for (let i = 0; i < info.device_state.length; i++) {
        if (Number(info.device_state[i]) === 0) {
          computed.state += 'false,';
        } else {
          computed.state += 'true,';
        }
      }

      computed.state = computed.state.slice(0, computed.state.length - 1);
      //DB에 상태(로그) 저장
      await db.setDeviceLog(computed);
    }
  });
};

self.getClientRef = function () {
  return client;
};

module.exports = self;
