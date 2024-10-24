import React, { useState, useRef } from 'react';
import { createOffer, createAnswer, waitForAnswer, handleICECandidates } from './signaling';

const FileShare = () => {
  const [connected, setConnected] = useState(false);
  const [file, setFile] = useState(null);
  const peerConnection = useRef(new RTCPeerConnection());
  const dataChannel = useRef(null);

  // Setup Data Channel for file transfer
  const setupDataChannel = () => {
    dataChannel.current = peerConnection.current.createDataChannel('fileChannel');
    
    dataChannel.current.onopen = () => {
      console.log('Data channel opened');
      setConnected(true);
    };

    dataChannel.current.onclose = () => {
      console.log('Data channel closed');
    };

    dataChannel.current.onmessage = (event) => {
      console.log('Received data: ', event.data);
      // Handle received file data
    };

    dataChannel.current.onerror = (error) => console.error('Data Channel Error:', error);
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  // Send file over Data Channel
  const sendFile = () => {
    if (dataChannel.current && file && dataChannel.current.readyState === "open") {
      const reader = new FileReader();
      reader.onload = (e) => {
        dataChannel.current.send(e.target.result);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // Start connection as offerer
  const startConnection = async () => {
    setupDataChannel();

    const offerId = await createOffer(peerConnection.current);
    handleICECandidates(peerConnection.current, offerId);
    waitForAnswer(offerId, peerConnection.current);
  };

  // Join connection as answerer
  const joinConnection = async (offerId) => {
    peerConnection.current.ondatachannel = (event) => {
      dataChannel.current = event.channel;
      setConnected(true);
    };

    await createAnswer(offerId, peerConnection.current);
    handleICECandidates(peerConnection.current, offerId);
  };

  return (
    <div>
      <h2>File Sharing</h2>
      {!connected ? (
        <>
          <button onClick={startConnection}>Start Connection</button>
          <input type="text" placeholder="Enter Offer ID" id="offerId" />
          <button onClick={() => joinConnection(document.getElementById('offerId').value)}>Join Connection</button>
        </>
      ) : (
        <div>
          <input type="file" onChange={handleFileChange} />
          <button onClick={sendFile}>Send File</button>
        </div>
      )}
    </div>
  );
};

export default FileShare;
