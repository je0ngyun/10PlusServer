## 목차

> - [개요](#프로젝트-개요)
> - [시스템구성도](#시스템구성도)
> - [중계서버의 필요성](#중계서버의-필요성)
> - [사용기술](#사용기술)
> - [주요기능](#주요기능)
> - [회고](#회고)

## 프로젝트 개요

본 프로젝트는 **2021 캡스톤디자인 프로젝트 중 일부**로 웹 통신을 이용한 IOT 스마트홈 구축 이란 주제로 스마트홈서비스 제작을 진행하였습니다.
프로젝트의 **목표는 기존 거주지의 스마트홈화** 이며 이러한 목표에 맞게 사용자가 이용하는 IOT 기기, 웹사이트, 스마트 디바이스를
제작하였고, 그중에서 본 글에서 설명하는 프로젝트는 사용자의 집에 설치되는 **스마트 디바이스인 동시에 중계서버** 역할을 수행하는 프로그램입니다. 개발 기간은 2개월이 소요되었으며 혼자 개발하였습니다.

## 시스템구성도

시스템 구성도는 다음 사진과 같습니다.

<img width="80%" alt="system" src="https://user-images.githubusercontent.com/33706043/130343583-30e0b663-9a81-4a5f-a311-4a678833899a.png">

중앙 API 서버 가 각 사용자의 중계서버에 요청을 하고 각 중계서버는 사용자의 요청에 맞게 내부망에 연결된 IOT 기기 들을 작동시키게 됩니다.
**API 서버에서 중계서버로의 요청은 HTTP** 요청을 사용하고 **중계서버에서 각 IOT 기기로의 요청은 MQTT** 프로토콜을 사용합니다.
또한 본 프로젝트에서 중계서버는 라즈베리파이 위에서 구동됩니다.

## 중계서버의 필요성

저희 팀은 프로젝트 초기부터 중계서버의 필요성에 대해 고민해 왔습니다.
초기에는 기기로의 통신을 모두 HTTP를 사용하였는데 웹 통신 특성상 외부에서 **하나의 호스트 주소로 여러 기기를 운용할 수 없다** 판단되어 중계서버를 도입해
내부망에서 각 중계서버들이 기기 관리하는 형식을 채택했습니다.
후에 MQTT를 도입한 이후에는 시스템 토폴로지에 대한 일부 제약이 사라져 중계서버 도입의 필요가 없어졌지만 저희 팀은 사용자의 집에 설치되는 **스마트 디바이스 제품 제작도 목표**로 삼았기 때문에 사용자가 사용하는 라즈베리 파이를 중계서버화 시켜서
기기와의 통신을 하는 것으로 결정지었습니다.

## 사용기술

<span>
<img alt="NodeJS" src ="https://img.shields.io/badge/NodeJS-339933.svg?&style=for-the-badge&logo=Node.js&logoColor=white"/>
</span>
<span>
<img alt="Express" src ="https://img.shields.io/badge/Express-001039.svg?&style=for-the-badge&logo=Express&logoColor=white"/>
</span>
<span>
<img alt="MySQL" src ="https://img.shields.io/badge/MySQL-4479a1.svg?&style=for-the-badge&logo=MySQL&logoColor=white"/>
</span>
<span>
<img alt="JWT" src ="https://img.shields.io/badge/JWT-291345.svg?&style=for-the-badge&logo=JsonWebTokens&logoColor=white"/>
</span>
<span>
<img alt="MQTT" src ="https://img.shields.io/badge/MQTT-3c5280.svg?&style=for-the-badge&logo=EclipseMosquitto&logoColor=white"/>
</span>
<span>
<img alt="Knex" src ="https://img.shields.io/badge/Knex-566179.svg?&style=for-the-badge&logo=Known&logoColor=white"/>
</span>
<span>
<img alt="SocketIO" src ="https://img.shields.io/badge/Socket.io-189472.svg?&style=for-the-badge&logo=Socket.io&logoColor=white"/>
</span>

1. **NodeJS - v15.11.0**

   - 중계서버는 NodeJS환경 위에서 실행됩니다.

2. **Express - v4.16.1**

   - Express 프레임워크를 이용하여 서버를 구성하였습니다.

3. **MySQL - v5.7.32**

   - 기기관련 정보를 저장하기 위해 MySQL DB를 사용하였습니다.

4. **JWT - v8.5.1**

   - 사용자 인증을위해 토큰인증방식을 채택하였으며 JsonWebToken을 사용하였습니다.

5. **MQTT(Ades-broker) -v0.46.0**

   - 각 IOT기기와의 통신을 위해 MQTT 프로토콜을 사용하였습니다.
   - 브로커는 Ades 브로커를 사용하였습니다.
   - Node 서버 시작 시 브로커도 같이 실행되도록 하였습니다.

6. **Knex(QueryBuilder) -v0.95.4**

   - DB쿼리를 실행하기위해 Knex 쿼리빌더를 사용하였습니다.

7. **Socket-io -v4.0.1**

   - 연결된 웹에 이벤트(인증코드 표출)를 발생시키기 위해 웹소켓을 사용하였습니다.

## 주요기능

서버의 여러 기능들중 주요기능은 다음과 같습니다.

> - [기기등록](#기기등록)
> - [기기동작요청](#기기동작요청)
> - [기기로그관리](#기기로그관리)
> - [사용자인증](#사용자인증)

추가로 중계서버는 **RESTful 하게** 설계하였습니다.

아래 사진은 API Document 입니다.

<img src = "https://github.com/ye0reum/ye0reum.github.io/blob/master/src/images/project-imgs/10plus-server/REST.png?raw=true" width="80%">

### **기기등록**

기기등록은 다음과 같은 단계를 거칩니다.

> 1. 초기에 IOT기기 전원작동시 내부망으로 UDP 메시지를 브로드캐스팅합니다.
> 2. 중계서버가 브로드캐스팅된 메시지를 받으면 중계서버의 Host주소를 메시지에 담아 응답합니다.
> 3. IOT기기가 중계서버의 Host 주소로 각 MQTT 토픽 구독과 발행을 진행합니다.
> 4. IOT기기가 발행한 정보에 따라 중계서버의 DB에 기기정보를 저장합니다.

기기등록기능과 관련된 MQTT

```
topic-name : registTopic
action : subscribe
message : 기기호스트,기기이름,기기전원갯수(구)
```

### **기기동작요청**

기기동작은 다음과 같은 단계를 거칩니다.

> 1. 중계서버가 특정 기기작동 웹 요청을 받았을때 MQTT 기기동작 토픽을 발행합니다.
> 2. IOT기기가 중계서버가 발행한 토픽에 대한 정보로 스위치를 작동시킵니다.
> 3. IOT기기가 현재 기기의 상태의 정보를 담아 토픽을 발행합니다.
> 4. 중계서버가 IOT기기의 현재 상태를 JSON형식으로 웹 요청에 대해 응답합니다.

기기동작기능과 관련된 MQTT

```
중계서버 -> IOT기기

topic-name : "기기호스트주소"/action
action : publish
message : 스위치번호
```

기기동작기능과 관련된 Http

```
웹서버 -> 중계서버

method : GET
url : device/action
request-header : x-access-token(token)
request-query : host,switch
response-body : success(boolean),device(object)
```

### **기기로그관리**

중계서버는 각 **기기상태가 변화할때마다** 다음과 같은 DB테이블에 상태를 저장합니다.

<img src = "https://github.com/ye0reum/ye0reum.github.io/blob/master/src/images/project-imgs/10plus-server/DB%ED%85%8C%EC%9D%B4%EB%B8%94.png?raw=true" width="80%">

DB 쿼리실행을 위해 쿼리빌더(Knex 라이브러리)를 사용하였습니다.

### **사용자인증**

사용자 인증방식은 **토큰기반 인증방식** 을 채택하였으며 **JsonWebToken** 을 사용하였습니다.
사용자 토큰 발급 은 다음과 같은 단계를 거칩니다.

> 1. 사용자가 장소등록을 할때 중계서버의 주소(디바이스 메인화면에 표출됨) 를 입력하여 요청합니다.
> 2. 요청을 받은 중계서버는 인증번호를 생성하고 연결된 웹에 인증코드 표출 이벤트를.
> 3. 사용자가 인증번호를 확인하고 입력하여 중계서버에 확인 요청을 보냅니다.
> 4. 인증코드가 정상적으로 확인될 경우 중계서버는 토큰을 담아 응답합니다.

위와같은 인증 절차를 사용한 이유는 **사용자가 집에 설치된 스마트디바이스** 만으로도 **로그인 없이**
연결된 각 IOT기기들을 사용할 수 있게 하기 위해 육안으로 인증번호를 확인하여 입력하는 방식을 채택하였습니다.  
이로써 사용자가 각 IoT기기들을 작동시킬수 있는 방법으로 두 가지 방법을 제공하게 되었습니다.

1. **웹 페이지에 접속해 로그인을 한 후 각 IoT 기기동작요청**
2. **집에 설치된 스마트디바이스(라즈베리파이) 로 각 IoT 기기동작요청**

아래 페이지의 이미지는 위의 단계를 나타낸 것 입니다.</br>

<img src = "https://github.com/ye0reum/ye0reum.github.io/blob/master/src/images/project-imgs/10plus-server/%EC%9D%B8%EC%A6%9D.png?raw=true" width="80%">

## 회고

> 본 프로젝트를 진행하면서 자연스럽게 웹 공부를 병행할 수 있었고  
> REST API, 토큰 기반 인증 방식 및 세션 기반 인증 방식에 대한 이해와 구현을 배울 수 있었습니다.  
> 또한 NodeJS에서의 여러 모듈 관리, 에러 처리 및 여러 가지 DB 접근 방식을 배우면서  
> API 서버 구축을 좀 더 알아갈 수 있는 계기가 되었고 사용자에게 더 나은 서비스를  
> 제공하기 위해 충분히 고민하며 MQTT 프로토콜을 적용하면서 문제해결력도 더욱 키울 수 있었습니다.
