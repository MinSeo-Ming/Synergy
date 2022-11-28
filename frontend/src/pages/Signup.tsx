import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";

import Header from "../components/common/Header";
import { Link, Outlet, useNavigate } from "react-router-dom";

import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { useState, useCallback, useRef } from "react";

import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";

import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid"; // Grid version 1

import TextField from "@mui/material/TextField";
import "./Signup.css";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import Swal from "sweetalert2";

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

const Signup = () => {
  const BE_URL = process.env.REACT_APP_BACKEND_URL;
  //닉네임, 이메일, 비밀번호, 비밀번호 확인
  const [nickName, setNickName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const navigate = useNavigate();

  // 비밀번호 보여줄지 여부
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordConfirm, setShowPasswordConfirm] =
    useState<boolean>(false);

  //에러메시지 저장
  const [nickNameError, setNickNameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [passwordConfirmError, setPasswordConfirmError] = useState<string>("");

  // 유효성 검사
  const [isNickName, setIsNickName] = useState<boolean>(false);
  const [isEmail, setIsEmail] = useState<boolean>(false);
  const [isPassword, setIsPassword] = useState<boolean>(false);
  const [isPasswordConfirm, setIsPasswordConfirm] = useState<boolean>(false);
  // const router = useRouter();

  // 닉네임, 이메일 중복 체크
  const [usableNickName, setUsableNickName] = useState<boolean>(false);
  const [usableEmail, setUsableEmail] = useState<boolean>(false);

  const signupRef = useRef<any>();

  // 회원가입 버튼 클릭
  const onSignUp = () => {
    if (!usableEmail) {
      Swal.fire({
        icon: "error",
        title: "닉네임 중복을 확인해주세요!",
        showConfirmButton: false,
        timer: 1500,
      });
    } else if (!usableNickName) {
      Swal.fire({
        icon: "error",
        title: "이메일 중복을 확인해주세요!",
        showConfirmButton: false,
        timer: 1500,
      });
    } else if (usableEmail && usableNickName) {
      //여러번 요청보내는 것을 방지
      signupRef.current.disabled = true;
      axios
        .post(
          `${BE_URL}/users/signup`,

          {
            email: email,
            nickname: nickName,
            password: password,
          }
        )
        .then((res) => {
          Swal.fire({
            icon: "success",
            title: "회원 가입 성공하였습니다",
            text: "이메일인증 후 로그인하여 주세요",
            showConfirmButton: false,
            timer: 1500,
          });

          // 입력된 내용 다 지우는 코드
          setNickName("");
          setEmail("");
          setPassword("");
          setPasswordConfirm("");

          navigate("/Login");
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status === 409) {
            Swal.fire({
              icon: "warning",
              title: error.response.data.message,
              showConfirmButton: false,
              timer: 1500,
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "아이디와 비밀 번호를 확인해주세요",
              showConfirmButton: false,
              timer: 1500,
            });
          }
          // console.log(error.message);
        })
        .finally(() => {
          signupRef.current.disabled = false;
        });
    }
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

  // 이메일
  const onChangeEmail = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const emailRegex =
        /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
      const emailCurrent = e.target.value;
      setEmail(emailCurrent);
      // 이메일 변경시 중복체크 다시하도록 false로 상태 변경
      setUsableEmail(false);

      if (!emailRegex.test(emailCurrent)) {
        setEmailError("이메일 형식에 맞게 입력해 주세요.");
        setIsEmail(false);
      } else {
        setEmailError("올바른 이메일 형식입니다!");
        setIsEmail(true);
      }
    },
    []
  );

  // 비밀번호
  const onChangePassword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // const passwordRegex =
      //   /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
      const passwordCurrent = e.target.value;
      setPassword(passwordCurrent);

      if (passwordCurrent.length < 8) {
        setPasswordError("비밀번호는 8자리 이상이어야 합니다.");
        setIsPassword(false);
      } else if (passwordConfirm && passwordCurrent !== passwordConfirm) {
        setPasswordError("비밀번호를 다시 확인해 주세요.");
        setPasswordConfirmError("비밀번호가 일치하지 않아요.");
        setIsPassword(false);
        setIsPasswordConfirm(false);
      } else {
        setPasswordError("올바른 비밀번호 형식입니다!");
        setIsPasswordConfirm(true);
        setPasswordConfirmError("비밀번호가 같습니다.");
        setIsPassword(true);
      }
    },
    [passwordConfirm]
  );

  // 비밀번호 확인
  const onChangePasswordConfirm = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const passwordConfirmCurrent = e.target.value;
      setPasswordConfirm(passwordConfirmCurrent);

      if (password === passwordConfirmCurrent) {
        setPasswordConfirmError("비밀번호가 같습니다.");
        setPasswordError("올바른 비밀번호 형식입니다!");
        setIsPasswordConfirm(true);
        setIsPassword(true);
      } else {
        setPasswordConfirmError("비밀번호를 다시 확인해 주세요.");
        setPasswordError("");
        setIsPasswordConfirm(false);
      }
    },
    [password]
  );

  // 패스워드 보기 버튼이 눌릴때마다 동작
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleClickShowPasswordConfirm = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
  };

  const handleMouseDownPasswordConfirm = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  // 닉네임 중복확인
  const nickNameCheck = (e: any) => {
    e.preventDefault();
    if (isNickName) {
      axios
        .post(`${BE_URL}/users/nickname`, {
          nickname: nickName,
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            title: "사용가능한 닉네임입니다.",
          });
          setUsableNickName(true);
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "중복된 닉네임입니다.",
            timer: 1500,
          });
        });
    } else {
      Swal.fire({
        icon: "warning",
        title: "닉네임을 다시 한번 확인해주세요",
        text: "6~12자 영소문자와 한글로 된 닉네임만 사용 가능합니다.",
      });
    }
  };

  // 이메일 중복확인
  const emailCheck = (e: any) => {
    e.preventDefault();
    if (isEmail) {
      axios
        .post(`${BE_URL}/users/email`, { email: email })
        .then((response) => {
          Swal.fire({
            icon: "success",
            title: "이메일 사용 가능합니다",
            showConfirmButton: false,
            timer: 1500,
          });
          setUsableEmail(true);
        })
        .catch((error) => {
          Swal.fire({
            icon: "warning",
            title: "중복된 이메일입니다",
            showConfirmButton: false,
            timer: 1500,
          });
        });
    } else {
      Swal.fire({
        icon: "error",
        title: "이메일 형식을 확인해주세요",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <Container>
      <Wrapper>
        <ThemeProvider theme={themeA306}>
          <SignupForm>
            <SignupHead>회원 가입</SignupHead>

            <SignupMsg>
              이미 SYNERGY 회원이신가요?
              <LinkLogin to="/login"> 로그인</LinkLogin>
            </SignupMsg>

            <SignupInput>
              <Grid item container xs={12} spacing={1}>
                <Grid item xs={12} sm={8}>
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
                <Grid item xs={12} sm={4}>
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
            </SignupInput>

            <SignupInput>
              <Grid item container xs={12} spacing={1}>
                <Grid item xs={12} sm={8}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel htmlFor="component-helper" shrink>
                      Email
                    </InputLabel>

                    <Input
                      id="component-helper-email"
                      placeholder="이메일을 입력해 주세요."
                      // value={email}
                      onChange={onChangeEmail}
                      required
                      aria-describedby="component-helper-text"
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <EmailButton onClick={emailCheck}>
                    이메일 중복체크
                  </EmailButton>
                </Grid>
              </Grid>
              {email.length > 0 && (
                <div className={`${isEmail ? "success" : "error"}`}>
                  {emailError}
                </div>
              )}
            </SignupInput>
            <SignupInput>
              <FormControl variant="standard" fullWidth>
                <InputLabel htmlFor="standard-adornment-password" shrink>
                  Password
                </InputLabel>
                <Input
                  id="standard-adornment-password"
                  type={showPassword ? "text" : "password"}
                  // value={password}
                  placeholder="비밀번호를 입력해 주세요."
                  onChange={onChangePassword}
                  required
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              {password.length > 0 && (
                <div className={`${isPassword ? "success" : "error"}`}>
                  {passwordError}
                </div>
              )}
            </SignupInput>

            <SignupInput>
              <FormControl variant="standard" fullWidth>
                <InputLabel htmlFor="standard-adornment-passwordConfirm" shrink>
                  Password Confirmation
                </InputLabel>
                <Input
                  id="standard-adornment-passwordConfirm"
                  type={showPasswordConfirm ? "text" : "password"}
                  // value={passwordConfirm}
                  placeholder="비밀번호를 다시 입력해 주세요."
                  onChange={onChangePasswordConfirm}
                  required
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPasswordConfirm}
                        onMouseDown={handleMouseDownPasswordConfirm}
                      >
                        {showPasswordConfirm ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              {passwordConfirm.length > 0 && (
                <div className={`${isPasswordConfirm ? "success" : "error"}`}>
                  {passwordConfirmError}
                </div>
              )}
            </SignupInput>
            <SignupInput>
              <Button
                type="submit"
                variant="contained"
                size="medium"
                fullWidth
                disabled={
                  !(
                    isNickName &&
                    isEmail &&
                    isPassword &&
                    isPasswordConfirm &&
                    usableNickName &&
                    usableEmail
                  )
                }
                ref={signupRef}
                onClick={onSignUp}
              >
                회원 가입
              </Button>
              {/* <div>{!usableNickName ? "닉네임 중복체크를 해주세요" : ""}</div> */}
              {/* <div>{!usableEmail ? "이메일 중복체크를 해주세요" : ""}</div> */}
            </SignupInput>
          </SignupForm>
        </ThemeProvider>
      </Wrapper>
    </Container>
  );
};

const Container = styled.div`
  // position: sticky;
  // align-self: center;
  // top: 0;
  // left: 0;
  // height: 60px;
  // width: 100%;
  // // padding:150px 0;
  // background-color: #D7D7D7;
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  background: linear-gradient(lightCyan, skyBlue, deepSkyBlue);
`;

const Wrapper = styled.div`
  display: flex;
  // align-items: center;
  // text-align: center;
  // background-color: #D7D7D7;
  justify-content: center;
  // z-index: 5;
  border-radius: 25px;
  box-shadow: 5px 5px 5px 5px;
  width: 50%;
  padding: 2em 0 4em;
  margin: 2em;
  background: white;
`;

const SignupHead = styled.h1`
  color: #000000;
  margin: 40px;
`;

const SignupMsg = styled.h5`
  color: #000000;
  margin: 40px;
  font-size: 16px;
`;

const SignupForm = styled.div`
  // display: flex;
  // flex-direction: column;
  // align-items: right;
  width: 500px;
  display: inline-block;
  // position: absolute;
`;

const SignupInput = styled.div`
  // display: flex;
  // flex-direction: column;
  // width: 500px;
  // text-align: center;
  // align-items: center;
  margin: 15px 0px;
`;

const SignupButton = styled.button`
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
const EmailButton = styled.button`
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

const LinkFindPassword = styled(Link)`
  // position: absolute;
  display: block;
  text-decoration: none;
  margin: 10px;
  // padding: 4px 8px;
  font-size: 13px;
  // font-weight: 500;
  // line-height: 1.6;
  color: #769fcd;
  // transition: color 0.08s ease-in-out;

  // &:hover {
  //   color: #fff;
  // }

  // display: block;
  // margin: auto;
  // margin-bottom: 8px;
  // padding: 12px;
  // color: #000000;
  // text-decoration: none;
  // font-size: 16px;
  // // align-self: center;
  // font-weight: 600;

  // &:hover {
  //   color: #000000;
  // }
`;

const LoginMsg = styled.div`
  text-decoration: none;
  font-size: 14px;
  font-weight: bold;
`;

const LinkLogin = styled(Link)`
  text-decoration: none;
  color: #39a2db;
`;

// const LoginInput = styled.div`
//   // display: flex;
//   // flex-direction: column;
// 	width: 500px;
// 	// text-align: center;
// 	// align-items: center;
// `;

export default Signup;
