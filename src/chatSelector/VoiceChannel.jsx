import React, { useState, useEffect, useRef } from 'react';
import Webcam from "react-webcam";
import io from 'socket.io-client';
import { Peer } from 'peerjs';

const VoiceChannel = ({ user, setUser, socket }) => {
  const [isJoined, setIsJoined] = useState(false);
  const roomName = '@ Voice Channel';
  const username = user;

  const myPeer = new Peer(undefined, {
    host: '/',
    port: '3001',
  });

  myPeer.on('open', (id) => {
    socket.emit('join-room', {
      id: id,
      room: roomName,
      username: username,
    })
  })

  const videoGrid = document.getElementsByClassName('video-container')
  const myVideo = document.createElement('video')
  myVideo.muted = true

  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  }).then((stream) => {
    addVideoStream(myVideo, stream)
    myPeer.on('call', (call) => {
      call.answer(stream)
      const video = document.createElement('video')
      call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
      })
    })
    socket.on('user-connected', (username) => {
      connectToNewUser(username, stream)
    })
  })

  // socket.on('user-connected', (username, stream) => {
  //   connectToNewUser(username, stream)
  // })

  const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
    videoGrid[0].append(video)
  }

  const connectToNewUser = (id, stream) => {
    const call = myPeer.call(id, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
      video.remove();
    })
  }

  return (
    <div className="voice-channel-container">
      <div className="voice-channel-name" onClick={() => {setIsJoined(!isJoined)}}>{roomName}</div>
      <div className="video-container">

      </div>
      <div>users in channel go here</div>
    </div>
  )
}

export default VoiceChannel

