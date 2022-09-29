import React, { Component }  from 'react';
import { useEffect, useState } from 'react';
import Message from './Message.jsx';
import io from 'socket.io-client';


const TextChat = ( { currentChat, username, socket } ) => {
  const [inputText, setInputText] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const handleInputChange  = (event) => {
    setInputText(event.target.value);
  }

  const sendMessage = async (text) => {
    if (text.length > 0) {
      const messageData = {
        room: currentChat,
        author: username,
        message: text,
        time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes()
      };
      await socket.emit('send_message', messageData);
      setMessageList((list) => [...list, messageData]);
    }

  }

  useEffect(() => {
    socket.on('recieve_message', (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket])


  return (
    <div className="text-chat">
      <div className="message-header">
        <h1># {currentChat}</h1>
      </div>
      <div className="message-container">
        {isLoading ? <div>Loading</div> : messageList.map((message, index) => {
          if (message.room === currentChat) {
            return (
              <Message
                room={message.room}
                user={message.author}
                text={message.message}
                time={message.time}
                key={index}
              />)
          } else {
            return null;
          }
        })
        }
      </div>
      <div className="field-container">
        <input className="message-text-field" placeholder="type your message here" onChange={handleInputChange}></input>
        <button className="send" onClick={() => {sendMessage(inputText)}}> Send</button>
      </div>
    </div>
  );
}

export default TextChat;