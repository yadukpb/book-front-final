import React, { useEffect, useState } from "react";
import "./CSS/userInfo.css";
import { NavLink, useParams } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";

import nametag from "./images/User/nameTag.png";
import maillogo from "./images/User/mail.png";
import telegram from "./images/Seller/Telegram.png";
import location from "./images/Seller/locationIcon.png";
import nonSeller from "./images/Seller/nonSeller.png";
import pageNotFound from "./images/pageNotFound.png";

function UserInfo({ currUser, userData }) {
  const { userId } = useParams();
  const [userDetail, setUserDetail] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [wishlistedBooks, setWishlistedBooks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let userResponse;
        
        if (userId === currUser) {
          userResponse = userData;
          setUserDetail(userData);
        } else {
          const response = await axios.get(`http://localhost:5007/api/users/${userId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
          });
          userResponse = response.data;
          setUserDetail(response.data);
        }

        if (userResponse?.wishlist?.length > 0) {
          setWishlistedBooks(userResponse.wishlist);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.response?.data?.message || 'Error fetching user data');
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId, currUser, userData]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const uploadResponse = await axios.post('http://localhost:5007/api/upload/profile', formData);
      const imageUrl = uploadResponse.data.url;

      await axios.patch(`http://localhost:5007/api/users/${userId}/profile-image`, {
        imageUrl
      });

      setUserDetail(prev => ({...prev, image: imageUrl}));
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const headers = { Authorization: `Bearer ${token}` };
        await axios.post('http://localhost:5007/api/auth/logout', {}, { headers });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  };

  const renderBookCard = (book) => {
    if (!book) return null;

    const bName = book.name?.length > 21 ? book.name.substring(0, 20) + "..." : book.name;

    return (
      <NavLink key={book._id} to={`/book/${book._id}`} className="bookOverview">
        <img src={book.bookFront} alt={book.name} />
        <h2>{bName}</h2>
        <button>₹{book.price}</button>
      </NavLink>
    );
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <section>
      <h1 className="gradient_head" id="userInfoHead">
        {userDetail ? "Account Details" : "No user found"}
      </h1>
      {userDetail ? (
        <>
          <div id="userInfoDetails">
            <div id="userLogout">
              <div className="profile-image-container">
                {userDetail.image ? (
                  <img src={userDetail.image} alt="user pic" id="userImage" />
                ) : (
                  <FaUserCircle className="default-profile-icon" />
                )}
                {userId === currUser && (
                  <label className="image-upload-label" title={uploading ? "Uploading..." : "Change Profile Picture"}>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                    <span>{uploading ? "Uploading..." : "Change Picture"}</span>
                  </label>
                )}
              </div>
              {userId === currUser && (
                <NavLink to="/auth">
                  <button onClick={handleLogout}>Sign Out</button>
                </NavLink>
              )}
            </div>
            <div id="userDetails">
              <div>
                <div className="userInfoData" title="User name">
                  <img src={nametag} alt="name" />
                  {userDetail.name}
                </div>
                {userDetail.verified ? (
                  <div className="userInfoData" title="User telegram id">
                    <img src={telegram} alt="telegram" />
                    {userDetail.telegram}
                  </div>
                ) : (
                  <div className="userInfoData" title="non verified">
                    <img src={nonSeller} alt="telegram" />
                    Not Seller
                  </div>
                )}
              </div>
              <div>
                <div className="userInfoData" title="User email">
                  <img src={maillogo} alt="mail" />
                  {userDetail.email}
                </div>
                {userDetail.verified && userDetail.location && (
                  <div className="userInfoData" title="User location">
                    <img src={location} alt="location" />
                    {userDetail.location}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div id="userBookDetail">
            <div className="userBooks">
              <h1>Wishlist</h1>
              <div className="booksGrid">
                {wishlistedBooks.length > 0 ? (
                  wishlistedBooks.map(book => renderBookCard(book))
                ) : (
                  <p className="no-books-message">No books in wishlist</p>
                )}
              </div>
            </div>

            {userDetail?.verified && (
              <div className="userBooks">
                <h1>Books Listed for Sale</h1>
                <div className="booksGrid">
                  {userDetail?.bookToSell?.length > 0 ? (
                    userDetail.bookToSell.map(book => renderBookCard(book))
                  ) : (
                    <p className="no-books-message">No books listed for sale</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <img className="pageNotFound" src={pageNotFound} alt="page not found" />
      )}
    </section>
  );
}

export default UserInfo;
