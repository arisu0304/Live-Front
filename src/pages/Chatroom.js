import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const Chatroom = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socket = useRef(null);

  const nickname = useSelector(state => state.memberSlice.nickname);

  useEffect(() => {

    if (!nickname) return;

    // WebSocket 연결
    socket.current = new WebSocket("ws://192.168.0.38:9090/chat");

    socket.current.onopen = () => {
      console.log("WebSocket 연결이 열렸습니다.");
      // 연결이 열리면 사용자 이름을 서버로 전송
      socket.current.send(JSON.stringify({ type: 'join', username: nickname }));
    };

    socket.current.onmessage = (event) => {
      console.log("서버로부터 메시지:", event.data);  
      const message = event.data;
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.current.onclose = () => {
      console.log("WebSocket 연결이 닫혔습니다.");
      socket.current = null;
    };

    return () => {
      if (socket.current) {
        socket.current.close();
      }
    };
  }, [nickname]);

  const sendMessage = () => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify({ type: 'message', username : nickname, content: input }));
      setInput(""); // 입력 필드 초기화
    } else {
      console.error("WebSocket is not open.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div>
      <h1>Chat Room</h1>
      <div style={{ border: "1px solid black", height: "300px", overflowY: "scroll", padding: "10px" }}>
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type your message here"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chatroom;
