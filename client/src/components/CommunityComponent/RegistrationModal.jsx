import React, { useState } from 'react';
import axios from 'axios';
import './RegistrationModal.css';
import Logo from '../../assets/Logo-fit.png';
import { registerParticipants } from '../../api';

const RegistrationModal = ({ closeModal, eventId, eventFee }) => {
  console.log('Event ID:', eventId);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [guests, setGuests] = useState([{ name: '', age: '' }]);
  const [isComingWithGuests, setIsComingWithGuests] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [participantData, setParticipantData] = useState(null);

  const handleGuestChange = (index, field, value) => {
    const newGuests = [...guests];
    newGuests[index][field] = value;
    setGuests(newGuests);
  };

  const handleAddGuest = () => {
    setGuests([...guests, { name: '', age: '' }]);
  };

  const handleRemoveGuest = (index) => {
    const newGuests = guests.filter((_, i) => i !== index);
    setGuests(newGuests);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const participantData = {
      eventId,
      name,
      age,
      email,
      contactNumber,
      guests: guests.length > 0 && guests[0].name && guests[0].age ? guests : null,
      paymentProof: null, // Set default value
      isConfirmed: false, // Set default value
      createdAt: new Date(), // Set default value
    };

    // if (eventFee > 0) {
    //   setParticipantData(participantData);
    //   setShowPaymentModal(true);
    // } else {
      try {
        const response = await registerParticipants(participantData);
        console.log('Registration successful:', response);
        alert('Thank you for joining! Check your email for further comfirmation.')
        closeModal();
      } catch (error) {
        console.error('Error registering participants:', error);
      }
    // }
  };

  const totalPayment = (guests.length + 1) * eventFee;
  console.log('Total Payment:', totalPayment);

  return (
    <div className="modal" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={closeModal}>X</button>
        <img src={Logo} alt="" className="logo" />
        <h1>Event Registration Form</h1>
        <h2>Thank you for showing interest in joining this event!</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            Age:
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Contact Number:
            <input
              type="text"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
            />
          </label>
          {!isComingWithGuests && (
            <div className="guest-prompt">
              <p>Coming with guests?</p>
              <button type="button" onClick={() => setIsComingWithGuests(true)}>Yes</button>
            </div>
          )}
          {isComingWithGuests && (
            <div className="guests-section">
              {guests.map((guest, index) => (
                <div key={index} className="guest-fields">
                  <label>
                    Guest Name:
                    <input
                      type="text"
                      value={guest.name}
                      onChange={(e) => handleGuestChange(index, 'name', e.target.value)}
                      required
                    />
                  </label>
                  <label>
                    Guest Age:
                    <input
                      type="number"
                      value={guest.age}
                      onChange={(e) => handleGuestChange(index, 'age', e.target.value)}
                      required
                    />
                  </label>
                  <button className="full-button" type="button" onClick={() => handleRemoveGuest(index)}>Remove Guest</button>
                </div>
              ))}
              <button className="full-button" type="button" onClick={handleAddGuest}>Add Guest</button>
            </div>
          )}
          <button className="full-button" type="submit">Register</button>
        </form>
        {/* {showPaymentModal && (
          <PaymentModal
            closeModal={() => setShowPaymentModal(false)}
            participantData={participantData}
            totalPayment={totalPayment}
            onClose={closeModal}
          />
        )} */}
      </div>
    </div>
  );
};

// const PaymentModal = ({ closeModal, participantData, totalPayment, onClose }) => {
//   const [paymentProof, setPaymentProof] = useState(null);

//   const handleFileChange = (e) => {
//     console.log('handleFileChange called');
//     const file = e.target.files[0];
//     const reader = new FileReader();

//     reader.onload = () => {
//       console.log('File converted to Base64:', reader.result);
//       setPaymentProof(reader.result); // Base64-encoded string
//     };

//     reader.onerror = (error) => {
//         console.error("Error reading image file:", error);
//     };

//     reader.readAsDataURL(file); // Converts to Base64
// };


//   const handleConfirmPayment = async () => {
//     const formData = {
//       eventId: participantData.eventId,
//       name: participantData.name,
//       age: participantData.age,
//       email: participantData.email,
//       contactNumber: participantData.contactNumber,
//       guests: JSON.stringify(participantData.guests),
//       paymentProof: paymentProof, 
//       isConfirmed: false, // Set default value
//       createdAt: new Date(), // Set default value
//     }

//     try {
//       console.log('Submitting payment proof:', formData);
//       const response = await registerParticipants(formData);
//       console.log('Registration successful:', response);
//       alert("Registered successfully! A confirmation email will be sent to you.");
//       closeModal();
//       onClose();
//     } catch (error) {
//       console.error('Error registering participants:', error);
//     }
//   };

//   return (
//     <div className="modal">
//       <div className="modal-content">
//         <h2>Complete Payment</h2>
//         <p>
//           Please scan the QR code below to submit the event fee. Once your
//           transaction is complete, your registration will be confirmed, and a
//           confirmation email will be sent to {participantData.email}.
//         </p>
//         <p>
//           Your Total Payment: <strong>${totalPayment}</strong>
//         </p>
//         <div className="qr-code">
//           <img src="qr-code-placeholder.png" alt="QR Code for Payment" />
//         </div>
//         <label>
//           Payment Proof:
//           <input
//             type="file"
//             onChange={handleFileChange}
//             required
//           />
//         </label>
//         <button onClick={handleConfirmPayment}>Confirm Payment</button>
//         <button onClick={closeModal}>Cancel</button>
//       </div>
//     </div>
//   );
// };

export default RegistrationModal;