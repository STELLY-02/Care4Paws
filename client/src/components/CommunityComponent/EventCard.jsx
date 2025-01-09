import React from 'react';
import { FaUsers, FaCalendarAlt, FaMapMarkerAlt, FaShareAlt } from 'react-icons/fa';
import './EventCard.css';

function EventCard({
  organizerPic,
  organizerName,
  eventTitle,
  eventDate,
  eventTime,
  eventLocation,
  eventFee,
  participantsCount,
  eventPic,
  eventTags,
  eventType,
  registrationStatus,
  onShare,
  onClick,
}) {
  return (
    <div className="event-card" onClick={onClick}>
      <div className="event-card-header">
        <div className="organizer-info">
          <img src={organizerPic} alt={organizerName} className="organizer-pic" />
          <div className="organizer-name">{organizerName}</div>
        </div>
        <div className="event-type">{eventType}</div>
      </div>
      <div className="event-card-body">
        <img src={eventPic} alt={eventTitle} className="event-pic" />
        <div className="event-details">
          <h3 className="event-title">{eventTitle}</h3>
          <div className="event-date-time">
            <div className="event-time">
              <FaCalendarAlt /> {eventDate}
            </div>
            <div className="event-time">
              <FaUsers /> {participantsCount} Participants
            </div>
            <div className="event-time">
              <FaMapMarkerAlt /> {eventLocation}
            </div>
          </div>
          <div className="event-fee">
            <strong>Fee: </strong>{eventFee}
          </div>
          <button className="check-details" onClick={(e) => {
          e.stopPropagation(); // Prevent triggering card click
          onClick();
        }}>See Event Details</button>
        </div>
      </div>
      <div className="event-card-footer">
        <div className="event-status">
          <strong>Status: </strong>{registrationStatus}
        </div>
        <div className="event-tags">
          {eventTags.map((tag, index) => (
            <span key={index} className="event-tag">{tag}</span>
          ))}
        </div>
        {/* <div className="event-share" onClick={onShare}>
          <FaShareAlt /> Share
        </div> */}
      </div>
    </div>
  );
}

export default EventCard;
