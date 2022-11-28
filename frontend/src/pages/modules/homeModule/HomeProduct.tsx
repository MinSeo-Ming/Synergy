import React from "react";
import HomeProductLayout from "./HomeProudctLayOut";
import img from "../images/logo_A306_2.png";
import { Button, Container, Link, Typography } from "@mui/material";
import {   useNavigate } from "react-router-dom";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import blue from "@mui/material/colors/blue";

const theme = createTheme({
  palette: {
    primary: {
      main: "#90caf9",
    },
  },
});

const HomeProduct = () => {


  const navigate = useNavigate();
  const handleClick =()=>{
    navigate('/channel/createchannel');
  }

  return (
    <ThemeProvider theme={theme}>
      <HomeProductLayout
        sxBackground={{
          backgroundImage: `url(${img})`,
          backgroundPosition: "center",
        }}
      >
        <img style={{ display: "none" }} src={img} alt="increase priority" />
        <Typography color="inherit" align="center" variant="h1">
          <div></div>
        </Typography>
        <Typography
          color="deepskyblue"
          align="center"
          variant="h1"
          sx={{ mb: 4, mt: { sx: 4, sm: 10 } }}
        >
          <br></br>
          <div>SYNERGY</div>
        </Typography>
        {/* <Link to="/meeting-main" style={{ textDecoration: "none" }}> */}
        <Button
          color="primary"
          variant="contained"
          size="large"
          sx={{ minWidth: 200 }}
          onClick={handleClick}
        >
          <div>GAME START</div>
        </Button>

        <Typography variant="body2" color="inherit" sx={{ mt: 2 }}></Typography>
        <Container>
        <div className="chc">
          <div className="ddddbox">
            <h5>아래로 스크롤 해보세요~!</h5>
          </div>
        </div>
        </Container>
      </HomeProductLayout>
    </ThemeProvider>
  );
};

export default HomeProduct;