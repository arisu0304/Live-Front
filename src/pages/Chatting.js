import React from 'react'
import { useState } from 'react';
import axios from 'axios';


const Chatting = ({ roomId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = async () => {
    if (newMessage.trim()) {
      await sendMessageToNchat(roomId, newMessage);
      setNewMessage('');
      // 메시지 전송 후 채팅방 메시지 업데이트
      // Nchat API에서 채팅방 메시지 리스트 받아서 업데이트
    }
  };

   // Nchat API로 메시지 전송하는 함수
   const sendMessageToNchat = async (roomId, message) => {
    try {
      const response = await axios.post(`https://dashboard-api.ncloudchat.naverncp.com/v1/api/messages/${roomId}`, {
        content : message,
      }, {
        headers: {
          'X-API-KEY': '32090982a2191b98e328a24e657a5b24b9b0e52922cef428',
          'X-PROJECT-ID': 'd14299de-d2c1-413a-ab96-7760a0e56639'
        }
      });

      console.log('Message sent:', response.data);
      // 메시지가 성공적으로 전송된 후, 새로운 메시지 추가
      setMessages(prevMessages => [...prevMessages, message]);

    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div>
      <div className="chat-window">
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="메시지를 입력하세요"
      />
      <button onClick={sendMessage}>전송</button>
    </div>
  );
};

export default Chatting