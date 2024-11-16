import React from "react";
import "./CSS/seller.css";
import sellerStore from "./images/Seller/sellerStore.png";
import telegram from "./images/Seller/Telegram.png";
import location from "./images/Seller/locationIcon.png";
import { db } from "../firebase"; // Ensure this is correctly set up
import { doc, updateDoc } from "firebase/firestore"; // Correct imports
import { NavLink, useNavigate } from "react-router-dom";

function Seller({ verified, user, updateUser }) {
  const navigate = useNavigate();

  async function becomeSeller() {
    if (user) {
      const sellerDetails = document.querySelectorAll(
        ".sellerDetailInput input"
      );
      const telegramInput = sellerDetails[0];
      const locationInput = sellerDetails[1];

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch('http://localhost:5007/api/users/become-seller', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            userId: user,
            telegram: telegramInput.value,
            location: locationInput.value
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to become seller');
        }

        const data = await response.json();
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        updateUser(data.user);
        
        navigate('/seller/verified', { replace: true });
        
      } catch (error) {
        console.error("Error updating seller status:", error);
        alert("Error becoming seller. Please try again.");
      }
    } else {
      alert("Please Sign In to proceed");
    }
  }

  return (
    <section id="home">
      <form
        id="details"
        onSubmit={(e) => {
          e.preventDefault();
        }}>
        <h1>SELL BOOKS</h1>
        <h2 className="gradient_head">MAKE YOUR BOOK ALIVE AGAIN</h2>
        <div id="sellerInput">
          <p style={{ marginBottom: "22px" }}>
            {verified ? "Verified Seller" : "Fill details to become a seller"}
          </p>
          {verified ? (
            <div>Seller ID: {user}</div>
          ) : (
            <div>
              <div className="sellerDetailInput">
                <img src={telegram} alt="telegram" />
                <input
                  type="text"
                  placeholder="Enter your telegram id here"
                  required
                />
              </div>
              <div className="sellerDetailInput">
                <img src={location} alt="location" />
                <input
                  type="text"
                  placeholder="Enter your location to sell books"
                  required
                />
              </div>
            </div>
          )}
        </div>
        <div className="detailButtons">
          {verified ? (
            <NavLink to="verified">
              <button>Upload New Book</button>
            </NavLink>
          ) : (
            <button type="submit" onClick={becomeSeller}>
              Become Seller
            </button>
          )}
        </div>
      </form>
      <img src={sellerStore} alt="online store" width={600} />
    </section>
  );
}

export default Seller;