'use strict';
//UDP 서버
const env = require('./env/env.json');
const ip = require('ip');
const self = {};

self.start = function () {
  let PORT = env.udp_env.UDP_PORT;
  let dgram = require('dgram');
  let server = dgram.createSocket('udp4');

  server.on('listening', async function () {
    let address = server.address();
    console.log(`UDP Server Start ${address.address}:${address.port}`);
  });

  server.on('message', async function (message, remote) {
    console.log(`udp receive from ${remote.address + ''}`);
    response(remote.address + '', ip.address());
  });

  server.bind(PORT);
};

const response = function (reqHost, msg) {
  let PORT = env.udp_env.UDP_PORT;
  let HOST = reqHost;
  let dgram = require('dgram');
  let message = Buffer.from(msg, 'utf-8');
  let client = dgram.createSocket('udp4');
  client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
    if (err) throw err;
    console.log(`udp send to ${HOST} message : ${message}`);
    client.close();
  });
};

module.exports = self;
