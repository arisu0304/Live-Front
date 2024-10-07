import React from "react";
import styled from "styled-components";

const InputContainer = styled.div`
  width: 100%;
  height: 7.5%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InputMessage = styled.input`
  width: 70%;
  height: 70%;
  padding-left: 20px;
  background-color: #f6f6f6;
  border-radius: 30px;
  border: none;
  outline: none;
`;

const SendButton = styled.button`
  width: 20%;
  height: 70%;
  background-color: #5ac467;
  border-radius: 30px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  color: white;
`;

const ChatInput = ({
  inputMessage,
  setInputMessage,
  handleKeyPress,
  handleSendMessage,
}) => (
  <InputContainer>
    <InputMessage
      type="text"
      value={inputMessage}
      onChange={(e) => setInputMessage(e.target.value)}
      onKeyPress={handleKeyPress}
    />
    <SendButton onClick={handleSendMessage}>보내기</SendButton>
  </InputContainer>
);

export default ChatInput;
