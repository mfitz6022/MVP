import React, { useState, useEffect, useRef } from 'react';
import Webcam from "react-webcam";
import io from 'socket.io-client';
import { Peer } from 'peerjs';

const VoiceChannel = ({ user, setUser, socket }) => {
  const [isJoined, setIsJoined] = useState(false);
  const roomName = '@ Voice Channel';
  const username = user;
  const videoGrid = document.getElementsByClassName('video-container')
  const myVideo = document.createElement('video')
  myVideo.muted = true

  const myPeer = new Peer(undefined, {
    host: '/',
    port: '3001',
  });

  const peers = {};
  let currentId;

  const joinChat = () => {
    myPeer.on('open', (id) => {
      currentId = id;
      console.log('shit', currentId);
      socket.emit('join-room', {
        id: id,
        room: roomName,
        username: username,
      })
    })

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
  };

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
    peers[username] = call;
  }

  const toggleVoiceChannel = () => {
    setIsJoined(!isJoined);
  }

  useEffect(() => {
    if(isJoined) {
      joinChat()
    }
  },[isJoined])

  socket.on('user-disconnected', (data) => {
    console.log('EVENT TRIGGERED', data)
    if (peers[data.username]) {
      peers[data.currentId].close()
    }
  })

  return (
    <div className="voice-channel-container">
      <div className="voice-channel-name" onClick={toggleVoiceChannel}>{roomName}</div>
      {isJoined ? <div className="video-container"></div> : null}
    </div>
  )
}


// socket.emit('leave-room', {
//   id: currentId,
//   room: roomName,
//   username: username,
// })

export default VoiceChannel

