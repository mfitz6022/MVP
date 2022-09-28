import React, { Component }  from 'react';
import { useState } from 'react';

const UserModal = ({ setModalStatus, setCurrentServer, currentServer, serverList, setUsername }) => {
  const [inputText, setInputText] = useState('');
  const [selectorValue, setSelectorValue] = useState(currentServer)

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  }

  const handleSelectChange = (event) => {
    setSelectorValue(event.target.value)
  }

  const handleSubmit = () => {
    setUsername(inputText);
    setCurrentServer(selectorValue)
    setModalStatus(false);
  }

  return (
    <div className="modal">
      <input className="username-field" placeholder="enter your username" onChange={handleInputChange}></input>
      <select value={selectorValue} onChange={handleSelectChange} className="server-select">
        {serverList.map((server, index) =>
        <option value={server} key={index}>{server}</option>)}
      </select>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default UserModal