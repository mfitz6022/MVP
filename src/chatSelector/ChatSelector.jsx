import React, { useState } from 'react';
import VoiceChannel from './VoiceChannel'

const ChatSelector = ({ setCurrentChat, chatList, username, setUser, socket }) => {


  return (
    <div className="chat-selector">
      <VoiceChannel className="voice-channel" socket={socket} setUser={setUser} user={username}/>
      {chatList.map((chat, index) =>
      <div className="text-channel" onClick={() => {setCurrentChat(chat)}} key={index}>{chat}</div>)}
    </div>
  )
}

export default ChatSelector;