import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import './CSS/book.css';
import { Link, useNavigate } from 'react-router-dom';
import { BsChatDots } from "react-icons/bs";

// Import icons (assuming they're in the correct path)
import locationIcon from "./images/Books/locationIcon.png";
import rupeeIcon from "./images/Books/rupee.png";
import wishlistIcon from "./images/Books/wishlist.png";
import removeIcon from "./images/Books/remove.png";
import telegramIcon from "./images/Books/TelegramIcon.png";

// Import Payment component
import Payment from "./Payment";

const Book = ({ books, wishlist, setWishlist, user }) => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [book, setBook] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const foundBook = books.find(b => b._id === bookId);
        if (!foundBook) {
          setError('Book not found');
        } else {
          setBook(foundBook);
          await checkIfInWishlist(foundBook._id);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBook();
  }, [bookId, books]);

  const checkIfInWishlist = async (bookId) => {
    const accessToken = localStorage.getItem('token');
    if (!accessToken) return;

    try {
      const response = await fetch(`http://localhost:5007/api/wishlist/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ bookId })
      });

      if (response.ok) {
        const data = await response.json();
        setIsInWishlist(data.inWishlist);
      }
    } catch (err) {
      console.error('Error checking wishlist:', err);
    }
  };

  useEffect(() => {
    if (book?.seller?.id) {
      const hasExistingPayment = localStorage.getItem(`payment_${book.seller.id}`);
      if (hasExistingPayment === 'true') {
        setPaymentDone(true);
      }
    }
  }, [book]);

  // Handle payment process
  const handlePayment = () => {
    if (!user) {
      toast.error('Please sign in to make a payment');
      return;
    }
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setPaymentDone(true);
    localStorage.setItem(`payment_${book.seller.id}`, 'true');
  };

  // Handle wishlist toggling
  const handleWishlist = async () => {
    const accessToken = localStorage.getItem('token');
    if (!accessToken) {
      toast.error('Please sign in to add to wishlist');
      return;
    }

    try {
      const endpoint = isInWishlist ? 'remove' : 'add';
      
      const response = await fetch(`http://localhost:5007/api/wishlist/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ bookId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update wishlist');
      }

      const { wishlist: updatedWishlist } = await response.json();
      setWishlist(updatedWishlist);
      setIsInWishlist(!isInWishlist);
      toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist');
    } catch (err) {
      console.error('Wishlist error:', err);
      if (err.message === 'Invalid token') {
        toast.error('Session expired. Please login again');
      } else {
        toast.error(err.message || 'Failed to update wishlist');
      }
    }
  };

  const handleChatClick = () => {
    const accessToken = localStorage.getItem('token');
    if (!accessToken) {
      toast.error('Please login to chat with seller');
      navigate('/auth');
      return;
    }
    
    if (!paymentDone) {
      toast.error('Please make payment to chat with seller');
      return;
    }
    
    navigate(`/chat/${book.seller.id}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading book details...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Book</h2>
        <p>{error}</p>
      </div>
    );
  }

  // Not found state
  if (!book) {
    return (
      <div className="error-container">
        <h2>Book Not Found</h2>
        <p>The requested book could not be found.</p>
      </div>
    );
  }

  const bookImages = [
    { src: book.bookFront, alt: "Front Cover" },
    { src: book.bookBack, alt: "Back Cover" },
    { src: book.bookIndex, alt: "Index Pages" },
    { src: book.bookMiddle, alt: "Middle Pages" }
  ];

  return (
    <section className="book-detail-section">
      <div className="book-details-container">
        {/* Book Media Section */}
        <div className="book-media-section">
          <div className="main-image-container">
            <img 
              src={bookImages[selectedImage].src} 
              alt={bookImages[selectedImage].alt} 
              className="main-book-image" 
            />
            <div className="image-nav-buttons">
              <button 
                className="nav-button prev"
                onClick={() => setSelectedImage(prev => prev === 0 ? bookImages.length - 1 : prev - 1)}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </svg>
              </button>
              <button 
                className="nav-button next"
                onClick={() => setSelectedImage(prev => prev === bookImages.length - 1 ? 0 : prev + 1)}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                </svg>
              </button>
            </div>
          </div>
          <div className="thumbnail-container">
            {bookImages.map((image, index) => (
              <div 
                key={index}
                className={`thumbnail-wrapper ${selectedImage === index ? 'active' : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <img src={image.src} alt={image.alt} className="thumbnail-image" />
              </div>
            ))}
          </div>
        </div>

        {/* Book Info Section */}
        <div className="book-info-section">
          {/* Book Header */}
          <div className="book-header">
            <h1 className="book-title">{book.name}</h1>
            <div className="price-container">
              <div className="current-price">
                <img src={rupeeIcon} alt="Price" className="rupee-icon" />
                {book.price.toLocaleString()}
              </div>
              <div className="original-price">
                M.R.P: ₹{book.mrp.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Updated Seller Info Section */}
          <div className="seller-info">
            {book.seller.image ? (
              <img src={book.seller.image} alt={book.seller.name} className="seller-avatar" />
            ) : (
              <div className="seller-avatar-icon">
                <FaUserAlt size={30} />
              </div>
            )}
            <div className="seller-details">
              <h3>{book.seller.name}</h3>
              <p className="location">
                <img src={locationIcon} alt="Location" className="location-icon" />
                {book.seller.location}
              </p>
            </div>
          </div>

          {/* Book Description */}
          <div className="book-description">
            <h2>Description</h2>
            <p>{book.description}</p>
          </div>

          {/* Book Metadata */}
          <div className="book-metadata">
            <h2>Book Details</h2>
            <div className="metadata-grid">
              <div className="metadata-item">
                <span className="label">Edition</span>
                <span className="value">{book.edition}</span>
              </div>
              <div className="metadata-item">
                <span className="label">Publisher</span>
                <span className="value">{book.publisher}</span>
              </div>
              <div className="metadata-item">
                <span className="label">Category</span>
                <span className="value">{book.category}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              className={`action-button ${isInWishlist ? 'remove-wishlist' : 'add-wishlist'}`}
              onClick={handleWishlist}
            >
              <img 
                src={isInWishlist ? removeIcon : wishlistIcon} 
                alt={isInWishlist ? "Remove from wishlist" : "Add to wishlist"} 
                className="button-icon"
              />
              <span>{isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
            </button>

            {paymentDone ? (
              <div className="post-payment-actions">
                <a 
                  href={`https://t.me/${book.seller.telegram}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="telegram-link"
                >
                  <button className="action-button telegram-button">
                    <img src={telegramIcon} alt="Telegram" className="button-icon" />
                    <span>Connect on Telegram</span>
                  </button>
                </a>
                <button 
                  onClick={handleChatClick}
                  className="action-button chat-button"
                >
                  <BsChatDots className="button-icon" />
                  <span>Chat with Seller</span>
                </button>
              </div>
            ) : (
              <button 
                className="action-button payment-button"
                onClick={handlePayment}
              >
                <span>Pay ₹{(book.price * 0.1).toFixed(2)} to Connect</span>
              </button>
            )}
          </div>
        </div>
      </div>
      <ToastContainer 
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {showPayment && (
        <Payment
          amount={book.price * 0.1}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPayment(false)}
          sellerId={book.seller.id}
          bookId={book._id}
        />
      )}
    </section>
  );
};

export default Book;