# BCCS 헥슬란트 클론 코딩 (프로토타입)

BCCS는 Node.js(Express.js) 기반 서버입니다.

## 1. Server

### 1-1-1. Installation

패키지 매니저로 npm 또는 yarn을 사용합니다.

```bash
cd server

npm install

or

yarn install
```

### 1-1-2. ENV Config

- PORT 변수의 값을 변경하여 서버의 포트를 정의할 수 있습니다.

### 1-1-3. Usage

```bash
npm start

or

yarn start
```

### 1-2-1. 서비스 구조

- **V1** (Contract)  
  ***컨트랙트*** (작성, 컴파일, 배포)
- **V2** (이더리움 계열 Account, Network, Scan, Swap, Tx)  
  ***지갑*** (복구키 생성, 지갑 생성, 내보내기, 가져오기, 등록하기)  
  ***네트워크*** (지갑 별 블록체인 네트워크 추가)  
  ***트랜잭션 내역 조회*** (이더리움, 폴리곤, 클레이튼만 가능) -> explorer 사이트 웹 크롤링  
  ***토큰스왑*** (이더리움 계열만 가능) -> 유니스왑 사용  
  ***트랜잭션*** (밸류 전송 및 조회, 대납 전송, 수수료 조회) -> 대납기능은 클레이튼에만 있음  
  **V3** (비트코인 계열 Account, Tx) -> 사용 못함  
  ***지갑*** (지갑 생성, 등록)  
  **V4** (커스텀 토큰(ERC20) 가져오기, 밸류 전송 및 조회, 수수료 조회, 대납 전송)  
    -> 대납기능은 클레이튼의 커스텀 토큰만 가능

## 2. API 테스트 방법

### 2-1-1. Installation

postman: [https://www.postman.com/downloads/] 다운로드

### 2-1-2. IP & PORT Config

- Localhost
```bash
http://localhost:${port}/api
```
- DevServer
```bash
http://10.10.10.148:${port}/api
```
- ProdServer
```bash
http://3.39.180.120:${port}/api
```
상용서버(Prod)는 클라이언트 포트를 제외하고 다 인바운드를 닫아서 테스트 못함.

### 2-1-3. Usage

- 블록체인과 통신하는 API는 무조건 req.headers(체인ID)를 설정해야함
```bash  
예시 (클레이튼과 통신할 경우)

x-chain-id="1001"
```
- 밸런스 및 토큰뿐 아니라 블록체인에 트랜잭션을 발생하는 API는 충분한 밸런스를 가지고 있어야 함.