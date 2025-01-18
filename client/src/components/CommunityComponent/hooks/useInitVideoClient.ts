import { StreamVideoClient } from '@stream-io/video-react-sdk';
import { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { getUser } from '../utils/getUser';
import { useParams } from 'react-router-dom';

const envApiKey = import.meta.env.VITE_STREAM_API_KEY as string;

type VideoClientProviderProps = {
  isAnon?: boolean;
};

export const useInitVideoClient = ({
  isAnon,
}: PropsWithChildren<VideoClientProviderProps>) => {
  const { callId } = useParams<{ callId: string }>();
  const user = useMemo(() => {
    if (isAnon) {
      return { id: '!anon' };
    }
    return getUser();  // Fetches the user from localStorage or session
  }, [isAnon]);

  const apiKey = envApiKey; // API key directly from env variables
  const [client, setClient] = useState<StreamVideoClient | null>(null);

  // Fetch Stream token from the backend
  const tokenProvider = async () => {
    const jwt = localStorage.getItem('token'); // Get JWT from localStorage
    const response = await fetch('http://localhost:8085/api/stream-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ userId: user.id }),  // Pass the userId here
    });
    const data = await response.json();
    if (!data.token) {
      throw new Error('Failed to fetch Stream token');
    }
    return data.token; // Return the token for Stream
  };

  useEffect(() => {
    // Initialize the StreamVideoClient directly with apiKey, user, and tokenProvider
    const initializeClient = async () => {
      try {
        const token = await tokenProvider(); // Fetch token from tokenProvider
        const _client = new StreamVideoClient({
          apiKey,
          user: { id: user.id, name: user.name || 'Unknown' },
          token, // Use the token obtained from the token provider
        });

        // Now connect user after the client is initialized
        await _client.connectUser(user);
        console.log("User connected to video client.");

        // Update the client state once the user is connected
        setClient(_client);
      } catch (error) {
        console.error("Error initializing client:", error);
      }
    };

    initializeClient();

    // Cleanup when the component is unmounted or dependencies change
    return () => {
      if (client) {
        client.disconnectUser().catch((error) =>
          console.error('Unable to disconnect user', error),
        );
      }
      setClient(null); // Reset client state on cleanup
    };
  }, [apiKey, user]); // Re-run when apiKey or user changes

  return client;
};
