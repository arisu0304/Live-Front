import React, { useRef, useEffect } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";

const LiveStream = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const rtmpUrl = "rtmp://rtmp-ls2-k1.video.media.ntruss.com:8080/relay";
  const streamKey = "eqvmep6khooxe1em77kn13bghr4czeli";

  // FFmpeg 인스턴스 생성
  const ffmpeg = new FFmpeg({ log: true });

  const startStreaming = async () => {
    try {
      // 카메라, 마이크 접근
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;

      // FFmpeg 로직을 통해 RTMP로 전송
      if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
      }

      // 비디오 스트림 변환 및 RTMP로 송출하는 명령어 실행
      const command = `ffmpeg -re -i ${stream} -c:v libx264 -f flv ${rtmpUrl}/${streamKey}`;
      await ffmpeg.run(command);
    } catch (err) {
      console.error("Error starting stream: ", err);
    }
  };

  useEffect(() => {
    startStreaming();
  }, []);

  return (
    <div>
      <h1>Live Stream</h1>
      <video ref={videoRef} autoPlay muted playsInline></video>
      <button onClick={startStreaming}>Start Streaming</button>
    </div>
  );
};

export default LiveStream;
