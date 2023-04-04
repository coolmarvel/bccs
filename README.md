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

- **V1** (Contract)  
  \***\*컨트랙트\*\*** (작성, 컴파일, 배포)
- **V2** (Account, Network, Scan, Swap, Tx)  
  \***\*지갑\*\*** (복구키 생성, 지갑 생성, 내보내기, 가져오기, 등록하기)  
  \***\*네트워크\*\*** (지갑 별 블록체인 네트워크 추가)  
  \***\*트랜잭션 내역 조회\*\*** (이더리움, 폴리곤, 클레이튼만 가능) -> explorer 사이트 웹 크롤링  
  \***\*토큰스왑\*\*** (이더리움 계열만 가능) -> 유니스왑 사용  
  \***\*트랜잭션\*\*** (밸류 전송 및 조회, 대납 전송) -> 대납기능은 클레이튼에만 있음
- IPFS (Pin, Unpin)

## 2. Contract

Solidity를 활용하여 컨트랙트 작성 및 Truffle 프레임워크를 이용해 컴파일 및 배포

### 2-1-1. Installation

패키지 맨저로 npm 또는 yarn을 사용합니다.

```bash
npm install

or

yarn install
```

### 2-1-2. ENV Config

- MNEMONIC (복구키)

```bash
MNEMONIC="YOUR_MNEMONIC"
```

- PRIVATEKEY (지갑 비밀키)

```bash
PRIVATE_KEY="YOUR_PRIVATEY"
```

복구키와 비밀키를 선언해야 컨트랙트를 배포할 수 있습니다. (로컬 가나슈 테스트넷 제외)

### 2-1-3. Usage

- 테스트넷 배포시

#####

**./truffle-config.js**

#####

module.exports 객체안에

```bash
"contracts_build_directory": "./build/baobab/contracts"
```

를 명시 후 터미널에 아래 명령어 입력

```bash
truffle migrate --network baobab
```

- 메인넷 배포시

```bash
"contracts_build_directory": "./build/cypress/contracts"
```

를 명시 후 터미널에 아래 명령어 입력

```bash
truffle migrate --network cypress
```

이미 상용서버에는 배포된 파일이 있으므로 가나슈 로컬 네트워크에서 테스트 진행 요망

### 2-1-4. Owner

상용서버에는 이미 배포된 컨트랙트가 있습니다. 절대 지우시면 안됩니다.

#####

**상용서버에 배포한 지갑 정보**

- 지갑 주소

```bash
address="0xadc565Bb88aA72aa14b98Cb6196f216900614b3c"
```

- 지갑 비밀키

```bash
privateKey="0xa58f34a8853bde661ca77ad884faf3d355ebb1a54dc9ccab007f89e4b33cda8e"
```

- 복구키

```bash
mnemonic="another recipe eyebrow direct blade universe brush clay retire where crush spider"
```
