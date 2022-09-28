import React, { useState, useEffect, useRef } from 'react';
import { CopyToClipBoard } from 'react-copy-to-clipboard';
import Peer from 'simple-peer';
import io from 'socket.io-client';

const VoiceChannel = ({ user, setUser, socket }) => {
  const [ me, setMe ] = useState('');
  const [ stream, setStream] = useState();
  const [ receivingCall, setReceivingCall ] = useState(false);
  const [ caller, setCaller ] = useState('');
  const [ callerSignal, setCallerSignal ] = useState();
  const [ callAccepted, setCallAccepted ] = useState(false);
  const [ idToCall, setIdToCall ] = useState('');
  const [ callEnded, setCallEnded ] = useState(false);
  const [ name, setName ] = useState('');

  const myVideo = useRef(null);
  const userVideo = useRef(null);
  const connectionRef = useRef(null);

  useEffect(() => {
    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(stream);
        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }
      } catch (e) {
        console.error(e);
      }
    }
    getMedia();

    socket.on('me', (id) => {
      setMe(id);
    })

    socket.on('callUser', (data) => {
      setReceivingCall(true)
      setCaller(data.from)
      setName(data.name)
      setCallerSignal(data.signal)
    })
  }, [])

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on('signal', (data) => {
      socket.emit('callUser', {
        userToCall: id,
        signalData: data,
        from: me,
        name: user,
      })
    })

    peer.on('stream', (stream) => {
      userVideo.current.serObject = stream;
    })

    socket.on('callAccepted', (signal) => {
      setCallAccepted(true)
      peer.signal(signal)
    })

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true)
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    })

    peer.on('signal', (data) => {
      socket.emit('answer_call', {
        signal: data,
        to: caller,
      })
    })

    peer.on('stream', (stream) => {
      userVideo.current.srcObject = stream;
    })

    peer.signal(callerSignal)
    connectionRef.current = peer;
  }

  const leaveCall = () => {
    setCallEnded(true)
    connectionRef.current.destroy()
  }

  return (
    <div className="voice-channel-container">
      <div className="voice-channel-name">@ Voice Channel</div>
      <div className="video-container">
        <div className="video">
          {stream && <video playsInline muted ref={myVideo} autoPlay style={{ wdith: "300px"}} />}
        </div>
        <div className="video">
          {callAccepted && !callEnded ?
            <video playsInline muted ref={myVideo} autoPlay style={{ wdith: "300px"}} />
            : null
          }
        </div>
      </div>

      <div>users in channel go here</div>
    </div>
  )
}

export default VoiceChannel