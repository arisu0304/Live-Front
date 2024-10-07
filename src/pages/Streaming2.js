import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import VideoSection from "../components/Streaming/VideoSection/VideoSection";
import ChatSection from "../components/Streaming/ChatSection/ChatSection";
import axios from "axios";
import { ChannelContext } from "../context/context";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useNavigate } from "react-router";

const MainContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const Streaming2 = () => {
  const [chatLog, setChatLog] = useState([]);
  const [streamingUrl, setStreamingUrl] = useState([]);
  const { channelInfo, setChannelInfo } = useContext(ChannelContext);
  const [userType, setUserType] = useState(sessionStorage.getItem("userType"));
  const [stompClient, setStompClient] = useState(null);
  const [lectureId, setLectureId] = useState(0);
  const [userList, setUserList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedChannelInfo = JSON.parse(sessionStorage.getItem("channelInfo"));
    if (savedChannelInfo) {
      setChannelInfo(savedChannelInfo);
    }
  }, []);

  useEffect(() => {
    const channelId = channelInfo.channelId;

    const getStreamingUrl = async () => {
      let currentLectureId = lectureId;

      const url = `https://localhost:9090/live/url/${channelId}`

      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
          },
        });

        console.log(response.data);

        setStreamingUrl(response.data.items);
        
        if (userType === "teacher" || userType === "admin") {
          currentLectureId = channelInfo.lectureId;
          setLectureId(currentLectureId);
        } else {
          currentLectureId = response.data.item.lectureId;
          setLectureId(currentLectureId);
        }

        if (!stompClient) {
          const socket = new SockJS("https://eduventure.site:5443/ws");
          const client = Stomp.over(socket);

          setStompClient(client);

          client.connect(
            {},
            (frame) => {
              console.log("Connected: " + frame);
              client.subscribe(
                `/topic/lecture/${currentLectureId}`,
                (message) => {
                  const newMessage = JSON.parse(message.body);
                  setChatLog((prevChatLog) => [...prevChatLog, newMessage]);
                  setUserList(newMessage.userList);
                  console.log(
                    `newMessage 객체 값: ${JSON.stringify(newMessage)}`
                  );
                  console.log(`newMessage.exit 값: ${newMessage.exit}`);
                  console.log(`userType 값: ${userType}`);
                  if (userType === "student" && newMessage.exit === true) {
                    console.log(
                      `조건문 : newMessage 객체 값: ${JSON.stringify(
                        newMessage
                      )}`
                    );
                    console.log(
                      `조건문 : newMessage.exit 값: ${newMessage.exit}`
                    );
                    console.log(`조건문 : userType 값: ${userType}`);
                    alert(chatLog.content);
                    navigate("/");
                  }
                }
              );
              let token = sessionStorage.getItem("ACCESS_TOKEN");
              client.send(`/app/sendMsg/${currentLectureId}/addUser`, {
                Authorization: "Bearer " + token,
              });
            },
            (error) => {
              console.log(error);
            }
          );
        }

        const handleBeforeUnload = () => {
          if (stompClient !== null) {
            let token = sessionStorage.getItem("ACCESS_TOKEN");
            stompClient.send(`/app/sendMsg/${currentLectureId}/leave`, {
              Authorization: "Bearer " + token,
            });
            stompClient.disconnect();
          }
        };

        // beforeunload 이벤트 리스너 등록
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
          // cleanup 함수에서 beforeunload 이벤트 리스너 제거
          window.removeEventListener("beforeunload", handleBeforeUnload);

          if (stompClient !== null) {
            let token = sessionStorage.getItem("ACCESS_TOKEN");
            stompClient.send(`/app/sendMsg/${currentLectureId}/leave`, {
              Authorization: "Bearer " + token,
            });
            stompClient.disconnect();
          }
        };
      } catch (error) {
        console.log(error);
        const message =
          userType === "teacher" || userType === "admin"
            ? "강의를 송출할 수 없습니다 다시 채널을 만들어 주세요"
            : "현재 수강 중인 강의가 없습니다";
        alert(message);
      }
    };

    if (userType === "teacher" || userType === "admin") {
      if (channelId) getStreamingUrl();
    } else {
      getStreamingUrl();
    }
  }, [channelInfo]);

  const addEmojiMessage = (emoji, type) => {
    const userName = sessionStorage.getItem("userName") || "익명";
    const messageType = type === "응원하기" ? "응원" : "반응";
    const message = `${emoji} ${messageType}을 보냈습니다.`;

    const time = new Date();
    let hour = time.getHours();
    const minute = String(time.getMinutes()).padStart(2, "0");
    const ampm = hour >= 12 ? "오후" : "오전";
    hour = hour % 12 || 12;
    hour = String(hour).padStart(2, "0");

    const chatMessage = {
      sender: userName,
      content: message,
      time: `${ampm} ${hour}:${minute}`,
    };

    if (stompClient && stompClient.connected) {
      let token = sessionStorage.getItem("ACCESS_TOKEN");
      stompClient.send(
        `/app/sendMsg/${lectureId}`,
        { Authorization: "Bearer " + token },
        JSON.stringify(chatMessage)
      );
    } else {
      console.error("WebSocket 연결이 되어 있지 않습니다.");
    }
  };

  return (
    <MainContainer>
      <VideoSection
        addEmojiMessage={addEmojiMessage}
        streamingUrl={streamingUrl}
        userType={userType}
        chatLog={chatLog}
        stompClient={stompClient}
        lectureId={lectureId}
        userList={userList}
        navigate={navigate}
      />
      <ChatSection
        chatLog={chatLog}
        setChatLog={setChatLog}
        stompClient={stompClient}
        lectureId={lectureId}
      />
    </MainContainer>
  );
};

export default Streaming2;
