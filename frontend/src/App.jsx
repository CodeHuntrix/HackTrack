import React from 'react'
import Dashboard from './components/Dashboard'
import './index.css'

function App() {
  return (
    <div className="App">
      <Dashboard />
      
      {/* Background Decor */}
      <div style={{
        position: 'fixed',
        top: '-10%',
        left: '-10%',
        width: '40%',
        height: '40%',
        background: 'var(--primary)',
        filter: 'blur(150px)',
        opacity: '0.1',
        zIndex: -1,
        borderRadius: '50%'
      }}></div>
      <div style={{
        position: 'fixed',
        bottom: '-10%',
        right: '-10%',
        width: '30%',
        height: '30%',
        background: 'var(--secondary)',
        filter: 'blur(120px)',
        opacity: '0.1',
        zIndex: -1,
        borderRadius: '50%'
      }}></div>
    </div>
  )
}

export default App
