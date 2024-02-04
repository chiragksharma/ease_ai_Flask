import React, { useState, useEffect } from 'react';
import logo from '../../assets/img/logo.svg';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';

const Popup = () => {
  const [data, setData] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const url = tabs[0].url;
      const videoId = extractVideoId(url);
      if (videoId) {
        fetchTranscript(videoId);
      } else {
        setError('Invalid YouTube URL');
      }
    })
  }

  const extractVideoId = url => {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('v');
  };

  const fetchTranscript = videoId => {
    const apiUrl = `http://localhost:5000/transcript?url=${videoId}`;

    fetch(apiUrl).then(
      res => res.json()
    ).then(
      data => {
        setData(data.transcript);
        console.log(data.transcript);
      }
    ).catch(error => console.error('Error fetching data:', error));
  }


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/pages/Popup/Popup.jsx</code> and save to reload.
        </p>
        <button onClick={handleSubmit}>Fetch Transcript</button>
        {error && <p className="error">{error}</p>}
        <p>{data}</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React!
        </a>
      </header>
    </div>
  );
};

export default Popup;
