## 목차

> - [개요](#프로젝트-개요)
> - [개발방식](#개발방식)
> - [사용기술](#사용기술)
> - [제공화면](#제공화면)
> - [주요기능](#주요기능)
> - [회고](#회고)

## 프로젝트 개요

본 프로젝트는 **2021 캡스톤디자인 프로젝트 중 일부**로 웹 통신을 이용한 IOT 스마트홈 구축 이란 주제로 스마트홈서비스 제작을 진행하였습니다.
프로젝트의 **목표는 기존 거주지의 스마트홈화** 이며 이러한 목표에 맞게 사용자가 이용하는 IOT 기기, 웹사이트, 스마트 디바이스를 제작하였고, 그중에서 본 글에서 설명하는 프로젝트는 **스마트 디바이스(라즈베리파이)** 화면에 보이는 **웹 애플리케이션**입니다.
개발 시간은 1개월이 소요되었으며 혼자 진행하였습니다.

## 개발방식

Vue를 사용하여 화면을 구성한 후 빌드 한 결과물을 Express 내에 포함시켜 중계서버가 페이지를 제공하도록 하였습니다.

```js
//vue.config.js
const path = require('path');
module.exports = {
  outputDir: path.resolve(__dirname, '../APIserver/public'),
};
```

```js
//index.js(Express)
router.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});
```

## 사용기술

<span>
<img alt="Vue" src ="https://img.shields.io/badge/Vue-4FC08D.svg?&style=for-the-badge&logo=Vue.js&logoColor=white"/>
</span>
<span>
<img alt="Vuex" src ="https://img.shields.io/badge/Vuex-3268a8.svg?&style=for-the-badge&logo=Vue.js&logoColor=white"/>
</span>
<span>
<img alt="Buefy" src ="https://img.shields.io/badge/buefy-7957d5.svg?&style=for-the-badge&logo=Buefy&logoColor=white"/>
</span>
<span>
<img alt="Axios" src ="https://img.shields.io/badge/axios-d99586.svg?&style=for-the-badge&logo=AIOHTTP&logoColor=white"/>
</span>
<span>
<img alt="SocketIO" src ="https://img.shields.io/badge/Socket.io-189472.svg?&style=for-the-badge&logo=Socket.io&logoColor=white"/>
</span>

1. **Vue - v2.6.11**

   - Vue 프레임워크를 사용하여 사용자 인터페이스를 개발하였습니다.

2. **Vuex - v3.6.2**

   - 각 기기들의 테마를 변경시키는 기능을 위해 Vuex를 사용하였습니다.

3. **Buefy - v0.9.7**

   - UI 컴포넌트로 Buefy를 사용하였습니다.

4. **Axios - v0.21.1**

   - 서버에 웹 요청을 보내기 위해 Axios 라이브러리를 사용하였습니다.

5. **Vue-Socket-io - v3.0.10**

   - 서버로부터 인증번호 표출 이벤트를 받기 위해 Socket.io를 사용하였습니다.

## 제공화면

> 모든 화면은 라즈베리파이 터치스크린 사이즈(800x480)에 맞게 제작하였습니다.

- 메인화면

<img src = "https://github.com/ye0reum/ye0reum.github.io/blob/master/src/images/project-imgs/10plus-kiosk/%EB%A9%94%EC%9D%B8%ED%99%94%EB%A9%B4.png?raw=true" width="80%">

- 로그보기 화면

<img src = "https://github.com/ye0reum/ye0reum.github.io/blob/master/src/images/project-imgs/10plus-kiosk/%EB%A1%9C%EA%B7%B8%EB%B3%B4%EA%B8%B0.png?raw=true" width="80%">

- 새로고침 설정화면

<img src = "https://github.com/ye0reum/ye0reum.github.io/blob/master/src/images/project-imgs/10plus-kiosk/%EC%83%88%EB%A1%9C%EA%B3%A0%EC%B9%A8%EC%84%A4%EC%A0%95.png?raw=true" width="80%">

- 테마 설정화면

<img src = "https://github.com/ye0reum/ye0reum.github.io/blob/master/src/images/project-imgs/10plus-kiosk/%ED%85%8C%EB%A7%88%EC%84%A4%EC%A0%95.png?raw=true" width="80%">

## 주요기능

> - [날씨확인](#날씨확인)
> - [기기동작](#기기동작)
> - [기기테마변경](#기기테마-변경)
> - [기기로그확인](#기기로그-확인)
> - [새로고침설정](#새로고침-설정)

### **날씨확인**

날씨를 간단하게 확인할 수 있는 기능이 있으면 좋겠다고 판단되어
메인화면에서 **현재 날씨를 카드 형식**으로 표출하였습니다.  
날씨정보를 받아오기 위해서 **OpenWeatherAPI**를 활용하였습니다.
현재 위치를 도출해내기 위하여 GeoLoaction 을 사용하였습니다.

### **기기동작**

먼저 각 기기의 스위치 개수마다 **서로 표시되는 크기가 다르게** 하였고
스위치의 개수만큼 전원 버튼 아이콘을 위치시켰습니다.
버튼을 클릭하면
중계서버로 요청을 보내고 중계서버의 응답에 따라 버튼의 색상을 변경시킵니다.

### **기기테마 변경**

각 기기 더블클릭 시 표시되는 **영역의 배경, 버튼, 글자색**을 변경할 수 있게 하였습니다.
화면에 표출되는 각 기기는 여러 개의 컴포넌트들로 이루어져 있기 때문에 데이터의 흐름이 많아져
상태 관리 라이브러리인 `Vuex`를 사용하여 복잡한 데이터 흐름을 단순화 시켰습니다.

### **기기로그 확인**

각 기기 롱 클릭 시 해당 **기기의 이름, 호스트, 상태, 동작시간** 정보를 담은 모달창을 표출합니다.
기기의 전원 상태를 한눈에 확인하기 쉽게 화면을 구성하였습니다.

### **새로고침 설정**

사용자가 메인화면의 기기 새로 고침 버튼을 누르지 않고도 자동으로 설정한 시간에 따라 새로 고침 되는 기능이 필요하다고 생각하였습니다.
그에 따라 기기 등록 및 **기기 상태가 업데이트되는 주기**를 사용자가 설정할 수 있게 하였습니다.

## 회고

> 웹 애플리케이션을 제작하기 위해 Vue를 공부하면서 SPA에 대한 이해를 할 수 있었습니다.  
> 또한 Vue에서 서버로의 요청 및 응답으로 화면을 동적으로 구성하는 것을 배울 수 있었고  
> 상태 관리 패턴에 대한 이해와 적용으로 복잡한 데이터 흐름을 단순화 시키는 법을 알게 되었습니다.  
> 기본 레이아웃 구성 및 Html Css Javscript 능력도 더욱 탄탄히 할 수 있는 계기가 되었습니다.
