import { Grid2 } from '@mui/material'
import React from 'react'
import Streaming from './Streaming'
import Chatting from './Chatting'

const Live = () => {

  const chatRoomId = sessionStorage.getItem('chatRoomId');  // 생성된 채팅방 ID 가져오기

  return (
    <Grid2 container>
        <Grid2 size = {8}>
        <Streaming/>
        </Grid2>
        <Grid2 size = {4}>
          <Chatting roomId={chatRoomId}/>
        </Grid2>
      </Grid2>
  )
}

export default Live