import './App.css';
import React, { Component }  from 'react';
import { useState } from 'react';
import ServerList from './serverList/ServerList.jsx';
import ChatSelector from './chatSelector/ChatSelector.jsx';
import TextChat from './chatBox/TextChat.jsx';
import UserList from './userList/UserList.jsx';
import UserModal from './userList/UserModal.jsx';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:8080');

function App() {
  const [modalStatus, setModalStatus] = useState(true);
  const [username, setUsername] = useState('');
  const [serverList, setServerList] = useState(['Hackreactor']);
  const [currentServer, setCurrentServer] = useState('');
  const [chatList, setChatList] = useState(['General', 'Trash tests', 'Trash API', 'Tetrio', 'Help']);
  const [userList, setUserList] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [disconnectedUsers, setDisconnectedUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState('General');

  return (
    <div className="App">
      <div className="modal-container">
        { modalStatus ? <UserModal
          setModalStatus={setModalStatus}
          serverList={serverList}
          setCurrentServer={setCurrentServer}
          currentServer={currentServer}
          setUsername={setUsername}
          /> : <div className="ui-container">
            <ServerList list={serverList}/>
            <ChatSelector socket={socket} setCurrentChat={setCurrentChat} chatList={chatList} username={username} setUser={setUsername}/>
            <TextChat socket={socket} currentChat={currentChat} username={username}/>
          </div>
        }
      </div>

    </div>
  );
}

export default App;
