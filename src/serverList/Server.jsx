import React from 'react';

const Server = ({ server }) => {
  return (
    <div className="server">
      <div className="server-icon"></div>
      <div className="server-name">{server}</div>
    </div>
  )
}

export default Server