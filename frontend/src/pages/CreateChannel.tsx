/* eslint-disable */
// import BasicSelect from '../components/common/Select';
import { Link, Outlet, useNavigate, useLocation, Route } from 'react-router-dom';
import axios from 'axios'

import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MobileStepper from '@mui/material/MobileStepper';
import {Paper, Modal, DialogTitle, Dialog, DialogContent, DialogActions} from '@mui/material';
import Typography from '@mui/material/Typography';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

import Input from "@mui/material/Input";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import styled from "@emotion/styled";
import {Button, Grid} from "@mui/material/";

import "./Signup.css";
import "./modules/Gamestart.css";
  
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Connection, OpenVidu, Publisher, Session, StreamManager, Subscriber } from "openvidu-browser";
import "../components/openvidu/App.css";
import Messages from "../components/openvidu/Messages";
import UserVideoComponent from "../components/openvidu/UserVideoComponent";

import MicOutlinedIcon from "@mui/icons-material/MicOutlined";
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SendIcon from '@mui/icons-material/Send';
import HelpIcon from '@mui/icons-material/Help';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';

import Swal from "sweetalert2";
import GamestartMain from "./modules/GamestartMain"
import AlertPage from "./modules/AlertPage";
import ScoreRate from "./modules/ScoreRate";

const OPENVIDU_SERVER_URL = process.env.REACT_APP_OPENVIDU_SERVER_URL;
const OPENVIDU_SERVER_SECRET = process.env.REACT_APP_OPENVIDU_SERVER_SECRET;
const BE_URL = process.env.REACT_APP_BACKEND_URL;

const INITIAL_TIME = 60;

const steps = [
  {
    label: '게임을 선택해주세요',
    choice: ['몸으로 말해요', '골든벨', '고요 속의 외침', '라이어 게임']
  },
  {
    label: '개인전/팀전을 선택해주세요',
    choice: ['개인전', '팀전']
  },
  {
    label: '카테고리와 라운드를 선택해주세요',
    choice: ['카테고리', '라운드'],
  },
];

