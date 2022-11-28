import React, { useEffect, useState } from "react";
import { Link, Route, BrowserRouter,useLocation } from "react-router-dom";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import GitHubIcon from "@mui/icons-material/GitHub";
import YouTubeIcon from "@mui/icons-material/YouTube";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";


const Footer = () => {

  const location = useLocation();
  useEffect(()=>{
    
  }, [location])
  if (window.location.pathname === '/join'||window.location.pathname === '/channel/createchannel') return null;
  
  
  return (
    <Container>
      <Wrapper>
        <BrandWrapper>
          <Brand to="/">
            <Logo>
              <LogoImg src="/logo_A306_2.png" alt="SYNERGY logo img" />
              <LogoName>SYNERGY</LogoName>
            </Logo>
          </Brand>
        </BrandWrapper>
        <Line></Line>

        <ServiceWrapper>
          <ServiceMsg>
            <HeadMsg>문의 및 고객센터</HeadMsg>
            1:1 라이브챗
            <br />
            Email: SYNERGY@gmail.com
            <br />
            운영 시간 : 오전 9시 ~ 오후 6시 (주말 및 공휴일 휴무)
          </ServiceMsg>
          <SnsWrapper>
            <SnsIcon>
              <GitHubIcon></GitHubIcon>
            </SnsIcon>
            <SnsIcon
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <YouTubeIcon></YouTubeIcon>
            </SnsIcon>
            <SnsIcon href="#" target="_blank" rel="noopener noreferrer">
              <InstagramIcon></InstagramIcon>
            </SnsIcon>
            {/* <TwitterIcon></TwitterIcon> */}
          </SnsWrapper>
        </ServiceWrapper>
      </Wrapper>
    </Container>
  );
};

const Container = styled.footer`
  // position: sticky;
  // align-self: center;
  // top: 0;
  // left: 0;
  // height: 100px;
  // width: 100%;
  // padding:150px 0;
  background-color: deepSkyBlue;
  // height: 100px;
  margin-top: auto;
`;

const Wrapper = styled.div`
  // position: static;
  padding: 10px;
  height: inherit;
  // top: 0;
  // left: 0;
  // text-align: center;
  // align-self: center;
  // width: 100%;
  // padding:px 3px;
  // background-color: #13192f;
  // z-index: 3;
  // display: flex;
  // justify-content: space-between;
  align-self: center;
`;

const BrandWrapper = styled.div`
  // position: relative;
  // margin: 100px 100px
  align-items: center;
  display: flex;
  // align-text: center;
  align-self: center;
`;

const Brand = styled(Link)`
  // position: absolute;
  // display: flex;
  text-decoration: none;
`;

const Logo = styled.div`
  // position: absolute;
  display: flex;
`;

const LogoImg = styled.img`
  width: 30px;
  height: 30px;
  // margin: 0 auto;
  margin-left: 20px;
  margin-right: 10px;
`;

const LogoName = styled.span`
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

const Line = styled.div`
  border-bottom: 1px solid;
  border-color: #d7d7d7;
  margin: 15px 25px;
  // opacity: 0.5;
`;

const HeadMsg = styled.div`
  // border-bottom: 1px solid;

  // margin: 0px 25px;
  text-align: left;
  font-size: 17px;
  font-weight: 700;
`;

const ServiceWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  color: white;
`;

const ServiceMsg = styled.div`
  // border-bottom: 1px solid;
  margin: 5px 25px;
  text-align: left;
  font-size: 14px;
`;

const SnsWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 5px 25px;
`;

const SnsIcon = styled.a`
  margin-left: 10px;
  color: white;

  &:first-of-type {
    margin-left: 0;
  }
  &:hover {
    color: #3396f4;
  }
`;

const SnsIcon2 = css`
  font-size: 26px;
  color: #98a8b9;
  transition: color 0.08s ease-in-out;
  &:hover {
    color: #3396f4;
  }
`;

export default Footer;
