import React from "react";
import axios from "axios";

import { useState, useCallback } from "react";

import { Link, Outlet, useNavigate } from "react-router-dom";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";

import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import Button from "@mui/material/Button";

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

interface State {
  email: string;
  password: string;
  showPassword: boolean;
}

const Login = () => {
  const BE_URL = process.env.REACT_APP_BACKEND_URL;

  const [values, setValues] = React.useState<State>({
    email: "string",
    password: "",
    showPassword: false,
  });

  const navigate = useNavigate();

  // 유효성 검사
  const [isEmail, setIsEmail] = useState<boolean>(false);
  const [isPassword, setIsPassword] = useState<boolean>(false);
  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  // const router = useRouter();

  //에러메시지 저장
  const [emailError, setEmailError] =
    useState<string>("이메일을 입력해 주세요.");
  const [passwordError, setPasswordError] =
    useState<string>("비밀번호를 입력해 주세요.");

  // 로그인 버튼 클릭
  const onLogin = () => {
    axios
      .post(`${BE_URL}/auth/login`, {
        email: values.email,
        password: values.password,
      })
      .then((res) => {
        if (res.data.accessToken) {
          localStorage.setItem("access-token", res.data.accessToken);
        }
        Swal.fire({
          icon: "success",
          title: "로그인 되었습니다. :)",
          showConfirmButton: false,
          timer: 1500,
        });

        navigate("/");
      })
      .catch((error) => {
        if (error.response.status === 412) {
          Swal.fire({
            icon: "question",
            title: "이메일 인증 후 이용해주세요.",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "로그인 다시 시도해 주세요.",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
  };

  // 이메일 텍스트 필드가 바뀔때 마다 동작
  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      email: event.target.value,
    });

    const emailRegex =
      /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    const emailCurrent = event.target.value;

    if (event.target.value === "") {
      setEmailError("이메일을 입력해 주세요.");
      setIsEmail(false);
      setIsEmpty(true);
    } else if (!emailRegex.test(emailCurrent)) {
      setEmailError("이메일 형식에 맞게 입력해 주세요.");
      setIsEmail(false);
      setIsEmpty(false);
    } else {
      setEmailError("");
      setIsEmail(true);
      setIsEmpty(false);
    }
  };

  // 패스워드 텍스트 필드가 바뀔때 마다 동작
  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      password: event.target.value,
    });

    if (event.target.value === "") {
      setPasswordError("비밀번호를 입력해 주세요.");
      setIsPassword(false);
      setIsEmpty(true);
    } else if (event.target.value.length < 8) {
      setPasswordError("");
      setIsPassword(false);
      setIsEmpty(false);
    } else {
      setPasswordError("");
      setIsPassword(true);
      setIsEmpty(false);
    }
  };

  // 패스워드 보기 버튼이 눌릴때마다 동작
  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <Container>
      <Wrapper>
        <ThemeProvider theme={themeA306}>
          <LoginForm>
            <LoginHead>SYNERGY</LoginHead>
            <LoginMsg>SYNERGY에 오신것을 환영합니다.</LoginMsg>

            <LoginInput>
              <FormControl
                error={!isEmail && !isEmpty}
                variant="standard"
                fullWidth
              >
                <InputLabel htmlFor="component-helper" shrink>
                  Email
                </InputLabel>
                <Input
                  id="component-helper-email"
                  placeholder="이메일을 입력해 주세요."
                  onChange={handleChangeEmail}
                  required
                  aria-describedby="component-helper-text"
                />
                <FormHelperText id="component-helper-text">
                  {emailError}
                </FormHelperText>
              </FormControl>
            </LoginInput>

            <LoginInput>
              <FormControl
                error={!isPassword && !isEmpty}
                variant="standard"
                fullWidth
              >
                <InputLabel htmlFor="standard-adornment-password" shrink>
                  Password
                </InputLabel>
                <Input
                  id="standard-adornment-password"
                  type={values.showPassword ? "text" : "password"}
                  value={values.password}
                  placeholder="비밀번호를 입력해 주세요."
                  onChange={handleChangePassword}
                  required
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {values.showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                <FormHelperText id="component-helper-text">
                  {passwordError}
                </FormHelperText>
              </FormControl>
            </LoginInput>

            <LoginInput>
              <Button
                disabled={!(isEmail && isPassword && !isEmpty)}
                variant="contained"
                size="medium"
                fullWidth
                onClick={onLogin}
              >
                Login
              </Button>
            </LoginInput>

            {/* <LinkFindPassword to="/signup">
              비밀번호를 잊으셨나요?
            </LinkFindPassword> */}
            <SignupMsg>
              계정이 없으신가요?
              <LinkSignup to="/signup"> 가입하기</LinkSignup>
            </SignupMsg>
          </LoginForm>
        </ThemeProvider>
      </Wrapper>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  background: linear-gradient(lightCyan, skyBlue, deepSkyBlue);
`;

const Wrapper = styled.div`
  border-radius: 25px;
  box-shadow: 5px 5px 5px 5px;
  width: 50%;
  display: flex;
  justify-content: center;
  padding: 2em 0 4em;
  margin: 2em;
  background: white;
`;

const LoginHead = styled.h1`
  color: deepskyblue;
  margin: 40px;
`;

const LoginMsg = styled.h5`
  color: #000000;
  margin: 40px;
  font-size: 16px;
`;

const LoginForm = styled.div`
  width: 500px;
  display: inline-block;
`;

const LoginInput = styled.div`
  margin: 15px 0px;
`;

// const LinkFindPassword = styled(Link)`
//   display: block;
//   text-decoration: none;
//   margin: 10px;
//   font-size: 13px;
//   color: #769fcd;

//   &:hover {
//     color: #769fcd;
//   }
// `;

const SignupMsg = styled.div`
  text-decoration: none;
  font-size: 14px;
  font-weight: bold;
`;

const LinkSignup = styled(Link)`
  text-decoration: none;
  color: #39a2db;

  &:hover {
    color: #39a2db;
  }
`;

export default Login;
