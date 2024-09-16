# REST API Platform 통합 테스트 개선 프로젝트

이 프로젝트는 기존 통합 문서 뷰어의 테스트 과정에서 발생한 문제를 해결하기 위해 진행되었습니다. **API 요청의 예상 결과와 실제 결과 비교 기능**과 **Run 기록 확인 및 관리 기능**을 포함한 개선 작업이 이루어졌습니다. Postman의 장점을 흡수해 **사용자 친화적인 UI/UX**를 구현하고, **통합 테스트의 정확성과 효율성**을 높이기 위해 리팩토링을 진행했습니다.

## 사용 기술 스택
- **Frontend**: React, Typescript, Vite, MUI(Material-UI)
- **Backend**: Node.js, Express
- **아키텍처**: 도메인 주도 설계(DDD), 클린 아키텍처

## 리팩토링 전후 비교

### 리팩토링 전:
1. **기능 한계**
   - API 요청에 대한 응답 형식만으로 변환 성공 여부를 판단
   - 예상 결과와 실제 결과의 비교 기능 부족
2. **사용성 문제**
   - 테스트 기록 및 관리 기능 미흡
   - 작업 이력 관리가 어려워 사용자 경험 저하
3. **확장성 부족**
   - 통합 테스트 기능이 특정 포맷에만 제한
   - 다양한 포맷에 대한 테스트 확장이 어려움

### 리팩토링 후:
1. **비교 기능 추가**
   - 예상 결과와 실제 결과를 직관적으로 비교할 수 있는 기능 추가
   - 테스트 정확성 향상
2. **사용자 기록 관리 강화**
   - **Run History** 기능 추가로 테스트 실행 기록을 시간별로 확인 및 관리 가능
3. **확장성 강화**
   - **클린 아키텍처**와 **도메인 주도 설계(DDD)**를 도입하여 기능 확장과 유지보수 용이

## 향후 계획
- **Postman**과의 호환성 강화
- **PWA 구현** 및 내부 사용자용 무료 배포 목표




![REST_API_Platform_솔루션개발팀_공희진-01](https://github.com/user-attachments/assets/f6350e1c-fa33-4dd7-80a4-a8fe7dc61689)
![REST_API_Platform_솔루션개발팀_공희진-02](https://github.com/user-attachments/assets/5d4062ef-e8ee-42d9-86cd-627e1537e881)
![REST_API_Platform_솔루션개발팀_공희진-03](https://github.com/user-attachments/assets/f7074fad-5ded-480a-a390-b9a28c5c130c)
![REST_API_Platform_솔루션개발팀_공희진-04](https://github.com/user-attachments/assets/b46e616c-a3df-4e5b-9c87-e2be650cc886)
![REST_API_Platform_솔루션개발팀_공희진-05](https://github.com/user-attachments/assets/41c7b15e-99ed-4967-b763-82674c4799d0)
![REST_API_Platform_솔루션개발팀_공희진-06](https://github.com/user-attachments/assets/f76d183b-cb82-4f64-94b1-ccb1eecd4d64)
![REST_API_Platform_솔루션개발팀_공희진-07](https://github.com/user-attachments/assets/5f88a649-6dfd-4277-a6d1-ecc1bbb1c028)
![REST_API_Platform_솔루션개발팀_공희진-08](https://github.com/user-attachments/assets/eab289c6-a053-4bb2-bcbc-199a7b15dc8f)
![REST_API_Platform_솔루션개발팀_공희진-09](https://github.com/user-attachments/assets/28233fdb-da17-448e-a0ff-2760f6e6807b)
![REST_API_Platform_솔루션개발팀_공희진-10](https://github.com/user-attachments/assets/f530d4a3-d5ae-4b5a-b532-446da6fbbf04)
![REST_API_Platform_솔루션개발팀_공희진-11](https://github.com/user-attachments/assets/5d08c757-3866-41eb-9f3d-a3f849566562)
![REST_API_Platform_솔루션개발팀_공희진-12](https://github.com/user-attachments/assets/5e1de76e-34db-4b1c-ba70-f1566121c31e)
![REST_API_Platform_솔루션개발팀_공희진-13](https://github.com/user-attachments/assets/83183bc7-2268-4bd7-938d-56ee15c1813d)
![REST_API_Platform_솔루션개발팀_공희진-14](https://github.com/user-attachments/assets/3cdcb05b-a858-4bcc-a52b-0a1fbce94007)
![REST_API_Platform_솔루션개발팀_공희진-15](https://github.com/user-attachments/assets/64b8156a-f0fe-45cd-8d5a-ef7f05c3a104)
![REST_API_Platform_솔루션개발팀_공희진-16](https://github.com/user-attachments/assets/ae51f0b4-e95d-46c4-9578-9bdca39da505)
![REST_API_Platform_솔루션개발팀_공희진-17](https://github.com/user-attachments/assets/e9d8370c-2283-41da-b30b-81177f15a9da)
![REST_API_Platform_솔루션개발팀_공희진-18](https://github.com/user-attachments/assets/0229ec9f-a8c5-4ef4-96bf-5f0d42da1683)
![REST_API_Platform_솔루션개발팀_공희진-19](https://github.com/user-attachments/assets/fc45425f-58cc-46e1-bdc2-c328402759ca)
![REST_API_Platform_솔루션개발팀_공희진-20](https://github.com/user-attachments/assets/17aa3147-fc3c-4d9d-94a1-0a18ad78ee18)
![REST_API_Platform_솔루션개발팀_공희진-21](https://github.com/user-attachments/assets/7de8529a-bb93-4b7d-ac37-ddf4fa91e9d0)
![REST_API_Platform_솔루션개발팀_공희진-22](https://github.com/user-attachments/assets/60172d80-d22f-486e-8779-4820e2bbb783)
![REST_API_Platform_솔루션개발팀_공희진-23](https://github.com/user-attachments/assets/17442b00-7276-4aad-87f2-7062537e31ad)
![REST_API_Platform_솔루션개발팀_공희진-24](https://github.com/user-attachments/assets/54d71ae6-1764-49fe-ac4e-3b4424984e69)
![REST_API_Platform_솔루션개발팀_공희진-25](https://github.com/user-attachments/assets/f2d13345-fbd1-4f47-a5ab-9e3c63b754d5)
![REST_API_Platform_솔루션개발팀_공희진-26](https://github.com/user-attachments/assets/c3eeebe4-fac3-400b-ad33-7e8a0fb40c9e)
![REST_API_Platform_솔루션개발팀_공희진-27](https://github.com/user-attachments/assets/04670f61-64e9-4ecd-8930-c8e2bb63c14e)
![REST_API_Platform_솔루션개발팀_공희진-28](https://github.com/user-attachments/assets/c4f0f3aa-63da-4583-9462-9d4992c8921b)
![REST_API_Platform_솔루션개발팀_공희진-29](https://github.com/user-attachments/assets/d43fd062-de33-425b-98f1-de769ba6742d)
![REST_API_Platform_솔루션개발팀_공희진-30](https://github.com/user-attachments/assets/f5382cd4-2695-4bc4-ae91-9e781c6a131d)
![REST_API_Platform_솔루션개발팀_공희진-31](https://github.com/user-attachments/assets/0c996219-15a8-492c-9293-1bed79b7b62b)
![REST_API_Platform_솔루션개발팀_공희진-32](https://github.com/user-attachments/assets/65c515b2-5c16-4cb8-acb9-bd35b511eef4)
