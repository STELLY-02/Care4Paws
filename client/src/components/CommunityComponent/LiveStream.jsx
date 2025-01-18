import React from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import "./LiveStream.css";

function LiveStream() {
  return (
    <Stack justifyContent="center" alignItems="center" flexGrow={1} spacing={3}>
      <Typography variant="h3" textAlign="center">
        Livestream Dashboard
      </Typography>
      <Typography variant="h6" textAlign="center">
        Select an option to start your livestream experience.
      </Typography>
      <Stack direction="row" spacing={2}>
        <Link to="hosts">
          <Button className='livestream-button'>For Hosts</Button>
        </Link>
        <Link to="viewers">
          <Button className='livestream-button'>For Viewers</Button>
        </Link>
      </Stack>
    </Stack>
  );
}

export default LiveStream;
