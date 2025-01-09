import React, { useState, useEffect } from "react";
import EventCard from "../../../components/CommunityComponent/EventCard";
import EventDetailsModal from "../../../components/CommunityComponent/EventDetailPage";
import "./UserEvent.css";
import { FaRegCalendarCheck } from "react-icons/fa";
import EventRegister from "../../../components/CommunityComponent/eventRegistration"
import { fetchEvents, fetchCoordinatorEvents } from '../../../api'; // Import the fetchEvents function

function Event() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventDetails, setSelectedEventDetails] = useState(null);
  const [eventData, setEventData] = useState([]);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  const role = localStorage.getItem("role");

  useEffect(() => {
    const getEvents = async () => {
      try {
        let events = [];
        // if (role === 'coordinator') {
        //   console.log("Fetching coordinator events");
        //   events = await fetchCoordinatorEvents();
        // } else {
        //   console.log("Fetching user events");
          events = await fetchEvents();
        //}
        console.log("List of events:", events);
        setEventData(events);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    getEvents();
  }, [role]);

  const handleOpenModal = (eventDetails) => {
    setSelectedEventDetails(eventDetails);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEventDetails(null);
  };

  // const handleShare = () => {
  //   console.log("Event shared!");
  // };

  const handleAddEventClick = () => {
    setShowRegistrationModal(true);
  };

  const handleCloseRegistrationModal = () => {
    setShowRegistrationModal(false);
  };

  return (
    <div>
      <div className="Intro">
      <FaRegCalendarCheck size={40}
        color="493628"/>
      <h2>Mark your calendars !</h2>
      </div>
      {role === "coordinator" && (
        <>
          <p>Get ready to paws and play! Share your event to the users !</p>
          <button className="add-event-button" onClick={handleAddEventClick}>
            Add Event
          </button>
        </>
      )}
      {role === "user" && (
        <p>Get ready to paws and play! Check out the events near you !</p>
      )}
      <div className="EventCardContainer">
        {eventData.map((event, index) => (
          <EventCard
            key={index}
            {...event}
            //onShare={handleShare}
            onClick={() => handleOpenModal(event)}
          />
        ))}
      </div>
      {/* Modal for event details */}
      {isModalOpen && (
        <EventDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        eventDetails={selectedEventDetails}
      />
      )}
      
      {/* Modal for event registration */}
      {showRegistrationModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseRegistrationModal}>&times;</span>
            <EventRegister onClose={handleCloseRegistrationModal} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Event;
