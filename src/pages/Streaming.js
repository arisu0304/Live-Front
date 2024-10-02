import React, {useEffect, useState, useContext} from 'react';
import Hls from 'hls.js';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import VideoSection from '../components/VidoeSection';
import axios from 'axios';

const MainContainer = styled.div`
  display: flex;
  height: 100vh;
`;
const Streaming = () => {
    const [chatLog, setChatLog] = useState([]);
    const [streamingUrl, setStreamingUrl] = useState([]);
    const [userType, setUserType] = useState(sessionStorage.getItem("userType"));
    const [stompClient, setStompClient] = useState(null);
    const [lectureId, setLectureId] = useState(0);
    const [userList, setUserList] = useState([]);
    const navigate = useNavigate();

    const getStreamingUrl = async () => {
        let currentLectureId = lectureId;
  
        const url = "http://192.168.0.38:9090/live/student/lecture?channelId=ls-20241002150510-uHxfe";
        try {
          const response = await axios.get(url);
          console.log(response.data);
          setStreamingUrl(response.data.items); 
          
        } catch (error) {
          console.log(error);
          const message =
            userType === "teacher" || userType === "admin"
              ? "강의를 송출할 수 없습니다 다시 채널을 만들어 주세요"
              : "현재 수강 중인 강의가 없습니다";
          alert(message);
        }
      };

    useEffect(() => {
        const savedChannelInfo = JSON.parse(sessionStorage.getItem("channelInfo"));
        getStreamingUrl();
    }, []);

    

  return (
    <VideoSection streamingUrl={streamingUrl} navigate={navigate}/>
  );
};

export default Streaming;