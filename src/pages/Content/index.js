import { printLine } from './modules/print';
// import React from 'react';
// import ReactDOM from 'react-dom';
// import TranscriptSidebar from '../components/TranscriptSidebar.jsx';

// const app = document.createElement('div');
// app.id = 'transcript-sidebar-root';
// document.body.appendChild(app);

// ReactDOM.render(<TranscriptSidebar />, app);

let globalState = {
  transcript: null
};

async function fetchTranscript() {
  const videoId = new URL(window.location.href).searchParams.get('v');
  if (!videoId) {
    console.error('Could not find the video ID.');
    return;
  }

  const apiUrl = `http://localhost:5000/transcript?url=${videoId}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    globalState.transcript = data.transcript || 'No transcript found.';
    const transcriptContainer = document.getElementById('transcript-content')
    transcriptContainer.textContent = globalState.transcript;
  } catch (error) {
    console.error('Error Fetching transcript')
  }

  // fetch(apiUrl).then(
  //   res => res.json()
  // ).then(
  //   data => {
  //     const transcriptContainer = document.getElementById('transcript-content');
  //     transcriptContainer.textContent = '';
  //     transcriptContainer.textContent = data.transcript || 'No transcript found.';
  //     // setData(data.transcript);
  //     console.log(data.transcript);
  //   }
  // ).catch(error => console.error('Error fetching data:', error));

}

async function fetchSummary() {

  if (!globalState.transcript) {
    console.error('No transcript available to summarize.');
    return;
  }
  const apiUrl = `http://localhost:5000/summary`;
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcripts: globalState.transcript })
    });
    const data = await response.json();
    const summaryContainer = document.getElementById('transcript-content');
    summaryContainer.textContent = data.summary || 'No summary available';

  } catch (error) {
    console.error('Error fetching summary: ', error);
  }
  //   fetch(apiUrl, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ transcript: transcript }), // Assuming your backend expects this structure
  //   })
  //     .then(res => res.json())
  //     .then(data => {
  //       const summaryContainer = document.getElementById('transcript-content');
  //       summaryContainer.textContent = data.summary || 'No summary found.';
  //       console.log(data.summary);
  //     })
  //     .catch(error => console.error('Error fetching summary:', error));
  // });
}


function injectTranscriptSidebar() {

  const sidebarHtml = `
    <div id="transcript-sidebar" style="
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 320px;
      background-color: #fff;
      box-shadow: -2px 0 5px rgba(0,0,0,0.2);
      padding: 10px;
      overflow-y: auto;
      z-index: 1000;
    ">
      <h2 style="margin-top: 5px;">Transcript & Summary</h2>
      <div id="transcript-content" style="
        font-size: 14px;
        line-height: 1.6;
        height: calc(75% - 50px);
        overflow-y: auto;
      ">
        <!-- Transcript content will go here -->
      </div>
      <button id="fetch-transcript-button" style="
        position: absolute;
        bottom: 64px;
        width: calc(100% - 20px);
        padding: 30px;
        font-size: 16px;
        cursor: pointer;
      ">
        Fetch Transcript
      </button>
      <button id="fetch-summary-button" style="
        position: absolute;
        bottom: 10px;
        width: calc(100% - 20px);
        padding: 10px;
        font-size: 16px;
        cursor: pointer;
      ">
        Summarize
      </button>
    </div>
  `;

  // Inject the sidebar HTML into the page
  document.body.insertAdjacentHTML('beforeend', sidebarHtml);

  // Add button click listener to fetch the transcript
  document.querySelector('#fetch-transcript-button').addEventListener('click', fetchTranscript);
  document.querySelector('#fetch-summary-button').addEventListener('click', fetchSummary);

}
function updateSidebarVisibility() {
  const sidebar = document.getElementById('transcript-sidebar');
  if (sidebar) {
    if (isYouTubeVideoPage(window.location.href)) {
      sidebar.style.display = 'block';
    } else {
      sidebar.style.display = 'none';
    }
  }
}

function isYouTubeVideoPage(url) {
  return url.includes('www.youtube.com/watch');
}

injectTranscriptSidebar();

const observer = new MutationObserver((mutations, obs) => {
  updateSidebarVisibility();
});

// Start observing the body for changes in the child list
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Ensure sidebar visibility is correct on initial load
updateSidebarVisibility();

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");
