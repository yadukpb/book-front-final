import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/recommend.css";
import recLogo from "./images/recommend_graphic.png";
import recImg from "./images/SVGs/recommend.svg";

function Recommend() {
  const [bookInput, setBookInput] = useState("");
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRecommendation = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please log in to get recommendations.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5007/api/recommendations?query=${bookInput}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const recommendations = await response.json();
        const category = recommendations.category;
        const similarResponse = await fetch(`http://localhost:5007/api/books/category/${category}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (similarResponse.ok) {
          const similarBooks = await similarResponse.json();
          setRecommendedBooks(similarBooks);
        } else {
          alert("Failed to fetch similar recommendations.");
        }
      } else {
        alert("Failed to fetch recommendations.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching recommendations.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (id) => {
    navigate(`/book/${id}`);
  };

  return (
    <section className="bookWebPage">
      <h1 className="gradient_head">Get Book Recommendation</h1>
      <div className="boxAndLogo">
        <div id="book_recommend" className="books_box">
          <p>Find your next read</p>
          <div id="book_recommend_input">
            <img src={recImg} alt="book icon" width={28} />
            <input
              type="text"
              value={bookInput}
              onChange={(e) => setBookInput(e.target.value)}
              placeholder="Enter any category or book_name or author"
            />
          </div>
          <button 
            disabled={bookInput.length === 0} 
            onClick={handleRecommendation}
          >
            Recommend Books
          </button>
        </div>
        <img src={recLogo} alt="recommend logo" width={225} style={{ float: 'right' }} />
      </div>

      {loading && <div className="loading">Loading recommendations...</div>}
      {error && <div className="error">{error}</div>}
      {recommendedBooks.length > 0 && (
        <div className="recommendedBooks">
          <h2>Recommended Books</h2>
          <div className="bookCards">
            {recommendedBooks.map((book) => (
              <div className="bookCard" key={book.id} onClick={() => handleBookClick(book.id)}>
                <img src={book.bookFront} alt={book.name} loading="lazy" />
                <h3>{book.name}</h3>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default Recommend;