function SwipeableTextMobileStepper() {
  const [selectData, setSelectData] = useState([
    // [],
    new Array(),
    new Array(
      {id:5, name: 5},
      {id:10, name: 10},
      {id:15, name: 15},
      {id:20, name: 20}
    )
    // [5, 10, 15, 20], // round 문자열 -> 숫자로 변경
  ])
  const [category, setCategory] = useState('')
  const [round, setRound] = useState(0)
  
  const [info, setInfo] = useState<string[]>([]);
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = steps.length;
  const colors = ['orange', 'green', 'yellow', 'red'];

  const [accessToken, setAccessToken] = useState<string>("");

  const navigate = useNavigate();
  const location = useLocation();

  const [OV, setOV] = useState<OpenVidu | null>(null);
  const [mySessionId, setMySessionId] = useState<string | null>("");
  const [myUserName, setMyUserName] = useState<string>("");
  const [session, setSession] = useState<Session | undefined>(undefined);
  const [mainStreamManager, setMainStreamManager] = useState<Publisher | undefined>(undefined);
  const [publisher, setPublisher] = useState<Publisher | undefined>(undefined);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [streamManagers, setStreamManagers] = useState<StreamManager[]>([]);
  const [currentVideoDeviceId, setCurrentVideoDeviceId] = useState<string | undefined>("");
  const [myConnectionId, setMyConnectionId] = useState<string>("");
  const [examinerId, setExaminerId] = useState<string>("");
   
  const [audiostate, setAudiostate] = useState<boolean>(true);
  const [audioallowed, setAudioallowed] = useState<boolean>(true);
  const [videostate, setVideostate] = useState<boolean>(true);
  const [videoallowed, setVideoallowed] = useState<boolean>(true);
     
  const [messages, setMessages] = useState<object[]>([]);
  const [message, setMessage] = useState<string>("");

  const [joinLink, setJoinLink] = useState<string>("");

  let [subjectName, setSubjectName] = useState<string>("");
  let [answer, setAnswer] = useState<string[]>([]);
  let [examiners, setExaminers] = useState<string[]>([]);
  let [subjects, setSubjects] = useState<string[]>([]);
  let [scores, setScores] = useState<number[]>([]);

  let [isPlaying, setIsPlaying] = useState<boolean>(false);
  let [currentRound, setCurrentRound] = useState<number>(0);
  let [timer, setTimer] = useState<number>(0);
  let [categoryName, setCategoryName] = useState<string>("");

  const [isExaminer, setIsExaminer] = useState<boolean>(false);
  const [participantList, setParticipantList] = useState(new Map());
  const [correctorName, setCorrectorName] = useState<string>("");

  const getParticipantList = (channelId: string) => {
    axios.get(`${BE_URL}/api/channels/info/${channelId}`)
    .then((res) => {
      let temp = res.data.participantList;
        
      temp.map((object: { nickName: ""; channelId: ""; connectionId: "" }) => {
        setParticipantList((prev)=> new Map(prev).set(object.connectionId, object.nickName));
      });
    });
  };
  const emptyAllOV = () => {
    setOV(null);
    setSession(undefined);
    setSubscribers([]);
    setStreamManagers([]);
    setMySessionId("");
    setMyUserName("");
    setMainStreamManager(undefined);
    setPublisher(undefined);
  }
  //닉네임 확인
  const [nickName, setNickName] = useState<string>("");

  //에러메시지 저장
  const [nickNameError, setNickNameError] = useState<string>("");

  // 유효성 검사
  const [isNickName, setIsNickName] = useState<boolean>(false);

  // 닉네임 중복 체크
  const [usableNickName, setUsableNickName] = useState<boolean>(false);

  const [hostName, sethostName] = useState<string>("");

  const [isGamestart, setIsGamestart] = useState<boolean>(false);
  const [isGameover, setIsGameover] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [isRoundover, setIsRoundover] = useState<boolean>(false);
  const [scoreMarks, setScoreMarks] = useState<string>("");
  const [scoreExaminers, setScoreExaminers] = useState<string>("");
  const [isRank, setIsRank] = useState<boolean>(false);
  

  const didMount = useRef(false);
  const scrollRef = useRef<null|HTMLDivElement>(null);


  useEffect(() => {
    let token = localStorage.getItem("access-token");
    //토큰이 없으면 api호출안함
    if (!token) return;
    setAccessToken(token as string);

    // 전체 문제집 조회
    axios.get(`${BE_URL}/subjects`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      const copy = [...selectData]
      res.data.data.map((d: any, i: any) => (
        // copy[0].push(d.subject_name)
        copy[0].push({name : d.subject_name, id : d.subject_set_id})
      ))
      setSelectData(copy)
      
      // category, round에 기본 값 부여
      setCategory(copy[0][0].id);
      setCategoryName(copy[0][0].name);
      setRound(copy[1][0].id);
    });
    //닉네임 가져와서 세팅
    axios.get(`${BE_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      setMyUserName(res.data.userNickName);
    });
  }, [])

  useEffect(() => {
      // --- 2) Init a session ---
      setSession(OV?.initSession());
    }, [OV]);
    
    // 세션 받아오고 들어가는 로직
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    // leaveSession에는 동작하면 안됨
    if (session == null) {
      return;
    }
    var mySession = session;

    // --- 3) Specify the actions when events take place in the session ---

    // On every new Stream received...
    mySession?.on("streamCreated", (event : any) => {
      // Subscribe to the Stream to receive it. Second parameter is undefined
      // so OpenVidu doesn't create an HTML video by its own
      var subscriber = mySession?.subscribe(event.stream, "undefined");
      // Update the state with the new subscribers
      subscribers.push(subscriber);
      setSubscribers([...subscribers]);
      streamManagers.push(subscriber);
      setStreamManagers([...streamManagers]);
    });

    // On every Stream destroyed...
    mySession?.on("streamDestroyed", (event: any) => {
      if (event.reason !== "disconnect") {
        //비정상적으로 연결끊긴 참가자 쫒아내기
        kickParticipant(event.stream.connection.connectionId);
      }
      // Remove the stream from 'subscribers' array
      deleteSubscriber(event.stream.streamManager);
    });

    // On every asynchronous exception...
    mySession?.on("exception", (exception) => {
      console.warn(exception);
    });

    mySession?.on("sessionDisconnected", (event: any) => {
      Swal.fire({
        title: "Oops...",
        text: "서버와의 접속이 끊어졌습니다",
        icon: "error",
      });
    });

    // --- 4) Connect to the session with a valid user token ---

    // 'getToken' method is simulating what your server-side should do.
    // 'token' parameter should be retrieved and returned by your own backend
    getToken().then((token) => {
      // First param is the token got from OpenVidu Server. Second param can be retrieved by every user on event
      // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
      mySession?.connect(String(token), { clientData: myUserName })
        .then(async () => {
          var devices = await OV?.getDevices();
          var videoDevices = devices?.filter(
            (device) => device.kind === "videoinput"
          );

          // --- 5) Get your own camera stream ---

          // Init a publisher passing undefined as targetElement (we don't want OpenVidu to insert a video
          // element: we will manage it on our own) and with the desired properties
          let videoDevice = undefined;
          if (videoDevices && videoDevices?.length > 1) {
            videoDevice = videoDevices?.[0].deviceId;
            setCurrentVideoDeviceId(videoDevice);
          }

          let publisher = OV?.initPublisher("", {
            audioSource: undefined, // The source of audio. If undefined default microphone
            videoSource: videoDevice, // The source of video. If undefined default webcam
            publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
            publishVideo: true, // Whether you want to start publishing with your video enabled or not
            resolution: "640x480", // The resolution of your video
            frameRate: 30, // The frame rate of your video
            insertMode: "APPEND", // How the video is inserted in the target element 'video-container'
            mirror: false, // Whether to mirror your local video or not
          });

          // --- 6) Publish your stream ---

          mySession?.publish(publisher as Publisher);

          // Set the main video in the page to display our webcam and store our Publisher
          setMainStreamManager(publisher);
          setPublisher(publisher);
          streamManagers.push(publisher as StreamManager)
          setStreamManagers([...streamManagers])
        })
        .catch((error: any) => {
          console.log(
            "There was an error connecting to the session:",
            error.code,
            error.message
          );
        });
    });

  }, [session]);

  useEffect(() => {
    const mySession = session;

    mySession?.off("signal:gamestart");
    mySession?.on("signal:gamestart", (event: any) => {
      let parsedData = event.data.split(',');
      setSubjectName(parsedData[1]);
      setRound(parsedData[0]);
      setIsPlaying(true);
      setIsGamestart(true);
      setTimeout(() => {
        setIsGamestart(false);
      }, 5000);
    })

    mySession?.off("signal:gameover");
    mySession?.on("signal:gameover", (event: any) => {
      setIsPlaying(false);
      setIsCorrect(false);
      setIsRoundover(false);
      setIsGameover(true);
      setTimer(-1);
      setTimeout(() => {
        setIsGameover(false);
      }, 5000);
    })

    mySession?.off("signal:rank");
    mySession?.on("signal:rank", (event: any) => {
      let parsedData = event.data.split('|');
      setScoreMarks(parsedData[0]);
      setScoreExaminers(parsedData[1]);
      setIsRank(true);
      setTimeout(() => {
        setIsRank(false);
      }, 10000);
    })

  }, [session]);

  useEffect(() => {
    const mySession = session;

    mySession?.off("signal:chat");
    mySession?.on("signal:chat", (event : any) => {
      let chatdata = event.data.split(",");
      if(isPlaying == true) { // 현재 게임 중일 때
        if(chatdata[1] == subjects[currentRound]) { // 나온 채팅이 현재 라운드의 정답과 같다면
          scores[examiners.indexOf(event.from.connectionId)]++ // 맞춘 사람 점수++
          console.log("Correct!!")
          setScores(scores); // scores 갱신
          setTimer(-1);
          sendSignalCorrect(event.from.connectionId); // 맞췄다고 시그널
        }
      }
      if (chatdata[0] !== myUserName) {
        setMessages([
            ...messages,
            {
              userName: chatdata[0],
              text: chatdata[1],
              boxClass: "messages__box--visitor",
            },
          ],
        );
      }
    });
  }, [session, messages, isPlaying, currentRound, subjects, examiners, scores]);

  // 게임 시작할 때 최대 라운드 수도 함께 
  const sendSignalGameStart = () => {
    session?.signal({
      data: String(round)+","+categoryName,
      to: [],
      type: "gamestart"
    })
  }

  useEffect(() => {
    const mySession = session;
    mySession?.off("signal:word");
    mySession?.on("signal:word", (event: any) => {
      setIsCorrect(false);
      setIsRoundover(false);
      handleSignalWord(event)
    })
  // }, [session, myConnectionId, audiostate, videostate, isPlaying])
  }, [session, myConnectionId, audiostate, videostate, isPlaying, subjects, examiners])

  const sendSignalTimer = (time: number) => {
    session?.signal({
      data: String(time),
      to: [],
      type: "time"
    });
  }

  useEffect(() => {
    if (timer == 0) {
      sendSignalRoundOver();
      return;
    }

    if(timer == -1) {
      return;
    }

    const tt = setInterval(() => {
      sendSignalTimer(timer);
      setTimer(--timer);
    }, 1000);

    return () => {
      clearInterval(tt);
    }
  }, [timer])

  useEffect(() => {
    session?.off("signal:time")
    session?.on("signal:time", (event: any) => {
      console.log(event.data);
    })
  }, [session])

  // connectionId라는 connection id를 갖는 참가자가 맞췄다고 signal
  const sendSignalCorrect = (connectionId: string) => {

    const nickname = participantList.get(connectionId);

    session?.signal({
      data: connectionId + "," + nickname,
      to: [],
      type: "correct"
    })
  }

  useEffect(() => {
    session?.off("signal:correct"); 
    session?.on("signal:correct", (event: any) => { // correct 시그널이 오면
      setCorrectorName(event.data.split(",")[1]);
      setIsCorrect(true);
      if(currentRound < round-1) { // 아직 round가 남았다면
        setCurrentRound(++currentRound); // round 증가시키고
        setTimeout(() => {
          setTimer(INITIAL_TIME); 
          giveWordToExaminer(currentRound)
        }, 3000);
      } else { // round가 다 끝났다면
        setIsPlaying(false); // 게임 종료
        setTimeout(() => {
          sendSignalGameOver(); // 게임 종료됐다는 시그널
        }, 3000);
        // setCurrentRound(0); // 라운드 0으로 초기화
        return;
      }
    }) 
  }, [session, subjects, examiners, currentRound])

  // round가 끝났다는 시그널
  const sendSignalRoundOver = () => {
    session?.signal({
      data: "round over",
      to: [],
      type: "roundover"
    });
  }

  useEffect(() => {
    session?.off("signal:roundover");
    session?.on("signal:roundover", (event: any) => { // roundover 시그널을 받았을 때
      if(isCorrect == true) {
        setIsCorrect(false);
        return;
      }

      setIsRoundover(true);
      
      if(currentRound < round-1) { // 아직 round가 남았다면
        setCurrentRound(++currentRound); // round 증가시키고
        console.log("round:"+currentRound);
        setTimeout(() => {
          setTimer(INITIAL_TIME); // timer 초기화
          giveWordToExaminer(currentRound); // 다음 출제자에게 문제 전달
        }, 3000);
      } else { // round가 다 끝났다면
        setIsPlaying(false); // 게임 종료
        sendSignalGameOver(); // 게임 종료됐다는 시그널
        setCurrentRound(0); // 라운드 0으로 초기화
        return;
      }
    })
  }, [session, isCorrect, currentRound, subjects, examiners])

  useEffect(() => {
    // 참가자 닉네임과 커넥션을 받아옴
    if (streamManagers.length === 0) {
      return;
    }
    // 서버와 동기되는 시간 유예
    setTimeout(() => {
      getParticipantList(mySessionId as string);
    }, 1000);
  }, [streamManagers])

  const sendSignalGameOver = () => {
    let result: string = '';

    for(let score of scores) {
      result += score+","
    }
    result = result.slice(0, -1) + "|";

    for(let conId of examiners) {
      result += conId+","
    }
    result = result.slice(0, -1);

    session?.signal({
      to: [],
      type: "gameover"
    })

    setTimeout(() => {
      session?.signal({
        data: result,
        to: [],
        type: "rank"
      })
    }, 5000)
  }

  const handleSignalWord = (event: any) => {
    const answer = event.data.split(",")[0];
    const examinerId = event.data.split(",")[1];
    setAnswer(answer)
    setCurrentRound(event.data.split(",")[2])
    setExaminerId(examinerId)
    if (examinerId === myConnectionId) { // 내가 출제자라면
      // 카메라를 키고 카메라를 끄지 못하도록.
      if(!videostate) {
        reverseVideoState()
      }
      // 마이크를 끄고 마이크를 키지 못하도록.
      if(audiostate) {
        reverseAudioState()
      }
      setIsExaminer(true);
    } else { // 내가 출제자가 아니라면
      setIsExaminer(false);
      console.log("I'm not examiner")
    }
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const choice = (e: string) => {
    let copy: string[] = [...info]
    copy.push(e)
    setInfo(copy)
    handleNext()
  }

  const back = () => {
    let copy: string[] = [...info]
    copy.pop()
    setInfo(copy)
    handleBack()
  }

  const toHome = () => {
    <Link to = '/'></Link>
  }

  const sendMessageByClick = () => {
    if(isExaminer === true) {
      Swal.fire({
        icon: "warning",
        title: "Sorry...",
        text: "출제자는 채팅을 칠 수 없습니다.",
        timer: 1000,
      });
    } else {
      if (message !== "") {
        setMessages(
          [
            ...messages,
            {
              userName: myUserName,
              text: message,
              boxClass: "messages__box--operator",
            },
          ],
        );
        setMessage("");
        const mySession = session;

        mySession?.signal({
          data: `${myUserName},${message}`,
          to: [],
          type: "chat",
        });
      }
    }
  }

  const sendMessageByEnter = (e : any) => {
    if(isExaminer === true) {
      Swal.fire({
        icon: "warning",
        title: "Sorry...",
        text: "출제자는 채팅을 칠 수 없습니다.",
        timer: 1000,
      });
    } else {
      if (e.key === "Enter") {
        if (message !== "") {
          setMessages([
              ...messages,
              {
                userName: myUserName,
                text: message,
                boxClass: "messages__box--operator",
              },
            ],
          );
          setMessage("");
          const mySession = session;

          mySession?.signal({
            data: `${myUserName},${message}`,
            to: [],
            type: "chat",
          });

        }
      }
    }
  }


  const handleChatMessageChange = (e : any) => {
    setMessage(e.target.value);
  }
  // chatting

  const componentDidMount = () => {
    window.addEventListener("beforeunload", onbeforeunload);
  }

  const componentWillUnmount = () => {
    window.removeEventListener("beforeunload", onbeforeunload);
  }

  const onbeforeunload = (event : any) => {
    leaveSession();
  }

  const handleChangeSessionId = (e: any) => {
    setMySessionId(e.target.value);
  }

  const handleChangeUserName = (e : any) => {
    setMyUserName(e.target.value);
  }

  const handleMainVideoStream = (stream : any) => {
    if (mainStreamManager !== stream) {
      setMainStreamManager(stream);
    }
  }

  const deleteSubscriber = (streamManager : any) => {
    let varSubscribers = subscribers;
    let index = varSubscribers.indexOf(streamManager, 0);
    if (index > -1) {
      varSubscribers.splice(index, 1);
      setSubscribers(varSubscribers);
    }
    let varStreamMangers = streamManagers;
    let index2 = varStreamMangers.indexOf(streamManager, 0);
    if (index2 > -1) {
      varStreamMangers.splice(index2, 1);
      setStreamManagers(varStreamMangers);
    }
  }
  // 호스트 백엔드에 등록
  const recordParticipant = (conId : string) => {
    const requestBody = JSON.stringify({
      connectionId: conId,
      nickName: myUserName,
    });
    axios
      .put(`${BE_URL}/api/channels/generate/${mySessionId}`, requestBody, {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
  }

  const joinSession = () => {
    // --- 1) Get an OpenVidu object ---
    setOV(new OpenVidu());
  }

  const leaveSession = () => {
    axios
      .post(`${BE_URL}/api/channels/leave/${mySessionId}`,
        {
          nickName: myUserName,
          connectionId: myConnectionId,
        })
      .then((res) => {
        console.log("방 나가기 성공");
      })
      .catch((e) => {
        console.log("방 나가기 실패");
      })
      .finally(() => {
        deleteSession();
        navigate("/")
      });
    
    // --- 7) Leave the session by calling 'disconnect' method over the Session object ---

    const mySession = session;

    if (mySession) {
      mySession?.disconnect();
    }

    // Empty all properties...
    emptyAllOV();

  }

  const deleteSession = () => {
    axios
      .delete(`${BE_URL}/api/channels/delete/${mySessionId}`,
        {
          data : {
            nickName: myUserName,
            connectionId: myConnectionId,
          } 
        })
      .then((res) => {
        console.log("방 삭제 성공");
      })
      .catch((e) => {
        console.log("방 삭제 실패");
      });
    
    axios
    .delete(OPENVIDU_SERVER_URL + `/sessions/${mySessionId}`, {
      headers: {
        Authorization: "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
        "Content-Type": "application/json",
      },
    });
  }

  const kickParticipant = (conId : string) => {
    axios
      .post(`${BE_URL}/api/channels/kick/${mySessionId}`,
        {
          nickName: "",
          connectionId: conId,
        })
      .then((res) => {
        console.log("강제 퇴장 성공");
      })
      .catch((e) => {
        console.log("강제 퇴장 실패");
      });
  }

  const switchCamera = async() => {
    try {
      const devices = await OV?.getDevices();
      var videoDevices = devices?.filter(
        (device) => device.kind === "videoinput"
      );
      if (videoDevices && videoDevices.length > 1) {
        var newVideoDevice = videoDevices.filter(
          (device) => device.deviceId !== currentVideoDeviceId
        );

        if (newVideoDevice.length > 0) {
          // Creating a new publisher with specific videoSource
          // In mobile devices the default and first camera is the front one
          setCurrentVideoDeviceId(newVideoDevice[0].deviceId);
          var newPublisher = OV?.initPublisher("", {
            videoSource: newVideoDevice[0].deviceId,
            publishAudio: true,
            publishVideo: true,
            mirror: true,
          });
          await session?.unpublish(mainStreamManager as Publisher);
          await session?.publish(newPublisher as Publisher);
          setMainStreamManager(newPublisher);
          setPublisher(newPublisher);
        }
      }
    } catch (e : any) {
      console.error(e);
    }
  }

  /**
   * --------------------------
   * SERVER-SIDE RESPONSIBILITY
   * --------------------------
   * These methods retrieve the mandatory user token from OpenVidu Server.
   * This behavior MUST BE IN YOUR SERVER-SIDE IN PRODUCTION (by using
   * the API REST, openvidu-java-client or openvidu-node-client):
   *   1) Initialize a Session in OpenVidu Server	(POST /openvidu/api/sessions)
   *   2) Create a Connection in OpenVidu Server (POST /openvidu/api/sessions/<SESSION_ID>/connection)
   *   3) The Connection.token must be consumed in Session.connect() method
   */

   const getToken = () => {
     return createSession(mySessionId as string).then((sessionId) => 
      createToken(sessionId as string)     
    );
  }

  const createSession = (sessionId : string) => {
    return new Promise((resolve, reject) => {
      var data = JSON.stringify({ customSessionId: sessionId });
      axios
        .post(OPENVIDU_SERVER_URL + "/sessions", data, {
          headers: {
            Authorization:
              "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          resolve(response.data.id);
        })
        .catch((response) => {
          var error = Object.assign({}, response);
          if (error?.response?.status === 409) {
            resolve(sessionId);
          } else {
            console.log(error);
            console.warn(
              "No connection to OpenVidu Server. This may be a certificate error at " +
                OPENVIDU_SERVER_URL
            );
            if (
              window.confirm(
                'No connection to OpenVidu Server. This may be a certificate error at "' +
                  OPENVIDU_SERVER_URL +
                  '"\n\nClick OK to navigate and accept it. ' +
                  'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' +
                  OPENVIDU_SERVER_URL +
                  '"'
              )
            ) {
              window.location.assign(
                OPENVIDU_SERVER_URL + "/accept-certificate"
              );
            }
          }
        });
    });
  }

  const createToken = (sessionId: string) => {
    generateJoinLink(sessionId as string);
    return new Promise((resolve, reject) => {
      var data = {};
      axios
        .post(
          OPENVIDU_SERVER_URL + "/sessions/" + sessionId + "/connection",
          data,
          {
            headers: {
              Authorization:
                "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          setMyConnectionId(response.data.id);
          //TODO: setMyConnectionId가 늦게 작동하는 문제 해결 필요
          //임시로 connectionId를 인자로 넘겨주어 해결
          recordParticipant(response.data.id);
          resolve(response.data.token);
        })
        .catch((error) => reject(error));
    });
  }

  //방생성 요청
  const handleCreateRoom = (event : any) => {
    event.preventDefault();

    createRandomSessionId().then(() => {
      joinSession();
    });
  }

  // SpringBoot Server로부터 무작위 세션 id 생성.
  const createRandomSessionId = () => {
    return new Promise<void>((resolve) => {
      axios
        .get(`${BE_URL}/api/channels/create`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          // setState 호출 시 render도 호출 (https://velog.io/@lllen/React-%EC%9D%B4%EB%B2%A4%ED%8A%B8)
          setMySessionId(response.data);
          resolve();
        });
    });
  }

  const generateJoinLink = (sessionId: string) => {
    const str = "https://i7a306.p.ssafy.io/join?channelid="+sessionId;
    setJoinLink(str);
  }

  const handleCopyClipBoard = () => {
    navigator.clipboard.writeText(joinLink);
  }

  //카메라, 마이크 온오프
  const reverseAudioState = () => {
    if (!isExaminer) {
      publisher?.publishAudio(!audiostate);
      setAudiostate(!audiostate);
    } else {
      Swal.fire({
        icon: "warning",
        title: "Sorry...",
        text: "출제자는 마이크를 켤 수 없습니다.",
        timer: 1000,
      });
    }
  }

  const reverseVideoState = () => {
    if (!isExaminer) {
      publisher?.publishVideo(!videostate);
      setVideostate(!videostate);
    } else {
      Swal.fire({
        icon: "warning",
        title: "Sorry...",
        text: "출제자는 카메라를 끌 수 없습니다.",
        timer: 1000,
      });
    }
  }
  // game logics
  // 게임 시작 시그널 보내고 5초 대기 후 동작
  const initGame = () => {
    sendSignalGameStart();

    setTimeout(() => {
      setIsPlaying(true);
      setIsGameover(false);
      setTimer(INITIAL_TIME);
      setCurrentRound(0);
      initExaminerAndScores().then(
        () => getSubjects().then(
          () => giveWordToExaminer(currentRound)
        )
      )
    }, 5000);
  }

  // 출제자 목록 받아오고 랜덤으로 출제자 순서 정함
  const initExaminerAndScores = () => {
    return new Promise<void>((resolve) => {
      axios
      .get(`${OPENVIDU_SERVER_URL}/sessions/${mySessionId}/connection`, {
        headers : {
          "Authorization": "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
          "Content-Type": "application/json",
        }
      })
      .then((response) => {
        examiners = []; // clear examiners
        for(let idx=0; idx<response.data.content.length; idx++) {
          examiners.push(response.data.content[idx].id);
        }
        // shuffle using lambda
        examiners.sort(() => Math.random() - 0.5);
        setExaminers(examiners);

        scores = [];
        for(let idx=0; idx<response.data.content.length; idx++) {
          scores[idx] = 0;
        }
        setScores(scores);

        resolve();
      })
    })
  }

  // 문제들 받아옴
  const getSubjects = () => {
    return new Promise<void>((resolve) => {
      axios
      .get(`${BE_URL}/subjects/${category}`, {
        headers : {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        }
      })
      .then((response) => {
        subjects = [];
        for(let idx=0; idx<response.data.data.length; idx++) {
          subjects.push(response.data.data[idx].word);
        }
        setSubjects(subjects);
        
        // shuffle using lambda
        subjects.sort(() => Math.random() - 0.5);

        // console.log(subjects);
        resolve();
      })
    })
  }

  /*
   i번째 출제자에게 정답 알려주고,
   출제자 표시하고,
   출제자 음소거,
   출제자 카메라 비활성화 불가
   */

   // idx번째 출제자에게 정답 알려줌
  const giveWordToExaminer = (idx: number) => {
      session?.signal({
        "to": [],
        "type": "word",
        "data": subjects[idx]+","+examiners[(idx+1)%examiners.length]+","+idx
      })
  }

  useEffect(()=>{
    scrollRef.current?.scrollIntoView();
  },[messages]);

  return (
  <Container>
    {session === undefined ? (
      <Box sx={{ flexGrow: 1, 
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                zIndex: 0}}>
        <Paper
          square
          elevation={0}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            height: 50,
            pl: 2,
            pt: 10,
            pb: 3,
            backgroundColor: 'lightCyan',
          }}
        >
          <Typography
            sx={{
              typography: 'subtitle2',
              fontSize: 'h4.fontSize',
              fontWeight: 'bold',
              color: 'deepSkyBlue',
              justifySelf: 'left',
              paddingLeft: 20
            }}>
            <Link to="/">
              <HomeRoundedIcon
              fontSize='large' />
            </Link>
          </Typography>
          <Typography
          sx={{
            typography: 'subtitle2',
            fontSize: 'h4.fontSize',
            fontWeight: 'bold',
            color: 'deepSkyBlue',
            justifySelf: 'safeCenter'
          }}><span>{steps[activeStep].label}</span></Typography>
          <Box
            sx={{
              paddingRight: 25
            }}>
          </Box>
        </Paper>
        <div style={{ 
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          width: 900,
          height: "80vh",
      }}>
          {steps[activeStep].choice.map((step, index) => (
            <div key={index}>
              {activeStep < maxSteps - 1 ?
                <Button
                  disabled={index>0}
                  onClick={()=>{
                    activeStep < maxSteps - 1 ?  choice(steps[activeStep].choice[index]) : undefined
                    }}
                  sx={{
                    background: `linear-gradient(white, ${colors[index]} 8%, white 250%)`,
                    color: 'white',
                    height: 250,
                    margin: 2,
                    marginBottom: 0,
                    fontSize: 30,
                    width: 300,
                    zIndex: 1,
                    borderRadius: 8,
                    boxShadow: 10,
                  }}>
                  <div>{steps[activeStep].choice[index]}</div>
                </Button> : 
                <BasicSelect index = { index } steps = { steps } activeStep = {activeStep}
                setInfo = {setInfo}
                selectData = {selectData}
                setSelectData = {setSelectData}
                category = {category}
                round = {round}
                setCategory = {setCategory}
                setCategoryName = {setCategoryName}
                setRound = {setRound}
                />
              }
            </div>
          ))}
        </div>
        <MobileStepper
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            maxWidth: 1000,
            width: '100%',
            backgroundColor: 'lightcyan'
          }}
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          nextButton={
            activeStep === maxSteps - 1 ? 
            <Button
                size="small"
                onClick={handleCreateRoom}
              >
                <div>게임 생성</div>
                {theme.direction === 'rtl' ? (
                  <KeyboardArrowLeft />
                ) : (
                  <KeyboardArrowRight />
                )}
              </Button>
            : <Button
            size="small"
            disabled= {true}
            >
            <div>게임 생성</div>
            {theme.direction === 'rtl' ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
          }
          backButton={
            <Button size="small" onClick={back} disabled={activeStep === 0}>
              {theme.direction === 'rtl' ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
              <div>이전</div>
            </Button>
          }
        />
        </Box>
      ) : null}
      {/* session이 있을 때 */}
      {session !== undefined ? (
        <Box id='full'
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 0,
            height: '100vh',
            width: '100vw'
          }}>
         <Box id='header'
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '15%'
          }}>
          <Box id='logo'
          sx={{
            width: '20%',
            height: '100%',
            // bgcolor: 'green'
          }}>
          {/* <div id="session">
          <div id="session-header"> */}
              <BrandWrapper
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <Brand to="/">
                      <Logo>
                        <LogoImg
                          style={{
                            margin: 0,
                          }}
                          src="/images/common/logo_A306.png"
                          alt="SYNERGY logo img"
                        />
                      </Logo>
                    </Brand>
                  </BrandWrapper>
            </Box>
            {isPlaying ? (
              <Paper id='info'
                sx={{
                  // position: 'sticky',
                  top: 0,
                  left: 0,
                  right: 0,

                  width: '60%',
                  height: '100%',
                  // bgcolor: 'orange',
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                  borderBottomLeftRadius: 20,
                  borderBottomRightRadius: 20,
                  boxShadow: 4,
                  display: 'flex',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                }}>
                <Box id='round'>
                  <span>{round} 라운드 중</span>
                  <h1 style={{
                    color: 'indigo',
                    fontWeight: 'bold'
                  }}>{Number(currentRound) + 1}라운드</h1>
                </Box>
                <Box id='category'>
                  {isExaminer === true ?
                    <Box>
                      <h3 style={{
                        color: 'skyblue',
                        fontWeight: 'bold'
                      }}>{subjectName}</h3>
                      <h1 style={{
                        color: 'skyblue',
                        fontWeight: 'bold'
                      }}>{answer}</h1>
                    </Box>
                    :
                    <h1 style={{
                      color: 'skyblue',
                      fontWeight: 'bold'
                    }}>{subjectName}</h1>}
                </Box>
                <Box id='category'>
                  <span>남은 시간</span>
                  <h1>{timer}초</h1>
                </Box>
              </Paper>)
              : 
              (<Paper id='info'
              sx={{
                // position: 'sticky',
                top: 0,
                left: 0,
                right: 0,

                width: '60%',
                height: '100%',
                // bgcolor: 'orange',
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                boxShadow: 4,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 2,
                }}>
                <Box sx={{
                  width:"82px",
                  paddingLeft: '15%'
                }}></Box>
                <Box id='category'>
                  <h1>몸으로 말해요</h1>
                </Box>
                <Box 
                  id='link'
                  sx={{
                    paddingRight: '10%'
                  }}>
                  <Button 
                    color='success'
                    onClick={handleCopyClipBoard}>
                    <div
                      style={{
                        fontSize: 25,
                      }}>💌</div>
                      <span>초대 링크</span>
                  </Button>
              </Box>
            </Paper>)}
              <Box id='buttons'
                sx={{
                  width: '20%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
              }}>
                {
                  isPlaying === false ? (
                    <Button
                      variant='contained'
                      onClick={initGame}
                    >
                      <div style={{
                        fontSize: 20,
                      }}>게임 시작</div>
                    </Button>
                  ) : (
                    <Button
                      variant='contained'
                      color='error'
                      onClick={sendSignalGameOver}
                    >
                       <div style={{
                        fontSize: 20,
                      }}>게임 종료</div>
                    </Button>
                  )
                }
          <BasicModal/>        
        </Box>
      </Box>
      <Box id='main'
        sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '85%'
      }}>
        
        <Box id='conference'
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection:'column',
            width: '75%',
            height: '100%',
            display: 'flex',
            margin: 2,
            padding: 2
            }}>
            
          <Box id='cam' 
            sx={{ 
            // display: 'flex',
            // backgroundColor: 'powderblue',
            width: '100%',
            height: '90%',
            // margin: 10
                }}>
            <div className="chbox">
              {isGamestart === true ? (
                <GamestartMain></GamestartMain>
              ) : null}
              {isGameover ? (
                <AlertPage text={"게임종료"}></AlertPage>
                ) : isRank ? (
                <ScoreRate mark={scoreMarks} examiners={scoreExaminers} channelId={mySessionId as string}></ScoreRate>
                ):isCorrect ? (
                <AlertPage text={correctorName + "님 정답"}></AlertPage>
                ): isRoundover ? (
                <AlertPage text={"시간초과"}></AlertPage>
                    ) : null}
            </div>
            {/* 큰 화면 카메라 */}
            {/* {mainStreamManager !== undefined ? (
              <div id="main-video" className="col-md-6">
                <UserVideoComponent
                  streamManager={mainStreamManager}
                />
                <input
                  className="btn btn-large btn-success"
                  type="button"
                  id="buttonSwitchCamera"
                  onClick={switchCamera}
                  value="Switch Camera"
                />
              </div>
            ) : null} */}
            {/* <div id="video-container" className="col-md-6"> */}
          <Grid container spacing={{ xs: 1, md: 1 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            {/* {publisher !== undefined ? (
              <Grid
                item
                sm={4}
                md={4}
                onClick={() => handleMainVideoStream(publisher)}
              >
                <UserVideoComponent streamManager={publisher} />
              </Grid>
            ) : null}
            {subscribers.map((sub, i) => (
              {isPlaying == true ?
                <Grid
                  item
                  sm={4}
                  md={4}
                  key={i}
                  // className="stream-container col-md-6 col-xs-6"
                  onClick={() => handleMainVideoStream(sub)}
                >
                  <UserVideoComponent streamManager={sub} />
                </Grid>
              : null
              }
            ))} */}
            {isPlaying == true ?         
              streamManagers.map((sub: any, i: any) => (
                sub.stream.connection.connectionId != examinerId ?
                  <Grid
                    item sm={4} md={4}
                    key={i}
                    onClick={() => handleMainVideoStream(sub)}>
                    <UserVideoComponent streamManager={sub} />
                  </Grid>
                :       
                  <Grid
                    item sm={4} md={4}
                    key={i}
                    onClick={() => handleMainVideoStream(sub)}>
                    <Box
                      sx={{
                        border: 6,
                        borderRadius: 4,
                        borderColor: 'limegreen',
                        height: '100.8%'
                      }}>
                      <UserVideoComponent
                      style={{border: 'solid'}} streamManager={sub} />
                    </Box>
                  </Grid>
                  ))
              :
              streamManagers.map((sub, i) => (
                <Grid
                  item sm={4} md={4}
                  key={i}
                  onClick={() => handleMainVideoStream(sub)}
                >
                  <UserVideoComponent streamManager={sub} />
                </Grid>
              ))}               
              </Grid>
            </Box>

          <Box id='settings'
            sx={{
              backgroundColor: 'inherit',
              width: '100%',
              height: '10%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 3
            }}>
            
            
            {audiostate ? (
              <Button
                color = 'success'
                variant='contained'
                onClick={reverseAudioState}>
                <MicOutlinedIcon
                  sx={{
                    color: 'white'
                  }} />
                {/* <p style={{ color: 'white' }}>끄기</p> */}
              </Button>
            ) : (
              <Button
                color = 'warning'
                variant='contained'
                onClick={reverseAudioState}>
                <MicOffIcon
                  sx={{
                    color: 'white'
                  }} />
                {/* <p style={{ color: 'white' }}>켜기</p> */}
              </Button>
            )}
            {videostate ? (
              <Button
                color = 'success'
                variant='contained'
                sx={{
                  marginLeft: 2,
                  marginRight: 2
                }}
                onClick={reverseVideoState}>
                <VideocamIcon
                  sx={{
                    color: 'white'
                  }} />
              </Button>
            ) : (
              <Button
                color = 'warning'
                variant='contained'
                sx={{
                  marginLeft: 2,
                  marginRight: 2
                }}
                onClick={reverseVideoState}>
                <VideocamOffIcon
                  sx={{
                    color: 'white'
                  }} />
              </Button>
            )}                                  
          <Button
            variant='contained'
            color='error'
          onClick={leaveSession}>
            <ExitToAppIcon
              sx={{
                color: 'white'
              }} 
            />
            <p style={{ color: 'white' }}>나가기</p>
          </Button>

          
          </Box>
        </Box>
        <Box id='chat' 
          sx={{
          width: '25%',
          height: '95%',
          paddingRight: 2
          // margin: 10
        }}>
         
          <Box className="chatspace" 
          sx={{
            backgroundColor: 'skyblue', 
            width: '100%', 
            height: '100%', 
            borderRadius: 3,
            boxShadow: '3px 3px 3px',
          }}
        >
          <h3 style={{paddingTop: '5px'}}>채팅</h3>
          <Box 
          className="chatbox__messages" 
          sx={{
            backgroundColor: 'white',
            boxShadow: 'inset 3px 3px 3px',
            margin: 'auto', 
            width: '90%', 
            height: '80%', 
            borderRadius: 3, 
            overflow: 'auto'
            }}
          >
            <Messages messages={messages} myUserName={myUserName} />
            <div  ref ={scrollRef}/>
          </Box>
            <input
              id="chat_message"
              type="text"
              style={{margin: '15px', width:'70%', borderRadius: 8, borderStyle: 'solid', borderColor: '#ddd'}}
              placeholder="  메시지를 입력해주세요."
              onChange={handleChatMessageChange}
              onKeyPress={sendMessageByEnter}
              value={message}
            />
            <Button
              variant='contained'
              sx={{
                paddingRight: '12px'
              }}>
              <SendIcon
              className="chatbox__send--footer"
              // sx={{borderRadius: '20px', border: 'none'}}
              onClick={sendMessageByClick}
            >
            </SendIcon></Button></Box>
          </Box>
          </Box></Box>
        ) : null}
      </Container>
  );
}

export default SwipeableTextMobileStepper;

function BasicSelect(props: any) {
  const [category, setCategory] = useState(`${props.selectData[props.index][0].id}`);

  const handleChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
    if (props.index == 0) {
      console.log("setCategdt)")
      props.setCategory(event.target.value)
      props.selectData[props.index].map((d: any, i: any) => {
        if (d.id === event.target.value) {
          props.setCategoryName(d.name);
        }
      });
    }
    else {
      props.setRound(event.target.value)
    }
  };

  return (
    <Box sx={{ minWidth: 120,
    width: 560 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label"
          sx={{
            fontWeight: 'bold',
            }}>{steps[2].choice[props.index]}</InputLabel>
        <Select
          sx={{
            backgroundColor: 'white',
          }}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={category}
          label="Category"
          onChange={handleChange}
        >
          {props.selectData[props.index].map((d: any, i: any)=> (
            <MenuItem key={i} value={d.id}>{d.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}


const Container = styled.div`
  // position: sticky;
  // align-self: center;
  // top: 0;
  // left: 0;
  height: 100vh;
  // width: 100%;
  // // padding:150px 0;
  // background-color: #D7D7D7;
  background: lightCyan;
`;

// const Create = styled.div`
//   padding: 3em 0 0;
// `;

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40%',
  height: '75%',
  bgcolor: 'white',
  border: '2px solid #000',
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

export const BrandWrapper = styled.div`
  // position: relative;
  // margin: 100px 100px
  align-items: center;
  display: flex;
  // align-text: center;
  align-self: center;
`;

export const Brand = styled(Link)`
  // position: absolute;
  // display: flex;
  text-decoration: none;
`;

export const Logo = styled.div`
  // position: absolute; 
  display: flex;
`;

export const LogoImg = styled.img`
  height: 30px;
  // margin: 0 auto;
  margin-left: 20px;
  margin-right: 10px;
`;

export const LogoName = styled.span`
  margin-left: 6px;
  // padding-top: 1px;
  font-size: 20px;
  font-weight: 700;
  // align-items: center;
  // align-self: center;
  display: flex;
  color: #000;
  
  &:hover {
    color: #000;
  }

`;

function BasicModal() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen}
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}>
      <span>게임 방법</span>
        <HelpIcon color='success'></HelpIcon>
        
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
          <DialogTitle>
          <Typography id="modal-modal-title" variant="h6" component="span">
            <div>
            몸으로 말해요
            </div>
          </Typography>
          </DialogTitle>
          <DialogContent>
          <Typography id="modal-modal-description" sx={{ mt: 2 }} component="span">
            <div>            
              1. 출제자는 몸짓으로만 제시어를 묘사합니다. <br />
            2. 참여자는 출제자의 묘사를 통해 정답을 유추합니다. <br />
            3. 참여자는 채팅으로 정답을 맞춥니다.</div>

          </Typography>
          <DialogActions>
          <Button onClick={handleClose}><span>닫기</span></Button>
          </DialogActions>

          </DialogContent>
      </Dialog>
    </div>
  );
}