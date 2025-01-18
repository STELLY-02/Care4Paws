import { StreamVideo } from '@stream-io/video-react-sdk';
import { Outlet } from 'react-router-dom';
import { useInitVideoClient } from '../hooks/useInitVideoClient';
import React from 'react';

export const Hosts = () => {
  const client = useInitVideoClient({});
  console.log("bello", client)

  if (!client) {
    return null;
  }

  return (
    <StreamVideo client={client}>
    <div>Stream Video is initialized</div>  {/* Check if this gets rendered */}
    <Outlet />
  </StreamVideo>
  );
};
