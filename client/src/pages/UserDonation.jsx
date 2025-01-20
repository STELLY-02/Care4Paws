import React, { useState, useEffect } from "react";
import { donateUser, fetchCoordinators, fetchDonationHistory } from "../api"; // Import the donateUser API function
import { jwtDecode } from "jwt-decode"; // Correct way to import jwtDecode
import "./UserDonation.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/SidebarUser";

const UserDonation = () => {
  const [coordinators, setCoordinators] = useState([]);
  const [selectedCoordinator, setSelectedCoordinator] = useState(null);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // Added state for phone number
  const [message, setMessage] = useState("");

  const [donations, setDonations] = useState([]); // State to store donation history

  // Fetch coordinators on component mount
  useEffect(() => {
    const loadCoordinatorsAndHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMessage("You must be logged in to view coordinators.");
          return;
        }

        // Fetch coordinators
        const coordinatorsList = await fetchCoordinators(token);
        setCoordinators(coordinatorsList);

        // Fetch donation history
        const donationHistory = await fetchDonationHistory(token);
        setDonations(donationHistory);
      } catch (error) {
        console.error("Error loading coordinators:", error.message);
        setMessage("Error loading data.");
      }
    };

    loadCoordinatorsAndHistory();
  }, []);

  const handleDonate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!selectedCoordinator) {
      setMessage("Please select a coordinator.");
      return;
    }

    // Ensure the amount is a valid number
    if (isNaN(amount) || amount <= 0) {
      setMessage("Please enter a valid amount.");
      return;
    }

    if (!paymentMethod) {
      setMessage("Please select a payment method.");
      return;
    }

    // Validate phone number
    if (!phoneNumber) {
      setMessage("Phone number is required.");
      return;
    }
    const decodedToken = jwtDecode(token);
    console.log(decodedToken);

    const donationData = {
      amount: parseFloat(amount),
      paymentMethod,
      phoneNumber,
      coordinatorId: selectedCoordinator._id,
      postedBy: {
        id: decodedToken.id, // User ID from the decoded token
        username: decodedToken.username, // Username from the decoded token
      },
    };

    try {
      // const token = localStorage.getItem("token");
      const response = await donateUser(donationData, token);

      setMessage(response.message); // Display success message
      setAmount("");
      setPaymentMethod("");
      setSelectedCoordinator(null);

      const updatedDonations = await fetchDonationHistory(token);
      setDonations(updatedDonations);
    } catch (error) {
      setMessage(error.message || "Error making donation.");
    }
  };

  return (
    <div className="UserDonation">
      <Navbar />
      <div className="UserDonationSideBar">
        <Sidebar />
        <div className="UserDonationContent">
          <div className="UDonationForm">
            <h2>User Donation</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleDonate}>
              <div>
                <label htmlFor="coordinator">Select Coordinator:</label>
                <select
                  id="coordinator"
                  value={selectedCoordinator?._id || ""}
                  onChange={(e) =>
                    setSelectedCoordinator(
                      coordinators.find((c) => c._id === e.target.value)
                    )
                  }
                  required
                >
                  <option value="" disabled>
                    Choose a coordinator
                  </option>
                  {coordinators.map((coordinator) => (
                    <option key={coordinator._id} value={coordinator._id}>
                      {coordinator.bankAccountName}
                    </option>
                  ))}
                </select>
              </div>
              {selectedCoordinator && (
                <div>
                  <p>Account Number: {selectedCoordinator.bankAccountNumber}</p>
                  <p>Bank Type: {selectedCoordinator.bankType}</p>
                  <p>Account Name: {selectedCoordinator.bankAccountName}</p>
                </div>
              )}
              <div>
                <label htmlFor="amount">Amount:</label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="paymentMethod">Payment Method:</label>
                <select
                  id="paymentMethod"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Choose a payment method
                  </option>
                  <option value="Online Banking">Online Banking</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="PayPal">PayPal</option>
                </select>
              </div>
              <div>
                <label htmlFor="phoneNumber">Phone Number:</label>
                <input
                  type="text"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              <button type="submit">Donate</button>
            </form>
          </div>
          <div className="UDonationHistory">
            <h3>Your Donation History</h3>
            {donations.length > 0 ? (
              <ul>
                {donations.map((donation) => (
                  <li key={donation._id}>
                    You have donated RM{donation.amount} to{" "}
                    {donation.coordinator.id.bankAccountName} via{" "}
                    {donation.paymentMethod} on{" "}
                    {new Date(donation.createdAt).toLocaleString()} (Phone:{" "}
                    {donation.phoneNumber})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No donation history found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDonation;
