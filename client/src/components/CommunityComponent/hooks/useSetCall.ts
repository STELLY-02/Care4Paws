import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Call, CallingState, StreamVideoClient } from '@stream-io/video-react-sdk';
import { DEFAULT_CALL_TYPE } from '../utils/constants';

export const useSetCall = (client?: StreamVideoClient) => {
  const { callId } = useParams<{ callId: string }>();
  const [call, setCall] = useState<Call | undefined>(undefined);

  useEffect(() => {
    if (!(client && callId)) {
      return;
    }
    const _call = client.call(DEFAULT_CALL_TYPE, callId);  // Use default type if not provided
    setCall(_call);
    window.call = _call;

    return () => {
      if (_call?.state.callingState !== CallingState.LEFT) {
        _call?.leave();
      }
      setCall(undefined);
      window.call = undefined;
    };
  }, [client, callId]);

  return call;
};
