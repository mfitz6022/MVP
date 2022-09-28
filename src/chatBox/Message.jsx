import React from 'react';

const Message = ({ room, user, text, time }) => {
  return (
    <div className="message-content">
      <div className="username">{user} says:</div>
      <div className="message-text">{text}</div>
      <div className="time-stamp">{time}</div>
    </div>
  )
}

export default Message