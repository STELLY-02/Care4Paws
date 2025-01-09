import React, { useState, useEffect } from "react";
import "./EventDetailPage.css";
import RegistrationModal from "./RegistrationModal";

function EventDetailsModal({ isOpen, onClose, eventDetails }) {
  if (!isOpen) return null; // Do not render if modal is not open
  console.log("Event Details:", eventDetails);

  const [isRegistrationOpen, setRegistrationOpen] = useState(false);
  const [specEventDetails, setSpecEventDetails] = useState(null);

  useEffect(() => {
    setSpecEventDetails(eventDetails);
  }, [eventDetails]);

  const openRegistrationModal = () => {
    setRegistrationOpen(true);
  };

  const closeRegistrationModal = () => {
    setRegistrationOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container " onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <div className="modal-header">
          <img
            src={eventDetails.eventPic}
            alt="Event"
            className="event-image"
          />
          <h2 className="event-title">{eventDetails.eventTitle}</h2>
        </div>
        <div className="modal-content">
          <div className="organizer-info">
            <img
              src={eventDetails.organizerPic}
              alt="Organizer"
              className="organizer-pic"
            />
            <div className="organizer-name">{eventDetails.organizerName}</div>
          </div>
          <p>
            <strong>Date:</strong> {eventDetails.eventDate}
          </p>
          <p>
            <strong>Time:</strong> {eventDetails.eventTime}
          </p>
          <p>
            <strong>Location:</strong> {eventDetails.eventLocation}
          </p>
          <p>
            <strong>Fee:</strong> {eventDetails.eventFee}
          </p>
          <p>
            <strong>Participants:</strong> {eventDetails.participantsCount}
          </p>
          <div className="event-description">
            <strong>Description:</strong>
            <p>{eventDetails.eventDescription}</p>
          </div>
        </div>
        <button className="register-button" onClick={openRegistrationModal}>
          Register Now
        </button>
        {isRegistrationOpen && specEventDetails && (
            <RegistrationModal
              closeModal={closeRegistrationModal}
              eventId={specEventDetails.id}
              eventFee={specEventDetails.eventFee}
            />
          )}
      </div>
    </div>
  );
}

export default EventDetailsModal;
