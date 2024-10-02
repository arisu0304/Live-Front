import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Hls from "hls.js";
import axios from "axios";


const VideoPlayer = styled.video`
  width: 100%;
  height: 100%;
`;

const StyledButton = styled.button`
  margin: 10px;
  padding: 10px 20px;
  font-size: 20px;
  cursor: pointer;
  color: #fff;
  background: red;
  border-radius: 10px;
`;

const VideoSection = ({
  streamingUrl,
  navigate,
}) => {

  const videoRef = useRef(null);
  // const navigate = useNavigate();

  console.log(`streamingUrl 배열 ${JSON.stringify(streamingUrl)}`);

  useEffect(() => {
    if (streamingUrl && streamingUrl.length > 0) {
      const video = videoRef.current;
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(streamingUrl[0].url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play();
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamingUrl[0].url;
        video.addEventListener("loadedmetadata", function () {
          video.play();
        });
      }
    }
  }, [streamingUrl]);



  return (
    <>
        {streamingUrl && streamingUrl.length > 0 ? (
          <VideoPlayer controls ref={videoRef} muted>
            <source src={streamingUrl[0].url} type="application/x-mpegURL" />
          </VideoPlayer>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "#FFFFFF",
              fontSize: "1.5rem",
            }}
          >
            <div>비디오를 불러오는 중...</div>
          </div>
        )}
    </>
  );
};

export default VideoSection;