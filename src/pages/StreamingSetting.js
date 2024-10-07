import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import StreamingSettingContent from '../components/StreamingSettingContent';
import { useNavigate, useParams } from 'react-router-dom';

const Container = styled.div`
  width: 90%;
  margin: 63px auto 0;
  padding: 25px 45px;
  background: #ececec;
  border-radius: 20px 20px 0 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const InputBox = styled.div`
  display: flex;
  align-items: center;
  margin-top: 25px;
  margin-bottom: 15px;
`;

const TitleText = styled.p`
  width: 140px;
  background: #7f7f7f;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #fff;
  border-radius: 30px;
`;

const LiveInfo = styled.p`
  width: 100%;
  padding-left: 25px;
  font-size: 18px;
  background-color: white;
  line-height: 50px;
  border-radius: 30px;
`;

const CheckButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 60px;
  margin-bottom: 20px;
`;

const LiveonButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 100px;
  margin-bottom: 30px;
`;

const StyledButton = styled.button`
  width: 230px;
  height: 50px;
  background-color: #5ac467;
  color: #fff;
  border: none;
  border-radius: 30px;
  font-size: 20px;
  cursor: pointer;
`;

const TextBox = styled.div`
  font-size: 20px;
  margin-top: 40px;
  text-align: center;
`;

const StreamingSetting = () => {

  const { id } = useParams(); 
  const navi = useNavigate();

  const [liveInfo, setLiveInfo] = useState({});
  const [isCreating, setIsCreating] = useState(false);
  const [chatRoomId, setChatRoomId] = useState('');

  const [channelInfo, setChannelInfo] = useState({
    publishUrl: '',
    streamKey: ''
  });

  // LIVE ON 버튼 클릭 시 경매방으로 이동하는 함수
  const handleLiveOnClick = () => {
    navi(`/live/${id}`);
  };

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
  }, []);


  return (
    <Container>
      <h1>
        방송 인코더 <span style={{ fontWeight: 'lighter' }}>설정</span>
      </h1>
      <InputBox>
        <TitleText>강의 생성</TitleText>
        <LiveInfo>{isCreating ? '강의가 생성 중입니다.' : '강의 생성 완료'}</LiveInfo>
      </InputBox>
      <InputBox>
        <TitleText>스트림 URL</TitleText>
        <LiveInfo>{channelInfo.publishUrl || '스트림 URL 생성 중입니다'}</LiveInfo>
      </InputBox>
      <InputBox>
        <TitleText>스트림 키</TitleText>
        <LiveInfo>{channelInfo.streamKey || '스트림 키 생성 중입니다'}</LiveInfo>
      </InputBox>

      <CheckButtonContainer>
        <StyledButton onClick={() => window.location.reload()}>강의 생성여부 확인</StyledButton>
      </CheckButtonContainer>
      <TextBox>
        <p><b>강의</b>가 활성화될 때까지 기다려주세요.</p>
        <p>강의가 생성되기 전, 스트림 URL과 스트림 키를 가지고 아래의 단계에 따라 <b>OBS 인코더를 설정</b>하세요.</p>
      </TextBox>
      <h1 style={{ margin: '100px 0 0' }}>
        OBS 인코더 <span style={{ fontWeight: 'lighter' }}>설정</span>
      </h1>
      <StreamingSettingContent publishUrl={channelInfo.publishUrl} streamKey={channelInfo.streamKey} />
      <LiveonButtonContainer>
        <StyledButton onClick={handleLiveOnClick} disabled={isCreating}>
          LIVE ON
        </StyledButton>
      </LiveonButtonContainer>
    </Container>
  );
};

export default StreamingSetting;
