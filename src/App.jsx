import './App.css';
import React, { Component }  from 'react';
import { useState } from 'react';
import ServerList from './serverList/ServerList.jsx';
import ChatSelector from './chatSelector/ChatSelector.jsx';
import TextChat from './chatBox/TextChat.jsx';
import UserList from './userList/UserList.jsx';
import UserModal from './userList/UserModal.jsx';
import io from 'socket.io-client';

function App() {
  const [modalStatus, setModalStatus] = useState(true);
  const [username, setUsername] = useState('');
  const [serverList, setServerList] = useState(['Hackreactor']);
  const [currentServer, setCurrentServer] = useState('');
  const [chatList, setChatList] = useState(['Trash tests', 'Trash API', 'Tetrio']);
  const [userList, setUserList] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [disconnectedUsers, setDisconnectedUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState('Trash tests');

  const socket = io.connect('http://localhost:8080');

  return (
    <div className="App">
      <div className="modal-container">
        { modalStatus ? <UserModal
          setModalStatus={setModalStatus}
          serverList={serverList}
          setCurrentServer={setCurrentServer}
          currentServer={currentServer}
          setUsername={setUsername}
          /> : null}
      </div>
      <ServerList />
      <ChatSelector socket={socket} setCurrentChat={setCurrentChat} chatList={chatList} username={username} setUser={setUsername}/>
      <TextChat socket={socket} currentChat={currentChat} username={username}/>
      <UserList/>
    </div>
  );
}

export default App;
