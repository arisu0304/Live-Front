import React, { forwardRef } from "react";
import styled from "styled-components";

const ChatContentWrapper = styled.div`
  width: 100%;
  height: 85%;
  background: #fff;
  overflow-y: scroll;
`;

const MessageContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const MessageBox = styled.div`
  background-color: #e6e6e6;
  padding: 15px 25px;
  border-radius: 30px;
  margin-bottom: 10px;
  position: relative;
`;

const styles = {
  senderName: {
    fontSize: "15px",
  },
  messageText: {
    fontSize: "14px",
  },
  timeStamp: {
    fontSize: "13px",
    position: "absolute",
    right: "5px",
    bottom: "-25px",
  },
};

const ChatContent = forwardRef(({ chatLog }, ref) => (
  <ChatContentWrapper ref={ref}>
    {chatLog.map((chat, index) => (
      <MessageContainer key={index}>
        <MessageBox>
          <strong style={styles.senderName}>{chat.sender}</strong>
          <br />
          <span style={styles.messageText}>{chat.content}</span>
          <span style={styles.timeStamp}>{chat.time}</span>
        </MessageBox>
      </MessageContainer>
    ))}
  </ChatContentWrapper>
));

export default ChatContent;
