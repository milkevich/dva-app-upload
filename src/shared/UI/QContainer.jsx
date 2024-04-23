import React from 'react'

const QContainer = ({children, noMargin}) => {
  return (
    <div style={{width: "334px", display: "flex", flexDirection: "column", margin: "auto", marginTop: noMargin ? "10px" : "20px", textAlign: "left", marginBottom: noMargin ? "5px" : "0"}}>{children}</div>
  )
}

export default QContainer