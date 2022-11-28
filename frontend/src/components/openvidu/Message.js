import React, { Component } from "react";
import styled from "styled-components"; // npm i styled-components
import './Message.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
const Username = styled.p`
  // display: inline-flex;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 5px;
`;

const MessageContainer = styled.div`
  // width: 200px;
  width: 100%;
`;

const Text = styled.p`
  // display: inline-flex;
  font-size: 0.8rem;
  padding: 5px;
`;


class Message extends Component {
  
  render() {
    
    const { text, userName, boxClass, myUserName } = this.props;

    return ( 
      <div>
         {userName === myUserName ?
        <MessageContainer id='mycontainer'>
          <div style={{ 
            display: 'flex',
            flexDirection: 'row-reverse'
            }}>
          <AccountCircleIcon id='myicon' sx={{color: 'skyblue'}}/>
          <Username id='myname'>{userName}</Username>
         </div>
         <Text id='me' className={boxClass}>{text}</Text>
       </MessageContainer>
        
          : 
      <MessageContainer id='yourcontainer'>
        <div style={{
          display: 'flex',
          flexDirection: 'row'
        }}>
        <AccountCircleIcon id='youricon' sx={{color: '#45a6fb'}}/>
        <Username id='yourname'>{userName}</Username> 
        </div>
        <Text id='you' className={boxClass}>{text}</Text>
      </MessageContainer>}
      
      </div>
     
    );
  }
}

export default Message;
