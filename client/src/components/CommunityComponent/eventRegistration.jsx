import React, { useState, useRef } from 'react';
import { createEvent } from '../../api'; // Import the createEvent function
import './EventRegistration.css';
import Logo from '../../assets/Logo-fit.png';
import axios from 'axios';

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
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  const fileInputRef = useRef(null);

  const handleTagChange = (tag) => {
    setEventTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0]; // Extract the first file
    if (!file) {
      console.error("No file selected");
      return;
    }
  
    const formData = new FormData();
    formData.append('image', file); // Use the key 'image' as expected by the backend
  
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8085/api/uploadPic/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Let Axios handle Content-Type for FormData
        },
      });
  
      console.log("Image uploaded successfully:", response.data);
      setUploadedImageUrl(response.data.data); // Cloudinary URL or uploaded file URL
    } catch (error) {
      console.error("Error uploading file:", error.response?.data || error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Automatically set event status to "Ongoing"
    const eventStatus = 'Ongoing';
    const eventOrganizer = localStorage.getItem('userId');
    const eventDetails = {
      eventName,
      eventPic: uploadedImageUrl,
      eventTags,
      eventType,
      eventStatus,
      eventDate,
      eventTime,
      eventLocation,
      eventFee,
      eventDescription,
      eventOrganizer
    };
    try {
      if (!uploadedImageUrl) {
        console.error("Image URL is missing. Upload an image before submitting.");
        return;
      }
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