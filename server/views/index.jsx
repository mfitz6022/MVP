const React = require('react');


const Index = ({ roomId }) => {
  const ROOM_ID = `${roomId}`

  return (
    <>
      <div>{ROOM_ID}</div>
    </>
  )
}

module.exports = Index

