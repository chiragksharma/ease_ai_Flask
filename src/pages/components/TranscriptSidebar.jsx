import React from 'react';
// import './TranscriptSidebar.css';
import './content.styles.css';

export default function TranscriptSidebar({ transcript }) {
    // Render the sidebar UI using React
    // const sidebarStyle = {
    //     position: 'absolute',
    //     top: 0,
    //     right: 0,
    //     bottom: 0,
    //     width: '320px',
    //     backgroundColor: '#fff',
    //     boxShadow: '-2px 0 5px rgba(0,0,0,.2)',
    //     padding: '10px',
    //     overflowY: 'auto',
    //     zIndex: 1000,
    // };



    return (
        <div className="transcript-sidebar" >
            <h2>Transcript</h2>
            <div className="transcript-content">{transcript}</div>
        </div>
    );
}


// import React from 'react';

// export default function TranscriptSidebar({ transcript }) {
//     return (
//         <div id="transcript-sidebar">
//             <h2>Transcript & Summary</h2>
//             <div id="transcript-content">
//                 {transcript || 'Click "Fetch Transcript" to load the video transcript.'}
//             </div>
//             <button id="fetch-transcript-button">Fetch Transcript</button>
//         </div>
//     );
// }
