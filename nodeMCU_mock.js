var mqtt = require('mqtt');

//broker 연결시 host주소는 udp로 받아와서 설정
var client = mqtt.connect('mqtt://localhost');

//mqtt broker 연결시
client.on('connect', function () {
  console.log(`connected : ${client.connected}`);

  //nodemcu호스트주소/action 으로 동작요청 받기위해 구독
  client.subscribe('111.11.11.11/action');

  //중계서버에 아두이노 등록처리 하기위해 발행
  //호스트 주소는 nodemcu호스트 주소
  client.publish(
    'regist',
    JSON.stringify({
      device_host: '111.11.11.11',
      device_name: 'esp',
      device_way: '4',
    }),
  );
});

//에러 콜백
client.on('error', (error) => {
  console.log("Can't connect" + error);
});

client.on('message', function (topic, message) {
  //구독한 topic
  if (topic === '111.11.11.11/action') {
    //아두이노 동작처리 후
    //0번스위치 토글 가정
    console.log(message + '토글');
    //상태값 발행
    client.publish(
      'state',
      JSON.stringify({
        device_host: '111.11.11.11',
        device_state: '1000', //0번스위치 토글 가정
        device_way: '4',
      }),
    );
  } else {
    console.log(`${topic} : ${message.toString()}`);
  }
});
