import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { css } from "@emotion/react";
import styled from "@emotion/styled";

import Header from "../components/common/Header";
import Login from "../pages/Login";
import Logout from "../pages/Logout";
import Signup from "../pages/Signup";
import Mypage from "../pages/Mypage";
import CreateChannel from "../pages/CreateChannel";
import HomePage from "../pages/HomePage";
import EmailAUth from "../pages/EmailAuth";
import InvitePage from "../pages/InvitePage";

const Router = () => {
  // const HomePage: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/EmailAuth" element={<EmailAUth />} />
      <Route path="/users/mypage" element={<Mypage />} />
      <Route path="/channel/createchannel" element={<CreateChannel />} />
      <Route path="/join" element={<InvitePage />} />
    </Routes>
  );
};

export default Router;

const Main = styled.main`
  min - height: calc(100vh - 180px);

`;
