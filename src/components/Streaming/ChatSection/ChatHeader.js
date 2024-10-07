import React from "react";
import styled from "styled-components";

const StyledChatHeader = styled.div`
  width: 100%;
  height: 7.5%;
  background: #5ac467;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`;

const ChatHeader = () => <StyledChatHeader>채 팅 하 기</StyledChatHeader>;

export default ChatHeader;
