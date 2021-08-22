var express = require('express');
var router = express.Router();
const asyncHandler = require('express-async-handler');
const createError = require('http-errors');
const db = require('../common_modules/dbmodel');
const isEmpty = require('is-empty');
const { verifyToken } = require('./vertifyToken');
const mqttClient = require('../common_modules/mqttClient');

//등록기기조회
router.get(
  '/regist',
  verifyToken,
  asyncHandler(async (req, res, next) => {
    const result = await db.getDevices(req.query);
    if (isEmpty(result)) {
      throw new createError.BadRequest('등록기기 없음');
    }
    res.status(200).json({ success: true, devices: result });
  }),
);

//특정기기삭제
router.delete(
  '/regist',
  verifyToken,
  asyncHandler(async (req, res, next) => {
    await db.delDevice(req.query);
    res.status(200).json({ success: true });
  }),
);

//전체기기삭제
router.delete(
  '/regist/all',
  verifyToken,
  asyncHandler(async (req, res, next) => {
    await db.delDeviceAll(req.query);
    res.status(200).json({ success: true });
  }),
);

//특정기기로그조회
router.get(
  '/log',
  verifyToken,
  asyncHandler(async (req, res, next) => {
    const result = await db.getDeviceLog(req.query);
    if (isEmpty(result)) {
      throw new createError.BadRequest('요청기기 없음');
    }
    for (let i = 0; i < result.length; i++) {
      let state = [];
      let stateStr = result[i].state;
      state = stateStr.split(',');
      for (let k = 0; k < state.length; k++) {
        if (state[k] == 'true') {
          state[k] = true;
        } else {
          state[k] = false;
        }
      }
      result[i].state = state;
    }
    res.status(200).json({ success: true, logs: result });
  }),
);

//전체기기로그조회
router.get(
  '/log/all',
  verifyToken,
  asyncHandler(async (req, res, next) => {
    const result = await db.getDeviceLogAll(req.query);
    if (isEmpty(result)) {
      throw new createError.BadRequest('요청기기 없음');
    }
    res.status(200).json({ success: true, logs: result });
  }),
);

//전체로그삭제
router.delete(
  '/log/all',
  verifyToken,
  asyncHandler(async (req, res, next) => {
    await db.delDeviceLogAll(req.query);
    res.status(200).json({ success: true });
  }),
);

//기기상태확인
router.get(
  '/state',
  verifyToken,
  asyncHandler(async (req, res, next) => {
    let state = [];
    let stateStr;
    const result = await db.getLastState(req.query);
    if (isEmpty(result)) {
      //로그가 없을때 == 꺼진상태
      //기기의 스위치 수 만큼 상태 평문 생성
      let way = await db.getDeviceWay(req.query);
      for (let i = 0; i < Number(way); i++) {
        stateStr += 'false,';
      }
      stateStr = stateStr.slice(0, state.length - 1);
      //로그 평문을 배열화
      state = stateStr.split(',');
      for (let i = 0; i < state.length; i++) {
        if (state[i] == 'true') {
          state[i] = true;
        } else {
          state[i] = false;
        }
      }
    } else {
      stateStr = result.state;
      state = stateStr.split(',');
      for (let i = 0; i < state.length; i++) {
        if (state[i] == 'true') {
          state[i] = true;
        } else {
          state[i] = false;
        }
      }
    }
    res.status(200).json({ success: true, state: state });
  }),
);

//기기이름변경
router.get(
  '/rename',
  verifyToken,
  asyncHandler(async (req, res, next) => {
    await db.deviceRename(req.query);
    res.status(200).json({ success: true });
  }),
);

//기기동작요청
router.get(
  '/action',
  verifyToken,
  asyncHandler(async (req, res, next) => {
    const client = mqttClient.getClientRef();
    const stateTopic = 'state';
    const host = req.query.host;
    const switchNum = req.query.switch;
    let currentState = '';
    client.once('message', async function (topic, message) {
      if (topic === stateTopic) {
        //2.구독에 대한 응답으로 JSON이 옴
        let info = JSON.parse(message);

        //splice 를 위해 2진수를 평문에 , 문자 추가
        // 11 -> 1,1
        for (let i = 0; i < info.device_state.length; i++) {
          if (Number(info.device_state[i]) === 0) {
            currentState += '0,';
          } else {
            currentState += '1,';
          }
        }
        currentState = currentState.slice(0, currentState.length - 1);

        //평문 상태값을 배열 상태값으로 변환
        //0,0 -> [false,false]
        currentState = currentState.split(',');
        for (let i = 0; i < currentState.length; i++) {
          if (currentState[i] == '1') {
            currentState[i] = true;
          } else {
            currentState[i] = false;
          }
        }

        //3.웹 요청 응답
        res
          .status(200)
          .json({ success: true, device: { states: currentState } });
      }
    });
    //1.웹 요청 정보로 발행
    client.publish(`${host}/action`, switchNum);
  }),
);

module.exports = router;
