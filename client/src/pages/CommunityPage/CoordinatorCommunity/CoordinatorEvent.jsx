import React, { useEffect, useState } from 'react';
import { fetchParticipantsList, acceptParticipant, fetchCoordinatorEvents } from '../../../api';
import EventCard from '../../../components/CommunityComponent/EventCard';
import './CoordinatorEvent.css';
import EventRegistration from '../../../components/CommunityComponent/eventRegistration';
import axios from 'axios';

const CoordinatorEvent = () => {
  const [events, setEvents] = useState([]); // Assuming you have a way to fetch events
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    // Fetch events and set them to state
    const fetchEvents = async () => {
      try {
        let events =[];
        events = await fetchCoordinatorEvents();
        console.log('List of events:', events);
        setEvents(events);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      const fetchParticipants = async () => {
        try {
          const data = await fetchParticipantsList(selectedEvent._id);
          setParticipants(data);
        } catch (error) {
          console.error('Error fetching participants:', error);
        }
      };

      fetchParticipants();
    }
  }, [selectedEvent]);

  const handleAccept = async (participantId) => {
    try {
      const data = await acceptParticipant(participantId);
      setParticipants(participants.map(p => p._id === participantId ? { ...p, isConfirmed: true } : p));
      console.log('Participant accepted:', data);
    } catch (error) {
      console.error('Error accepting participant:', error);
    }
  };

  const handleOpenModal = async (event) => {
    console.log('Selected event:', event);
    setSelectedEvent(event);
    try {
      const token = localStorage.getItem('token'); // Get the token from localStorage
      const response = await axios.get(`http://localhost:8080/api/communityPost/participants/${event.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      setParticipants(response.data);
    } catch (error) {
      console.error('Error fetching participants:', error);
      setParticipants([]); // Ensure participants is an array even if there's an error
    }
  };

  const [isRegModalOpen, setIsRegModalOpen] = useState(false);

  const handleRegOpenModal = () => {
    setIsRegModalOpen(true);
  };

  const handleRegCloseModal = () => {
    setIsRegModalOpen(false);
  };

  return (
    <div className="coordinator-event">
      <button className='event-button' onClick={handleRegOpenModal}>Create New Event</button>
      {isRegModalOpen && (
        <div className="modal-overlay" onClick={handleRegCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={handleRegCloseModal}>X</button>
            <EventRegistration onClose={handleRegCloseModal} />
          </div>
        </div>
      )}
      <div className="event-card-container">
          {events.map((event, index) => (
            <EventCard
              className="event-card"
              key={index}
              {...event}
              onClick={() => handleOpenModal(event)}
            />
          ))}
        </div>
        <div className="event-details">
        {selectedEvent && (
          <>
            <h2>{selectedEvent.eventTitle}</h2>
            <p>{new Date(selectedEvent.eventDate).toLocaleDateString()}</p>
            <p>{selectedEvent.eventDescription}</p>
            <h3>Participants</h3>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Email</th>
                  <th>Contact Number</th>
                  <th>Guests</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(participants) && participants.map((participant, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td>{participant.name}</td>
                      <td>{participant.age}</td>
                      <td>{participant.email}</td>
                      <td>{participant.contactNumber}</td>
                      <td>
                        {participant.guests && participant.guests.length > 0 ? (
                          <ul>
                            {participant.guests.map((guest, guestIndex) => (
                              <li key={guestIndex}>{guest.name} (Age: {guest.age})</li>
                            ))}
                          </ul>
                        ) : (
                          'No guests'
                        )}
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default CoordinatorEvent;