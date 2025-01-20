import { useNavigate } from 'react-router-dom';
import { LeaveBadge } from '../../livecomponents';

import './ViewerControls.scss';
import { useCall } from '@stream-io/video-react-sdk';
import React from 'react';

export const ViewerControls = () => {
  const call = useCall();
  const navigate = useNavigate();

  const onClickHandler = async () => {
    await call?.leave();
    navigate('/coordinator/community');
  };

  return (
    <div className="viewer-controls">
      <button
        className="viewer-control-button"
        type="button"
        onClick={onClickHandler}
      >
        <LeaveBadge />
        <span>Leave Stream</span>
      </button>
    </div>
  );
};
