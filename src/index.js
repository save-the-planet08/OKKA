import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

// Simple error handling
try {
  ReactDOM.render(<App />, document.getElementById('root'));
} catch (error) {
  console.error('OKKA Loading Error:', error);
  document.getElementById('root').innerHTML = `
    <div style="
      padding: 50px; 
      text-align: center; 
      font-family: Arial, sans-serif;
      background-color: #0a0a0a;
      color: #00FFFF;
      min-height: 100vh;
    ">
      <h1>🎮 OKKA Gaming Platform</h1>
      <p>Error loading games. Please reload the page.</p>
      <button onclick="window.location.reload()" style="
        background: #FF0080;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 20px;
      ">
        Reload Games
      </button>
    </div>
  `;
}