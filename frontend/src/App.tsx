import React, {useEffect} from "react";
import logo from "./logo.svg";
import "./App.css";

// import Routes from 'react-router-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { css } from "@emotion/react";
import styled from "@emotion/styled";

import Router from "./router/Router";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import HomePage from "./pages/HomePage";

const App = () => {
  return (
    <div className="App">
      <div>
        <BrowserRouter>
          <Header />
          <Main>
            <Router />
          </Main>
          <Footer />
        </BrowserRouter>
      </div>
    </div>

    // <BrowserRouter>
    // <Routes>
    //   <Route path='/' element={<HomePage />} />
    //   <Route path='/article' element={<ArticlePage />} />
    //   <Route path='/about' element={<AboutPage />} />
    // </Routes>
    // </BrowserRouter>

    // <Header></Header>
    // <div>
    //   <HomePage></HomePage>
    //   <ArticlePage></ArticlePage>
    // </div>
    // <Routes>
    //   <Route path="/" element={<HomePage />} />
    // </Routes>
    // <div>
    // <Header></Header>

    //   </div>
    //   <Routes>
    //   <Route path="/" element={<Header/>} >
    //     <Route path="/article" element={<ArticlePage/>} />
    //     <Route path="/users" element={<Header />} />
    //   </Route>
    // </Routes>
    // <div></div>
  );
};

export default App;

const Main = styled.main`
  min-height: calc(100vh - 80px);
  //padding-top: 60px;
`;
