import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import VideoSection from '../components/VidoeSection';

const AuctionRoom = () => {
    const [messages, setMessages] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const [messageInput, setMessageInput] = useState("");
    const [connected, setConnected] = useState(false); // 연결 상태 관리
    const [streamingUrl, setStreamingUrl] = useState([]); // 스트리밍 URL 관리

    useEffect(() => {
        axios.get(`/live/lecture/${liveStationId}`)
            .then(response => {
                const { userRole, publishUrl, streamKey } = response.data.item;
                if (userRole === 'seller') {
                    // 판매자일 경우 OBS 설정 화면 표시
                    setStreamInfo({ publishUrl, streamKey });
                    setIsSeller(true);
                } else {
                    // 구매자일 경우 스트리밍 화면 표시
                    setIsBuyer(true);
                }
            })
            .catch(error => {
                console.error("Error fetching live station info:", error);
            });
    }, [liveStationId]);

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
                client.subscribe('/topic/public', (messageOutput) => {
                    const newMessage = JSON.parse(messageOutput.body);
                    setMessages((prevMessages) => [...prevMessages, newMessage]);
                });
            },
            onStompError: (error) => {
                console.error("WebSocket error: ", error);
            }
        });

        client.activate(); // WebSocket 연결 활성화
        setStompClient(client); // 연결된 stompClient 저장

        // 컴포넌트가 언마운트될 때 WebSocket 연결 해제
        return () => {
            if (client) {
                client.deactivate();
                console.log("WebSocket disconnected");
            }
        };
    }, []); // 빈 배열을 두어 useEffect가 한 번만 실행되도록 함


    const sendMessage = () => {
        if (connected && messageInput.trim() !== "") { // 연결이 된 경우에만 메시지 전송
            const message = {
                user: "사용자", // 현재 로그인한 사용자 이름 또는 ID
                text: messageInput
            };
            stompClient.publish({ destination: "/app/chat.sendMessage", body: JSON.stringify(message) });
            setMessageInput(""); // 메시지 전송 후 입력 필드 비우기
        } else {
            console.log("STOMP 클라이언트가 아직 연결되지 않았습니다.");
        }
    };

    // 가상의 스트리밍 URL 설정 (실제 URL을 가져오는 로직 필요)
    useEffect(() => {
        // 여기에 API 호출 또는 스트리밍 URL을 가져오는 로직을 추가
        // 가상의 스트리밍 URL 예시:
        const url = [{ url: "https://livestation.ncloud.com/stream/{stream-id}.m3u8" }];
        setStreamingUrl(url);
    }, []);

    return (
        <>
            {/* 스트리밍 섹션 */}
            <div>
                <h2>실시간 스트리밍</h2>
                {/* VideoSection 컴포넌트에 streamingUrl 전달 */}
                <VideoSection streamingUrl={streamingUrl} />
            </div>
            
            {/* 채팅 섹션 */}
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
