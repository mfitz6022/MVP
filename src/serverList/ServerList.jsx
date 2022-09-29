import React from 'react';
import Server from './Server.jsx'

const ServerList = ({list}) => {
  return (
    <div className="server-list">
      {list.map((server, index) => <Server server={server} key={index}/>)}
    </div>
  )
};

export default ServerList;