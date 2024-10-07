import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import VideoSection from '../components/VidoeSection';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AuctionRoom = () => {

    const { id } = useParams();

    const [messages, setMessages] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const [messageInput, setMessageInput] = useState("");
    const [connected, setConnected] = useState(false); // WebSocket 연결 상태
    const [streamingUrl, setStreamingUrl] = useState(); // 스트리밍 URL 관리
    const [isSeller, setIsSeller] = useState(false); // 판매자 여부
    const [isBuyer, setIsBuyer] = useState(false); // 구매자 여부
    const [streamInfo, setStreamInfo] = useState({}); // 스트리밍 정보
    
    const [liveInfo, setLiveInfo] = useState({});
    const [isCreating, setIsCreating] = useState(false);
    const [chatRoomId, setChatRoomId] = useState('');
    const [channelInfo, setChannelInfo] = useState({
        publishUrl: '',
        streamKey: ''
    });

    // 백엔드에서 경매와 스트리밍 정보를 가져오는 함수
  useEffect(() => {

    const fetchAuctionAndChannelInfo = async () => {
      try {

        // 채팅방 및 스트리밍 정보를 서버에서 가져옴
        const channelResponse = await axios.get(`http://localhost:9090/auction/${id}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('ACCESS_TOKEN')}`,
          },
        });

        const channelData = channelResponse.data;
        setChannelInfo({
          publishUrl: channelData.streamUrl,
          streamKey: channelData.streamKey
        });
        setChatRoomId(channelData.chatRoomId);

        console.log(channelData);

      } catch (error) {
        console.error('Error fetching live station info:', error);
      }
    };

    fetchAuctionAndChannelInfo();

    console.log(channelInfo.publishUrl);
  }, []);


    // WebSocket 연결 및 메시지 구독
    useEffect(() => {
        const socket = new SockJS('http://localhost:9090/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => {
                console.log(str);
            },
            onConnect: () => {
                console.log("Connected to WebSocket");
                setConnected(true); // 연결 완료 시 상태 업데이트
                client.subscribe(`/topic/public/${id}`, (messageOutput) => {
                    const newMessage = JSON.parse(messageOutput.body);
                    setMessages((prevMessages) => [...prevMessages, newMessage]);
                });
            },
            onStompError: (error) => {
                console.error("WebSocket error: ", error);
            }
        });

        client.activate(); // WebSocket 연결 활성화
        setStompClient(client);

        return () => {
            if (client) {
                client.deactivate();
                console.log("WebSocket disconnected");
            }
        };
    }, [id]);

    // 메시지 전송
    const sendMessage = () => {
        if (connected && messageInput.trim() !== "") {
            const message = {
                user: "사용자", 
                text: messageInput
            };
            stompClient.publish({ destination: `/app/chat.sendMessage/${id}`, body: JSON.stringify(message) });
            setMessageInput(""); 
        } else {
            console.log("STOMP 클라이언트가 아직 연결되지 않았습니다.");
        }
    };

    return (
        <>
            <div>
                <h2>실시간 스트리밍</h2>
                    <VideoSection streamingUrl={[channelInfo.publishUrl.streamUrl]} />
            </div>
            
            <div>
                <h1>채팅</h1>
                <div style={{ border: '1px solid #ccc', padding: '10px', height: '400px', overflowY: 'scroll' }}>
                    {messages.map((msg, index) => (
                        <p key={index}><strong>{msg.user}:</strong> {msg.text}</p>
                    ))}
                </div>
                <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="메시지를 입력하세요..."
                />
                <button onClick={sendMessage}>전송</button>
            </div>
        </>
    );
};

export default AuctionRoom;
