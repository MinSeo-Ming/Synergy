import React, { Component } from "react";
import styled from "styled-components";
import Message from "./Message";

const ChatContainer = styled.div``;

class Messages extends Component {
  render() {
    const { messages, myUserName } = this.props;

    return messages.map((message, i) => (
      <ChatContainer
        className={`messages__item ${message.boxClass}`}
        key={i}
      >
        <Message
          myUserName={myUserName}
          text={message.text}
          userName={message.userName}
          boxClass={`messages__box ${message.boxClass}`}
        />
      </ChatContainer>
    ));
  }
}

export default Messages;
