import React, {
  Component,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import ReactDOM from "react-dom";
import axios from "axios";

import Header from "../components/common/Header";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";

import MicOutlinedIcon from "@mui/icons-material/MicOutlined";
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";


import styled from "@emotion/styled";

import FormControl from "@mui/material/FormControl";
// import FormHelperText from "@mui/material/FormHelperText";
import {
  Brand,
  Logo,
  LogoImg,
  LogoName,
  BrandWrapper,
} from "../components/common/Header";
import {
  Button,
  Box,
  Input,
  InputLabel,
  Modal,
  Typography,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material/";

import "./Signup.css";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  OpenVidu,
  Publisher,
  Session,
  StreamManager,
  Subscriber,
} from "openvidu-browser";
import "../components/openvidu/App.css";
import Messages from "../components/openvidu/Messages";
import UserVideoComponent from "../components/openvidu/UserVideoComponent";
import Swal from "sweetalert2";
import GamestartMain from "./modules/GamestartMain"
import AlertPage from "./modules/AlertPage";
import SendIcon from '@mui/icons-material/Send';
import HelpIcon from '@mui/icons-material/Help';
import ScoreRate from "./modules/ScoreRate";

const OPENVIDU_SERVER_URL = process.env.REACT_APP_OPENVIDU_SERVER_URL;
const OPENVIDU_SERVER_SECRET = process.env.REACT_APP_OPENVIDU_SERVER_SECRET;
const BE_URL = process.env.REACT_APP_BACKEND_URL;
const JOIN_MEMBER_LIMIT = 6;

const themeA306 = createTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: "#39A2DB",
      contrastText: "#ffffff",
    },
    secondary: {
      // This is green.A700 as hex.
      main: "#769FCD",
    },
  },
});

interface IState {
  OV: OpenVidu | null;
  mySessionId: string;
  myUserName: string;
  session: Session | undefined;
  mainStreamManager: Publisher | undefined;
  publisher: Publisher | undefined;
  subscribers: Subscriber[];
  myConnectionId: string;
  audiostate: boolean;
  audioallowed: boolean;
  videostate: boolean;
  videoallowed: boolean;
  messages: object[];
  message: string;
}

const InvitePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // const [openviduState, setOpenviduState] = React.useState<IState>({
  //     OV: null,
  //     mySessionId: "",
  //     myUserName: "",
  //     session: undefined,
  //     mainStreamManager: undefined,
  //     publisher: undefined,
  //     subscribers: [],
  //     // user need to hold their own connection.id
  //     myConnectionId: "",

  //     // audio, video
  //     audiostate: true,
  //     audioallowed: true,
  //     videostate: true,
  //     videoallowed: true,

  //     // chatting
  //     messages: [],
  //     message: "",
  // });

  const [OV, setOV] = useState<OpenVidu | null>(null);
  const [mySessionId, setMySessionId] = useState<string | null>("");
  const [myUserName, setMyUserName] = useState<string>("");
  const [session, setSession] = useState<Session | undefined>(undefined);
  const [mainStreamManager, setMainStreamManager] = useState<
    Publisher | undefined
  >(undefined);
  const [publisher, setPublisher] = useState<Publisher | undefined>(undefined);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [streamManagers, setStreamManagers] = useState<StreamManager[]>([]);

  const [myConnectionId, setMyConnectionId] = useState<string>("");

  const [audiostate, setAudiostate] = useState<boolean>(true);
  const [audioallowed, setAudioallowed] = useState<boolean>(true);
  const [videostate, setVideostate] = useState<boolean>(true);
  const [videoallowed, setVideoallowed] = useState<boolean>(true);

  const [messages, setMessages] = useState<object[]>([]);
  const [message, setMessage] = useState<string>("");
  const emptyAllOV = () => {
    setOV(null);
    setMySessionId("");
    setMyUserName("");
    setSession(undefined);
    setMainStreamManager(undefined);
    setPublisher(undefined);
    setSubscribers([]);
    setStreamManagers([]);
    setMyConnectionId("");
    setAudiostate(true);
    setAudioallowed(false);
    setVideostate(true);
    setVideoallowed(false);
    setMessages([]);
    setMessage("");
  };
  //닉네임 확인
  const [nickName, setNickName] = useState<string>("");

  //에러메시지 저장
  const [nickNameError, setNickNameError] = useState<string>("");

  // 유효성 검사
  const [isNickName, setIsNickName] = useState<boolean>(false);

  // 닉네임 중복 체크
  const [usableNickName, setUsableNickName] = useState<boolean>(false);

  const [hostName, sethostName] = useState<string>("");
  const [hostConnectionId, setHostConnectionId] = useState<string>("");
  //게임관련
  
  let [isPlaying, setIsPlaying] = useState<boolean>(false);
  let [currentRound, setCurrentRound] = useState<number>(0);
  let [timer, setTimer] = useState<number>(0);
  let [categoryName, setCategoryName] = useState<string>("");
  let [subjectName, setSubjectName] = useState<string>("");
  let [answer, setAnswer] = useState<string[]>([]);
  const [examinerId, setExaminerId] = useState<string>("");
  const [isExaminer, setIsExaminer] = useState<boolean>(false);
  const [isGamestart, setIsGamestart] = useState<boolean>(false);
  const [isGameover, setIsGameover] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [isRoundover, setIsRoundover] = useState<boolean>(false);
  const [scoreMarks, setScoreMarks] = useState<string>("");
  const [scoreExaminers, setScoreExaminers] = useState<string>("");
  const [isRank, setIsRank] = useState<boolean>(false);
  const [correctorName, setCorrectorName] = useState<string>("");
  const [round, setRound] = useState(0)

  const didMount = useRef(false);

  const scrollRef = useRef<null|HTMLDivElement>(null);

  // URL에서 방 코드를 가져옴
  useEffect(() => {
    const sch = location.search;
    const params = new URLSearchParams(sch);
    const channelId = params.get("channelid");
    setMySessionId(channelId);
    //호스트 닉네임을 가져옴
    axios
      .get(`${BE_URL}/api/channels/findHost/${channelId}`)
      .then((res: any) => {
        console.log(res);
        sethostName(res.data.nickName);
        setHostConnectionId(res.data.connectionId);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }, []);

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
    mySession?.on("streamCreated", (event: any) => {
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
      //호스트가 비정상 종료했다면
      if (hostConnectionId === event.stream.connection.connectionId) {
        deleteSession();
      } else {
        // Remove the stream from 'subscribers' array
        deleteSubscriber(event.stream.streamManager);
      }
    });
    // On every asynchronous exception...
    mySession?.on("exception", (exception) => {
      console.warn(exception);
    });
    mySession?.on("sessionDisconnected", (event: any) => {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "서버와의 접속이 끊어졌습니다.",
        timer: 1000,
      });
      navigate("/");
    });

    mySession?.on("sessionDisconnected", (event: any) => {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "서버와의 접속이 끊어졌습니다.",
        timer: 1000,
      });
      navigate("/");
    });

    // --- 4) Connect to the session with a valid user token ---

    // 'getToken' method is simulating what your server-side should do.
    // 'token' parameter should be retrieved and returned by your own backend
    getToken().then((token) => {
      // First param is the token got from OpenVidu Server. Second param can be retrieved by every user on event
      // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
      mySession
        ?.connect(String(token), { clientData: myUserName })
        .then(async () => {
          var devices = await OV?.getDevices();
          var videoDevices = devices?.filter(
            (device) => device.kind === "videoinput"
          );

          // --- 5) Get your own camera stream ---

          // Init a publisher passing undefined as targetElement (we don't want OpenVidu to insert a video
          // element: we will manage it on our own) and with the desired properties
          let publisher = OV?.initPublisher("", {
            audioSource: undefined, // The source of audio. If undefined default microphone
            videoSource: undefined, // The source of video. If undefined default webcam
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
    mySession?.off("signal:chat");
    mySession?.on("signal:chat", (event: any) => {
      let chatdata = event.data.split(",");
      // let chatdata = event.;
      if (chatdata[0] !== myUserName) {
        console.log("messages: " + messages);

        // messages.push({
        //   userName: chatdata[0],
        //   text: chatdata[1],
        //   boxClass: "messages__box--visitor",
        // });

        // setMessages([...messages]);

        setMessages([
          ...messages,
          {
            userName: chatdata[0],
            text: chatdata[1],
            boxClass: "messages__box--visitor",
          },
        ]);
      }
    });
  }, [session, messages]);

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
    mySession?.off("signal:time");
    mySession?.on("signal:time", (event: any) => {
      setTimer(event.data);
    });

    mySession?.off("signal:correct");
    mySession?.on("signal:correct", (event: any) => {
      setCorrectorName(event.data.split(",")[1]);
      setIsCorrect(true);
    });

    mySession?.off("signal:roundover");
    mySession?.on("signal:roundover", (event: any) => {
      setIsRoundover(true);
    });

  }, [session]);

  useEffect(() => {
    const mySession = session;
    mySession?.off("signal:word");
    mySession?.on("signal:word", (event: any) => {
      setIsCorrect(false);
      setIsRoundover(false);
      handleSignalWord(event)
    })
  }, [session, myConnectionId, audiostate, videostate, isPlaying]);

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

  const onEnter = () => {
    axios
      .get(`${BE_URL}/api/channels/info/${mySessionId}`)
      .then((response) => {
        if (response.data.currentParticipantNumber >= JOIN_MEMBER_LIMIT) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "참여하려는 채널이 꽉 찼습니다.",
            timer: 1000,
          });
          navigate("/");
          return;
        }
        joinSession();
    })
  };

  // 닉네임
  const onChangeNickName = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const nickNameRegex = /^[ㄱ-ㅎ|가-힣|a-z]+$/; // 한글, 영어소문자만
      const nickNameCurrent = e.target.value;
      setNickName(nickNameCurrent);
      // 닉네임 변경시 중복체크 다시하도록 false로 상태 변경
      setUsableNickName(false);

      if (
        nickNameCurrent.length < 6 ||
        nickNameCurrent.length > 12 ||
        !nickNameRegex.test(nickNameCurrent)
      ) {
        setNickNameError("공백 없이 6~12자 영소문자와 한글만 가능합니다.");
        setIsNickName(false);
      } else {
        setNickNameError("올바른 이름 형식입니다!");
        setIsNickName(true);
      }
    },
    []
  );

  // 닉네임 중복확인
  const nickNameCheck = (e: any) => {
    e.preventDefault();
    if (isNickName) {
      axios
        .post(`${BE_URL}/api/channels/duplicate/nickname/${mySessionId}`, {
          connectionId: myConnectionId,
          nickName: nickName,
        })
        .then((response: any) => {
          if (response.status == 226) {
            Swal.fire({
              icon: "question",
              title: "Oops...",
              text: "중복된 닉네임입니다",
              timer: 1000,
            });
          } else {
            Swal.fire({
              icon: "success",
              title: "사용가능한 닉네임입니다.",
              timer: 1000,
            });
            setUsableNickName(true);
            setMyUserName(nickName);
          }
        })
        .catch((error: any) => {
          Swal.fire({
            icon: "warning",
            title: "Sorry...",
            text: "서버 오류입니다.",
            timer: 1000,
          });
        });
    } else {
      Swal.fire({
        icon: "error",
        title: "닉네임을 다시 입력해주세요",
        text: "6~12자 영소문자와 한글로 된 닉네임만 사용 가능합니다.",
        timer: 1000,
      });
    }
  };

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
        setMessages([
          ...messages,
          {
            userName: myUserName,
            text: message,
            boxClass: "messages__box--operator",
          },
        ]);
        setMessage("");
        const mySession = session;

        mySession?.signal({
          data: `${myUserName},${message}`,
          to: [],
          type: "chat",
        });
      }
    }
  };

  const sendMessageByEnter = (e: any) => {
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
          ]);
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
  };

  const handleChatMessageChange = (e: any) => {
    setMessage(e.target.value);
  };
  // chatting

  const componentDidMount = () => {
    window.addEventListener("beforeunload", onbeforeunload);
  };

  const componentWillUnmount = () => {
    window.removeEventListener("beforeunload", onbeforeunload);
  };

  const onbeforeunload = (event: any) => {
    leaveSession();
  };

  const handleChangeSessionId = (e: any) => {
    setMySessionId(e.target.value);
  };

  const handleChangeUserName = (e: any) => {
    setMyUserName(e.target.value);
  };

  const handleMainVideoStream = (stream: any) => {
    if (mainStreamManager !== stream) {
      setMainStreamManager(stream);
    }
  };

  const deleteSubscriber = (streamManager: any) => {
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
  };
  // 참가자 백엔드에 등록
  const recordParticipant = (conId: string) => {
    const requestBody = JSON.stringify({
      connectionId: conId,
      nickName: myUserName,
    });
    console.log("put session id " + mySessionId);
    axios
      .post(BE_URL + "/api/channels/join/" + mySessionId, requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response: any) => {
        console.log(response);
      })
      .catch((error: any) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `참여하려는 채널이 꽉 찼습니다.`,
          showConfirmButton: false,
          timer: 1500,
        });
        leaveSession();
      });
  };

  const joinSession = () => {
    // --- 1) Get an OpenVidu object ---
    setOV(new OpenVidu());
  };

  const leaveSession = () => {
    axios
      .post(`${BE_URL}/api/channels/leave/${mySessionId}`, {
        nickName: myUserName,
        connectionId: myConnectionId,
      })
      .then((res: any) => {
        console.log("방 나가기 성공");
      })
      .catch((e: any) => {
        console.log("방 나가기 실패");
      });
    // --- 7) Leave the session by calling 'disconnect' method over the Session object ---

    const mySession = session;

    if (mySession) {
      mySession?.disconnect();
    }

    // Empty all properties...
    emptyAllOV();
  };

  const deleteSession = () => {
    axios
      .delete(`${BE_URL}/api/channels/delete/${mySessionId}`, {
        data: {
          nickName: hostName,
          connectionId: hostConnectionId,
        },
      })
      .then((res: any) => {
        console.log("방 삭제 성공");
      })
      .catch((e: any) => {
        console.log("방 삭제 실패");
      });
    
    axios
    .delete(OPENVIDU_SERVER_URL + `/sessions/${mySessionId}`, {
      headers: {
        Authorization: "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
        "Content-Type": "application/json",
      },
    });
  };

  const switchCamera = async () => {
    try {
      const devices = await OV?.getDevices();
      var videoDevices = devices?.filter(
        (device) => device.kind === "videoinput"
      );

      if (videoDevices && videoDevices.length > 1) {
        var newVideoDevice = videoDevices.filter(
          // (device) => device.deviceId !== currentVideoDevice.deviceId
          (device) => device.deviceId
        );

        if (newVideoDevice.length > 0) {
          // Creating a new publisher with specific videoSource
          // In mobile devices the default and first camera is the front one
          var newPublisher = OV?.initPublisher("", {
            videoSource: newVideoDevice[0].deviceId,
            publishAudio: true,
            publishVideo: true,
            mirror: true,
          });

          //newPublisher.once("accessAllowed", () => {
          await session?.unpublish(mainStreamManager as Publisher);

          await session?.publish(newPublisher as Publisher);
          // currentVideoDevice: newVideoDevice,
          setMainStreamManager(newPublisher);
          setPublisher(newPublisher);
        }
      }
    } catch (e: any) {
      console.error(e);
    }
  };

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
  };

  const createSession = (sessionId: string) => {
    console.log("created session " + sessionId);
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
        .then((response: any) => {
          console.log("CREATE SESSION", response);
          axios.delete(OPENVIDU_SERVER_URL + "/sessions/" + response.data.id, {
            headers: {
              Authorization:
                "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
              "Content-Type": "application/json",
            },
          });
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `참가하려는 ${sessionId}방이 존재하지 않습니다.`,
            showConfirmButton: false,
            timer: 1500,
          });
          reject(response);
        })
        .catch((response: any) => {
          var error = Object.assign({}, response);
          if (error?.response?.status === 409) {
            resolve(sessionId);
          } else {
            console.log(error);
            console.warn(
              "No connection to OpenVidu Server. This may be a certificate error at " +
                OPENVIDU_SERVER_URL
            );
            //swal
            Swal.fire({
              title: "모든 문제집을 삭제하시겠습니까?",
              text:
                'No connection to OpenVidu Server. This may be a certificate error at "' +
                OPENVIDU_SERVER_URL +
                '"\n\nClick OK to navigate and accept it. ' +
                'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' +
                OPENVIDU_SERVER_URL +
                '"',
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "예, 전부 삭제합니다",
              cancelButtonText: "취소하기",
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.assign(
                  OPENVIDU_SERVER_URL + "/accept-certificate"
                );
              }
            });
            //원래 confrim
            // if (
            //   window.confirm(
            //     'No connection to OpenVidu Server. This may be a certificate error at "' +
            //       OPENVIDU_SERVER_URL +
            //       '"\n\nClick OK to navigate and accept it. ' +
            //       'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' +
            //       OPENVIDU_SERVER_URL +
            //       '"'
            //   )
            // ) {
            //   window.location.assign(
            //     OPENVIDU_SERVER_URL + "/accept-certificate"
            //   );
            // }
          }
        });
    });
  };

  const createToken = (sessionId: string) => {
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
        .then((response: any) => {
          console.log("TOKEN", response);
          resolve(response.data.token);
          console.log("connection id : " + response.data.id);
          setMyConnectionId(response.data.id);
          //TODO: setMyConnectionId가 늦게 작동하는 문제 해결 필요
          //임시로 connectionId를 인자로 넘겨주어 해결
          recordParticipant(response.data.id);
        })
        .catch((error: any) => reject(error));
    });
  };

  //카메라, 마이크 온오프
  const reverseAudioState = () => {
    publisher?.publishAudio(!audiostate);
    setAudiostate(!audiostate);
  };

  const reverseVideoState = () => {
    publisher?.publishVideo(!videostate);
    setVideostate(!videostate);
  };

  useEffect(()=>{
    scrollRef.current?.scrollIntoView();
  },[messages]);
  return (
    <Container>
      <Wrapper>
        <ThemeProvider theme={themeA306}>
          
          {session === undefined ? (
            <InvitePageAll>
              
              <InvitePageForm>
              <InvitePageWrapper>
                <InvitePageHead>SYNERGY</InvitePageHead>

                <InvitePageMsg>
                  {hostName} 님의 방에 입장하시겠습니까?
                </InvitePageMsg>

                <InvitePageInput>
                  <Grid container spacing={2}>
                    <Grid item  xs={8} >
                    <FormControl variant="standard" fullWidth>
                      <InputLabel htmlFor="component-helper" shrink>
                        Nick Name
                      </InputLabel>
                      <Input
                        id="component-helper-nickname"
                        placeholder="닉네임을 입력해 주세요."
                        // value={nickName}
                        onChange={onChangeNickName}
                        required
                        aria-describedby="component-helper-text"
                      />
                    </FormControl>
                    </Grid>
                    <Grid item  xs={4}>
                    <NickNameButton onClick={nickNameCheck}>
                      닉네임 중복체크
                    </NickNameButton>
                    </Grid>
                    </Grid>
                  {nickName.length > 0 && (
                    <div className={`${isNickName ? "success" : "error"}`}>
                      {nickNameError}
                    </div>
                  )}
                </InvitePageInput>

                <InvitePageInput onClick={onEnter}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="medium"
                    fullWidth
                    disabled={!(isNickName && usableNickName)}
                  >
                    채널 입장하기
                  </Button>
                  <div>{!usableNickName ? "닉네임 중복체크를 해주세요" : ""}</div>
                </InvitePageInput>
                </InvitePageWrapper>
              </InvitePageForm>
            </InvitePageAll>
          ) : null}
          {/* session이 있을 때 */}
          {session !== undefined ? (
            <Box
              id="full"
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: 0,
                height: "100vh",
                width: "100vw",
              }}
            >
              <Box
                id="header"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "15%",
                }}
              >
                <Box
                  id="logo"
                  sx={{
                    width: "20%",
                    height: "100%",
                  }}
                >
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
                  <Paper
                    id="info"
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
                      }}>{Number(currentRound)+1}라운드</h1>
                    </Box>
                    <Box id='category'>
                      {isExaminer === true ?
                      <Box>
                        <h3 style={{
                          color: 'skyblue',
                          fontWeight: 'bold'}}>{subjectName}</h3>
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
                      {timer === -1 ? 
                        (<h1> -</h1>)
                        : (
                          <>
                            <span>남은 시간</span>
                            <h1>{timer}초</h1>
                          </>
                        )}
                    </Box>
                  </Paper>)
                  : (<Paper id='info'
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
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 2,
                    }}>
                    <Box id='category'>
                      <h1>몸으로 말해요</h1>
                    </Box>
                </Paper>)}
                <Box
                  id="buttons"
                  sx={{
                    width: "20%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                  }}
                >
                  <Box
                    fontSize={25}>
                    {nickName}
                  </Box>
                  <BasicModal/>
                </Box>
              </Box>
              <Box
                id="main"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "85%",
                }}
              >
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
                    <Grid
                      container
                      spacing={{ xs: 1, md: 1 }}
                      columns={{ xs: 4, sm: 8, md: 12 }}
                    >
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
                  <Box
                    id="settings"
                    sx={{
                      backgroundColor: "inherit",
                      width: "100%",
                      height: "10%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 3
                    }}
                  >
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
        </ThemeProvider>
        
      </Wrapper>
    </Container>
  );
};

