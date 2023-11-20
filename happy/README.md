# HAPPY
PostMan과 유사한 Rest API Platform Front-End

## 1. Legal Information
Copyright (c) 2023. Hancom. All rights reserved.(http://www.hancom.com)

## 2. Project
### 2-1. Setup
```sh
npm i
```

### 2-2. Compile and Hot-Reload for Development
```sh
npm run dev
```

### 2-3. Compile for Production
```sh
# 일반 빌드
npm run build

# 특정 경로를 base로 설정하고 싶을 경우 아래와 같이 빌드
# 예 : localhost/happy를 base로 설정하기
npm run build -- --base="/happy"
```

### 2-4. Run Unit Tests with [Jest](https://jestjs.io/)
```sh
# 모든 테스트 실행
npm run test

# 특정 테스트만 실행
# 예 : test 혹은 describe 이름에 'save' 라는 키워드가 포함된 테스트만 실행 
npm run test -- -t 'save'
```
