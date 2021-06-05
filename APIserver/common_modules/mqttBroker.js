'use strict';
//MQTT 브로커
const aedes = require('aedes')();
const server = require('net').createServer(aedes.handle);
const port = 1883;
const self = {};

self.start = function () {
  server.listen(port, function () {
    console.log(`MQTT Broker Start : ${port}`);
  });
};

module.exports = self;
