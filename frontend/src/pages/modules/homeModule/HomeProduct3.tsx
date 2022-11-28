import React from "react";
import HomeProductLayout from "./HomeProudctLayOut";
import img from "../images/book.png";
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
              <div>우리만의 문제집 만들기</div>
            </Typography>
            <Typography
              color="black"
              align="center"
              component="span"
              sx={{ mb: 1, mt: { sx: 2, sm: 5 } }}
            >
              <h5>
                우리에게 맞는 주제로 커스텀 문제집을 만들 수 있어요.<br/>
                친구들과 원하는 단어들로 구성해 문제를 낼 수도 있고,<br/>
                단체에서 교육이나 레크레이션을 위해 활용할 수도 있답니다!<br/> 
                상황과 목적에 맞게 자유롭게 문제집을 생성, 삭제해보세요!
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
