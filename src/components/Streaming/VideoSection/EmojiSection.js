import confetti from "canvas-confetti";
import React from "react";
import styled from "styled-components";

const EmojiGroup = styled.div`
  width: 350px;
  height: 120px;
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const EmojiTitle = styled.p`
  font-size: 20px;
  text-align: center;
  color: #fff;
`;

const EmojiButtonGroup = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  height: 70px;
`;

const EmojiButton = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  background-color: #ffffff;
  font-size: 40px;
`;

const Emoji = ({ emoji, onEmojiClick }) => {
  const handleClick = (e) => {
    confetti({
      particleCount: 100,
      startVelocity: 30,
      spread: 360,
      origin: {
        x: 0.5,
        y: 0.4,
      },
      shapes: ["circle"],
    });
    onEmojiClick(emoji);
  };

  return <EmojiButton onClick={handleClick}>{emoji}</EmojiButton>;
};

const EmojiSection = ({ title, emojis, onEmojiClick }) => (
  <EmojiGroup>
    <EmojiTitle>{title}</EmojiTitle>
    <EmojiButtonGroup>
      {emojis.map((emoji) => (
        <Emoji emoji={emoji} key={emoji} onEmojiClick={onEmojiClick} />
      ))}
    </EmojiButtonGroup>
  </EmojiGroup>
);

export default EmojiSection;
