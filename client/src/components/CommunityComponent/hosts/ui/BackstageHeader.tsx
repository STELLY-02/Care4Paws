import './BackstageHeader.scss';
import {
  useCall,
  useCallStateHooks,
  useConnectedUser,
} from '@stream-io/video-react-sdk';
import {
  DurationBadge,
  LiveBadge,
  TotalViewersBadge,
} from '../../livecomponents';
import React from 'react';

export const BackstageHeader = () => {
  const call = useCall();
  const currentUser = useConnectedUser();
  const { useIsCallHLSBroadcastingInProgress, useCallCustomData } =
    useCallStateHooks();
  const customData = useCallCustomData();
  const isBroadcasting = useIsCallHLSBroadcastingInProgress();
  return (
    <div className="backstage-header">
      <div className="backstage-header-section pull-left">
        <div className="backstage-header-details">
          <h3 className="backstage-header-title">
            {customData.title || call?.cid || 'Livestream'}
          </h3>
          <h5 className="backstage-header-subtitle">
            {currentUser?.name || currentUser?.id || 'Stream user'}
          </h5>
        </div>
      </div>
      <div className="backstage-header-section pull-center">
        <DurationBadge />
        {isBroadcasting && <LiveBadge />}
        {isBroadcasting && <TotalViewersBadge />}
      </div>
    </div>
  );
};
