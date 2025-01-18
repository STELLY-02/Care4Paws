import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import LiveStream from './LiveStream';
import Logo from "../../assets/Logo-fit.png";
import "./LiveStreamRouting.css";
import { Hosts } from './hosts/Hosts';
import { SetupLivestream } from './hosts/SetupLivestream';
import { Backstage } from './hosts/Backstage';
import { Viewers } from './viewers/Viewers';
import { HLSLivestreamUI } from './viewers/HLSLivestream';
import { WebRTCLivestream } from './viewers/WebRTCLivestream';

const LiveStreamRouting = () => {
    return (
        <div className="LiveStreamRouting">
        <img src={Logo} alt="Logo" className="logo-livestream" />
        <Routes>
          {/* Home Route */}
          <Route path="/" element={<LiveStream />} />
  
          {/* Hosts Route with Nested Routes */}
          <Route path="hosts" element={<Hosts />}>
            <Route index element={<SetupLivestream />} /> {/* Default child route */}
            <Route path="backstage/:callId" element={<Backstage />} />
          </Route>
  
          {/* Viewers Route with Nested Routes */}
          <Route path="viewers" element={<Viewers />}>
            <Route path="hls/:callId" element={<HLSLivestreamUI />} />
            <Route path="webrtc/:callId" element={<WebRTCLivestream />} />
          </Route>
        </Routes>
      </div>
    );
  };
  
  export default LiveStreamRouting;
