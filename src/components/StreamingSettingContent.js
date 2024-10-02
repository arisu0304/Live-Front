import React from "react";
import styled from "styled-components";

const TextBox = styled.div`
  font-size: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 10px 0 20px 20px;
`;

const StyledH3 = styled.h3`
  color: #188a26;
  margin-top: 50px;
`;

const StyledLink = styled.a`
  color: #5ac467;
  text-decoration: underline;
  cursor: pointer;
  &:hover {
    color: #00a815;
  }
`;

const CenteredImage = styled.img`
  display: block;
  margin: 0 25px;
  width: 50%;
`;

const StreamingSettingContent = ({ publishUrl, streamKey }) => {
  return (
    <div>
      <TextBox>
        <StyledH3>1단계 | OBS Studio에서 설치 프로그램 다운로드하기</StyledH3>
        <p>
          1-1. OBS Studio{" "}
          <StyledLink href="https://obsproject.com/download">
            다운로드 페이지
          </StyledLink>
          로 이동합니다.
        </p>
        <p>1-2. 다운로드 페이지에서 컴퓨터의 운영 체제를 선택합니다.</p>
        <p>1-3. 아래로 스크롤해 Download Installer를 클릭합니다.</p>
      </TextBox>
      <CenteredImage src="/img/obs_1.png" />
      <TextBox>
        <StyledH3>2단계 | 컴퓨터에 인코더 설치하기</StyledH3>
        <p>
          2-1.컴퓨터에서 OBS 설치 프로그램을 엽니다. (인증 창 표시 시, Install
          anyway 선택)
        </p>
        <p>
          2-2. <b>Next, I Agree,</b> 파일을 설치할 위치 선택 후 <b>Next</b>,
          구성 요소 검토 후 <b>Install</b>을 클릭합니다.
        </p>
        <p>
          2-3. <b>Finish</b>를 클릭합니다.
        </p>
      </TextBox>
      <TextBox>
        <StyledH3>3단계 | 인코더에 카메라 연결하기</StyledH3>
        <p>3-1. 컴퓨터에서 OBS Studio Encoder를 엽니다.</p>
        <p>
          3-2. OBS 프로그램 내 왼쪽 하단의 Source 아래 <b>Add</b>를 클릭합니다.
        </p>
        <p>
          3-3. <b>Create New</b>를 선택하고 카메라 이름을 지정한 후 <b>OK</b>를
          클릭합니다.
        </p>
        <p>
          3-4. <b>Device 드롭다운 목록</b>에서 컴퓨터의 <b>내장 카메라</b>를
          선택한 후 <b>OK</b>를 클릭합니다.
        </p>
      </TextBox>
      <TextBox>
        <StyledH3>4단계 | 방송 설정하기</StyledH3>
        <p>
          4-1. 상단 메뉴에서 <b>파일 &gt; 설정 &gt; 방송</b> 순서로 클릭합니다.
        </p>
      </TextBox>
      <CenteredImage src="/img/obs_2.png" />
      <TextBox>
        <p>4-2. 서버와 스트림 키 항목에 아래의 정보를 복사해 붙여넣습니다.</p>
        <p>
          <b>(서버)</b> 방송을 송출할 채널의 스트림 URL : {publishUrl}
        </p>
        <p>
          <b>(스트림 키)</b> 방송을 송출할 채널의 스트림 키 : {streamKey}
        </p>
        <p>
          4-3. <b>적용</b> 버튼을 클릭합니다.
        </p>
      </TextBox>
      <CenteredImage src="/img/obs_3.png" />
      <TextBox>
        <StyledH3>5단계 | 방송 시작 혹은 종료하기</StyledH3>
        <p>
          5-1. <b>방송 시작</b> 버튼을 클릭하여 Live Station 채널로 방송을
          시작합니다.
        </p>
        <p>
          5-2. <b>끝내기</b> 버튼을 클릭하여 방송을 종료합니다.
        </p>
      </TextBox>
      <CenteredImage src="/img/obs_4.png" />
    </div>
  );
};

export default StreamingSettingContent;