// const theme = createTheme

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

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  height: "75%",
  bgcolor: "white",
  border: "2px solid #000",
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

const Container = styled.div`
  height: 100vh;
  background: lightCyan;
`;

const Wrapper = styled.div`
  // display: flex;
  // align-items: center;
  // text-align: center;
  // background-color: #D7D7D7;
  // justify-content: center;
  // z-index: 5;
`;

const InvitePageAll = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(lightCyan, skyBlue, deepSkyBlue);
`;

const InvitePageWrapper = styled.div`
  width: 500px;
  display: inline-block;
`;

const InvitePageHead = styled.h1`
  color: deepskyblue;
  margin: 40px;
`;

const InvitePageMsg = styled.h5`
  color: #000000;
  margin: 40px;
  font-size: 16px;
`;

const InvitePageForm = styled.div`
  display: flex;
  justify-content: center;
  border-radius: 25px;
  box-shadow: 5px 5px 5px 5px;
  width: 50%;
  padding: 2em 0 4em;
  margin: 2em;
  background: white;
`;

const InvitePageInput = styled.div`
  // display: flex;
  // flex-direction: column;
  // width: 500px;
  // text-align: center;
  // align-items: center;
  margin: 15px 0px;
`;

const InvitePageButton = styled.button`
  height: 40px;
  margin-bottom: 24px;
  border: none;
  border-radius: 0.25rem;
  box-sizing: border-box;
  background-color: #3396f4;
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  transition: background-color 0.08s ease-in-out;
  cursor: pointer;
  &:hover {
    background-color: #2878c3;
  }
  @media (max-width: 575px) {
    font-size: 15px;
  }
`;

const NickNameButton = styled.button`
  height: 40px;
  margin-bottom: 24px;
  border: none;
  border-radius: 0.25rem;
  box-sizing: border-box;
  background-color: #39a2db;
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  transition: background-color 0.08s ease-in-out;
  cursor: pointer;
  &:hover {
    background-color: #2878c3;
  }
  @media (max-width: 100px) {
    font-size: 15px;
  }
`;

// const InvitePageMsg = styled.div`
//   text-decoration: none;
//   font-size: 14px;
//   font-weight: bold;
// `;

export default InvitePage;
