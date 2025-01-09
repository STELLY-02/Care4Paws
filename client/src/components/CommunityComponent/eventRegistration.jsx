import React, { useState } from 'react';
import { createEvent } from '../../api'; // Import the createEvent function
import './EventRegistration.css';
import Logo from '../../assets/Logo-fit.png';

const EventRegistration = ({ onClose }) => {
  const [eventName, setEventName] = useState('');
  const [eventPic, setEventPic] = useState('');
  const [eventTags, setEventTags] = useState([]);
  const [eventType, setEventType] = useState('In-Person');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventFee, setEventFee] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  const handleTagChange = (tag) => {
    setEventTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setEventPic(reader.result); // Base64-encoded string
      };
      reader.onerror = (error) => {
        console.error("Error reading image file:", error);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Automatically set event status to "Ongoing"
    const eventStatus = 'Ongoing';
    const eventDetails = {
      eventName,
      eventPic,
      eventTags,
      eventType,
      eventStatus,
      eventDate,
      eventTime,
      eventLocation,
      eventFee,
      eventDescription,
    };
    try {
      await createEvent(eventDetails);
      console.log("Event registered successfully");
      onClose();
    } catch (error) {
      console.error("Error registering event:", error);
    }
  };

  return (
    <div>
      <img src={Logo} alt="" className="logo" />
      <h2 className='Add-title'>Add Event</h2>
      <form onSubmit={handleSubmit} className='reg-form'> 
        <label>
          Event Name:
          <input
            type="text"
            name="eventName"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />
        </label>
        <label>
          Event Picture:
          <input
            type="file"
            name="eventPic"
            onChange={handleFileChange}
            required
          />
        </label>
        <label>
          Event Tags:
          <div className='checkbox-container'>
            <label className='checkbox-label'>
              <input
              className='checkbox-input'
                type="checkbox"
                name="eventTags"
                value="Fundraiser"
                onChange={() => handleTagChange('Fundraiser')}
              />
              Fundraiser
            </label>
            <label className='checkbox-label'>
              <input
              className='checkbox-input'
                type="checkbox"
                name="eventTags"
                value="Adoption"
                onChange={() => handleTagChange('Adoption')}
              />
              Adoption
            </label>
            <label className='checkbox-label'>
              <input
                className='checkbox-input'
                type="checkbox"
                name="eventTags"
                value="Competition"
                onChange={() => handleTagChange('Competition')}
              />
              Competition
            </label>
            <label className='checkbox-label'>
              <input
              className='checkbox-input'
                type="checkbox"
                name="eventTags"
                value="Talk"
                onChange={() => handleTagChange('Talk')}
              />
              Talk
            </label>
          </div>
        </label>
        <label>
          Event Type:
          <select
          className='reg-event-type'
            name="eventType"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            required
          >
            <option value="In-Person">In-Person</option>
            <option value="Virtual">Virtual</option>
          </select>
        </label>
        <label>
          Event Date:
          <input
            type="date"
            name="eventDate"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
          />
        </label>
        <label>
          Event Time:
          <input
            type="time"
            name="eventTime"
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
            required
          />
        </label>
        <label>
          Event Location:
          <input
            type="text"
            name="eventLocation"
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
            required
          />
        </label>
        <label>
          Event Fee:
          <input
            type="text"
            name="eventFee"
            value={eventFee}
            onChange={(e) => setEventFee(e.target.value)}
            required
          />
        </label>
        <label>
          Event Description:
          <textarea
            className='reg-description'
            name="eventDescription"
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            required
          ></textarea>
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default EventRegistration;