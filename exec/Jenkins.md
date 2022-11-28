# Jenkins 설정 방법

1. 서버에 도커 설치 
2. 도커로 젠킨스 설치 및 셋업
    
    ```bash
    sudo docker run -d -p 8085:8080 \
    -v /var/run/docker.sock:/var/run/docker.sock \
    --restart always \
    --name jenkins \
    -e TZ=Asia/Seoul \
    jenkins/jenkins:lts
    ```
    
    ```bash
    -d : 백그라운드에서 실행
    -p {호스트포트}:{컨테이너포트} : 포트포워딩
    -v {호스트폴더경로}:{컨테이너폴더경로} : 호스트와 컨테이너의 폴더 공유 
    --restart always : 서버가 재시작되도 자동으로 실행
    --name {컨테이너이름} : 컨테이너의 이름 설정
    -e TZ=Asia/Seoul : 컨테이너의 시간대 설정
    ```
    
    - 볼륨 설정해야 젠킨스 컨테이너에서 호스트 도커에 접근할 수 있음
3. 브라우저로 젠킨스 웹 UI 접속
    - ip:8085
4. 초기 패스워드 입력
    1. 젠킨스 컨테이너 진입
        - `sudo docker exec -it -u root jenkins /bin/bash`
    2. 초기 패스워드 확인
        - `cat /var/jenkins_home/secrets/initialAdminPassword`
5. 젠킨스 컨테이너 안에서 호스트의 도커를 사용할 수 있도록 도커 설치
    1. X86 64bit의 경우
        
        ```bash
        apt-get update && \
        apt-get upgrade && \
        apt-get -y install apt-transport-https \
             ca-certificates \
             curl \
             gnupg2 \
             software-properties-common && \
        curl -fsSL https://download.docker.com/linux/$(. /etc/os-release; echo "$ID")/gpg > /tmp/dkey; apt-key add /tmp/dkey && \
        add-apt-repository \
           "deb [arch=amd64] https://download.docker.com/linux/$(. /etc/os-release; echo "$ID") \
           $(lsb_release -cs) \
           stable" && \
        apt-get update && \
        apt-get -y install docker-ce
        ```
        
    2. ARM 64bit의 경우
        
        ```bash
        apt-get update && \
        apt-get upgrade && \
        apt-get -y install apt-transport-https \
             ca-certificates \
             curl \
             gnupg2 \
             software-properties-common && \
        curl -fsSL https://download.docker.com/linux/$(. /etc/os-release; echo "$ID")/gpg > /tmp/dkey; apt-key add /tmp/dkey && \
        add-apt-repository \
           "deb [arch=arm64] https://download.docker.com/linux/$(. /etc/os-release; echo "$ID") \
           $(lsb_release -cs) \
           stable" && \
        apt-get update && \
        apt-get -y install docker-ce
        ```
        
6. 젠킨스 컨테이너 안에서 docker 정상 설치됐는지 확인
    1. `docker ps`
7. sudo 없이 docker 명령어 사용하기 위해 도커 그룹에 유저 추가 / 호스트에서
    1. `sudo usermod -aG docker ubuntu`
    2. `sudo usermod -aG docker {userid}`
8. 젠킨스 웹에서 깃랩 플러그인 설치
9. 깃랩 인증키 설정
    1. [https://be-developer.tistory.com/14](https://be-developer.tistory.com/14)
10. 젠킨스 ↔ 깃랩 연결
    1. [https://aamoos.tistory.com/365](https://aamoos.tistory.com/365)
11. 깃랩 푸시 시 웹훅으로 연결
    1. [https://velog.io/@psystar99/깃랩과-젠킨스-연동](https://velog.io/@psystar99/%EA%B9%83%EB%9E%A9%EA%B3%BC-%EC%A0%A0%ED%82%A8%EC%8A%A4-%EC%97%B0%EB%8F%99)
12. 빌드 설정 
    1. **Execute shell / Backend**
        
        ```bash
        cd backend
        chmod +x gradlew
        ./gradlew build
        docker login -u "docker아이디" -p "docker비밀번호" docker.io
        docker build -t honorable110/springboot:latest .
        docker push honorable110/springboot:latest
        docker stop A306_Backend && docker rm A306_Backend;
        docker run -d -p 8080:8080 --name A306_Backend honorable110/springboot:latest
        ```
        
    2. **Execute shell / Frontend**
        
        ```bash
        cd frontend
        docker login -u "docker아이디" -p "docker비밀번호" docker.io
        docker build -t honorable110/react:latest .
        docker push honorable110/react:latest
        docker stop A306_Frontend && docker rm A306_Frontend;
        docker run -d -p 3000:80 --name A306_Frontend honorable110/react:latest
        # 이전 이미지(<none>) 삭제
        docker rmi -f $(docker images -f "dangling=true" -q)
        ```
        
    - docker login, docker push
        - docker hub 레포지토리에 업로드 하기 위함이므로 필요에 따라 빼는것도 가능

---

## Issue

1. 젠킨스에서 빌드 시 아래와 같은 권한 에러 발생
    
    <aside>
    🚨 Got permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock: Get "http://%2Fvar%2Frun%2Fdocker.sock/v1.24/containers/json": dial unix /var/run/docker.sock: connect: permission denied
    
    </aside>
    
    1. 원인 : 빌드시 동작하는 “jenkins” 유저의 권한 문제
    2. 해결 방법
        1. 젠킨스 컨테이너에 root 유저로 접속하여 /var/run/docker.sock의 권한 부여
            1. 호스트에서 젠킨스 컨테이너로 접속
            `docker exec -it -u root jenkins /bin/bash`
            2. 젠킨스 컨테이너 안에서 권한 부여
            `chmod 666 /var/run/docker.sock`
        2. crontab 사용하여 부팅, 리붓 시 자동으로 /var/run/docker.sock의 권한 부여
            1. 호스트에서 크론탭 설정
            `sudo crontab -e`
            2. 크론탭 맨아래 아래 추가후 리붓
            `@reboot sudo chmod 666 /var/run/docker.sock`
            
2. 위와 같은 에러가 발생할 경우
    
    <aside>
    🚨 Got permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock: Get "http://%2Fvar%2Frun%2Fdocker.sock/v1.24/containers/json": dial unix /var/run/docker.sock: connect: permission denied
    
    </aside>
    
    1. `sudo chmod 666 /var/run/docker.sock`

---