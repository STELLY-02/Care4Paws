import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "./CoordinationDonation.css";

import {
  createCoordinator,
  fetchCoordinatorDonationHistory,
  fetchCoordinatorDetails,
} from "../api"; // Import the createCoordinator function from api.js

const CoordinatorDonation = () => {
  const [donations, setDonations] = useState([]);
  const [coordinatorDetails, setCoordinatorDetails] = useState(null); // Store coordinator details
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankType, setBankType] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [message, setMessage] = useState("");
  // const [success, setSuccess] = useState(false); // Track if submission is successful
  const [error, setError] = useState(""); // Track errors for delete

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMessage("You must be logged in to view donations.");
          return;
        }
        // Fetch donation history for the logged-in coordinator
        const donationHistory = await fetchCoordinatorDonationHistory(token);
        setDonations(donationHistory);

        // Fetch coordinator details
        const details = await fetchCoordinatorDetails(token);
        setCoordinatorDetails(details);
      } catch (error) {
        setMessage("Error loading donation history.");
        console.error("Error loading donation history:", error.message);
      }
    };

    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data to send
    const formData = {
      bankAccountNumber,
      bankType,
      bankAccountName,
    };

    try {
      // Get the token from localStorage
      const token = localStorage.getItem("token");

      // Call the createCoordinator function from api.js
      const response = await createCoordinator(formData, token);

      // Show success message
      setMessage(response.message);
      setError(""); // Clear any previous errors
      // Reset form
      setCoordinatorDetails(formData); // Update displayed details
      setBankAccountNumber("");
      setBankType("");
      setBankAccountName("");
    } catch (error) {
      // Show error message
      setMessage(error.message || "Error submitting form");
    }
  };

  return (
    <div className="DonationC">
      <Navbar />
      <div className="DonationCSidebar">
        <Sidebar />

        <div className="content-Donation-container">
          <div className="coordinator-Donation-form">
            <h2>Coordinator Donation Dashboard</h2>
            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {coordinatorDetails ? (
              <div className="coordinator-details">
                <h3>Your Coordinator Details</h3>
                <p>
                  Bank Account Number: {coordinatorDetails.bankAccountNumber}
                </p>
                <p>Bank Type: {coordinatorDetails.bankType}</p>
                <p>Bank Account Name: {coordinatorDetails.bankAccountName}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3>Submit Your Coordinator Details</h3>
                <div>
                  <label htmlFor="bankAccountNumber">
                    Bank Account Number:
                  </label>
                  <input
                    type="text"
                    id="bankAccountNumber"
                    value={bankAccountNumber}
                    onChange={(e) => setBankAccountNumber(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="bankType">Bank Type:</label>
                  <input
                    type="text"
                    id="bankType"
                    value={bankType}
                    onChange={(e) => setBankType(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="bankAccountName">Bank Account Name:</label>
                  <input
                    type="text"
                    id="bankAccountName"
                    value={bankAccountName}
                    onChange={(e) => setBankAccountName(e.target.value)}
                    required
                  />
                </div>
                <button type="submit">Submit</button>
              </form>
            )}
          </div>
          <div className="Cdonation-history">
            <h3>Donations Made to You</h3>
            {donations.length > 0 ? (
              <ul>
                {donations.map((donation) => (
                  <li key={donation._id}>
                    <p>
                      Donor: {donation.postedBy.id.username} (Phone:{" "}
                      {donation.phoneNumber})
                    </p>
                    <p>Amount: RM{donation.amount}</p>
                    <p>Payment Method: {donation.paymentMethod}</p>
                    <p>
                      Donated on:{" "}
                      {new Date(donation.createdAt).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No donations received yet.</p>
            )}
            {/* {success && (
        <div>
          <h3>Submission Successful!</h3>
          <p>Your coordinator donation details have been saved successfully.</p>
          <button onClick={() => setSuccess(false)}>Add Another</button>
        </div>
      )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoordinatorDonation;
