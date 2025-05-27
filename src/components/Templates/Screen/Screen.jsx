import './Screen.css'
import React from 'react'
import Nav from "../Nav/Nav"

export default ({ children }) => (
  <div className="screen">
    <div className="ajuste">
      <Nav />
      {children}
    </div>
  </div>
)