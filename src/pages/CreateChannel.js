import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CreateChannel = () => {
    const navigate = useNavigate();
    const user_id = useSelector(state => state.memberSlice.id);
    const userIdAsString = String(user_id);

    // 액세스 토큰 발급 함수 (필요 시 토큰 발급)
    const getAccessToken = async () => {
        try {
            const response = await axios.post('https://dashboard-api.ncloudchat.naverncp.com/v1/api/token', {
                id: "aaaaaaaa",
                expireDay: 10
            }, {
                headers: {
                    'X-API-KEY': '32090982a2191b98e328a24e657a5b24b9b0e52922cef428',
                    'X-PROJECT-ID': 'd14299de-d2c1-413a-ab96-7760a0e56639'
                }
            });

            const token = response.data.token;
            sessionStorage.setItem('NCHAT_ACCESS_TOKEN', token);  // 토큰을 세션에 저장
            return token;
        } catch (error) {
            console.error('Error getting access token:', error);
            return null;
        }
    };

    // 채팅방 생성 함수 (Nchat API)
    const createChatRoom = async (channelId, accessToken) => {
        try {
            const response = await axios.post(`https://dashboard-api.ncloudchat.naverncp.com/v1/api/channels`, {
                type: 'PUBLIC',  // Ncloud Chat 프로젝트 ID
                name: `Live Streaming Room for ${channelId}`,  // 채팅방 이름 (채널 ID 포함)
            }, {
                headers: {
                    'X-API-KEY': '32090982a2191b98e328a24e657a5b24b9b0e52922cef428',
                    'X-PROJECT-ID': 'd14299de-d2c1-413a-ab96-7760a0e56639',
                    'Content-Type': 'application/json'
                }
            });

            console.log('Chat room created:', response.data);
            return response.data.channel.id;  // 생성된 채팅방 ID 반환
        } catch (error) {
            console.error('Error creating chat room:', error);
            return null;
        }
    };
    
     // 채널 생성 및 채팅방 생성 함수
     const createChannel = async () => {
        try {
            // 1. 토큰 발급 (세션에서 토큰이 없을 경우에만 발급)
            let accessToken = sessionStorage.getItem('NCHAT_ACCESS_TOKEN');
            if (!accessToken) {
                accessToken = await getAccessToken();
                if (!accessToken) {
                    console.error('토큰 발급 실패');
                    return;
                }
            }

            // 2. 라이브 채널 생성 요청
            const response = await axios.post(`http://192.168.0.38:9090/live/lecture?title=test`);
            console.log(response);

            // 3. 생성된 채널 정보를 sessionStorage에 저장
            sessionStorage.setItem("channelInfo", JSON.stringify(response.data.item));

            // 4. 채널 ID로 채팅방 생성 (Nchat API)
            const roomId = await createChatRoom(response.data.item.channelId, accessToken);

            // 5. 생성된 채팅방 정보를 sessionStorage에 저장 (필요 시)
            sessionStorage.setItem("chatRoomId", roomId);

            // 6. 채널 설정 페이지로 이동
            navigate("/setting");
        } catch (e) {
            console.error('Error creating channel or chat room:', e);
        }
    };

  return (
    <div>
        <button onClick={createChannel}>채널 및 채팅방 생성</button>
    </div>
  )
}

export default CreateChannel