import React, { useEffect, useState } from "react";

import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import AOS from "aos";
import "../aos/dist/aos.css";
import HomeProduct from "./modules/homeModule/HomeProduct";
import HomeProduct2 from "./modules/homeModule/HomeProduct2";
import HomeProduct3 from "./modules/homeModule/HomeProduct3";
import ScrollToTopButton from "./modules/homeModule/ScrollToTop";
import "./modules/homeModule/HomeProduct.css";

const HomePage = () => {
  AOS.init();

  // const HomePage: React.FC = () => {
  return (
    <Container>
      <div data-aos="zoom-in" data-aos-duration="2000">
        <HomeProduct />
      </div>
      <div data-aos="zoom-in" data-aos-duration="2000">
        <HomeProduct2 />
      </div>
      <div data-aos="zoom-in" data-aos-duration="2000">
        <HomeProduct3 />
      </div>

      <div>
        <ScrollToTopButton />
      </div>
    </Container>
  );
};

const Container = styled.div`
  background: linear-gradient(lightCyan, skyBlue, deepSkyBlue);
`;

export default HomePage;
