import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import LiveStream from './LiveStream';
import Logo from "../../assets/Logo-fit.png";
import "./LiveStreamRouting.css";
// import { Hosts } from './hosts/Hosts';
// import { Backstage } from './hosts/Backstage';
// import { Viewers } from './viewers/Viewers';
// import { HLSLivestreamUI } from './viewers/HLSLivestream';
// import { WebRTCLivestream } from './viewers/WebRTCLivestream';

const LiveStreamRouting = () => {
    return (
      <div className='LiveStreamRouting'>
        <img src={Logo} alt="" className="logo-livestream" />
        <Routes>
          <Route path="/" element={<LiveStream />} />
          {/* <Route path="hosts" element={<Hosts />} />
          <Route path="viewers" element={<Viewers />} />
          <Route path="hls/:callId" element={<HLSLivestreamUI />} />
          <Route path="webrtc/:callId" element={<WebRTCLivestream />} /> */}
        </Routes>
  
        {/* The nested routes will render here */}
        <Outlet />
      </div>
    );
  };
  
  export default LiveStreamRouting;
