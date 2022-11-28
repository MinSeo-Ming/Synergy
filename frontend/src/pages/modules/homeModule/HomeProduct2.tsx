import React from "react";
import HomeProductLayout from "./HomeProudctLayOut";
import img from "../images/game-console (1).png";
import { Button, Container, Grid, Link, Typography } from "@mui/material";

import blue from "@mui/material/colors/blue";

const HomeProduct = () => {
  return (
    <HomeProductLayout
      sxBackground={{
        backgroundPosition: "center",
      }}
    >
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography
              color="black"
              align="center"
              variant="h3"
              sx={{ mb: 2, mt: { sx: 4, sm: 10 } }}
            >
              <div>아이스 브레이킹을 위한<br/> 다양한 게임 기능</div>
            </Typography>
            <Typography
              color="black"
              align="center"
              component="span"
              sx={{ mb: 1, mt: { sx: 2, sm: 5 } }}
            >
              <h5>
                친구들과 이야기도 하고 게임을 하며 놀고 싶을 때,<br/>
                또는 서로 만난 지 얼마 안되어 어색하고 낯선 사이일 때,<br/>
                SYNERGY의 다양한 게임 기능을 이용해 보세요! 🙂<br/>
                채널을 손쉽게 생성해 게임을 즐기고,<br/> 
                더욱 친밀한 사이가 될 수 있습니다.
              </h5>
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography
              color="black"
              align="center"
              variant="h3"
              sx={{ mb: 1, mt: { sx: 2, sm: 5 } }}
            >
              {/* 여기다 이미지박아용 */}
              <img src={img} width="300vw"></img>
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </HomeProductLayout>
  );
};

export default HomeProduct;
