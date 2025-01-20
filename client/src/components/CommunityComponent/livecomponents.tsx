import './livecomponents.scss';
import { useEffect, useState } from 'react';
import { useCallStateHooks } from '@stream-io/video-react-sdk';
import React from 'react';

export const DurationBadge = () => {
  const [duration, setDuration] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setDuration((d) => d + 1);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, []);

  const timestamp = new Date(duration * 1000).toISOString().slice(11, 19);
  return (
    <div className="duration-badge">
      <ShieldBadge />
      <span className="elapsed-time">{timestamp}</span>
    </div>
  );
};

export const LiveBadge = () => {
  return <div className="live-badge">Live</div>;
};

export const TotalViewersBadge = () => {
  const { useParticipantCount } = useCallStateHooks();
  const viewers = useParticipantCount();
  return (
    <div className="total-viewers-badge">
      <EyeBadge />
      <span className="total-viewers">{viewers}</span>
    </div>
  );
};

export const ShieldBadge = () => {
  return (
    <svg
      width="9"
      height="10"
      viewBox="0 0 9 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.79919 8.79157L4.02014 9.63654C4.22869 9.7774 4.49664 9.7774 4.70498 9.63654L5.92594 8.79157C7.6828 7.5523 8.75481 5.60898 8.75481 3.52489V1.60984C8.75481 1.35641 8.57617 1.13107 8.30822 1.07467L4.3774 0.257812L0.446587 1.07447C0.178632 1.13085 0 1.35619 0 1.60964V3.52469C0 5.60888 1.04233 7.58057 2.79919 8.79157ZM2.56093 4.05991L3.69256 5.13019L6.16414 2.79258L7.05753 3.63755L3.72223 6.82014L1.69742 4.90488L2.56093 4.05991Z"
        fill="#00E2A1"
      />
    </svg>
  );
};

export const EyeBadge = () => {
  return (
    <svg
      width="15"
      height="10"
      viewBox="0 0 15 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.25488 1.5625C9.62363 1.5625 11.7361 2.89375 12.7674 5C11.7361 7.10625 9.62363 8.4375 7.25488 8.4375C4.88613 8.4375 2.77363 7.10625 1.74238 5C2.77363 2.89375 4.88613 1.5625 7.25488 1.5625ZM7.25488 0.3125C4.12988 0.3125 1.46113 2.25625 0.379883 5C1.46113 7.74375 4.12988 9.6875 7.25488 9.6875C10.3799 9.6875 13.0486 7.74375 14.1299 5C13.0486 2.25625 10.3799 0.3125 7.25488 0.3125ZM7.25488 3.4375C8.11738 3.4375 8.81738 4.1375 8.81738 5C8.81738 5.8625 8.11738 6.5625 7.25488 6.5625C6.39238 6.5625 5.69238 5.8625 5.69238 5C5.69238 4.1375 6.39238 3.4375 7.25488 3.4375ZM7.25488 2.1875C5.70488 2.1875 4.44238 3.45 4.44238 5C4.44238 6.55 5.70488 7.8125 7.25488 7.8125C8.80488 7.8125 10.0674 6.55 10.0674 5C10.0674 3.45 8.80488 2.1875 7.25488 2.1875Z"
        fill="#FCFCFC"
      />
    </svg>
  );
};

export const LeaveBadge = () => {
  return (
    <svg
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.75 5.75L16.9875 7.5125L20.2125 10.75H7.5V13.25H20.2125L16.9875 16.475L18.75 18.25L25 12L18.75 5.75ZM2.5 3.25H12.5V0.75H2.5C1.125 0.75 0 1.875 0 3.25V20.75C0 22.125 1.125 23.25 2.5 23.25H12.5V20.75H2.5V3.25Z"
        fill="#FCFCFC"
      />
    </svg>
  );
};

export const HDBadge = () => {
  return (
    <svg
      width="30"
      height="20"
      viewBox="0 0 30 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="30" height="20" rx="4" fill="#005FFF" fillOpacity="0.16" />
      <path
        d="M12.75 8.51562V9.74219H6.59375V8.51562H12.75ZM6.82812 3.625V15H5.32031V3.625H6.82812ZM14.0625 3.625V15H12.5625V3.625H14.0625ZM19.8203 15H17.4453L17.4609 13.7734H19.8203C20.6328 13.7734 21.3099 13.6042 21.8516 13.2656C22.3932 12.9219 22.7995 12.4427 23.0703 11.8281C23.3464 11.2083 23.4844 10.4844 23.4844 9.65625V8.96094C23.4844 8.3099 23.4062 7.73177 23.25 7.22656C23.0938 6.71615 22.8646 6.28646 22.5625 5.9375C22.2604 5.58333 21.8906 5.3151 21.4531 5.13281C21.0208 4.95052 20.5234 4.85938 19.9609 4.85938H17.3984V3.625H19.9609C20.7057 3.625 21.3854 3.75 22 4C22.6146 4.24479 23.1432 4.60156 23.5859 5.07031C24.0339 5.53385 24.3776 6.09635 24.6172 6.75781C24.8568 7.41406 24.9766 8.15365 24.9766 8.97656V9.65625C24.9766 10.4792 24.8568 11.2214 24.6172 11.8828C24.3776 12.5391 24.0312 13.099 23.5781 13.5625C23.1302 14.026 22.5885 14.3828 21.9531 14.6328C21.3229 14.8776 20.612 15 19.8203 15ZM18.25 3.625V15H16.7422V3.625H18.25Z"
        fill="#005FFF"
      />
    </svg>
  );
};
