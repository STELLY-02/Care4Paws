import React from "react";
import "./PaymentModal.css";

const PaymentModal = ({ closeModal, email, totalPayment }) => {
  const handleConfirmPayment = () => {
    alert("Registered successfully! A confirmation email will be sent to you.");
    closeModal();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Complete Payment</h2>
        <p>
          Please scan the QR code below to submit the event fee. Once your
          transaction is complete, your registration will be confirmed, and a
          confirmation email will be sent to {email}.
        </p>
        <p>
          Your Total Payment: <strong>${totalPayment}</strong>
        </p>
        <div className="qr-code">
          <img src="qr-code-placeholder.png" alt="QR Code for Payment" />
        </div>
        <button onClick={handleConfirmPayment}>Confirm Payment</button>
        <button onClick={closeModal}>Cancel</button>
      </div>
    </div>
  );
};

export default PaymentModal;
