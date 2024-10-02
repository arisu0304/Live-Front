import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import axios from 'axios';
import StreamingSettingContent from '../components/StreamingSettingContent';
import { Link } from 'react-router-dom';


const Container = styled.div`
  width: 90%;
  height: auto;
  margin: 63px auto 0 auto;
  padding: 25px 45px;
  background: #ececec;
  border-radius: 20px 20px 0 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const InputBox = styled.div`
  width: 100%;
  height: 50px;
  position: relative;
  display: flex;
  align-items: center;
  margin-top: 25px;
  margin-bottom: 15px;
`;

const TitleText = styled.p`
  width: 140px;
  height: 50px;
  margin: 0 10px 0 0;
  border-radius: 30px;
  background: #7f7f7f;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #fff;
`;

const LiveInfo = styled.p`
  width: 1500px;
  height: 50px;
  line-height: 50px;
  border-radius: 30px;
  border: none;
  padding-left: 25px;
  font-size: 18px;
  outline: none;
  background-color: white;
`;

const CheckButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 60px;
  margin-bottom: 20px;
`;

const LiveonButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 100px;
  margin-bottom: 30px;
`;

const StyledButton = styled.button`
  width: 230px;
  height: 50px;
  background-color: #5ac467;
  color: #ffffff;
  border: none;
  border-radius: 30px;
  font-size: 20px;
  cursor: pointer;
`;

const TextBox = styled.div`
  font-size: 20px;
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StreamingSetting = () => {
    const channelInfo = JSON.parse(sessionStorage.getItem('channelInfo'));
    const chatRoomId = sessionStorage.getItem('chatRoomId');  // 생성된 채팅방 ID 가져오기
    const channelId = channelInfo.channelId;
    const [liveInfo, setLiveInfo] = useState({}); // 라이브방송 채널 정보
    const [isCreating, setIsCreating] = useState(false); // 채널 생성 여부
  
    console.log(`settingItem컴포넌트 채널ID ${channelId}`);
  
    const getLiveInfo = async () => {
      const savedChannelInfo = JSON.parse(sessionStorage.getItem("channelInfo"));
  
      try {
        console.log(`getLiveInfo함수 channelID ${channelId}`);
        const response = await axios.get(
          `http://192.168.0.38:9090/live/lecture/${channelId}`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
            },
          }
        );
        console.log(response.data.item);
        setLiveInfo(response.data.item);
        console.log(
          `생성 여부 확인  liveInfo 상태값: ${JSON.stringify(liveInfo)}`
        );
        setIsCreating(
          response.data.item.cdnStatus === "creating" ||
            response.data.item.cdnStatus === undefined ||
            response.data.item.cdnStatus === null
        );
      } catch (error) {
        console.log(error);
      }
    };
  
    useEffect(() => {
      getLiveInfo();
    }, []);
  
    return (
      <div>
        <Container>
          <h1>
            방송 인코더 <span style={{ fontWeight: "lighter" }}>설정</span>
          </h1>
          <InputBox>
            <TitleText>강의 생성</TitleText>
            <LiveInfo>
              {isCreating ? "강의가 생성 중입니다." : "강의 생성 완료"}
            </LiveInfo>
          </InputBox>
          <InputBox>
            <TitleText>스트림 URL</TitleText>
            <LiveInfo placeholder="스트림 URL 생성 중입니다">
              {channelInfo.publishUrl}
            </LiveInfo>
          </InputBox>
          <InputBox>
            <TitleText>스트림 키</TitleText>
            <LiveInfo placeholder="스트림 키 생성 중입니다">
              {channelInfo.streamKey}
            </LiveInfo>
          </InputBox>

           {/* 채팅방 정보 표시 */}
           <InputBox>
              <TitleText>채팅방 ID</TitleText>
              <LiveInfo>{chatRoomId}</LiveInfo>
          </InputBox>

          <CheckButtonContainer>
            <StyledButton onClick={getLiveInfo}>강의 생성여부 확인</StyledButton>
          </CheckButtonContainer>
          <TextBox>
            <p>
              <b>강의</b>가 활성화될 때까지 기다려주세요.
            </p>
            <p>
              강의가 생성되기 전, 스트림 URL과 스트림 키를 가지고 아래의 단계에
              따라 <b>OBS 인코더를 설정</b>하세요.
            </p>
          </TextBox>
          <h1 style={{ margin: "100px 0 0" }}>
            OBS 인코더 <span style={{ fontWeight: "lighter" }}>설정</span>
          </h1>
          <StreamingSettingContent
            publishUrl={channelInfo.publishUrl}
            streamKey={channelInfo.streamKey}
          />
          <LiveonButtonContainer>
            <Link to="/liveStream">
              <StyledButton disabled={isCreating}>LIVE ON</StyledButton>
            </Link>
          </LiveonButtonContainer>
        </Container>
      </div>
    );
};

export default StreamingSetting;